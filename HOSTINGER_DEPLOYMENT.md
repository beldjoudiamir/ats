# 🚀 Guide de Déploiement sur Hostinger

## 📋 Prérequis

1. **Compte Hostinger** avec hébergement VPS ou Cloud
2. **Node.js** supporté (version 18+)
3. **Accès SSH** à votre serveur

## 🔧 Étapes de Déploiement

### 1. **Préparer le projet localement**

```bash
# Build du frontend
cd frontEnd
npm run build

# Vérifier que le dossier dist est créé
ls -la dist/
```

### 2. **Uploader sur Hostinger**

#### **Méthode 1 : Via File Manager**
1. Connectez-vous à votre panneau Hostinger
2. Allez dans **File Manager**
3. Naviguez vers le dossier public_html
4. Uploadez tous les fichiers du projet

#### **Méthode 2 : Via SSH (Recommandé)**
```bash
# Se connecter à votre serveur Hostinger
ssh username@your-server.com

# Naviguer vers le dossier web
cd public_html

# Cloner le projet (ou uploader via SCP)
git clone https://github.com/beldjoudiamir/ats.git
cd ats
```

### 3. **Configuration sur Hostinger**

#### **A. Variables d'environnement**
1. Dans votre panneau Hostinger, allez dans **Advanced** → **Environment Variables**
2. Ajoutez ces variables :
   ```
   MONGODB_URI=mongodb+srv://ATS8SOLUTIONS:Jg3nbtEUc4vfHwlP@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=false&w=1
   JWT_SECRET=214fb1a94856e046bc8e1a14735213425790d3f6d5f2e80bf8b50dbbb1098f9025feb395773fa2d0f7c0b45037311200effec3c3d52a
   NODE_ENV=production
   PORT=5000
   ```

#### **B. Configuration Node.js**
1. Dans **Advanced** → **Node.js**
2. Définir :
   - **Node.js version** : 18.x ou plus
   - **Application URL** : votre-domaine.com
   - **Application root** : /public_html/ats
   - **Application startup file** : backEnd/src/server.js

### 4. **Installation des dépendances**

```bash
# Installer les dépendances
npm install

# Ou manuellement
cd backEnd && npm install
cd ../frontEnd && npm install
```

### 5. **Build du frontend**

```bash
# Build pour la production
npm run build
```

### 6. **Démarrer l'application**

```bash
# Démarrer le serveur
npm start
```

## 🔍 Vérification

### **Test de l'API**
```
https://votre-domaine.com/api/health
```

### **Test de l'application**
```
https://votre-domaine.com
```

## ⚙️ Configuration avancée

### **A. Domaine personnalisé**
1. Dans Hostinger, allez dans **Domains**
2. Ajoutez votre domaine
3. Pointez vers le dossier de l'application

### **B. SSL/HTTPS**
1. Dans **SSL**, activez le certificat gratuit
2. Redirigez HTTP vers HTTPS

### **C. Base de données**
- Continuez à utiliser MongoDB Atlas
- Ou migrez vers une base de données MySQL/PostgreSQL de Hostinger

## 🚨 Dépannage

### **Erreur de port**
- Hostinger utilise souvent le port 5000
- Vérifiez dans les logs d'erreur

### **Erreur de permissions**
```bash
chmod 755 -R /public_html/ats
```

### **Erreur de dépendances**
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans le panneau Hostinger
2. Contactez le support Hostinger
3. Vérifiez la configuration MongoDB Atlas

## ✅ Checklist de déploiement

- [ ] Projet uploadé sur Hostinger
- [ ] Variables d'environnement configurées
- [ ] Node.js activé et configuré
- [ ] Dépendances installées
- [ ] Frontend buildé
- [ ] Application démarrée
- [ ] Tests de connexion réussis
- [ ] SSL/HTTPS activé
- [ ] Domaine configuré 