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
Railway détecte automatiquement :
- ✅ Application Node.js
- ✅ Structure du projet
- ✅ Dépendances

### 4. Variables d'Environnement
Ajouter dans Railway :

| Variable | Valeur |
|----------|--------|
| `MONGODB_URI` | `mongodb+srv://ATS8SOLUTIONS:Jg3nbtEUc4vfHwlP@cluster0.bhv3c.mongodb.net/?retryWrites=true&w=majority` |
| `JWT_SECRET` | `ats8solutions-jwt-secret-2024-super-securise` |
| `PORT` | `3000` |

### 5. Déploiement
- Railway déploie automatiquement
- URL générée automatiquement
- Logs en temps réel

## 🎉 C'est tout !

Railway gère tout automatiquement :
- ✅ Backend Node.js
- ✅ Frontend React
- ✅ Variables d'environnement
- ✅ HTTPS
- ✅ Déploiement continu

## 🧪 Test
Après déploiement, testez :
- URL principale : votre application
- API : `/api/test` 