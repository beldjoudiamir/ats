import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api.js';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Test de base - URL API',
        test: () => Promise.resolve(API_BASE_URL)
      },
      {
        name: 'Test de connexion - Health Check',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/api/health`);
          return response.json();
        }
      },
      {
        name: 'Test CORS - GET simple',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          return response.json();
        }
      },
      {
        name: 'Test avec Axios',
        test: async () => {
          const axios = (await import('axios')).default;
          const response = await axios.get(`${API_BASE_URL}/api/health`);
          return response.data;
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`🧪 Exécution du test: ${test.name}`);
        const result = await test.test();
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'success',
          result: result
        }]);
      } catch (error) {
        console.error(`❌ Test échoué: ${test.name}`, error);
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          error: error.message,
          details: error
        }]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔧 Test de Connexion API</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          <strong>URL API configurée:</strong> {API_BASE_URL}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Environnement:</strong> {process.env.NODE_ENV || 'development'}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>VITE_API_URL:</strong> {process.env.VITE_API_URL || 'Non définie'}
        </p>
      </div>

      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Tests en cours...' : 'Lancer les tests'}
      </button>

      {testResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Résultats des tests:</h3>
          <div className="space-y-3">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${
                  test.status === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{test.name}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    test.status === 'success' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {test.status === 'success' ? '✅ Succès' : '❌ Échec'}
                  </span>
                </div>
                
                {test.status === 'success' ? (
                  <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(test.result, null, 2)}
                  </pre>
                ) : (
                  <div className="mt-2">
                    <p className="text-red-600 text-sm">{test.error}</p>
                    {test.details && (
                      <details className="mt-2">
                        <summary className="text-sm text-gray-600 cursor-pointer">
                          Détails techniques
                        </summary>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 