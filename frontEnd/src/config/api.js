// Configuration API pour développement et production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Fonction pour construire les URLs API
export const buildApiUrl = (endpoint) => `${API_BASE_URL}/api${endpoint}`;

// URLs API
export const API_ENDPOINTS = {
  // Entreprise
  COMPANY_INFO: '/myCompanyInfo',
  COMPANY_PHONE: '/myCompanyInfo/phone',
  COMPANY_UPDATE: (id) => `/myCompanyInfo/update/${id}`,
  COMPANY_LOGO: (id) => `/myCompanyInfo/logo/${id}`,
  
  // Devis
  ESTIMATES: '/estimate',
  ESTIMATE_ADD: '/estimate/add',
  ESTIMATE_UPDATE: (id) => `/estimate/update/${id}`,
  ESTIMATE_DELETE: (id) => `/estimate/delete/${id}`,
  
  // Clients
  CLIENTS: '/clients',
  CLIENTS_ADD: '/clients/add',
  CLIENTS_UPDATE: (id) => `/clients/update/${id}`,
  CLIENTS_DELETE: (id) => `/clients/delete/${id}`,
  
  // Commissionnaires
  COMMISSIONNAIRES: '/listeCommissionnaire',
  COMMISSIONNAIRE_ADD: '/listeCommissionnaire/add',
  COMMISSIONNAIRE_UPDATE: (id) => `/listeCommissionnaire/update/${id}`,
  COMMISSIONNAIRE_DELETE: (id) => `/listeCommissionnaire/delete/${id}`,
  
  // Factures
  INVOICES: '/invoice',
  INVOICE_ADD: '/invoice/add',
  INVOICE_UPDATE: (id) => `/invoice/update/${id}`,
  INVOICE_DELETE: (id) => `/invoice/delete/${id}`,
}; 