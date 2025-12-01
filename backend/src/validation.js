/**
 * Input validation utilities
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic email regex: must contain @ and domain
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Phone regex: 10-15 digits, optional + prefix
  const phoneRegex = /^\+?\d{10,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} - True if valid OTP format (exactly 6 digits)
 */
export function isValidOtp(otp) {
  if (!otp || typeof otp !== 'string') {
    return false;
  }
  
  // OTP regex: exactly 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}

/**
 * Validate identifier (email or phone)
 * @param {string} identifier - Identifier to validate
 * @returns {boolean} - True if valid email or phone format
 */
export function isValidIdentifier(identifier) {
  return isValidEmail(identifier) || isValidPhone(identifier);
}
