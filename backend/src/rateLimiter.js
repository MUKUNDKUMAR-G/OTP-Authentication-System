import { getBlock, setBlock, deleteBlock, getAllBlocks } from './storage.js';

/**
 * Rate Limiter Service - Tracks failed attempts and manages blocking
 */

const MAX_FAILED_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Record a failed OTP verification attempt
 * @param {string} identifier - Email or phone number
 */
export function recordFailedAttempt(identifier) {
  const blockRecord = getBlock(identifier);
  
  if (!blockRecord) {
    // First failed attempt
    setBlock(identifier, {
      identifier,
      blockedUntil: 0,
      failedAttempts: 1,
    });
  } else {
    // Increment failed attempts
    const updatedRecord = {
      ...blockRecord,
      failedAttempts: blockRecord.failedAttempts + 1,
    };
    
    // If reached max attempts, set block timestamp
    if (updatedRecord.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      updatedRecord.blockedUntil = Date.now() + BLOCK_DURATION_MS;
    }
    
    setBlock(identifier, updatedRecord);
  }
}

/**
 * Check if an identifier is currently blocked
 * @param {string} identifier - Email or phone number
 * @returns {boolean} - True if identifier is blocked, false otherwise
 */
export function isBlocked(identifier) {
  const blockRecord = getBlock(identifier);
  
  if (!blockRecord) {
    return false;
  }
  
  // Check if block has expired
  if (blockRecord.blockedUntil > 0 && Date.now() >= blockRecord.blockedUntil) {
    // Block has expired, remove it
    deleteBlock(identifier);
    return false;
  }
  
  // Check if identifier has reached max attempts and is blocked
  return blockRecord.failedAttempts >= MAX_FAILED_ATTEMPTS && blockRecord.blockedUntil > Date.now();
}

/**
 * Get the timestamp when an identifier will be unblocked
 * @param {string} identifier - Email or phone number
 * @returns {number | null} - Unblock timestamp or null if not blocked
 */
export function getBlockedUntil(identifier) {
  const blockRecord = getBlock(identifier);
  
  if (!blockRecord) {
    return null;
  }
  
  // Check if actually blocked
  if (blockRecord.failedAttempts >= MAX_FAILED_ATTEMPTS && blockRecord.blockedUntil > Date.now()) {
    return blockRecord.blockedUntil;
  }
  
  return null;
}

/**
 * Reset failed attempts counter for an identifier
 * @param {string} identifier - Email or phone number
 */
export function resetAttempts(identifier) {
  deleteBlock(identifier);
}

/**
 * Get the number of failed attempts for an identifier
 * @param {string} identifier - Email or phone number
 * @returns {number} - Number of failed attempts
 */
export function getFailedAttempts(identifier) {
  const blockRecord = getBlock(identifier);
  return blockRecord ? blockRecord.failedAttempts : 0;
}

/**
 * Clean up expired blocks from storage
 * @returns {number} - Number of expired blocks removed
 */
export function cleanupExpiredBlocks() {
  const allBlocks = getAllBlocks();
  const now = Date.now();
  let removedCount = 0;
  
  for (const [identifier, blockRecord] of allBlocks.entries()) {
    if (blockRecord.blockedUntil > 0 && now >= blockRecord.blockedUntil) {
      deleteBlock(identifier);
      removedCount++;
    }
  }
  
  return removedCount;
}
