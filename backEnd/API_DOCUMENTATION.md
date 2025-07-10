# API Documentation - ATS Backend

## Base URL
```
http://localhost:3000/api
```

## Authentification
L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans le header Authorization :
```
Authorization: Bearer <votre-token-jwt>
```

## Endpoints

### Authentification

#### POST /auth/login
Connexion utilisateur
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /auth/register
Inscription d'un nouvel utilisateur
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Clients

#### GET /clients
Récupérer la liste des clients
- Query params: `search`, `page`, `limit`

#### POST /clients
Créer un nouveau client
```json
{
  "name": "Entreprise ABC",
  "email": "contact@abc.com",
  "phone": "+33123456789",
  "address": "123 Rue de la Paix, Paris"
}
```

#### GET /clients/:id
Récupérer un client par ID

#### PUT /clients/:id
Modifier un client

#### DELETE /clients/:id
Supprimer un client

### Devis

#### GET /devis
Récupérer la liste des devis
- Query params: `search`, `page`, `limit`, `status`

#### POST /devis
Créer un nouveau devis
```json
{
  "clientId": "client_id",
  "items": [
    {
      "description": "Transport de marchandises",
      "quantity": 1,
      "unitPrice": 500,
      "total": 500
    }
  ],
  "totalAmount": 500,
  "validityDate": "2024-12-31"
}
```

#### GET /devis/:id
Récupérer un devis par ID

#### PUT /devis/:id
Modifier un devis

#### DELETE /devis/:id
Supprimer un devis

#### GET /devis/:id/pdf
Générer le PDF d'un devis

### Factures

#### GET /factures
Récupérer la liste des factures
- Query params: `search`, `page`, `limit`, `status`

#### POST /factures
Créer une nouvelle facture
```json
{
  "clientId": "client_id",
  "devisId": "devis_id",
  "items": [
    {
      "description": "Transport de marchandises",
      "quantity": 1,
      "unitPrice": 500,
      "total": 500
    }
  ],
  "totalAmount": 500,
  "dueDate": "2024-12-31"
}
```

#### GET /factures/:id
Récupérer une facture par ID

#### PUT /factures/:id
Modifier une facture

#### DELETE /factures/:id
Supprimer une facture

#### GET /factures/:id/pdf
Générer le PDF d'une facture

### Transports

#### GET /transports
Récupérer la liste des commandes de transport
- Query params: `search`, `page`, `limit`, `status`

#### POST /transports
Créer une nouvelle commande de transport
```json
{
  "clientId": "client_id",
  "origin": "Paris",
  "destination": "Lyon",
  "cargo": "Marchandises diverses",
  "weight": 1000,
  "dimensions": "2x2x3m",
  "pickupDate": "2024-01-15",
  "deliveryDate": "2024-01-16"
}
```

#### GET /transports/:id
Récupérer une commande de transport par ID

#### PUT /transports/:id
Modifier une commande de transport

#### DELETE /transports/:id
Supprimer une commande de transport

### Utilisateurs

#### GET /users
Récupérer la liste des utilisateurs (admin seulement)

#### POST /users
Créer un nouvel utilisateur (admin seulement)

#### GET /users/:id
Récupérer un utilisateur par ID

#### PUT /users/:id
Modifier un utilisateur

#### DELETE /users/:id
Supprimer un utilisateur

### Upload de fichiers

#### POST /upload
Uploader un fichier
- Content-Type: `multipart/form-data`
- Body: `file` (fichier à uploader)

### Statistiques

#### GET /stats/dashboard
Récupérer les statistiques du tableau de bord
```json
{
  "totalClients": 150,
  "totalDevis": 45,
  "totalFactures": 32,
  "totalTransports": 28,
  "monthlyRevenue": 15000,
  "pendingDevis": 12,
  "pendingFactures": 8
}
```

## Codes de réponse

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non autorisé
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `500` - Erreur serveur interne

## Exemples d'utilisation

### Avec Axios (Frontend)
```javascript
import axios from 'axios';

// Configuration de base
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemple d'utilisation
const getClients = async () => {
  try {
    const response = await api.get('/clients');
    return response.data;
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
};
```

### Avec cURL
```bash
# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Récupérer les clients (avec token)
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer <votre-token>"
``` 