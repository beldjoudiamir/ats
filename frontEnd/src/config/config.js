// Configuration globale de l'application
const isProduction = process.env.NODE_ENV === 'production';

// URL de base de l'API
export const API_BASE_URL = isProduction 
  ? 'https://votre-app-railway.railway.app' // Remplacez par votre URL Railway
  : 'http://localhost:5000';

// Configuration pour les uploads
export const UPLOAD_BASE_URL = isProduction
  ? 'https://votre-app-railway.railway.app' // Remplacez par votre URL Railway
  : 'http://localhost:5000';

// Configuration pour les images
export const getImageUrl = (path) => {
  if (!path) return '/3342137.png';
  if (path.startsWith('http')) return path;
  return `${UPLOAD_BASE_URL}${path}`;
};

export default {
  API_BASE_URL,
  UPLOAD_BASE_URL,
  getImageUrl
}; 