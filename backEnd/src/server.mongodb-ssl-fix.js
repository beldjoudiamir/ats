const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration CORS
app.use(cors({
  origin: ['https://railway.com', 'https://web-production-2554.up.railway.app', 'http://localhost:3000'],
  credentials: true
}));

// Middleware pour parser JSON
app.use(express.json());

console.log('🚀 ATS MongoDB SSL Fix Server starting...');
console.log('📊 Test MongoDB: http://localhost:' + PORT + '/api/mongodb-test');
console.log('🔧 Configuration: http://localhost:' + PORT + '/api/config');

// Test de configuration
app.get('/api/config', (req, res) => {
  const config = {
    message: 'Configuration MongoDB SSL Fix',
    variables: {
      mongodb_uri: process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing',
      jwt_secret: process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing',
      email_user: process.env.EMAIL_USER ? '✅ Configured' : '❌ Missing'
    }
  };
  res.json(config);
});

// Test MongoDB avec options SSL spéciales
app.get('/api/mongodb-test', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Tentative de connexion MongoDB avec options SSL spéciales...');
    
    // Options MongoDB avec configuration SSL spéciale
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      // Options SSL spéciales pour Railway
      ssl: true,
      sslValidate: false,
      sslCA: undefined,
      sslCert: undefined,
      sslKey: undefined,
      sslPass: undefined,
      // Options de connexion réseau
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      // Options de retry
      retryWrites: true,
      retryReads: true,
      // Options de compression
      compressors: ['zlib'],
      zlibCompressionLevel: 6,
      // Options de monitoring
      monitorCommands: false,
      // Options de réplication
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };

    console.log('🔧 Options MongoDB configurées:', JSON.stringify(options, null, 2));
    
    // URI MongoDB avec paramètres explicites
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI non configurée');
    }
    
    // Ajouter des paramètres à l'URI si nécessaire
    if (!mongoUri.includes('?')) {
      mongoUri += '?';
    } else {
      mongoUri += '&';
    }
    mongoUri += 'retryWrites=true&w=majority&ssl=true&sslValidate=false';
    
    console.log('🗄️ URI MongoDB (masquée):', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const client = new MongoClient(mongoUri, options);
    
    console.log('🔌 Tentative de connexion...');
    await client.connect();
    
    console.log('✅ Connexion MongoDB réussie !');
    
    // Test de ping
    const adminDb = client.db('admin');
    const pingResult = await adminDb.command({ ping: 1 });
    console.log('🏓 Ping MongoDB:', pingResult);
    
    // Test de base de données
    const db = client.db('ats');
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections disponibles:', collections.map(c => c.name));
    
    await client.close();
    
    const duration = Date.now() - startTime;
    
    res.json({
      message: 'Test MongoDB Atlas SSL Fix',
      timestamp: new Date().toISOString(),
      result: {
        success: true,
        duration: duration + 'ms',
        ping: pingResult,
        collections: collections.map(c => c.name),
        message: 'Connexion MongoDB réussie avec options SSL spéciales'
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    console.error('🔍 Détails de l\'erreur:', error);
    
    const duration = Date.now() - startTime;
    
    res.status(500).json({
      message: 'Test MongoDB Atlas SSL Fix',
      timestamp: new Date().toISOString(),
      result: {
        success: false,
        duration: duration + 'ms',
        error: error.message,
        details: {
          name: error.name,
          code: error.code,
          stack: error.stack
        }
      }
    });
  }
});

// Test de base simple
app.get('/api/test', (req, res) => {
  res.json({
    message: 'ATS Server SSL Fix - OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('🚀 ATS MongoDB SSL Fix Server running on port', PORT);
  console.log('📊 Test MongoDB: http://localhost:' + PORT + '/api/mongodb-test');
  console.log('🔧 Configuration: http://localhost:' + PORT + '/api/config');
  console.log('🗄️ MongoDB URI:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing');
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 