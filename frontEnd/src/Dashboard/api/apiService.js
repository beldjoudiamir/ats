// src/api/estimateService.js
import axios from "axios";

// Partie pour les informations de l'entreprise //
export const getCompanyInfo = () => 
    axios.get("http://localhost:5000/api/myCompanyInfo");

export const getCompanyPhone = () => axios.get("http://localhost:5000/api/myCompanyInfo/phone");

export const updateCompanyInfo = (id, data) => {
  console.log('🚀 updateCompanyInfo - DÉBUT');
  console.log('🚀 updateCompanyInfo - ID:', id);
  console.log('🚀 updateCompanyInfo - Type de ID:', typeof id);
  console.log('🚀 updateCompanyInfo - Data:', JSON.stringify(data, null, 2));
  console.log('🚀 updateCompanyInfo - URL:', `http://localhost:5000/api/myCompanyInfo/update/${id}`);
  
  return axios.put(`http://localhost:5000/api/myCompanyInfo/update/${id}`, data)
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
  axios.get("http://localhost:5000/api/estimate");

export const addEstimate = (data) => 
  axios.post("http://localhost:5000/api/estimate/add", data);

export const updateEstimate = (id, data) =>
    axios.put(`http://localhost:5000/api/estimate/update/${id}`, data);

export const apiDeleteEstimate = (id) => 
    axios.delete(`http://localhost:5000/api/estimate/delete/${id}`);


// partie pour les clients //

export const getClients = () => 
  axios.get("http://localhost:5000/api/clients");

export const addClients = (data) => 
  axios.post("http://localhost:5000/api/clients/add", data);

// export const updateClients = (id, data) =>
//     axios.put(`http://localhost:5000/api/companyClient/update/${id}`, data);    

export const updateClients = (id, updatedData) => {
  return axios.put(`http://localhost:5000/api/clients/update/${id}`, updatedData);
};

export const apiDeleteClients = (id) =>
    axios.delete(`http://localhost:5000/api/clients/delete/${id}`);

// partie pour les commissionnaires //

export const getCommissionnaires = () => 
  axios.get("http://localhost:5000/api/listeCommissionnaire");

export const addCommissionnaire = (data) => 
  axios.post("http://localhost:5000/api/listeCommissionnaire/add", data);

export const updateCommissionnaire = (id, updatedData) => {
  return axios.put(`http://localhost:5000/api/listeCommissionnaire/update/${id}`, updatedData);
};

export const deleteCommissionnaire = (id) =>
  axios.delete(`http://localhost:5000/api/listeCommissionnaire/delete/${id}`);

// partie pour les factures //
export const getAllFactures = () =>
  axios.get("http://localhost:5000/api/invoice");

export const addFacture = (data) =>
  axios.post("http://localhost:5000/api/invoice/add", data);

export const updateFacture = (id, data) =>
  axios.put(`http://localhost:5000/api/invoice/update/${id}`, data);

export const apiDeleteFacture = (id) =>
  axios.delete(`http://localhost:5000/api/invoice/delete/${id}`);

// Met à jour le logo de l'entreprise (logo peut être une URL ou une chaîne vide pour suppression)
export const updateCompanyLogo = (id, logo) => {
  console.log('updateCompanyLogo - ID:', id);
  console.log('updateCompanyLogo - Logo:', logo);
  return axios.patch(`http://localhost:5000/api/myCompanyInfo/logo/${id}`, { logo: logo ?? "" });
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







