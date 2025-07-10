import React from 'react';
import API_BASE_URL from '../config/api.js';

const EnvironmentDebug = () => {
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    viteApiUrl: process.env.VITE_API_URL,
    apiBaseUrl: API_BASE_URL,
    hostname: window.location.hostname,
    href: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">🔍 Debug Environnement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div><strong>NODE_ENV:</strong> <span className="font-mono">{envInfo.nodeEnv}</span></div>
        <div><strong>VITE_API_URL:</strong> <span className="font-mono text-blue-600">{envInfo.viteApiUrl || 'Non définie'}</span></div>
        <div><strong>API_BASE_URL:</strong> <span className="font-mono text-green-600">{envInfo.apiBaseUrl}</span></div>
        <div><strong>Hostname:</strong> <span className="font-mono">{envInfo.hostname}</span></div>
        <div><strong>URL complète:</strong> <span className="font-mono text-purple-600 break-all">{envInfo.href}</span></div>
        <div><strong>Timestamp:</strong> <span className="font-mono">{envInfo.timestamp}</span></div>
      </div>
    </div>
  );
};

export default EnvironmentDebug; 