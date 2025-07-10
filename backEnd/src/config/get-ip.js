// Utilitaire pour récupérer l'IP publique
const https = require('https');

async function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.ip);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = { getPublicIP }; 