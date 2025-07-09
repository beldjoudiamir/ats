# 🔧 Guide de Dépannage - Déploiement ATS

## ❌ Erreurs de Déploiement Courantes

### **1. Erreur : "Build failed"**

**Causes possibles :**
- Certificats SSL manquants
- Variables d'environnement non configurées
- Dépendances manquantes

**Solutions :**

#### **A. Utiliser la version de production**
Le serveur de production (`server.production.js`) ne nécessite pas de certificats SSL.

#### **B. Vérifier les variables d'environnement**
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atsInfo
JWT_SECRET=votre-secret-jwt-fort
NODE_ENV=production
```

#### **C. Vérifier les dépendances**
```bash
cd backEnd
npm install
```

### **2. Erreur : "Cannot find module"**

**Solution :**
- Vérifier que toutes les dépendances sont installées
- Utiliser `npm install` dans le dossier `backEnd`

### **3. Erreur : "Port already in use"**

**Solution :**
- Utiliser la variable d'environnement `PORT` fournie par la plateforme
- Le serveur utilise automatiquement `process.env.PORT`

### **4. Erreur : "Database connection failed"**

**Solutions :**

#### **A. Vérifier l'URI MongoDB**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atsInfo
```

#### **B. Vérifier l'accès réseau MongoDB Atlas**
- Aller dans "Network Access"
- Ajouter "0.0.0.0/0" (tous les IPs)

#### **C. Vérifier les credentials**
- Username et password corrects
- Base de données créée

### **5. Erreur : "Health check failed"**

**Solution :**
- Le serveur de production inclut une route de santé `/`
- Vérifier que le serveur démarre correctement

## 🚀 **Solutions par Plateforme**

### **Railway**

#### **Configuration recommandée :**
```json
{
  "buildCommand": "cd backEnd && npm install",
  "startCommand": "cd backEnd && npm start"
}
```

#### **Variables d'environnement :**
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atsInfo
JWT_SECRET=votre-secret-jwt-fort
NODE_ENV=production
```

### **Render**

#### **Configuration :**
- **Build Command :** `cd backEnd && npm install`
- **Start Command :** `cd backEnd && npm start`
- **Root Directory :** `backEnd`

### **Heroku**

#### **Configuration :**
- Utiliser le fichier `Procfile`
- Configurer les variables d'environnement dans le dashboard

## 🔍 **Diagnostic des Problèmes**

### **1. Vérifier les logs**
```bash
# Railway
railway logs

# Render
# Voir dans le dashboard

# Heroku
heroku logs --tail
```

### **2. Test local**
```bash
cd backEnd
npm install
npm start
```

### **3. Test de l'API**
```bash
curl https://votre-app.railway.app/
curl https://votre-app.railway.app/api/health
```

## 🛠️ **Solutions Rapides**

### **Problème : Build échoue**
1. Vérifier que `server.production.js` existe
2. Vérifier les variables d'environnement
3. Redéployer

### **Problème : Serveur ne démarre pas**
1. Vérifier les logs d'erreur
2. Vérifier la connexion MongoDB
3. Vérifier le port

### **Problème : API ne répond pas**
1. Vérifier l'URL de déploiement
2. Vérifier les routes
3. Tester avec Postman

## 📞 **Support**

### **Logs utiles :**
```bash
# Démarrage du serveur
🚀 Démarrage du serveur ATS en production...

# Connexion DB
✅ Connexion à la base de données établie

# Serveur démarré
🌐 ATS Backend Server running on port 3000
```

### **Tests de santé :**
```bash
# Test de base
curl https://votre-app.railway.app/

# Test API
curl https://votre-app.railway.app/api/health

# Test utilisateurs
curl https://votre-app.railway.app/api/users/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"le@padre.io","password":"Xman2025!"}'
```

---

## 🎯 **Checklist de Déploiement**

- [ ] Variables d'environnement configurées
- [ ] MongoDB Atlas configuré
- [ ] Serveur de production utilisé
- [ ] Health check fonctionne
- [ ] API répond correctement
- [ ] Logs sans erreur

**Si le problème persiste, partagez les logs d'erreur pour un diagnostic plus précis.** 