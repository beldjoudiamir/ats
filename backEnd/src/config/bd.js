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
  retryWrites: true,
  w: "majority",
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

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
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
}

module.exports = connectToDatabase;
