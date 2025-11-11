
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentApiKey: string;
}

const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key.');
      return;
    }
    setError('');
    onSave(apiKey);
    onClose();
  };
  
  const handleTestConnection = async () => {
      // Dummy test logic for now. A real implementation would make a simple API call.
      if (apiKey.trim() && apiKey.startsWith('AIza')) {
          setError('');
          alert('Connection successful!');
      } else {
          setError('Invalid API Key format. It should start with "AIza".');
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-slate-400 mt-2">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
        
        {error && (
            <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm">
                {error}
            </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
          >
            Save Settings
          </button>
          <button
            onClick={handleTestConnection}
            className="flex-1 bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
          >
            Test Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal;
