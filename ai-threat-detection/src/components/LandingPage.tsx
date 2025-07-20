import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Brain, AlertTriangle, Lock, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Shield className="w-24 h-24 text-primary-blue animate-pulse" />
                <Eye className="w-8 h-8 text-text-light absolute top-8 left-8" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-text-light mb-6">
              AI-Powered
              <span className="block text-primary-blue">Threat Detection</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced behavioral analysis and malware detection system powered by artificial intelligence
              to protect your organization from insider threats and cyber attacks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Lock className="w-5 h-5 mr-2" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-light mb-4">
            Comprehensive Security Solutions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our AI-driven platform provides real-time monitoring, threat analysis, and automated response capabilities
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center group hover:border-primary-blue transition-colors duration-300">
            <Brain className="w-16 h-16 text-primary-blue mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl font-semibold text-text-light mb-3">
              AI Behavioral Analysis
            </h3>
            <p className="text-gray-400">
              Advanced machine learning algorithms detect anomalous user behavior patterns and predict potential insider threats
            </p>
          </div>
          
          <div className="card text-center group hover:border-primary-blue transition-colors duration-300">
            <AlertTriangle className="w-16 h-16 text-alert-red mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl font-semibold text-text-light mb-3">
              Real-time Malware Detection
            </h3>
            <p className="text-gray-400">
              Continuous monitoring and instant identification of malicious files and activities with AI-powered scanning
            </p>
          </div>
          
          <div className="card text-center group hover:border-primary-blue transition-colors duration-300">
            <Shield className="w-16 h-16 text-success-green mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl font-semibold text-text-light mb-3">
              Automated Response
            </h3>
            <p className="text-gray-400">
              Intelligent threat response system that automatically contains threats and generates detailed security reports
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-blue mb-2">99.7%</div>
              <div className="text-gray-400">Threat Detection Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success-green mb-2">24/7</div>
              <div className="text-gray-400">Continuous Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-blue mb-2">&lt;1s</div>
              <div className="text-gray-400">Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success-green mb-2">1000+</div>
              <div className="text-gray-400">Protected Organizations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-bg border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 AI Threat Detection System. Built with cutting-edge security technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;