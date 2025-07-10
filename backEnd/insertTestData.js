const { MongoClient } = require("mongodb");
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ats";

async function insertTestData() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db();
    
    // Données de test pour l'entreprise
    const companyInfo = {
      name: "ATS Transport Solutions",
      description: "Entreprise spécialisée dans le transport de marchandises",
      address: "123 Rue du Transport, 75001 Paris",
      phone: "+33 1 23 45 67 89",
      email: "contact@ats-transport.com",
      siret: "12345678901234",
      logo: "",
      date: new Date().toISOString()
    };

    // Données de test pour les clients
    const clients = [
      {
        name: "Entreprise ABC",
        email: "contact@abc.com",
        phone: "+33 1 98 76 54 32",
        address: "456 Avenue des Affaires, 69000 Lyon",
        siret: "98765432109876",
        date: new Date().toISOString()
      },
      {
        name: "Société XYZ",
        email: "info@xyz.fr",
        phone: "+33 2 34 56 78 90",
        address: "789 Boulevard Commercial, 13000 Marseille",
        siret: "11223344556677",
        date: new Date().toISOString()
      }
    ];

    // Données de test pour les transporteurs
    const transporteurs = [
      {
        name: "Transport Express",
        email: "contact@transport-express.fr",
        phone: "+33 1 11 22 33 44",
        address: "321 Route Nationale, 31000 Toulouse",
        siret: "55667788990011",
        date: new Date().toISOString()
      }
    ];

    // Données de test pour les commissionnaires
    const commissionnaires = [
      {
        name: "Commissionnaire Pro",
        email: "contact@commissionnaire-pro.fr",
        phone: "+33 1 55 66 77 88",
        address: "654 Rue du Commerce, 44000 Nantes",
        siret: "22334455667788",
        date: new Date().toISOString()
      }
    ];

    // Insertion des données
    console.log("📝 Inserting test data...");

    // Vérifier si les données existent déjà
    const existingCompany = await db.collection("myCompanyInfo").findOne({});
    if (!existingCompany) {
      await db.collection("myCompanyInfo").insertOne(companyInfo);
      console.log("✅ Company info inserted");
    } else {
      console.log("ℹ️ Company info already exists");
    }

    // Insérer les clients
    for (const client of clients) {
      const existingClient = await db.collection("clients").findOne({ email: client.email });
      if (!existingClient) {
        await db.collection("clients").insertOne(client);
        console.log(`✅ Client ${client.name} inserted`);
      } else {
        console.log(`ℹ️ Client ${client.name} already exists`);
      }
    }

    // Insérer les transporteurs
    for (const transporteur of transporteurs) {
      const existingTransporteur = await db.collection("transporteurs").findOne({ email: transporteur.email });
      if (!existingTransporteur) {
        await db.collection("transporteurs").insertOne(transporteur);
        console.log(`✅ Transporteur ${transporteur.name} inserted`);
      } else {
        console.log(`ℹ️ Transporteur ${transporteur.name} already exists`);
      }
    }

    // Insérer les commissionnaires
    for (const commissionnaire of commissionnaires) {
      const existingCommissionnaire = await db.collection("commissionnaires").findOne({ email: commissionnaire.email });
      if (!existingCommissionnaire) {
        await db.collection("commissionnaires").insertOne(commissionnaire);
        console.log(`✅ Commissionnaire ${commissionnaire.name} inserted`);
      } else {
        console.log(`ℹ️ Commissionnaire ${commissionnaire.name} already exists`);
      }
    }

    console.log("🎉 Test data insertion completed!");
    await client.close();
    console.log("🔌 Database connection closed");

  } catch (error) {
    console.error("❌ Error inserting test data:", error.message);
    process.exit(1);
  }
}

insertTestData(); 