# 🔧 Guide de résolution MongoDB Atlas

## 🚨 Problème actuel
Erreur SSL : `tlsv1 alert internal error` - Problème de configuration MongoDB Atlas

## ✅ Solution en 3 étapes

### **Étape 1 : Serveur simple fonctionnel**
Le serveur simple va démarrer sans MongoDB pour confirmer que Railway fonctionne.

### **Étape 2 : Configuration MongoDB Atlas correcte**

#### **2.1 Vérifier votre chaîne de connexion**
Votre chaîne doit ressembler à :
```
mongodb+srv://username:password@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=true&w=majority
```

#### **2.2 Paramètres MongoDB Atlas requis**
Dans votre chaîne de connexion, assurez-vous d'avoir :
- ✅ `retryWrites=true`
- ✅ `w=majority`
- ✅ Le bon nom de base de données (`atsInfo`)

#### **2.3 Configuration Network Access**
1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Sélectionnez votre cluster
3. Cliquez sur "Network Access"
4. Ajoutez `0.0.0.0/0` pour autoriser toutes les IP

#### **2.4 Configuration Database Access**
1. Cliquez sur "Database Access"
2. Vérifiez que votre utilisateur a les permissions :
   - `readWrite` sur la base de données `atsInfo`
   - Ou `atlasAdmin` pour tous les privilèges

### **Étape 3 : Variables d'environnement Railway**

Dans Railway → Variables d'environnement, configurez :

```env
MONGODB_URI=mongodb+srv://votre-username:votre-password@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=true&w=majority
JWT_SECRET=votre-jwt-secret-fort
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 🔍 Test de la configuration

### **Test 1 : Serveur simple**
```
GET https://votre-app-railway.railway.app/api/config
```
Résultat attendu :
```json
{
  "variables": {
    "mongodb_uri": "✅ Configured",
    "jwt_secret": "✅ Configured",
    "email_user": "✅ Configured"
  }
}
```

### **Test 2 : Connexion MongoDB**
Une fois configuré, vous devriez voir :
```
🔄 Tentative de connexion à MongoDB Atlas...
✅ Connecté à MongoDB Atlas avec succès!
📊 Base de données: atsInfo
```

## 🚀 Activation du serveur de production

Une fois MongoDB configuré :

1. **Modifiez le package.json** :
```json
"start": "node src/server.production.js"
```

2. **Redéployez sur Railway**
3. **Testez l'API complète**

## 📞 Support

- **MongoDB Atlas** : [Documentation officielle](https://docs.atlas.mongodb.com/)
- **Railway** : Dashboard Railway pour les logs
- **Variables d'environnement** : Railway → Variables d'environnement

---

## 🎯 Checklist finale

- [ ] Serveur simple fonctionne
- [ ] Variables d'environnement configurées
- [ ] MongoDB Atlas Network Access configuré
- [ ] MongoDB Atlas Database Access configuré
- [ ] Chaîne de connexion testée
- [ ] Serveur de production activé
- [ ] API complète testée 