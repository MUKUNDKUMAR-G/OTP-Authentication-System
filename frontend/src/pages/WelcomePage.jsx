import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function WelcomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve token from localStorage
        const token = authService.getToken();
        
        // Redirect to login if token is missing
        if (!token) {
          navigate('/');
          return;
        }
        
        // Call AuthService.getMe to fetch user data
        const userData = await authService.getMe(token);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        // Redirect to login if token is invalid
        console.error('Failed to fetch user:', error);
        authService.clearToken();
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    // Clear token and redirect to login
    authService.clearToken();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>Welcome!</h1>
        
        <div className="user-info">
          <p><strong>Identifier:</strong> {user.identifier}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <p><strong>Last login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
