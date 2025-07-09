# 🚀 Déploiement ATS sur Hostinger - Guide Rapide

## 📋 Résumé du Déploiement

Votre application ATS est maintenant prête pour le déploiement sur Hostinger ! Voici les étapes simplifiées :

## 🎯 **Option 1 : Hébergement Partagé (Recommandé)**

### **Frontend (Hébergement Web Hostinger)**
1. **Build de production** ✅ (Déjà fait)
2. **Upload sur Hostinger** :
   - Connectez-vous à votre panneau Hostinger
   - Allez dans "Gestionnaire de fichiers"
   - Naviguez vers `public_html/`
   - Uploadez **tout le contenu** du dossier `frontEnd/dist/`

### **Backend (Service Externe)**
**Recommandé : Railway ou Render (Gratuit)**

#### **Railway :**
1. Allez sur [railway.app](https://railway.app)
2. Connectez votre compte GitHub
3. Cliquez "New Project" → "Deploy from GitHub repo"
4. Sélectionnez votre repo ATS
5. Configurez les variables d'environnement :
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atsInfo
   JWT_SECRET=votre-secret-jwt-fort
   EMAIL_USER=votre-email@gmail.com
   EMAIL_PASS=votre-mot-de-passe-app
   NODE_ENV=production
   ```
6. Déployez !

#### **Render :**
1. Allez sur [render.com](https://render.com)
2. Connectez votre compte GitHub
3. Cliquez "New" → "Web Service"
4. Sélectionnez votre repo ATS
5. Configurez :
   - **Build Command :** `cd backEnd && npm install`
   - **Start Command :** `cd backEnd && npm start`
   - **Root Directory :** `backEnd`
6. Ajoutez les variables d'environnement (même que Railway)
7. Déployez !

## 🎯 **Option 2 : VPS Hostinger (Production)**

### **1. Achetez un VPS Hostinger**
- Minimum : 2GB RAM, 1 CPU
- OS : Ubuntu 20.04 ou plus récent

### **2. Connectez-vous via SSH**
```bash
ssh root@votre-ip-vps
```

### **3. Installation automatique**
```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Installer PM2
npm install -g pm2

# Cloner votre projet
git clone https://github.com/votre-username/ats.git
cd ats/backEnd

# Installer les dépendances
npm install

# Configurer l'environnement
cp env.production.example .env
nano .env  # Éditez avec vos vraies valeurs

# Créer les administrateurs
npm run create-admins

# Démarrer avec PM2
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

### **4. Configuration Nginx (optionnel)**
```bash
# Installer Nginx
apt install nginx -y

# Configurer le proxy
nano /etc/nginx/sites-available/ats
```

**Contenu du fichier Nginx :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/ats /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 🔧 **Configuration Frontend pour Production**

### **Modifier l'URL de l'API**

Dans `frontEnd/src/Dashboard/api/apiService.js`, changez :

```javascript
// Développement
const API_BASE_URL = 'http://localhost:5000/api';

// Production (remplacez par votre URL backend)
const API_BASE_URL = 'https://votre-backend.railway.app/api';
// ou
const API_BASE_URL = 'https://votre-backend.onrender.com/api';
// ou
const API_BASE_URL = 'https://votre-domaine.com/api';
```

### **Rebuild après modification**
```bash
cd frontEnd
yarn build
```

## 🗄️ **Configuration MongoDB Atlas**

1. **Créer un compte** sur [mongodb.com](https://mongodb.com)
2. **Créer un cluster** (gratuit disponible)
3. **Configurer l'accès réseau** :
   - Cliquez "Network Access"
   - Ajoutez "0.0.0.0/0" (tous les IPs)
4. **Créer un utilisateur** :
   - Cliquez "Database Access"
   - "Add New Database User"
   - Username + Password
5. **Obtenir l'URI** :
   - Cliquez "Connect"
   - "Connect your application"
   - Copiez l'URI

## 🔒 **Variables d'Environnement Critiques**

```env
# Obligatoires
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atsInfo
JWT_SECRET=votre-secret-jwt-super-fort-et-unique

# Optionnelles mais recommandées
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application-gmail
NODE_ENV=production
```

## 🚀 **Test du Déploiement**

### **1. Test Frontend**
- Allez sur votre domaine Hostinger
- Vérifiez que l'interface se charge

### **2. Test Backend**
```bash
# Test de l'API
curl https://votre-backend.railway.app/api

# Test de connexion
curl -X POST https://votre-backend.railway.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"le@padre.io","password":"Xman2025!"}'
```

### **3. Test Complet**
- Connectez-vous à l'application
- Testez les fonctionnalités principales
- Vérifiez les uploads de fichiers

## 🔍 **Monitoring et Logs**

### **Railway/Render**
- Logs disponibles dans le dashboard
- Monitoring automatique

### **VPS avec PM2**
```bash
# Voir les processus
pm2 status

# Voir les logs
pm2 logs ats-backend

# Monitoring en temps réel
pm2 monit

# Redémarrer
pm2 restart ats-backend
```

## 🛠️ **Maintenance**

### **Mise à jour**
```bash
# Pull des changements
git pull origin main

# Rebuild frontend
cd frontEnd && yarn build

# Redémarrage backend
pm2 restart ats-backend  # (VPS)
# ou redéploiement automatique (Railway/Render)
```

### **Sauvegarde**
- **MongoDB Atlas** : Sauvegarde automatique
- **Fichiers uploads** : Sauvegarde manuelle recommandée

## 📞 **Support**

**En cas de problème :**
1. Vérifiez les logs du backend
2. Testez l'API avec Postman
3. Vérifiez les variables d'environnement
4. Consultez la documentation de votre hébergeur

---

## 🎉 **Félicitations !**

Votre application ATS est maintenant en ligne ! 

**URLs :**
- **Frontend :** https://votre-domaine.com
- **Backend :** https://votre-backend.railway.app (ou votre VPS)

**Comptes admin créés :**
- **LE PADRE** : le@padre.io / Xman2025!
- **Admin Principal** : admin@ats.com / admin123
- **Super Admin** : superadmin@ats.com / SuperAdmin2025! 