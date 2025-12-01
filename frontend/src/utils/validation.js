/**
 * Input validation utilities for frontend
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic email regex: must contain @ and domain
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (Indian Standard: 10 digits with optional +91 prefix)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Phone regex: 10-15 digits, optional + prefix (supports Indian standard)
  const phoneRegex = /^\+?\d{10,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} - True if valid OTP format (exactly 6 digits)
 */
function isValidOtp(otp) {
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
function isValidIdentifier(identifier) {
  return isValidEmail(identifier) || isValidPhone(identifier);
}

/**
 * Get validation error message for identifier
 * @param {string} identifier - Identifier to validate
 * @returns {string|null} - Error message or null if valid
 */
function getIdentifierValidationError(identifier) {
  if (!identifier || identifier.trim() === '') {
    return 'Email or phone number is required';
  }
  
  if (!isValidIdentifier(identifier)) {
    return 'Please enter a valid email or phone number (e.g., email@example.com or +911234567890)';
  }
  
  return null;
}

// ES6 exports
export {
  isValidEmail,
  isValidPhone,
  isValidOtp,
  isValidIdentifier,
  getIdentifierValidationError
};
