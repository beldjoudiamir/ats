// Fichier config/bd.js
const { MongoClient } = require("mongodb");
const { createLocalMongoClient } = require("./mongodb-local");
const dotenv = require("dotenv");

dotenv.config();

const DATABASE = "atsInfo";
const COLLECTION = {
  collection: "information",
  collection2: "companyClient",
  collection3: "transportOrder",
  collection4: "conditionsTransport",
  collection5: "estimate",
  collection6: "invoice",
  collection7: "transportQuoteRequest",
  collection8: "receivedMessage",
  collection9: "listeCommissionnaire",
  users: "users",
};

// Configuration MongoDB sans SSL/TLS
function createMongoClient() {
  const uri = process.env.MONGODB_URI;
  
  // Configuration ultra-simple sans SSL
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    // Désactiver complètement SSL/TLS
    ssl: false,
    tls: false,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    // Options de connexion basiques
    retryWrites: false,
    w: 1,
    bufferMaxEntries: 0,
    bufferCommands: false,
  };
  
  return new MongoClient(uri, options);
}

async function connectToDatabase() {
  let client;
  
  // Afficher les informations de connexion pour MongoDB Atlas
  console.log("🌐 Railway Environment Info:");
  console.log("   - RAILWAY_STATIC_URL:", process.env.RAILWAY_STATIC_URL || "Not set");
  console.log("   - RAILWAY_PUBLIC_DOMAIN:", process.env.RAILWAY_PUBLIC_DOMAIN || "Not set");
  console.log("   - RAILWAY_REPLICA_ID:", process.env.RAILWAY_REPLICA_ID || "Not set");
  console.log("   - RAILWAY_PROJECT_ID:", process.env.RAILWAY_PROJECT_ID || "Not set");
  console.log("   - PORT:", process.env.PORT || "3000");
  console.log("   - NODE_ENV:", process.env.NODE_ENV || "development");
  
  try {
    console.log("🔌 Attempting to connect to MongoDB Atlas...");
    client = createMongoClient();
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas successfully!");

    const db = client.db(DATABASE);
    console.log(`📊 Using database: ${DATABASE}`);

    return {
      collection: db.collection(COLLECTION.collection),
      collection2: db.collection(COLLECTION.collection2),
      collection3: db.collection(COLLECTION.collection3),
      collection4: db.collection(COLLECTION.collection4),
      collection5: db.collection(COLLECTION.collection5),
      collection6: db.collection(COLLECTION.collection6),
      collection7: db.collection(COLLECTION.collection7),
      collection8: db.collection(COLLECTION.collection8),
      collection9: db.collection(COLLECTION.collection9),
      users: db.collection(COLLECTION.users),
    };
  } catch (err) {
    console.error("❌ Error connecting to MongoDB Atlas:", err.message);
    console.error("🔧 Trying alternative connection method...");
    
    // Tentative avec une configuration encore plus basique
    try {
      console.log("🔄 Trying alternative MongoDB connection...");
      const alternativeClient = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        ssl: false,
        tls: false,
        retryWrites: false,
        w: 1,
      });
      
      await alternativeClient.connect();
      console.log("✅ Connected to MongoDB with alternative config!");
      
      const db = alternativeClient.db(DATABASE);
      
      return {
        collection: db.collection(COLLECTION.collection),
        collection2: db.collection(COLLECTION.collection2),
        collection3: db.collection(COLLECTION.collection3),
        collection4: db.collection(COLLECTION.collection4),
        collection5: db.collection(COLLECTION.collection5),
        collection6: db.collection(COLLECTION.collection6),
        collection7: db.collection(COLLECTION.collection7),
        collection8: db.collection(COLLECTION.collection8),
        collection9: db.collection(COLLECTION.collection9),
        users: db.collection(COLLECTION.users),
      };
    } catch (altErr) {
      console.error("❌ Alternative connection also failed:", altErr.message);
      console.error("🔧 Trying local MongoDB as last resort...");
      
      // Dernière tentative avec MongoDB local
      try {
        console.log("🏠 Trying local MongoDB connection...");
        const localClient = createLocalMongoClient();
        await localClient.connect();
        console.log("✅ Connected to local MongoDB!");
        
        const db = localClient.db(DATABASE);
        
        return {
          collection: db.collection(COLLECTION.collection),
          collection2: db.collection(COLLECTION.collection2),
          collection3: db.collection(COLLECTION.collection3),
          collection4: db.collection(COLLECTION.collection4),
          collection5: db.collection(COLLECTION.collection5),
          collection6: db.collection(COLLECTION.collection6),
          collection7: db.collection(COLLECTION.collection7),
          collection8: db.collection(COLLECTION.collection8),
          collection9: db.collection(COLLECTION.collection9),
          users: db.collection(COLLECTION.users),
        };
      } catch (localErr) {
        console.error("❌ All connection attempts failed!");
        console.error("💡 Please check your MongoDB URI and network connection");
        console.error("🔧 Try adding 'Allow Access from Anywhere' in MongoDB Atlas Network Access");
        throw localErr;
      }
    }
  }
}

module.exports = connectToDatabase;
