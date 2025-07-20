import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components (will create these next)
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ThreatAnalysis from './components/ThreatAnalysis';
import MalwareScanner from './components/MalwareScanner';
import RiskReports from './components/RiskReports';
import SystemLogs from './components/SystemLogs';
import Settings from './components/Settings';
import Navbar from './components/Navbar';

// Auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  user: { email: string; name: string } | null;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock authentication logic
    if (email && password) {
      const userData = { email, name: email.split('@')[0] };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const authValue: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    user
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen bg-dark-bg text-text-light">
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
            } />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
            } />
            <Route path="/signup" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } />
            <Route path="/threats" element={
              isAuthenticated ? <ThreatAnalysis /> : <Navigate to="/login" />
            } />
            <Route path="/scanner" element={
              isAuthenticated ? <MalwareScanner /> : <Navigate to="/login" />
            } />
            <Route path="/reports" element={
              isAuthenticated ? <RiskReports /> : <Navigate to="/login" />
            } />
            <Route path="/logs" element={
              isAuthenticated ? <SystemLogs /> : <Navigate to="/login" />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <Settings /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
