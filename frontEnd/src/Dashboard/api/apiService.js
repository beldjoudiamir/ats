// src/api/estimateService.js
import axios from "axios";
import { API_BASE_URL } from "../../config/config.js";

// Partie pour les informations de l'entreprise //
export const getCompanyInfo = () => 
    axios.get(`${API_BASE_URL}/api/myCompanyInfo`);

export const getCompanyPhone = () => axios.get(`${API_BASE_URL}/api/myCompanyInfo/phone`);

export const updateCompanyInfo = (id, data) => {
  console.log('🚀 updateCompanyInfo - DÉBUT');
  console.log('🚀 updateCompanyInfo - ID:', id);
  console.log('🚀 updateCompanyInfo - Type de ID:', typeof id);
  console.log('🚀 updateCompanyInfo - Data:', JSON.stringify(data, null, 2));
  console.log('🚀 updateCompanyInfo - URL:', `${API_BASE_URL}/api/myCompanyInfo/update/${id}`);
  
  return axios.put(`${API_BASE_URL}/api/myCompanyInfo/update/${id}`, data)
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
  axios.get(`${API_BASE_URL}/api/estimate`);

export const addEstimate = (data) => 
  axios.post(`${API_BASE_URL}/api/estimate/add`, data);

export const updateEstimate = (id, data) =>
    axios.put(`${API_BASE_URL}/api/estimate/update/${id}`, data);

export const apiDeleteEstimate = (id) => 
    axios.delete(`${API_BASE_URL}/api/estimate/delete/${id}`);


// partie pour les clients //

export const getClients = () => 
  axios.get(`${API_BASE_URL}/api/clients`);

export const addClients = (data) => 
  axios.post(`${API_BASE_URL}/api/clients/add`, data);

// export const updateClients = (id, data) =>
//     axios.put(`${API_BASE_URL}/api/companyClient/update/${id}`, data);    

export const updateClients = (id, updatedData) => {
  return axios.put(`${API_BASE_URL}/api/clients/update/${id}`, updatedData);
};

export const apiDeleteClients = (id) =>
    axios.delete(`${API_BASE_URL}/api/clients/delete/${id}`);

// partie pour les commissionnaires //

export const getCommissionnaires = () => 
  axios.get(`${API_BASE_URL}/api/listeCommissionnaire`);

export const addCommissionnaire = (data) => 
  axios.post(`${API_BASE_URL}/api/listeCommissionnaire/add`, data);

export const updateCommissionnaire = (id, updatedData) => {
  return axios.put(`${API_BASE_URL}/api/listeCommissionnaire/update/${id}`, updatedData);
};

export const deleteCommissionnaire = (id) =>
  axios.delete(`${API_BASE_URL}/api/listeCommissionnaire/delete/${id}`);

// partie pour les factures //
export const getAllFactures = () =>
  axios.get(`${API_BASE_URL}/api/invoice`);

export const addFacture = (data) =>
  axios.post(`${API_BASE_URL}/api/invoice/add`, data);

export const updateFacture = (id, data) =>
  axios.put(`${API_BASE_URL}/api/invoice/update/${id}`, data);

export const apiDeleteFacture = (id) =>
  axios.delete(`${API_BASE_URL}/api/invoice/delete/${id}`);

// Met à jour le logo de l'entreprise (logo peut être une URL ou une chaîne vide pour suppression)
export const updateCompanyLogo = (id, logo) => {
  console.log('updateCompanyLogo - ID:', id);
  console.log('updateCompanyLogo - Logo:', logo);
  return axios.patch(`${API_BASE_URL}/api/myCompanyInfo/logo/${id}`, { logo: logo ?? "" });
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







