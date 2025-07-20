import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ThreatAnalysis from './components/ThreatAnalysis';
import MalwareScanner from './components/MalwareScanner';
import FileUpload from './components/FileUpload';
import RiskReports from './components/RiskReports';
import SystemLogs from './components/SystemLogs';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-900">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Navbar />
                      <div className="flex-1 ml-64">
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="threats" element={<ThreatAnalysis />} />
                          <Route path="malware" element={<MalwareScanner />} />
                          <Route path="upload" element={<FileUpload />} />
                          <Route path="reports" element={<RiskReports />} />
                          <Route path="logs" element={<SystemLogs />} />
                          <Route path="settings" element={<Settings />} />
                        </Routes>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
