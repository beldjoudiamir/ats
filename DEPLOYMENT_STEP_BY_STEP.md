# 🚀 Guide de Déploiement Étape par Étape - ATS

## 📋 Prérequis
- Compte GitHub
- Compte Vercel (gratuit)
- Compte MongoDB Atlas (gratuit)

## 🎯 Plan de Déploiement

### Phase 1 : Backend (API)
### Phase 2 : Frontend (React)
### Phase 3 : Base de Données
### Phase 4 : Configuration et Tests

---

## 🔧 Phase 1 : Déploiement du Backend

### Étape 1.1 : Préparer MongoDB Atlas
1. Aller sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Créer un compte gratuit
3. Créer un nouveau cluster (gratuit)
4. Créer un utilisateur de base de données
5. Obtenir l'URL de connexion

### Étape 1.2 : Configurer les Variables d'Environnement
Dans votre projet backend, créer un fichier `.env` :
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ats-db
JWT_SECRET=votre-secret-jwt-super-securise
PORT=5000
```

### Étape 1.3 : Déployer sur Vercel
1. Aller sur [Vercel](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer "New Project"
4. Sélectionner votre repository `ats`
5. Configurer :
   - **Framework Preset** : Node.js
   - **Root Directory** : `backEnd`
   - **Build Command** : `npm install`
   - **Output Directory** : (laisser vide)
   - **Install Command** : `npm install`

### Étape 1.4 : Ajouter les Variables d'Environnement sur Vercel
Dans les paramètres du projet Vercel :
- `MONGODB_URI` = votre URL MongoDB Atlas
- `JWT_SECRET` = votre secret JWT
- `PORT` = 5000

### Étape 1.5 : Déployer
1. Cliquer "Deploy"
2. Attendre le déploiement
3. Noter l'URL générée (ex: `https://ats-backend.vercel.app`)

---

## 🎨 Phase 2 : Déploiement du Frontend

### Étape 2.1 : Mettre à jour l'URL de l'API
Dans `frontEnd/src/config/api.js`, remplacer :
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://votre-backend-url.vercel.app';
```

### Étape 2.2 : Déployer sur Vercel
1. Nouveau projet Vercel
2. Sélectionner le même repository
3. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontEnd`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### Étape 2.3 : Variables d'Environnement Frontend
- `VITE_API_URL` = URL de votre backend Vercel

### Étape 2.4 : Déployer
1. Cliquer "Deploy"
2. Noter l'URL frontend (ex: `https://ats-frontend.vercel.app`)

---

## 🗄️ Phase 3 : Configuration Base de Données

### Étape 3.1 : Tester la Connexion
1. Aller sur votre URL backend + `/api/test`
2. Vérifier que la connexion MongoDB fonctionne

### Étape 3.2 : Créer les Collections
Les collections seront créées automatiquement lors de la première utilisation.

---

## ⚙️ Phase 4 : Configuration Finale

### Étape 4.1 : Tester l'Application
1. Ouvrir l'URL frontend
2. Tester la connexion
3. Tester les fonctionnalités principales

### Étape 4.2 : Configurer les Domaines Personnalisés (Optionnel)
1. Dans Vercel, aller dans "Settings" > "Domains"
2. Ajouter votre domaine personnalisé

### Étape 4.3 : Monitoring
- Vercel Analytics (gratuit)
- MongoDB Atlas Monitoring

---

## 🔄 Workflow de Déploiement Continu

### Pour les Mises à Jour :
1. Faire des modifications sur la branche `develop`
2. Tester localement
3. Pousser sur GitHub
4. Vercel déploie automatiquement

### Commandes Utiles :
```bash
# Vérifier le statut
git status

# Ajouter les changements
git add .

# Commiter
git commit -m "feat: nouvelle fonctionnalité"

# Pousser sur develop
git push origin develop

# Fusionner dans main quand stable
git checkout main
git merge develop
git push origin main
```

---

## 🛠️ Dépannage

### Problèmes Courants :

1. **Erreur CORS** :
   - Vérifier la configuration CORS dans le backend
   - Ajouter l'URL frontend dans les origines autorisées

2. **Erreur MongoDB** :
   - Vérifier l'URL de connexion
   - Vérifier les permissions utilisateur

3. **Erreur Build** :
   - Vérifier les dépendances dans package.json
   - Vérifier les variables d'environnement

---

## 📞 Support

En cas de problème :
1. Vérifier les logs Vercel
2. Vérifier les logs MongoDB Atlas
3. Tester localement d'abord

---

## 🎉 Félicitations !

Votre application ATS est maintenant en ligne et accessible partout dans le monde ! 