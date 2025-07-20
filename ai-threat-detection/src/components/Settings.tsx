import React, { useState, useContext, useEffect } from 'react';
import { Save, Eye, EyeOff, Key, Bell, Shield, Database, Brain, Lock } from 'lucide-react';
import { AuthContext } from '../App';
import { UserSettings } from '../types';

const Settings: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    aiSuggestions: true,
    dataRetentionDays: 90,
    apiKey: 'sk-1234567890abcdef...',
    autoQuarantine: true,
    realTimeScanning: true
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: keyof UserSettings, value: boolean | number | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (key: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
    }
    
    setIsSaving(false);
  };

  const changePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setSaveMessage('Please fill in all password fields.');
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      setSaveMessage('New passwords do not match.');
      return;
    }
    
    if (passwords.new.length < 6) {
      setSaveMessage('Password must be at least 6 characters long.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswords({ current: '', new: '', confirm: '' });
      setSaveMessage('Password changed successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to change password. Please try again.');
    }
    
    setIsSaving(false);
  };

  const generateNewApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    handleSettingChange('apiKey', newKey);
    setSaveMessage('New API key generated. Remember to save your settings!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and system configuration</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveMessage.includes('successfully') 
            ? 'bg-success-green/20 border border-success-green/30 text-success-green'
            : 'bg-alert-red/20 border border-alert-red/30 text-alert-red'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-primary-blue mr-3" />
            <h2 className="text-xl font-semibold text-text-light">Profile & Security</h2>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Email Address</label>
              <input
                type="email"
                value={authContext?.user?.email || ''}
                disabled
                className="input-field w-full opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Password Change */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-text-light mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    className="input-field w-full"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <button
                onClick={changePassword}
                disabled={isSaving}
                className="btn-secondary mt-4"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Bell className="w-6 h-6 text-primary-blue mr-3" />
            <h2 className="text-xl font-semibold text-text-light">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-light">Email Notifications</div>
                <div className="text-xs text-gray-400">Receive security alerts and reports via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Brain className="w-6 h-6 text-primary-blue mr-3" />
            <h2 className="text-xl font-semibold text-text-light">AI Configuration</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-light">AI Suggestions</div>
                <div className="text-xs text-gray-400">Enable intelligent security recommendations</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiSuggestions}
                  onChange={(e) => handleSettingChange('aiSuggestions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-light">Auto Quarantine</div>
                <div className="text-xs text-gray-400">Automatically quarantine high-risk threats</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoQuarantine}
                  onChange={(e) => handleSettingChange('autoQuarantine', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-light">Real-time Scanning</div>
                <div className="text-xs text-gray-400">Continuous monitoring of file activities</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.realTimeScanning}
                  onChange={(e) => handleSettingChange('realTimeScanning', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 text-primary-blue mr-3" />
            <h2 className="text-xl font-semibold text-text-light">Data Management</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Data Retention Period</label>
              <select
                value={settings.dataRetentionDays}
                onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
                className="input-field"
              >
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>1 year</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">How long to keep security logs and scan results</p>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Key className="w-6 h-6 text-primary-blue mr-3" />
            <h2 className="text-xl font-semibold text-text-light">API Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                    className="input-field pr-12 w-full"
                    placeholder="Enter API key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-text-light"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={generateNewApiKey}
                  className="btn-secondary whitespace-nowrap"
                >
                  Generate New
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">API key for integrating with external security tools</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;