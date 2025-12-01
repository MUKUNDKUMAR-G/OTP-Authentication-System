/**
 * In-memory storage for users, OTPs, and block records
 */

// Storage Maps
const users = new Map();
const otps = new Map();
const blocks = new Map();

/**
 * User Storage Functions
 */

/**
 * Get a user by identifier
 * @param {string} identifier - Email or phone number
 * @returns {import('./models.js').User | null}
 */
export function getUser(identifier) {
  return users.get(identifier) || null;
}

/**
 * Set/update a user
 * @param {string} identifier - Email or phone number
 * @param {import('./models.js').User} user - User object
 */
export function setUser(identifier, user) {
  users.set(identifier, user);
}

/**
 * Delete a user
 * @param {string} identifier - Email or phone number
 * @returns {boolean} - True if user was deleted, false if not found
 */
export function deleteUser(identifier) {
  return users.delete(identifier);
}

/**
 * Get all users (for testing/debugging)
 * @returns {Map<string, import('./models.js').User>}
 */
export function getAllUsers() {
  return users;
}

/**
 * OTP Storage Functions
 */

/**
 * Get an OTP record by identifier
 * @param {string} identifier - Email or phone number
 * @returns {import('./models.js').OTPRecord | null}
 */
export function getOTP(identifier) {
  return otps.get(identifier) || null;
}

/**
 * Set/update an OTP record
 * @param {string} identifier - Email or phone number
 * @param {import('./models.js').OTPRecord} otpRecord - OTP record object
 */
export function setOTP(identifier, otpRecord) {
  otps.set(identifier, otpRecord);
}

/**
 * Delete an OTP record
 * @param {string} identifier - Email or phone number
 * @returns {boolean} - True if OTP was deleted, false if not found
 */
export function deleteOTP(identifier) {
  return otps.delete(identifier);
}

/**
 * Get all OTPs (for testing/debugging)
 * @returns {Map<string, import('./models.js').OTPRecord>}
 */
export function getAllOTPs() {
  return otps;
}

/**
 * Block Record Storage Functions
 */

/**
 * Get a block record by identifier
 * @param {string} identifier - Email or phone number
 * @returns {import('./models.js').BlockRecord | null}
 */
export function getBlock(identifier) {
  return blocks.get(identifier) || null;
}

/**
 * Set/update a block record
 * @param {string} identifier - Email or phone number
 * @param {import('./models.js').BlockRecord} blockRecord - Block record object
 */
export function setBlock(identifier, blockRecord) {
  blocks.set(identifier, blockRecord);
}

/**
 * Delete a block record
 * @param {string} identifier - Email or phone number
 * @returns {boolean} - True if block was deleted, false if not found
 */
export function deleteBlock(identifier) {
  return blocks.delete(identifier);
}

/**
 * Get all blocks (for testing/debugging)
 * @returns {Map<string, import('./models.js').BlockRecord>}
 */
export function getAllBlocks() {
  return blocks;
}

/**
 * Clear all storage (for testing)
 */
export function clearAllStorage() {
  users.clear();
  otps.clear();
  blocks.clear();
}
