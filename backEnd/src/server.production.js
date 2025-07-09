require('dotenv').config();
const express = require("express");
const path = require("path");

const connectToDatabase = require("./config/bd.js");
const applyMiddlewares = require("./utils/middleware.js");
const createRoutes = require("./routes/myRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");

const PORT = process.env.PORT || 3000;

const app = express();

// Configuration CORS pour la production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

async function startServer() {
  try {
    console.log("🚀 Démarrage du serveur ATS en production...");
    
    const {
      collection, collection2, collection3, collection4,
      collection5, collection6, collection7, collection8, collection9,
      users
    } = await connectToDatabase();

    console.log("✅ Connexion à la base de données établie");

    const routes = createRoutes(
      collection, collection2, collection3, collection4,
      collection5, collection6, collection7, collection8, collection9,
      users
    );

    app.use("/api", routes);
    app.use("/api/clients", clientRoutes(collection2));

    // Route de santé pour les health checks
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

    // Gestion des routes non trouvées
    app.use((req, res) => {
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

    // Démarrer le serveur HTTP uniquement
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 ATS Backend Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });

  } catch (err) {
    console.error("❌ Failed to start the server:", err.message);
    process.exit(1);
  }
}

// Gestion des signaux pour un arrêt propre
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer(); 