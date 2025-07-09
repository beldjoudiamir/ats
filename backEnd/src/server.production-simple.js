require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration CORS pour la production
app.use(cors({
  origin: ['https://railway.com', 'https://web-production-2554.up.railway.app', 'https://ats-front-end-xi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('🚀 ATS Production Server starting...');

// Variables globales pour les collections
let db, usersCollection, companyCollection;

// Connexion à MongoDB
async function connectToMongoDB() {
  try {
    console.log('🔄 Tentative de connexion à MongoDB Atlas...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI non configurée');
    }

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      ssl: true,
      sslValidate: false
    });

    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');

    db = client.db('atsInfo');
    usersCollection = db.collection('users');
    companyCollection = db.collection('information');

    console.log('📚 Collections configurées');
    return client;

  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    throw error;
  }
}

// Route de santé
app.get("/", (req, res) => {
  res.json({
    message: "ATS Backend API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Route de test de l'API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

// Route de configuration
app.get('/api/config', (req, res) => {
  const config = {
    message: 'Configuration ATS Production',
    variables: {
      mongodb_uri: process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing',
      jwt_secret: process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing',
      email_user: process.env.EMAIL_USER ? '✅ Configured' : '❌ Missing'
    }
  };
  res.json(config);
});

// Route de connexion utilisateur
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    console.log('🔐 Tentative de connexion pour:', email);

    // Recherche l'utilisateur
    const user = await usersCollection.findOne({ mail: email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    if (!user.password) {
      console.log('❌ Mot de passe non défini pour:', email);
      return res.status(401).json({ error: "Mot de passe non défini pour cet utilisateur" });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Définir la durée d'expiration du token
    const expiresIn = rememberMe ? "30d" : "8h";

    // Génère un JWT
    const token = jwt.sign(
      { userId: user._id, email: user.mail, role: user.role },
      process.env.JWT_SECRET || "dev_secret_key",
      { expiresIn: expiresIn }
    );

    console.log('✅ Connexion réussie pour:', email);

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.mail, 
        role: user.role 
      } 
    });

  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Route pour récupérer les informations de l'entreprise
app.get("/api/myCompanyInfo", async (req, res) => {
  try {
    const companyInfo = await companyCollection.findOne({});
    if (companyInfo) {
      res.json(companyInfo);
    } else {
      res.json({
        message: "Aucune information d'entreprise trouvée",
        data: {
          name: 'ATS Solutions',
          phone: '+33 1 23 45 67 89',
          email: 'contact@ats-solutions.com',
          address: '123 Rue de la Paix, 75001 Paris'
        }
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des infos entreprise:', error);
    res.status(500).json({ error: "Erreur lors de la récupération des informations" });
  }
});

// Route pour récupérer le numéro de téléphone
app.get("/api/myCompanyInfo/phone", async (req, res) => {
  try {
    const companyInfo = await companyCollection.findOne({});
    if (companyInfo && companyInfo.phone) {
      res.json({ phone: companyInfo.phone });
    } else {
      res.json({ phone: '+33 1 23 45 67 89' });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du téléphone:', error);
    res.status(500).json({ error: "Erreur lors de la récupération du téléphone" });
  }
});

// Gestion des routes non trouvées
app.use((req, res) => {
  console.log('❌ Route non trouvée:', req.method, req.path);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("❌ Global error handler:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    const client = await connectToMongoDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 ATS Production Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/users/login`);
    });

    // Gestion de l'arrêt gracieux
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      await client.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully');
      await client.close();
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
}

startServer(); 