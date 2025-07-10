// Fichier config/bd.js
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  sslValidate: false,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  retryWrites: true,
  w: "majority",
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db(DATABASE);

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
    console.error("🔧 SSL/TLS Error - Trying alternative connection...");
    
    // Tentative de connexion alternative
    try {
      const alternativeClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: false,
          deprecationErrors: false,
        },
        ssl: false,
        tls: false,
        retryWrites: false,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
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
      throw altErr;
    }
  }
}

module.exports = connectToDatabase;
