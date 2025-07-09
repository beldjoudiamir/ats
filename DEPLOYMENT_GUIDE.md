# 🚀 Guide de Déploiement ATS - Frontend & Backend

## 📋 État Actuel

### ✅ Backend (Railway)
- **URL**: `https://web-production-2554.up.railway.app`
- **Status**: Déployé avec serveur MongoDB SSL Fix
- **Variables d'environnement**: Configurées
- **MongoDB**: Connecté via Atlas

### 🔄 Frontend (À déployer)
- **Configuration**: Prête pour Railway
- **Backend URL**: Configurée
- **Build**: Prêt

## 🎯 Déploiement du Frontend

### Option 1: Déploiement sur Railway (Recommandé)

#### Étape 1: Créer un nouveau projet Railway pour le Frontend

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Choisissez votre repo `ats`
5. Sélectionnez le dossier `frontEnd`

#### Étape 2: Configuration Railway

Dans le nouveau projet Railway :

1. **Variables d'environnement** (optionnel) :
   ```env
   NODE_ENV=production
   ```

2. **Domaine personnalisé** (optionnel) :
   - Allez dans l'onglet "Settings"
   - Configurez un domaine comme `ats-frontend.railway.app`

#### Étape 3: Déploiement

Railway détectera automatiquement le Dockerfile et déploiera.

### Option 2: Déploiement sur Vercel

#### Étape 1: Préparer pour Vercel

1. Créez un fichier `vercel.json` dans le dossier `frontEnd` :
   ```json
   {
     "buildCommand": "yarn build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

#### Étape 2: Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Importez votre repo GitHub
3. Configurez le dossier `frontEnd`
4. Déployez

### Option 3: Déploiement sur Netlify

#### Étape 1: Préparer pour Netlify

1. Créez un fichier `netlify.toml` dans le dossier `frontEnd` :
   ```toml
   [build]
     publish = "dist"
     command = "yarn build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Étape 2: Déployer sur Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Importez votre repo GitHub
3. Configurez le dossier `frontEnd`
4. Déployez

## 🔧 Configuration Post-Déploiement

### Variables d'Environnement Frontend

Si nécessaire, ajoutez ces variables dans votre plateforme de déploiement :

```env
NODE_ENV=production
VITE_API_BASE_URL=https://web-production-2554.up.railway.app
```

### Test de Connexion

Une fois le frontend déployé, testez :

1. **Connexion au backend** : Vérifiez que les appels API fonctionnent
2. **Authentification** : Testez la connexion utilisateur
3. **Fonctionnalités** : Testez les principales fonctionnalités

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreurs CORS
- Vérifiez que le backend autorise l'origine du frontend
- Ajoutez l'URL du frontend dans la configuration CORS du backend

#### 2. Erreurs de Build
- Vérifiez que toutes les dépendances sont installées
- Vérifiez la version de Node.js (18+ recommandé)

#### 3. Erreurs de Connexion API
- Vérifiez l'URL du backend dans `config.js`
- Vérifiez que le backend est accessible

## 📞 Support

En cas de problème :
1. Vérifiez les logs de déploiement
2. Testez les endpoints individuellement
3. Vérifiez la configuration des variables d'environnement

## 🎉 Succès !

Une fois déployé, votre application ATS sera accessible via :
- **Frontend** : `https://votre-frontend-url`
- **Backend** : `https://web-production-2554.up.railway.app` 