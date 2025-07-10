// Configuration MongoDB Atlas pour Railway
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

// URL MongoDB Atlas avec options de connexion alternatives
const getMongoURI = () => {
  const baseURI = process.env.MONGODB_URI;
  
  // Si l'URL contient déjà des paramètres, on les garde
  if (baseURI.includes('?')) {
    return baseURI;
  }
  
  // Sinon on ajoute les paramètres de base
  return `${baseURI}?retryWrites=true&w=majority`;
};

const createMongoClient = () => {
  const uri = getMongoURI();
  
  // Configuration MongoDB Atlas optimisée
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
    // Options pour éviter les problèmes SSL
    ssl: false,
    tls: false,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  };
  
  return new MongoClient(uri, options);
};

module.exports = { createMongoClient, getMongoURI }; 