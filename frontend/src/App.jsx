import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/welcome" element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
