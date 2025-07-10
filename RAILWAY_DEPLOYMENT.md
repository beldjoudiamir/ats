# 🚀 Déploiement Railway - ATS

## 📋 Prérequis
- Compte GitHub
- Compte Railway (gratuit)

## 🎯 Étapes de Déploiement

### 1. Aller sur Railway
- Ouvrir : https://railway.app
- Se connecter avec GitHub

### 2. Créer un Nouveau Projet
- Cliquer "New Project"
- Choisir "Deploy from GitHub repo"
- Sélectionner le repository `ats`

### 3. Configuration Automatique
Railway va maintenant détecter :
- ✅ Dockerfile pour le build
- ✅ Configuration Railway (`railway.json`)
- ✅ Structure backend + frontend

### 4. Variables d'Environnement
Dans Railway, aller dans "Variables" et ajouter :

| Variable | Valeur |
|----------|--------|
| `MONGODB_URI` | `mongodb+srv://ATS8SOLUTIONS:Jg3nbtEUc4vfHwlP@cluster0.bhv3c.mongodb.net/?retryWrites=true&w=majority` |
| `JWT_SECRET` | `214fb1a94856e046bc8e1a14735213425790d3f6d5f2e80bf8b50dbbb1098f9025feb395773fa2d0f7c0b45037311200effec3c3d52a` |
| `PORT` | `3000` |

### 5. Déploiement
- Railway va automatiquement :
  - Utiliser le Dockerfile pour le build
  - Installer les dépendances backend et frontend
  - Builder le frontend React
  - Démarrer le serveur backend
  - Générer une URL publique

## 🎉 C'est tout !

Railway gère tout automatiquement :
- ✅ Backend Node.js
- ✅ Frontend React
- ✅ Variables d'environnement
- ✅ HTTPS
- ✅ Déploiement continu

## 🧪 Test
Après déploiement, testez :
- URL principale : votre application complète
- API : `/api/test`

## 🔧 Fichiers de Configuration
- `Dockerfile` : Configuration de build Docker
- `railway.json` : Configuration Railway
- `.dockerignore` : Fichiers ignorés par Docker 