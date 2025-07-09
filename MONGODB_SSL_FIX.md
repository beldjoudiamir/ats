# 🔧 Correction Erreur SSL MongoDB Atlas

## 🚨 Problème actuel
Erreur SSL : `tlsv1 alert internal error` - Problème de configuration SSL avec MongoDB Atlas

## ✅ Solution en 4 étapes

### **Étape 1 : Vérifier la chaîne de connexion MongoDB Atlas**

Votre chaîne doit ressembler à :
```
mongodb+srv://username:password@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=true&w=majority&tls=true
```

### **Étape 2 : Paramètres requis dans la chaîne de connexion**

Assurez-vous que votre chaîne contient :
- ✅ `retryWrites=true`
- ✅ `w=majority`
- ✅ `tls=true` (nouveau paramètre)
- ✅ Le bon nom de base de données (`atsInfo`)

### **Étape 3 : Configuration MongoDB Atlas**

#### **3.1 Network Access**
1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Sélectionnez votre cluster
3. Cliquez sur "Network Access"
4. **Ajoutez `0.0.0.0/0`** pour autoriser toutes les IP
5. **Ou ajoutez l'IP de Railway** si vous préférez

#### **3.2 Database Access**
1. Cliquez sur "Database Access"
2. Vérifiez que votre utilisateur a les permissions :
   - `readWrite` sur la base de données `atsInfo`
   - Ou `atlasAdmin` pour tous les privilèges

#### **3.3 Cluster Configuration**
1. Vérifiez que votre cluster est actif
2. Assurez-vous que la version MongoDB est compatible (4.4+)

### **Étape 4 : Variables d'environnement Railway**

Dans Railway → Variables d'environnement, mettez à jour :

```env
MONGODB_URI=mongodb+srv://votre-username:votre-password@cluster0.bhv3c.mongodb.net/atsInfo?retryWrites=true&w=majority&tls=true
JWT_SECRET=votre-jwt-secret-fort
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 🔍 Test de la configuration

### **Test 1 : Chaîne de connexion**
Testez votre chaîne de connexion dans MongoDB Compass ou un autre client MongoDB.

### **Test 2 : API Health**
Une fois configuré, testez :
```
GET https://votre-app-railway.railway.app/api/health
```

Résultat attendu :
```json
{
  "status": "OK",
  "message": "API is healthy",
  "timestamp": "2025-07-09T..."
}
```

## 🚀 Après correction

1. **Railway va redéployer automatiquement**
2. **Les logs devraient montrer** :
   ```
   🔄 Tentative de connexion à MongoDB Atlas...
   ✅ Connecté à MongoDB Atlas avec succès!
   📊 Base de données: atsInfo
   ```
3. **L'API sera accessible** sur tous les endpoints

## 📞 Support

- **MongoDB Atlas** : [Documentation SSL](https://docs.atlas.mongodb.com/security-vpc-peering/)
- **Railway** : Dashboard Railway pour les logs
- **Variables d'environnement** : Railway → Variables d'environnement

---

## 🎯 Checklist de correction

- [ ] Chaîne de connexion avec `tls=true`
- [ ] Network Access configuré (0.0.0.0/0)
- [ ] Database Access configuré
- [ ] Variables d'environnement mises à jour
- [ ] Test de connexion réussi
- [ ] API health check fonctionnel 