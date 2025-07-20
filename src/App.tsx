import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
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

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  settings: {
    aiAlerts: boolean;
    emailNotifications: boolean;
    dataRetentionDays: number;
  };
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medium-slate-blue"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-charcoal text-white-smoke">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/threats" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <ThreatAnalysis />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/malware" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <MalwareScanner />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <FileUpload />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <RiskReports />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/logs" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <SystemLogs />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64">
                  <Settings />
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;