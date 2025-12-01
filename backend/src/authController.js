/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import express from 'express';
import { generateOtp, validateOtp, isExpired } from './otpService.js';
import { isBlocked, getBlockedUntil, recordFailedAttempt, resetAttempts, getFailedAttempts } from './rateLimiter.js';
import { findOrCreateUser, updateLastLogin, getUserByIdentifier } from './userService.js';
import { isValidIdentifier } from './validation.js';
import { generateToken, verifyToken } from './tokenService.js';
import { validateRequestBody } from './middleware.js';

const router = express.Router();

/**
 * POST /auth/request-otp
 * Request an OTP for authentication
 */
router.post('/request-otp', validateRequestBody(['identifier']), (req, res) => {
  const { identifier } = req.body;
  
  // Validate identifier format
  if (!isValidIdentifier(identifier)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid identifier format. Must be a valid email or phone number',
    });
  }
  
  // Check if identifier is blocked
  if (isBlocked(identifier)) {
    const blockedUntil = getBlockedUntil(identifier);
    const remainingTime = Math.ceil((blockedUntil - Date.now()) / 1000);
    
    return res.status(429).json({
      success: false,
      error: 'Too many failed attempts. Please try again later',
      blockedUntil,
      remainingTime,
    });
  }
  
  // Find or create user
  findOrCreateUser(identifier);
  
  // Generate OTP
  const { otp, expiresAt } = generateOtp(identifier);
  
  // Calculate expiration time in seconds
  const expiresIn = Math.ceil((expiresAt - Date.now()) / 1000);
  
  // Return success response
  return res.status(200).json({
    success: true,
    message: 'OTP generated successfully',
    expiresIn,
  });
});

/**
 * POST /auth/verify-otp
 * Verify an OTP and authenticate the user
 */
router.post('/verify-otp', validateRequestBody(['identifier', 'otp']), (req, res) => {
  const { identifier, otp } = req.body;
  
  // Validate identifier format
  if (!isValidIdentifier(identifier)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid identifier format',
    });
  }
  
  // Validate OTP format (6 digits)
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid OTP format. Must be 6 digits',
    });
  }
  
  // Check if OTP is expired (don't increment counter if expired)
  if (isExpired(identifier)) {
    return res.status(401).json({
      success: false,
      error: 'OTP has expired. Please request a new one',
      expired: true,
    });
  }
  
  // Validate OTP against stored value
  const isValid = validateOtp(identifier, otp);
  
  if (!isValid) {
    // On failure: increment failed attempts counter
    recordFailedAttempt(identifier);
    
    const failedAttempts = getFailedAttempts(identifier);
    const attemptsRemaining = Math.max(0, 3 - failedAttempts);
    
    return res.status(401).json({
      success: false,
      error: 'Invalid OTP',
      attemptsRemaining,
    });
  }
  
  // On success:
  // 1. Reset failed attempts
  resetAttempts(identifier);
  
  // 2. Update lastLogin
  const user = updateLastLogin(identifier);
  
  // 3. Generate JWT token
  const token = generateToken(identifier);
  
  // 4. Return token and user
  return res.status(200).json({
    success: true,
    token,
    user,
  });
});

/**
 * GET /auth/me
 * Get authenticated user information
 * Requires valid JWT token in Authorization header
 */
router.get('/me', (req, res) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authorization header is required',
    });
  }
  
  // Check if it's a Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authorization format. Use: Bearer <token>',
    });
  }
  
  const token = parts[1];
  
  // Verify the token
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
  
  // Get user information
  const user = getUserByIdentifier(decoded.identifier);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User not found',
    });
  }
  
  // Return user information
  return res.status(200).json({
    success: true,
    user,
  });
});

export default router;
