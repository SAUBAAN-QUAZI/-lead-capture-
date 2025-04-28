'use client';

import React, { useState } from 'react';

const SettingsPage = () => {
  // State for settings form
  const [apiSettings, setApiSettings] = useState({
    openaiApiKey: 'sk-********************************',
    modelName: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 1000
  });

  const [conversationSettings, setConversationSettings] = useState({
    aiResponseDelay: 500,
    saveConversationHistory: true,
    autoSuggestResponses: true,
    collectLeadInfo: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newLeadNotifications: true,
    dailySummary: true,
    weeklyReport: true,
    alertOnErrorsOnly: false
  });

  const [userSettings, setUserSettings] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    allowMultipleLogins: false,
    twoFactorAuth: true
  });

  // Handle changes to API settings
  const handleApiSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApiSettings(prev => ({
      ...prev,
      [name]: name === 'temperature' || name === 'maxTokens' ? Number(value) : value
    }));
  };

  // Handle changes to conversation settings
  const handleConversationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, type, value } = e.target;
    setConversationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle changes to notification settings
  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle changes to user settings
  const handleUserSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submissions
  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the API settings to the backend
    alert('API settings saved successfully!');
  };

  const handleConversationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the conversation settings to the backend
    alert('Conversation settings saved successfully!');
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the notification settings to the backend
    alert('Notification settings saved successfully!');
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the user settings to the backend
    alert('User settings saved successfully!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-1">
              <a href="#api-settings" className="block px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
                API Configuration
              </a>
              <a href="#conversation-settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
                Conversation Settings
              </a>
              <a href="#notification-settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
                Notification Preferences
              </a>
              <a href="#user-settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
                User Management
              </a>
            </nav>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* API Settings */}
          <div id="api-settings" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
            <form onSubmit={handleApiSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                    OpenAI API Key
                  </label>
                  <div className="flex">
                    <input
                      type="password"
                      id="openaiApiKey"
                      name="openaiApiKey"
                      className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={apiSettings.openaiApiKey}
                      onChange={handleApiSettingsChange}
                    />
                    <button
                      type="button"
                      className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-700"
                      onClick={() => alert('In a real app, this would show the API key')}
                    >
                      Show
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Your OpenAI API key is encrypted and stored securely.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                    OpenAI Model
                  </label>
                  <select
                    id="modelName"
                    name="modelName"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={apiSettings.modelName}
                    onChange={handleApiSettingsChange}
                  >
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature: {apiSettings.temperature}
                  </label>
                  <input
                    type="range"
                    id="temperature"
                    name="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    className="block w-full"
                    value={apiSettings.temperature}
                    onChange={handleApiSettingsChange}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>More Focused</span>
                    <span>More Creative</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Tokens: {apiSettings.maxTokens}
                  </label>
                  <input
                    type="range"
                    id="maxTokens"
                    name="maxTokens"
                    min="100"
                    max="4000"
                    step="100"
                    className="block w-full"
                    value={apiSettings.maxTokens}
                    onChange={handleApiSettingsChange}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Save API Settings
                </button>
              </div>
            </form>
          </div>
          
          {/* Conversation Settings */}
          <div id="conversation-settings" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Conversation Settings</h2>
            <form onSubmit={handleConversationSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="aiResponseDelay" className="block text-sm font-medium text-gray-700 mb-1">
                    AI Response Delay (ms): {conversationSettings.aiResponseDelay}
                  </label>
                  <input
                    type="range"
                    id="aiResponseDelay"
                    name="aiResponseDelay"
                    min="0"
                    max="2000"
                    step="100"
                    className="block w-full"
                    value={conversationSettings.aiResponseDelay}
                    onChange={(e) => setConversationSettings(prev => ({
                      ...prev,
                      aiResponseDelay: Number(e.target.value)
                    }))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Instant</span>
                    <span>Delayed</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="saveConversationHistory"
                    name="saveConversationHistory"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    checked={conversationSettings.saveConversationHistory}
                    onChange={handleConversationSettingsChange}
                  />
                  <label htmlFor="saveConversationHistory" className="ml-2 block text-sm text-gray-700">
                    Save conversation history
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSuggestResponses"
                    name="autoSuggestResponses"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    checked={conversationSettings.autoSuggestResponses}
                    onChange={handleConversationSettingsChange}
                  />
                  <label htmlFor="autoSuggestResponses" className="ml-2 block text-sm text-gray-700">
                    Auto-suggest responses for leads
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="collectLeadInfo"
                    name="collectLeadInfo"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    checked={conversationSettings.collectLeadInfo}
                    onChange={handleConversationSettingsChange}
                  />
                  <label htmlFor="collectLeadInfo" className="ml-2 block text-sm text-gray-700">
                    Automatically collect lead information
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Save Conversation Settings
                </button>
              </div>
            </form>
          </div>
          
          {/* Notification Settings */}
          <div id="notification-settings" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
            <form onSubmit={handleNotificationSubmit}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationSettingsChange}
                    />
                    <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                      Email Notifications
                    </label>
                  </div>
                  <div className="text-xs text-gray-500">
                    Master toggle for all email notifications
                  </div>
                </div>
                
                <div className="pl-6 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newLeadNotifications"
                      name="newLeadNotifications"
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.newLeadNotifications}
                      onChange={handleNotificationSettingsChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <label htmlFor="newLeadNotifications" className="ml-2 block text-sm text-gray-700">
                      Notify me when new leads are captured
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="dailySummary"
                      name="dailySummary"
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.dailySummary}
                      onChange={handleNotificationSettingsChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <label htmlFor="dailySummary" className="ml-2 block text-sm text-gray-700">
                      Daily activity summary
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="weeklyReport"
                      name="weeklyReport"
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.weeklyReport}
                      onChange={handleNotificationSettingsChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <label htmlFor="weeklyReport" className="ml-2 block text-sm text-gray-700">
                      Weekly performance report
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="alertOnErrorsOnly"
                      name="alertOnErrorsOnly"
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.alertOnErrorsOnly}
                      onChange={handleNotificationSettingsChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <label htmlFor="alertOnErrorsOnly" className="ml-2 block text-sm text-gray-700">
                      Only alert me on errors and issues
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Save Notification Settings
                </button>
              </div>
            </form>
          </div>
          
          {/* User Settings */}
          <div id="user-settings" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">User Management</h2>
            <form onSubmit={handleUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={userSettings.name}
                    onChange={handleUserSettingsChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={userSettings.email}
                    onChange={handleUserSettingsChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={userSettings.role}
                    onChange={handleUserSettingsChange}
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Role changes must be done by a system administrator.
                  </p>
                </div>
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="allowMultipleLogins"
                    name="allowMultipleLogins"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    checked={userSettings.allowMultipleLogins}
                    onChange={handleUserSettingsChange}
                  />
                  <label htmlFor="allowMultipleLogins" className="ml-2 block text-sm text-gray-700">
                    Allow multiple login sessions
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    checked={userSettings.twoFactorAuth}
                    onChange={handleUserSettingsChange}
                  />
                  <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                    Enable two-factor authentication
                  </label>
                </div>
                
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset your password?')) {
                        alert('Password reset email sent!');
                      }
                    }}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Save User Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 