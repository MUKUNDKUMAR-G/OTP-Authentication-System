import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { isValidIdentifier, getIdentifierValidationError } from '../utils/validation';

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Real-time validation feedback
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    
    // Clear errors when user starts typing
    setError(null);
    
    // Show validation feedback only after user has typed something
    if (value.trim() !== '') {
      const validationErr = getIdentifierValidationError(value);
      setValidationError(validationErr);
    } else {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate identifier before submission
    const validationErr = getIdentifierValidationError(identifier);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }
    
    // Prevent submission if validation fails
    if (!isValidIdentifier(identifier)) {
      setValidationError('Please enter a valid email or phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call AuthService.requestOtp
      const response = await authService.requestOtp(identifier);
      
      if (response.success) {
        // Navigate to /verify on success, passing identifier via state
        navigate('/verify', { state: { identifier } });
      } else {
        // Display error message
        setError(response.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      // Handle API errors
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        // Display error messages for blocked identifiers
        if (errorData.blockedUntil) {
          const remainingMinutes = Math.ceil(errorData.remainingTime / 60);
          setError(`Too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`);
        } else {
          setError(errorData.error || 'Failed to send OTP. Please try again.');
        }
      } else {
        // Network or other errors
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>Login</h1>
        <p>Enter your email or phone number to receive an OTP</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Email or Phone Number</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder="email@example.com or +911234567890"
              disabled={loading}
              className={validationError ? 'input-error' : ''}
              required
            />
            {validationError && (
              <div className="validation-error">{validationError}</div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading || validationError !== null}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
