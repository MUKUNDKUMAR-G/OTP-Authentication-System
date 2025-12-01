import { getOTP, setOTP, deleteOTP, getAllOTPs } from './storage.js';

/**
 * OTP Service - Handles OTP generation, validation, and expiration
 */

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Generate a 6-digit OTP for the given identifier
 * @param {string} identifier - Email or phone number
 * @returns {{ otp: string, expiresAt: number }} - Generated OTP and expiration timestamp
 */
export function generateOtp(identifier) {
  // Generate a random 6-digit number (100000-999999)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  const now = Date.now();
  const expiresAt = now + OTP_EXPIRY_MS;
  
  const otpRecord = {
    otp,
    identifier,
    expiresAt,
    createdAt: now,
  };
  
  // Store the OTP record
  setOTP(identifier, otpRecord);
  
  // Log OTP to console (mock delivery)
  console.log(`OTP for ${identifier}: ${otp}`);
  
  return { otp, expiresAt };
}

/**
 * Validate an OTP for the given identifier
 * @param {string} identifier - Email or phone number
 * @param {string} otp - OTP to validate
 * @returns {boolean} - True if OTP is valid and not expired, false otherwise
 */
export function validateOtp(identifier, otp) {
  const otpRecord = getOTP(identifier);
  
  if (!otpRecord) {
    return false;
  }
  
  // Check if OTP matches
  if (otpRecord.otp !== otp) {
    return false;
  }
  
  // Check if OTP is expired
  if (isExpired(identifier)) {
    return false;
  }
  
  return true;
}

/**
 * Check if an OTP is expired
 * @param {string} identifier - Email or phone number
 * @returns {boolean} - True if OTP is expired or doesn't exist, false otherwise
 */
export function isExpired(identifier) {
  const otpRecord = getOTP(identifier);
  
  if (!otpRecord) {
    return true;
  }
  
  return Date.now() > otpRecord.expiresAt;
}

/**
 * Clean up expired OTPs from storage
 * @returns {number} - Number of expired OTPs removed
 */
export function cleanupExpiredOtps() {
  const allOtps = getAllOTPs();
  const now = Date.now();
  let removedCount = 0;
  
  for (const [identifier, otpRecord] of allOtps.entries()) {
    if (now > otpRecord.expiresAt) {
      deleteOTP(identifier);
      removedCount++;
    }
  }
  
  return removedCount;
}
