import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { isValidOtp } from '../utils/validation';

function VerificationPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;

  useEffect(() => {
    // Redirect to login if no identifier is provided
    if (!identifier) {
      navigate('/');
    }
  }, [identifier, navigate]);

  // Validate OTP format as user types
  useEffect(() => {
    if (otp && !isValidOtp(otp)) {
      setValidationError('OTP must be exactly 6 digits');
    } else {
      setValidationError(null);
    }
  }, [otp]);

  const handleRequestNewOtp = async () => {
    navigate('/', { state: { identifier } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate OTP format before submission
    if (!isValidOtp(otp)) {
      setValidationError('OTP must be exactly 6 digits');
      return;
    }

    setLoading(true);

    try {
      // Call AuthService to verify OTP
      const token = await authService.verifyOtp(identifier, otp);
      
      // On success: token is already saved by authService, navigate to welcome
      navigate('/welcome');
    } catch (err) {
      setLoading(false);
      
      // Handle different error types
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check if OTP is expired
        if (errorData.error?.toLowerCase().includes('expired')) {
          setError(
            <span>
              This OTP has expired. 
              <button 
                className="link-button-inline" 
                onClick={handleRequestNewOtp}
                type="button"
              >
                Request a new OTP
              </button>
            </span>
          );
        } else {
          // Display error with attempts remaining
          const attempts = errorData.attemptsRemaining;
          if (typeof attempts === 'number') {
            setAttemptsRemaining(attempts);
            setError(`${errorData.error || 'Invalid OTP'}. ${attempts} attempt${attempts !== 1 ? 's' : ''} remaining.`);
          } else {
            setError(errorData.error || 'Verification failed. Please try again.');
          }
        }
      } else {
        // Network or other errors
        setError(err.message || 'An error occurred. Please try again.');
      }
    }
  };

  if (!identifier) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>Verify OTP</h1>
        <p>Enter the 6-digit code sent to {identifier}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">One-Time Password</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              disabled={loading}
              required
            />
            {validationError && !error && (
              <div className="validation-error">{validationError}</div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          
          {attemptsRemaining < 3 && !error?.toString().includes('expired') && (
            <div className="info-message">
              Attempts remaining: {attemptsRemaining}
            </div>
          )}

          <button type="submit" disabled={loading || !!validationError}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : 'Verify'}
          </button>
        </form>

        <button 
          className="link-button" 
          onClick={handleRequestNewOtp}
          disabled={loading}
        >
          Request new OTP
        </button>
      </div>
    </div>
  );
}

export default VerificationPage;
