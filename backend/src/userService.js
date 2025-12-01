import { getUser, setUser } from './storage.js';

/**
 * User Service - Handles user creation and retrieval
 */

/**
 * Find an existing user or create a new one
 * @param {string} identifier - Email or phone number
 * @returns {import('./models.js').User} - User object
 */
export function findOrCreateUser(identifier) {
  let user = getUser(identifier);
  
  if (!user) {
    // Create new user
    const now = Date.now();
    user = {
      identifier,
      createdAt: now,
      lastLogin: now,
    };
    setUser(identifier, user);
  }
  
  return user;
}

/**
 * Get a user by identifier
 * @param {string} identifier - Email or phone number
 * @returns {import('./models.js').User | null} - User object or null if not found
 */
export function getUserByIdentifier(identifier) {
  return getUser(identifier);
}

/**
 * Update the lastLogin timestamp for a user
 * @param {string} identifier - Email or phone number
 * @returns {import('./models.js').User | null} - Updated user object or null if not found
 */
export function updateLastLogin(identifier) {
  const user = getUser(identifier);
  
  if (!user) {
    return null;
  }
  
  user.lastLogin = Date.now();
  setUser(identifier, user);
  
  return user;
}
