# 🔍 Diagnostic MongoDB Atlas - Erreur SSL

## 🚨 Problème identifié
Erreur SSL persistante : `tlsv1 alert internal error` avec MongoDB Atlas

## 🔧 Solutions à essayer

### **Solution 1 : Vérifier la chaîne de connexion MongoDB Atlas**

#### **1.1 Format correct de la chaîne**
Votre chaîne doit ressembler à :
```
mongodb+srv://username:password@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=true&w=majority
```

#### **1.2 Paramètres requis**
- ✅ `retryWrites=true`
- ✅ `w=majority`
- ❌ **NE PAS** ajouter `tls=true` (causerait des conflits)
- ✅ Nom de base de données : `atsInfo`

### **Solution 2 : Configuration MongoDB Atlas**

#### **2.1 Network Access**
1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Sélectionnez votre cluster
3. Cliquez sur "Network Access"
4. **Ajoutez `0.0.0.0/0`** (autoriser toutes les IP)
5. Cliquez sur "Add IP Address"

#### **2.2 Database Access**
1. Cliquez sur "Database Access"
2. Vérifiez que votre utilisateur a :
   - **Authentication Method** : Password
   - **Database User Privileges** : `readWrite` sur `atsInfo`
   - Ou `atlasAdmin` pour tous les privilèges

#### **2.3 Cluster Configuration**
1. Vérifiez que votre cluster est **Active**
2. Version MongoDB : 4.4 ou plus récente
3. Région : Europe (pour Railway)

### **Solution 3 : Variables d'environnement Railway**

Dans Railway → Variables d'environnement :

```env
MONGODB_URI=mongodb+srv://votre-username:votre-password@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=true&w=majority
JWT_SECRET=votre-jwt-secret-fort
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

### **Solution 4 : Test de connexion**

#### **4.1 Test avec le serveur de test**
Une fois configuré, testez :
```
GET https://votre-app-railway.railway.app/api/mongodb-test
```

#### **4.2 Résultat attendu**
```json
{
  "message": "Test MongoDB Atlas",
  "result": {
    "success": true,
    "collections": 0
  }
}
```

## 🚀 Étapes de résolution

### **Étape 1 : Vérifier MongoDB Atlas**
1. ✅ Cluster actif
2. ✅ Network Access configuré
3. ✅ Database Access configuré
4. ✅ Chaîne de connexion correcte

### **Étape 2 : Tester la connexion**
1. ✅ Serveur de test déployé
2. ✅ Test `/api/mongodb-test`
3. ✅ Analyse des logs Railway

### **Étape 3 : Activer le serveur de production**
1. ✅ MongoDB connecté
2. ✅ Modifier package.json
3. ✅ Redéployer

## 📞 Support

- **MongoDB Atlas** : [Documentation officielle](https://docs.atlas.mongodb.com/)
- **Railway** : Dashboard Railway pour les logs
- **Erreurs SSL** : [Guide MongoDB SSL](https://docs.mongodb.com/manual/reference/connection-string/)

---

## 🎯 Checklist de diagnostic

- [ ] Chaîne de connexion correcte (sans tls=true)
- [ ] Network Access : 0.0.0.0/0
- [ ] Database Access : readWrite sur atsInfo
- [ ] Cluster actif et en Europe
- [ ] Variables d'environnement configurées
- [ ] Test /api/mongodb-test réussi
- [ ] Logs Railway sans erreur SSL 