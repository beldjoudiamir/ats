// Configuration centralisée pour l'API
const isProduction = process.env.NODE_ENV === 'production' || 
                     window.location.hostname !== 'localhost' ||
                     process.env.VITE_API_URL;

const API_BASE_URL = isProduction
  ? (process.env.VITE_API_URL || 'https://ats-app-production.up.railway.app')  // URL Railway en production
  : 'http://localhost:3000';  // URL locale en développement

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 VITE_API_URL:', process.env.VITE_API_URL);
console.log('🏠 Hostname:', window.location.hostname);
console.log('📦 Is Production:', isProduction);

export default API_BASE_URL; 