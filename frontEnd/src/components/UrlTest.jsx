import React, { useState } from 'react';
import API_BASE_URL from '../config/api.js';

const UrlTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testUrl = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Test URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      
      setTestResult({
        success: true,
        url: API_BASE_URL,
        status: response.status,
        data: data
      });
    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResult({
        success: false,
        url: API_BASE_URL,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2 text-blue-800">🔗 Test URL API</h3>
      
      <div className="mb-4">
        <p className="text-sm text-blue-700 mb-2">
          <strong>URL configurée:</strong> <span className="font-mono">{API_BASE_URL}</span>
        </p>
        <p className="text-sm text-blue-700 mb-2">
          <strong>Hostname:</strong> <span className="font-mono">{window.location.hostname}</span>
        </p>
        <p className="text-sm text-blue-700">
          <strong>VITE_API_URL:</strong> <span className="font-mono">{process.env.VITE_API_URL || 'Non définie'}</span>
        </p>
      </div>

      <button
        onClick={testUrl}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester l\'URL'}
      </button>

      {testResult && (
        <div className={`mt-4 p-3 rounded ${
          testResult.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
        }`}>
          <h4 className="font-semibold mb-2">
            {testResult.success ? '✅ Succès' : '❌ Échec'}
          </h4>
          <p className="text-sm mb-2">
            <strong>URL testée:</strong> {testResult.url}
          </p>
          {testResult.success ? (
            <div>
              <p className="text-sm mb-2">
                <strong>Status:</strong> {testResult.status}
              </p>
              <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              <strong>Erreur:</strong> {testResult.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UrlTest; 