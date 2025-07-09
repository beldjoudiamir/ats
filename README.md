# ATS - Application de Transport et Services

## 📋 Description

ATS est une application web complète de gestion de transport et de services, développée avec React pour le frontend et Node.js/Express pour le backend. L'application permet la gestion des clients, transporteurs, devis, factures, et offre un système de messagerie intégré.

## 🚀 Fonctionnalités

### Frontend (React + Vite)
- **Dashboard interactif** avec graphiques D3.js
- **Gestion des clients** et transporteurs
- **Système de devis** et facturation
- **Messagerie intégrée**
- **Interface responsive** avec Tailwind CSS
- **Génération de PDF** pour devis et factures

### Backend (Node.js + Express)
- **API RESTful** complète
- **Authentification JWT**
- **Gestion des fichiers** (upload d'images)
- **Envoi d'emails** avec Nodemailer
- **Base de données MongoDB**
- **Certificats SSL** auto-signés

## 🛠️ Technologies Utilisées

### Frontend
- React 19
- Vite
- Tailwind CSS
- D3.js (graphiques)
- React Router DOM
- Axios
- jsPDF

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Multer (gestion fichiers)
- Nodemailer
- bcrypt (hachage)

## 📁 Structure du Projet

```
ats-finished-avec-option/
├── frontEnd/                 # Application React
│   ├── src/
│   │   ├── Dashboard/        # Composants du tableau de bord
│   │   ├── components/       # Composants réutilisables
│   │   └── ...
│   ├── public/              # Assets statiques
│   └── package.json
├── backEnd/                 # API Node.js
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── routes/          # Routes Express
│   │   ├── config/          # Configuration DB
│   │   └── utils/           # Utilitaires
│   ├── uploads/             # Fichiers uploadés
│   └── package.json
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- MongoDB
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <votre-repo-url>
cd ats-finished-avec-option
```

2. **Installer les dépendances Backend**
```bash
cd backEnd
npm install
```

3. **Configurer l'environnement Backend**
```bash
cp env.example .env
# Éditer .env avec vos configurations
```

4. **Installer les dépendances Frontend**
```bash
cd ../frontEnd
npm install
```

### Démarrage

1. **Démarrer le Backend**
```bash
cd backEnd
npm run dev
```

2. **Démarrer le Frontend**
```bash
cd frontEnd
npm start
```

3. **Accéder à l'application**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔧 Configuration

### Variables d'environnement Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ats
JWT_SECRET=votre_secret_jwt
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

## 📚 Documentation API

L'API backend expose les endpoints suivants :

- `POST /api/auth/login` - Authentification
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `GET /api/transporteurs` - Liste des transporteurs
- `POST /api/devis` - Créer un devis
- `GET /api/factures` - Liste des factures

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- Votre nom - Développeur principal

## 🙏 Remerciements

- React et la communauté React
- Tailwind CSS pour le styling
- D3.js pour les graphiques
- MongoDB pour la base de données

---

**Note**: Ce projet est en développement actif. Les fonctionnalités peuvent évoluer.