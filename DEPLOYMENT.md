# 🚀 Guide de Déploiement - ATS sur Hostinger

## 📋 Prérequis

- Compte Hostinger avec hébergement web
- Base de données MongoDB (MongoDB Atlas recommandé)
- Domaine configuré

## 🏗️ Architecture de Déploiement

### Option 1 : Hébergement Partagé (Recommandé pour débuter)
- **Frontend :** Hébergement web Hostinger
- **Backend :** VPS Hostinger ou service externe (Railway, Render, etc.)
- **Base de données :** MongoDB Atlas

### Option 2 : VPS Hostinger (Recommandé pour production)
- **Frontend + Backend :** VPS Hostinger
- **Base de données :** MongoDB Atlas ou MongoDB local

## 📁 Structure des Fichiers

```
public_html/                    # Dossier racine Hostinger
├── index.html                  # Build React
├── assets/                     # Assets React
├── .htaccess                   # Configuration Apache
└── uploads/                    # Dossier uploads (optionnel)

backend/                        # Dossier backend (VPS)
├── src/
├── package.json
├── .env                        # Variables d'environnement
└── uploads/                    # Dossier uploads
```

## 🔧 Configuration Frontend

### 1. Modifier l'URL de l'API
Dans `frontEnd/src/Dashboard/api/apiService.js`, changer l'URL de base :

```javascript
// Développement
const API_BASE_URL = 'http://localhost:5000/api';

// Production
const API_BASE_URL = 'https://votre-backend.com/api';
```

### 2. Build de Production
```bash
cd frontEnd
yarn build
```

### 3. Upload sur Hostinger
- Connectez-vous à votre panneau Hostinger
- Allez dans "Gestionnaire de fichiers"
- Naviguez vers `public_html`
- Uploadez le contenu du dossier `frontEnd/dist/`

## 🔧 Configuration Backend

### Option A : VPS Hostinger

1. **Connectez-vous à votre VPS via SSH**
```bash
ssh root@votre-ip-vps
```

2. **Installer Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Cloner le projet**
```bash
git clone https://github.com/votre-username/ats.git
cd ats/backEnd
```

4. **Installer les dépendances**
```bash
npm install
```

5. **Configurer les variables d'environnement**
```bash
cp env.example .env
nano .env
```

**Contenu du fichier .env :**
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atsInfo
JWT_SECRET=votre_secret_jwt_super_securise
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
NODE_ENV=production
```

6. **Créer les administrateurs**
```bash
npm run create-admins
```

7. **Démarrer avec PM2**
```bash
npm install -g pm2
pm2 start src/server.js --name "ats-backend"
pm2 startup
pm2 save
```

### Option B : Service Externe (Railway/Render)

1. **Railway**
- Connectez votre repo GitHub
- Configurez les variables d'environnement
- Déployez automatiquement

2. **Render**
- Connectez votre repo GitHub
- Configurez le service web
- Ajoutez les variables d'environnement

## 🔗 Configuration CORS

Dans `backEnd/src/utils/middleware.js`, configurez CORS :

```javascript
app.use(cors({
  origin: ['https://votre-domaine.com', 'http://localhost:5173'],
  credentials: true
}));
```

## 🗄️ Configuration MongoDB Atlas

1. **Créer un cluster MongoDB Atlas**
2. **Configurer l'accès réseau** (0.0.0.0/0 pour tous)
3. **Créer un utilisateur de base de données**
4. **Obtenir l'URI de connexion**

## 🔒 Sécurité

### Variables d'environnement sensibles
- `JWT_SECRET` : Secret fort et unique
- `MONGODB_URI` : URI MongoDB avec credentials
- `EMAIL_PASS` : Mot de passe d'application Gmail

### Headers de sécurité
Le fichier `.htaccess` inclut déjà :
- Protection XSS
- Protection clickjacking
- Compression Gzip
- Cache des assets

## 📧 Configuration Email

### Gmail SMTP
```env
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=mot_de_passe_application
```

**Note :** Utilisez un mot de passe d'application Gmail, pas votre mot de passe principal.

## 🚀 Déploiement Final

### 1. Testez en local
```bash
# Backend
cd backEnd && npm start

# Frontend
cd frontEnd && yarn preview
```

### 2. Déployez le backend
- VPS : Suivez les étapes VPS ci-dessus
- Service externe : Connectez votre repo

### 3. Déployez le frontend
- Uploadez le contenu de `frontEnd/dist/` sur Hostinger

### 4. Testez en production
- Vérifiez que l'API répond
- Testez la connexion utilisateur
- Vérifiez les uploads de fichiers

## 🔍 Monitoring

### PM2 (VPS)
```bash
pm2 status
pm2 logs ats-backend
pm2 monit
```

### Logs
```bash
# Logs d'erreur
pm2 logs ats-backend --err

# Logs d'accès
pm2 logs ats-backend --out
```

## 🛠️ Maintenance

### Mise à jour
```bash
# Pull des changements
git pull origin main

# Redémarrage
pm2 restart ats-backend
```

### Sauvegarde
- Base de données MongoDB Atlas (automatique)
- Fichiers uploads (sauvegarde manuelle recommandée)

## 📞 Support

En cas de problème :
1. Vérifiez les logs PM2
2. Testez l'API avec Postman
3. Vérifiez les variables d'environnement
4. Consultez la documentation Hostinger

---

**Note :** Ce guide est optimisé pour Hostinger mais peut être adapté pour d'autres hébergeurs. 