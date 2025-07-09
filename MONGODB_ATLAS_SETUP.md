# 🗄️ Configuration MongoDB Atlas pour Railway

## 🔧 Problème actuel
L'erreur SSL indique que la chaîne de connexion MongoDB Atlas n'est pas correctement configurée.

## 📋 Étapes pour corriger

### 1. **Vérifier votre chaîne de connexion MongoDB Atlas**

Votre chaîne de connexion doit ressembler à ceci :
```
mongodb+srv://username:password@cluster.mongodb.net/atsInfo?retryWrites=true&w=majority
```

### 2. **Configurer les variables d'environnement sur Railway**

Dans votre projet Railway, allez dans **Variables d'environnement** et configurez :

```env
MONGODB_URI=mongodb+srv://votre-username:votre-password@votre-cluster.mongodb.net/atsInfo?retryWrites=true&w=majority
JWT_SECRET=votre-jwt-secret
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

### 3. **Vérifier les paramètres MongoDB Atlas**

1. **Allez sur [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Sélectionnez votre cluster**
3. **Cliquez sur "Connect"**
4. **Choisissez "Connect your application"**
5. **Copiez la chaîne de connexion**

### 4. **Paramètres importants dans la chaîne de connexion**

Assurez-vous que votre chaîne contient :
- ✅ `retryWrites=true`
- ✅ `w=majority`
- ✅ Le bon nom de base de données (`atsInfo`)

### 5. **Exemple de chaîne de connexion correcte**

```
mongodb+srv://ats_user:password123@cluster0.abc123.mongodb.net/atsInfo?retryWrites=true&w=majority
```

## 🔍 Vérification

### Test de connexion
Une fois configuré, vous devriez voir dans les logs Railway :
```
🔄 Tentative de connexion à MongoDB Atlas...
✅ Connecté à MongoDB Atlas avec succès!
📊 Base de données: atsInfo
```

### Erreurs courantes

#### Erreur SSL
- **Cause** : Chaîne de connexion incorrecte
- **Solution** : Vérifier la chaîne MongoDB Atlas

#### Erreur d'authentification
- **Cause** : Username/password incorrects
- **Solution** : Vérifier les credentials MongoDB Atlas

#### Erreur de réseau
- **Cause** : IP non autorisée
- **Solution** : Ajouter `0.0.0.0/0` dans Network Access MongoDB Atlas

## 🚀 Après configuration

1. **Redéployez sur Railway** (automatique après changement de variables)
2. **Vérifiez les logs** - Plus d'erreurs SSL
3. **Testez l'API** - Endpoint `/api/health`

## 📞 Support

- **MongoDB Atlas** : [Documentation officielle](https://docs.atlas.mongodb.com/)
- **Railway** : Dashboard Railway pour les logs
- **Variables d'environnement** : Railway → Variables d'environnement 