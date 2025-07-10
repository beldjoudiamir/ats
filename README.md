# ATS - Application de Transport et Services

## 📋 Description

Application complète de gestion de transport et services avec interface web moderne et API backend robuste.

## 🏗️ Architecture

```
ats-finiched-avec-option/
├── backEnd/          # API Node.js/Express
├── frontEnd/         # Application React/Vite
└── README.md         # Ce fichier
```

## 🚀 Technologies Utilisées

### Backend
- **Node.js** avec Express
- **MongoDB** pour la base de données
- **JWT** pour l'authentification
- **Multer** pour la gestion des fichiers
- **Nodemailer** pour l'envoi d'emails
- **bcrypt** pour le chiffrement des mots de passe

### Frontend
- **React 19** avec Vite
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Axios** pour les requêtes API
- **D3.js** pour les graphiques
- **jsPDF** pour la génération de PDF

## 📁 Structure du Projet

### Backend (`/backEnd`)
```
backEnd/
├── src/
│   ├── config/           # Configuration base de données
│   ├── controllers/      # Contrôleurs métier
│   ├── routes/           # Définition des routes API
│   ├── utils/            # Utilitaires et middleware
│   └── server.js         # Point d'entrée serveur
├── certs/                # Certificats SSL
├── Json/                 # Données JSON de test
├── uploads/              # Fichiers uploadés
└── package.json
```

### Frontend (`/frontEnd`)
```
frontEnd/
├── src/
│   ├── Dashboard/        # Interface principale
│   │   ├── Clients/      # Gestion des clients
│   │   ├── Factures/     # Gestion des factures
│   │   ├── NosDevis/     # Gestion des devis
│   │   ├── Transport/    # Gestion des transports
│   │   └── ...
│   ├── components/       # Composants réutilisables
│   └── ...
├── public/               # Assets statiques
└── package.json
```

## 🛠️ Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- MongoDB installé et en cours d'exécution
- Yarn ou npm

### Installation

1. **Cloner le repository**
```bash
git clone <votre-repo-url>
cd ats-finiched-avec-option
```

2. **Configuration Backend**
```bash
cd backEnd
yarn install
cp env.example .env
# Éditer .env avec vos configurations
```

3. **Configuration Frontend**
```bash
cd ../frontEnd
yarn install
```

### Démarrage

1. **Démarrer le Backend**
```bash
cd backEnd
yarn dev
```

2. **Démarrer le Frontend**
```bash
cd frontEnd
yarn start
```

Le backend sera accessible sur `http://localhost:3000` (ou le port configuré)
Le frontend sera accessible sur `http://localhost:5173`

## 🔧 Configuration

### Variables d'environnement Backend
Créer un fichier `.env` dans le dossier `backEnd/` :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ats-database
JWT_SECRET=votre-secret-jwt
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 📊 Fonctionnalités

- **Gestion des Clients** : Ajout, modification, recherche de clients
- **Gestion des Devis** : Création, modification, génération PDF
- **Gestion des Factures** : Création, suivi, génération PDF
- **Gestion des Transports** : Commandes de transport, suivi
- **Messagerie** : Communication interne
- **Tableaux de bord** : Graphiques et statistiques
- **Gestion des utilisateurs** : Authentification et autorisation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub. 