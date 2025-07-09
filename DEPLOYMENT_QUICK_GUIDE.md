# 🚀 Guide de Déploiement Rapide ATS

## 📋 Checklist de Déploiement

### ✅ Backend Railway (Déjà fait)
- [x] Projet créé sur Railway
- [x] Variables d'environnement configurées
- [x] Déploiement réussi avec Yarn

### 🔧 Configuration Frontend (À faire)

#### 1. Récupérer l'URL Railway
1. Allez sur [Railway.app](https://railway.app)
2. Sélectionnez votre projet ATS
3. Copiez l'URL (ex: `https://ats-backend-production.up.railway.app`)

#### 2. Mettre à jour la configuration
Remplacez dans `frontEnd/src/config/config.js` :
```javascript
export const API_BASE_URL = isProduction 
  ? 'VOTRE_URL_RAILWAY_ICI' // Remplacez par votre vraie URL
  : 'http://localhost:5000';
```

#### 3. Reconstruire le frontend
```bash
cd frontEnd
yarn build
```

### 🌐 Déploiement Frontend Hostinger

#### 1. Préparer les fichiers
- Le dossier `frontEnd/dist/` contient tous les fichiers à uploader
- Le fichier `.htaccess` est déjà configuré

#### 2. Upload sur Hostinger
1. Connectez-vous à votre panneau Hostinger
2. Allez dans "File Manager"
3. Naviguez vers `public_html/`
4. Uploadez TOUS les fichiers du dossier `frontEnd/dist/`

#### 3. Vérifier la configuration
- Le fichier `.htaccess` doit être à la racine
- Le fichier `index.html` doit être à la racine
- Tous les assets doivent être dans le dossier `assets/`

### 🔍 Test Final

#### 1. Test de connexion
- Allez sur votre site Hostinger
- Testez la connexion avec vos comptes admin :
  - Email : `admin@ats.com`
  - Mot de passe : `admin123`

#### 2. Test des fonctionnalités
- [ ] Connexion utilisateur
- [ ] Dashboard
- [ ] Gestion des devis
- [ ] Gestion des factures
- [ ] Gestion des clients
- [ ] Upload de fichiers

### 🆘 En cas de problème

#### Erreur CORS
Si vous avez des erreurs CORS, vérifiez que l'URL Railway est correcte dans la configuration.

#### Erreur 404 sur les routes
Vérifiez que le fichier `.htaccess` est bien uploadé à la racine.

#### Erreur de connexion à la base de données
Vérifiez les variables d'environnement sur Railway.

### 📞 Support
- **Backend** : Railway Dashboard
- **Frontend** : Hostinger File Manager
- **Base de données** : MongoDB Atlas

---

## 🎯 URLs Finales
- **Frontend** : `https://votre-domaine.com`
- **Backend** : `https://votre-app-railway.railway.app`
- **Base de données** : MongoDB Atlas 