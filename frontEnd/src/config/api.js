// Configuration centralisée pour l'API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ats-app-production.up.railway.app'  // URL Railway
  : 'http://localhost:5000';  // URL locale

console.log('🌐 API Base URL:', API_BASE_URL);

export default API_BASE_URL; 