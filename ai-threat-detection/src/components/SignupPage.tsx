import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Lock, Mail, User, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = authContext?.login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary-blue" />
          </div>
          <h1 className="text-3xl font-bold text-text-light mb-2">Create Account</h1>
          <p className="text-gray-400">Join our advanced threat detection platform</p>
        </div>

        {/* Signup Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-alert-red/10 border border-alert-red/20 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-alert-red mr-3" />
                <span className="text-alert-red text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Password must be at least 6 characters long
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Confirm your password"
                  required
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle className="w-5 h-5 text-success-green absolute right-3 top-3" />
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="rounded border-gray-600 text-primary-blue focus:ring-primary-blue mt-1" required />
              <span className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <button type="button" className="text-primary-blue hover:text-blue-400">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-primary-blue hover:text-blue-400">Privacy Policy</button>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-blue hover:text-blue-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-success-green/10 border border-success-green/20 rounded-lg">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-success-green mr-3" />
            <p className="text-sm text-success-green">
              Your data is protected with enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;