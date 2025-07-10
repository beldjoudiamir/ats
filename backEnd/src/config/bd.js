// Fichier config/bd.js
const { MongoClient } = require("mongodb");
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ats";

console.log("🔌 Attempting to connect to MongoDB Atlas...");

async function connectToDatabase() {
  try {
    // Configuration simplifiée sans options dépréciées
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    console.log("✅ Connected to MongoDB Atlas successfully!");

    const db = client.db();
    
    // Collections
    const collection = db.collection("myCompanyInfo");
    const collection2 = db.collection("clients");
    const collection3 = db.collection("transporteurs");
    const collection4 = db.collection("commissionnaires");
    const collection5 = db.collection("estimates");
    const collection6 = db.collection("invoices");
    const collection7 = db.collection("transportOrders");
    const collection8 = db.collection("conditionsTransport");
    const collection9 = db.collection("messages");
    const users = db.collection("users");

    return {
      collection,
      collection2,
      collection3,
      collection4,
      collection5,
      collection6,
      collection7,
      collection8,
      collection9,
      users,
      client
    };
  } catch (error) {
    console.error("❌ Error connecting to MongoDB Atlas:", error.message);
    throw error;
  }
}

module.exports = connectToDatabase;
