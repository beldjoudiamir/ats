// Fichier config/bd.js
const { createMongoClient } = require("./mongodb-atlas");
const { getPublicIP } = require("./get-ip");
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

async function connectToDatabase() {
  let client;
  
  // Afficher les informations de connexion pour MongoDB Atlas
  console.log("🌐 Railway Environment Info:");
  console.log("   - RAILWAY_STATIC_URL:", process.env.RAILWAY_STATIC_URL || "Not set");
  console.log("   - RAILWAY_PUBLIC_DOMAIN:", process.env.RAILWAY_PUBLIC_DOMAIN || "Not set");
  console.log("   - PORT:", process.env.PORT || "3000");
  
  // Récupérer l'IP publique pour MongoDB Atlas
  try {
    const publicIP = await getPublicIP();
    console.log("🌍 Public IP Address:", publicIP);
    console.log("📝 Add this IP to MongoDB Atlas Network Access:", publicIP + "/32");
  } catch (error) {
    console.log("⚠️ Could not get public IP:", error.message);
  }
  
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
    console.error("❌ Error connecting to MongoDB:", err.message);
    console.error("🔧 Trying alternative connection method...");
    
    // Tentative avec une configuration encore plus basique
    try {
      const { MongoClient } = require("mongodb");
      const simpleClient = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        ssl: false,
        tls: false,
      });
      
      await simpleClient.connect();
      console.log("✅ Connected to MongoDB with simple config!");
      
      const db = simpleClient.db(DATABASE);
      
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
      console.error("💡 Please check your MongoDB URI and network connection");
      throw altErr;
    }
  }
}

module.exports = connectToDatabase;
