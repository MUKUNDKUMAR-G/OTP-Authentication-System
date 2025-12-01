/**
 * @typedef {Object} User
 * @property {string} identifier - Email or phone number
 * @property {number} createdAt - Timestamp when user was created
 * @property {number} lastLogin - Timestamp of last successful login
 */

/**
 * @typedef {Object} OTPRecord
 * @property {string} otp - 6-digit OTP code
 * @property {string} identifier - Associated email or phone number
 * @property {number} expiresAt - Expiration timestamp
 * @property {number} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} BlockRecord
 * @property {string} identifier - Blocked email or phone number
 * @property {number} blockedUntil - Unblock timestamp
 * @property {number} failedAttempts - Current failed attempt count
 */

export { User, OTPRecord, BlockRecord };
