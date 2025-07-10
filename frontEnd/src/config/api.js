// Configuration centralisée pour l'API
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('localhost');

const isProduction = !isLocalhost || process.env.VITE_API_URL;

// URL par défaut pour Railway (à remplacer par la vraie URL)
const RAILWAY_URL = 'https://ats-app-production.up.railway.app';

const API_BASE_URL = isProduction
  ? (process.env.VITE_API_URL || RAILWAY_URL)
  : 'http://localhost:3000';

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 VITE_API_URL:', process.env.VITE_API_URL);
console.log('🏠 Hostname:', window.location.hostname);
console.log('📦 Is Production:', isProduction);
console.log('🏠 Is Localhost:', isLocalhost);

export default API_BASE_URL; 