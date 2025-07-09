// Serveur de test MongoDB Atlas
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

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

// Test MongoDB Atlas
async function testMongoDB() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log("❌ MONGODB_URI non configurée");
    return { success: false, error: "MONGODB_URI manquante" };
  }

  console.log("🔍 Test de connexion MongoDB Atlas...");
  console.log("📝 URI (masquée):", uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));

  try {
    // Configuration simple
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      retryWrites: true,
      w: "majority",
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("🔄 Tentative de connexion...");
    await client.connect();
    console.log("✅ Connexion MongoDB réussie!");

    const db = client.db("atsInfo");
    console.log("📊 Base de données: atsInfo");

    // Test simple
    const collections = await db.listCollections().toArray();
    console.log("📋 Collections trouvées:", collections.length);

    await client.close();
    console.log("🔒 Connexion fermée");

    return { success: true, collections: collections.length };
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error.message);
    console.error("🔍 Détails:", error);
    return { success: false, error: error.message };
  }
}

// Route de test MongoDB
app.get("/api/mongodb-test", async (req, res) => {
  const result = await testMongoDB();
  res.json({
    message: "Test MongoDB Atlas",
    timestamp: new Date().toISOString(),
    result: result
  });
});

// Route de test simple
app.get("/", (req, res) => {
  res.json({
    message: "🚀 ATS MongoDB Test Server",
    status: "running",
    timestamp: new Date().toISOString(),
    mongodb_uri: process.env.MONGODB_URI ? "Configured" : "Missing"
  });
});

// Route de configuration
app.get("/api/config", (req, res) => {
  res.json({
    message: "Configuration MongoDB Test",
    variables: {
      mongodb_uri: process.env.MONGODB_URI ? "✅ Configured" : "❌ Missing",
      jwt_secret: process.env.JWT_SECRET ? "✅ Configured" : "❌ Missing",
      email_user: process.env.EMAIL_USER ? "✅ Configured" : "❌ Missing"
    }
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    available_routes: ["/", "/api/config", "/api/mongodb-test"]
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("❌ Global error handler:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ATS MongoDB Test Server running on port ${PORT}`);
  console.log(`📊 Test MongoDB: http://localhost:${PORT}/api/mongodb-test`);
  console.log(`🔧 Configuration: http://localhost:${PORT}/api/config`);
  console.log(`🗄️ MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Missing'}`);
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