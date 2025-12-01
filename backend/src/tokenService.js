/**
 * JWT Token Service
 * Handles generation and verification of JWT tokens for authentication
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const TOKEN_EXPIRATION = '24h'; // 24 hours

/**
 * Generate a JWT token for an identifier
 * @param {string} identifier - Email or phone number
 * @returns {string} - JWT token
 */
export function generateToken(identifier) {
  if (!identifier || typeof identifier !== 'string') {
    throw new Error('Invalid identifier');
  }

  const payload = {
    identifier,
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {{ identifier: string } | null} - Decoded payload with identifier, or null if invalid
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ensure the decoded token has an identifier
    if (!decoded.identifier) {
      return null;
    }

    return {
      identifier: decoded.identifier
    };
  } catch (error) {
    // Handle all JWT errors: invalid signature, expired, malformed, etc.
    return null;
  }
}
