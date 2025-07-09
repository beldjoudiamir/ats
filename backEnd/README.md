# Backend ATS - Node.js API

## 📋 Description

API RESTful pour l'application ATS développée avec Node.js, Express et MongoDB. Cette API gère l'authentification, les données clients, transporteurs, devis, factures et l'envoi d'emails.

## 🚀 Fonctionnalités

- **API RESTful** complète
- **Authentification JWT** sécurisée
- **Gestion des fichiers** (upload d'images)
- **Envoi d'emails** avec Nodemailer
- **Base de données MongoDB**
- **Certificats SSL** auto-signés
- **Middleware de sécurité** (CORS, validation)
- **Gestion des erreurs** centralisée

## 🛠️ Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **JWT** - Authentification
- **Multer** - Gestion des uploads
- **Nodemailer** - Envoi d'emails
- **bcrypt** - Hachage des mots de passe
- **dotenv** - Variables d'environnement

## 📁 Structure du Code

```
src/
├── controllers/           # Contrôleurs API
│   └── clientController.js
├── routes/               # Routes Express
│   ├── clientRoutes.js
│   └── myRoutes.js
├── config/               # Configuration
│   └── bd.js            # Configuration MongoDB
├── utils/                # Utilitaires
│   ├── middleware.js     # Middleware personnalisé
│   └── routeHandlers.js  # Gestionnaires de routes
├── certs/                # Certificats SSL
└── server.js            # Point d'entrée principal
```

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- MongoDB
- npm ou yarn

### Installation

1. **Installer les dépendances**
```bash
cd backEnd
npm install
```

2. **Configurer l'environnement**
```bash
cp env.example .env
# Éditer .env avec vos configurations
```

3. **Démarrer le serveur**
```bash
npm run dev
```

4. **Accéder à l'API**
- URL: http://localhost:3000

## 📜 Scripts Disponibles

- `npm start` - Démarre le serveur en production
- `npm run dev` - Démarre le serveur en développement avec nodemon

## 🔧 Configuration

### Variables d'environnement (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ats
JWT_SECRET=votre_secret_jwt_super_securise
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
NODE_ENV=development
```

### Configuration MongoDB
Le fichier `src/config/bd.js` contient la configuration de connexion à MongoDB.

## 📚 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/verify` - Vérification du token

### Clients
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Transporteurs
- `GET /api/transporteurs` - Liste des transporteurs
- `POST /api/transporteurs` - Créer un transporteur
- `PUT /api/transporteurs/:id` - Modifier un transporteur
- `DELETE /api/transporteurs/:id` - Supprimer un transporteur

### Devis
- `GET /api/devis` - Liste des devis
- `POST /api/devis` - Créer un devis
- `PUT /api/devis/:id` - Modifier un devis
- `DELETE /api/devis/:id` - Supprimer un devis

### Factures
- `GET /api/factures` - Liste des factures
- `POST /api/factures` - Créer une facture
- `PUT /api/factures/:id` - Modifier une facture
- `DELETE /api/factures/:id` - Supprimer une facture

### Uploads
- `POST /api/upload` - Upload de fichiers
- `GET /api/uploads/:filename` - Récupérer un fichier

### Emails
- `POST /api/email/send` - Envoyer un email

## 🔐 Sécurité

### Middleware de sécurité
- **CORS** - Configuration des origines autorisées
- **JWT** - Authentification par token
- **bcrypt** - Hachage des mots de passe
- **Validation** - Validation des données d'entrée

### Certificats SSL
Les certificats auto-signés sont générés automatiquement pour le développement.

## 📊 Base de Données

### Collections MongoDB
- `users` - Utilisateurs de l'application
- `clients` - Clients
- `transporteurs` - Transporteurs
- `devis` - Devis
- `factures` - Factures
- `messages` - Messages

### Modèles de données
Les modèles JSON sont disponibles dans le dossier `Json/` pour référence.

## 📧 Configuration Email

### Nodemailer
L'API utilise Nodemailer pour l'envoi d'emails avec support SMTP.

### Templates d'emails
- Emails de confirmation
- Notifications de devis
- Rappels de factures

## 🚨 Gestion des Erreurs

### Middleware d'erreur
- Gestion centralisée des erreurs
- Logs d'erreur détaillés
- Réponses d'erreur standardisées

### Codes d'erreur
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error

## 📝 Logs

### Types de logs
- Logs d'erreur
- Logs d'accès
- Logs de performance

### Configuration
Les logs sont configurés pour le développement et la production.

## 🧪 Tests

Pour lancer les tests (si configurés) :
```bash
npm test
```

## 📦 Déploiement

### Production
1. Configurer les variables d'environnement
2. Construire l'application
3. Démarrer avec PM2 ou similaire

### Docker (optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Débogage

- Utiliser les logs de développement
- Vérifier la console Node.js
- Utiliser les outils de débogage MongoDB

## 🤝 Contribution

1. Suivre les conventions de nommage
2. Documenter les nouvelles routes
3. Tester les endpoints
4. Vérifier la sécurité

## 📄 Licence

Ce projet fait partie de l'application ATS et suit la même licence. 