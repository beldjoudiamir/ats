// Serveur très simple pour tester le déploiement Railway
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware CORS basique
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

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de test simple
app.get("/", (req, res) => {
  res.json({
    message: "🚀 ATS Backend is running successfully!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    mongodb_uri: process.env.MONGODB_URI ? 'Configured' : 'Missing',
    jwt_secret: process.env.JWT_SECRET ? 'Configured' : 'Missing',
    email_user: process.env.EMAIL_USER ? 'Configured' : 'Missing'
  });
});

// Route de test de l'API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is healthy and ready for MongoDB configuration",
    timestamp: new Date().toISOString(),
    variables: {
      mongodb_uri: process.env.MONGODB_URI ? 'Present' : 'Missing',
      jwt_secret: process.env.JWT_SECRET ? 'Present' : 'Missing',
      email_user: process.env.EMAIL_USER ? 'Present' : 'Missing'
    }
  });
});

// Route de test des variables d'environnement
app.get("/api/config", (req, res) => {
  res.json({
    message: "Configuration check",
    variables: {
      mongodb_uri: process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing',
      jwt_secret: process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing',
      email_user: process.env.EMAIL_USER ? '✅ Configured' : '❌ Missing',
      port: process.env.PORT || 3000
    }
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    available_routes: ["/", "/api/health", "/api/config"]
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

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ATS Simple Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Missing'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing'}`);
  console.log(`📧 Email User: ${process.env.EMAIL_USER ? 'Configured' : 'Missing'}`);
});

// Gestion des signaux pour un arrêt propre
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 