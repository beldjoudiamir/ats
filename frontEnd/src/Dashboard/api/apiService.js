// src/api/estimateService.js
import axios from "axios";
import API_BASE_URL from "../../config/api.js";

// Configuration axios avec intercepteurs pour le debugging
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Requête API:', config.method?.toUpperCase(), config.url);
    console.log('🔗 URL complète:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('💥 Erreur API:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Partie pour les informations de l'entreprise //
export const getCompanyInfo = () => 
    apiClient.get(`/api/myCompanyInfo`);

export const getCompanyPhone = () => 
    apiClient.get(`/api/myCompanyInfo/phone`);

export const updateCompanyInfo = (id, data) => {
  console.log('🚀 updateCompanyInfo - DÉBUT');
  console.log('🚀 updateCompanyInfo - ID:', id);
  console.log('🚀 updateCompanyInfo - Type de ID:', typeof id);
  console.log('🚀 updateCompanyInfo - Data:', JSON.stringify(data, null, 2));
  
  return apiClient.put(`/api/myCompanyInfo/update/${id}`, data)
    .then(response => {
      console.log('✅ updateCompanyInfo - SUCCÈS:', response.data);
      return response;
    })
    .catch(error => {
      console.error('💥 updateCompanyInfo - ERREUR:');
      console.error('💥 updateCompanyInfo - Status:', error.response?.status);
      console.error('💥 updateCompanyInfo - StatusText:', error.response?.statusText);
      console.error('💥 updateCompanyInfo - Data:', error.response?.data);
      console.error('💥 updateCompanyInfo - Message:', error.message);
      throw error;
    });
};

// partie pour les devis //
export const getAllEstimates = () => 
  apiClient.get(`/api/estimate`);

export const addEstimate = (data) => 
  apiClient.post(`/api/estimate/add`, data);

export const updateEstimate = (id, data) =>
    apiClient.put(`/api/estimate/update/${id}`, data);

export const apiDeleteEstimate = (id) => 
    apiClient.delete(`/api/estimate/delete/${id}`);


// partie pour les clients //

export const getClients = () => 
  apiClient.get(`/api/clients`);

export const addClients = (data) => 
  apiClient.post(`/api/clients/add`, data);

export const updateClients = (id, updatedData) => {
  return apiClient.put(`/api/clients/update/${id}`, updatedData);
};

export const apiDeleteClients = (id) =>
    apiClient.delete(`/api/clients/delete/${id}`);

// partie pour les commissionnaires //

export const getCommissionnaires = () => 
  apiClient.get(`/api/listeCommissionnaire`);

export const addCommissionnaire = (data) => 
  apiClient.post(`/api/listeCommissionnaire/add`, data);

export const updateCommissionnaire = (id, updatedData) => {
  return apiClient.put(`/api/listeCommissionnaire/update/${id}`, updatedData);
};

export const deleteCommissionnaire = (id) =>
  apiClient.delete(`/api/listeCommissionnaire/delete/${id}`);

// partie pour les factures //
export const getAllFactures = () =>
  apiClient.get(`/api/invoice`);

export const addFacture = (data) =>
  apiClient.post(`/api/invoice/add`, data);

export const updateFacture = (id, data) =>
  apiClient.put(`/api/invoice/update/${id}`, data);

export const apiDeleteFacture = (id) =>
  apiClient.delete(`/api/invoice/delete/${id}`);

// Met à jour le logo de l'entreprise (logo peut être une URL ou une chaîne vide pour suppression)
export const updateCompanyLogo = (id, logo) => {
  console.log('updateCompanyLogo - ID:', id);
  console.log('updateCompanyLogo - Logo:', logo);
  return apiClient.patch(`/api/myCompanyInfo/logo/${id}`, { logo: logo ?? "" });
};

export async function secureFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  return res.json();
}







