import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api.js';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [environmentInfo, setEnvironmentInfo] = useState({});

  useEffect(() => {
    // Collecter les informations d'environnement
    setEnvironmentInfo({
      nodeEnv: process.env.NODE_ENV,
      viteApiUrl: process.env.VITE_API_URL,
      apiBaseUrl: API_BASE_URL,
      userAgent: navigator.userAgent,
      location: window.location.href,
      timestamp: new Date().toISOString()
    });
  }, []);

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
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
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
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
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
      },
      {
        name: 'Test de connectivité réseau',
        test: async () => {
          const startTime = Date.now();
          const response = await fetch(`${API_BASE_URL}/api/health`);
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          return {
            status: response.status,
            duration: `${duration}ms`,
            headers: Object.fromEntries(response.headers.entries())
          };
        }
      },
      {
        name: 'Test des variables d\'environnement',
        test: () => Promise.resolve({
          NODE_ENV: process.env.NODE_ENV,
          VITE_API_URL: process.env.VITE_API_URL,
          API_BASE_URL: API_BASE_URL
        })
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
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔧 Test de Connexion API</h2>
      
      {/* Informations d'environnement */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📋 Informations d'environnement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>URL API configurée:</strong></p>
            <p className="font-mono text-blue-600 break-all">{API_BASE_URL}</p>
          </div>
          <div>
            <p><strong>Environnement:</strong></p>
            <p className="font-mono">{process.env.NODE_ENV || 'development'}</p>
          </div>
          <div>
            <p><strong>VITE_API_URL:</strong></p>
            <p className="font-mono text-green-600">{process.env.VITE_API_URL || 'Non définie'}</p>
          </div>
          <div>
            <p><strong>URL actuelle:</strong></p>
            <p className="font-mono text-purple-600 break-all">{window.location.href}</p>
          </div>
        </div>
      </div>

      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 font-semibold"
      >
        {loading ? '🔄 Tests en cours...' : '🚀 Lancer les tests'}
      </button>

      {testResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">📊 Résultats des tests:</h3>
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  test.status === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-lg">{test.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    test.status === 'success' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {test.status === 'success' ? '✅ Succès' : '❌ Échec'}
                  </span>
                </div>
                
                {test.status === 'success' ? (
                  <pre className="mt-2 text-sm bg-gray-100 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto">
                    {JSON.stringify(test.result, null, 2)}
                  </pre>
                ) : (
                  <div className="mt-2">
                    <p className="text-red-600 text-sm font-medium">{test.error}</p>
                    {test.details && (
                      <details className="mt-2">
                        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                          🔍 Détails techniques
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-32 overflow-y-auto">
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

      {/* Instructions de dépannage */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">🔧 Instructions de dépannage</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Vérifiez que le backend Railway est démarré et accessible</li>
          <li>• Configurez la variable VITE_API_URL dans Vercel</li>
          <li>• Vérifiez les logs Railway pour les erreurs de démarrage</li>
          <li>• Assurez-vous que les routes API existent sur le backend</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest; 