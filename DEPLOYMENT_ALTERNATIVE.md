# 🚀 Déploiement Alternatif - Render.com

## 📋 Problème avec Railway

Railway semble avoir des problèmes de déploiement. Voici une alternative fiable avec Render.com.

## 🎯 Déploiement sur Render.com

### **Étape 1 : Créer un compte Render**

1. Allez sur [render.com](https://render.com)
2. Créez un compte gratuit
3. Connectez votre compte GitHub

### **Étape 2 : Créer un nouveau service Web**

1. Cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repo GitHub `ats`

### **Étape 3 : Configuration du service**

**Paramètres de base :**
- **Name** : `ats-backend`
- **Environment** : `Node`
- **Region** : `Frankfurt (EU Central)`
- **Branch** : `main`
- **Root Directory** : `backEnd`
- **Build Command** : `npm install`
- **Start Command** : `npm start`

### **Étape 4 : Variables d'environnement**

Ajoutez ces variables dans Render :

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://ATS8SOLUTIONS:Jg3nbtEUc4vfHwlP@cluster0.bhv3c.mongodb.net/ats?retryWrites=true&w=majority
JWT_SECRET=votre_jwt_secret_ici
EMAIL_USER=votre_email@gmail.com
```

### **Étape 5 : Déploiement**

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement déployer votre application
3. Attendez 2-3 minutes pour le déploiement

## 🔧 Mise à jour du Frontend

Une fois le backend déployé sur Render, mettez à jour l'URL dans le frontend.

## 📱 Test de la connexion

Après le déploiement, testez avec :
- **Email** : `admin@ats.com`
- **Mot de passe** : `admin123` 