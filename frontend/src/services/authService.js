import api from './api';

/**
 * AuthService handles all authentication-related API calls and token management
 */
class AuthService {
  /**
   * Request an OTP for the given identifier
   * @param {string} identifier - Email or phone number
   * @returns {Promise<Object>} Response with success status and expiration info
   */
  async requestOtp(identifier) {
    const response = await api.post('/auth/request-otp', { identifier });
    return response.data;
  }

  /**
   * Verify an OTP for the given identifier
   * @param {string} identifier - Email or phone number
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<string>} JWT token on success
   */
  async verifyOtp(identifier, otp) {
    const response = await api.post('/auth/verify-otp', { identifier, otp });
    if (response.data.success && response.data.token) {
      this.saveToken(response.data.token);
      return response.data.token;
    }
    throw new Error(response.data.error || 'Verification failed');
  }

  /**
   * Get current user information using the provided token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} User information
   */
  async getMe(token) {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.user;
  }

  /**
   * Save token to localStorage
   * @param {string} token - JWT token to store
   */
  saveToken(token) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Get token from localStorage
   * @returns {string|null} Stored token or null if not found
   */
  getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Clear token from localStorage
   */
  clearToken() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
}

// Export a singleton instance
export default new AuthService();
