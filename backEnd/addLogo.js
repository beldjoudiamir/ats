const { MongoClient } = require("mongodb");
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ats";

async function addLogo() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db();
    
    // Logo de test (utilise un logo existant)
    const logoUrl = "/uploads/1751567242239-logo.png"; // Logo existant dans le dossier uploads
    
    // Mettre à jour l'entreprise avec le logo
    const result = await db.collection("myCompanyInfo").updateOne(
      {}, // Mettre à jour le premier document trouvé
      { 
        $set: { 
          logo: logoUrl,
          updatedAt: new Date().toISOString()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log("✅ Logo added successfully!");
      console.log("🖼️ Logo URL:", logoUrl);
      
      // Vérifier les données mises à jour
      const updatedCompany = await db.collection("myCompanyInfo").findOne({});
      console.log("📋 Updated company data:", JSON.stringify(updatedCompany, null, 2));
    } else {
      console.log("❌ No company found to update");
    }

    await client.close();
    console.log("🔌 Database connection closed");

  } catch (error) {
    console.error("❌ Error adding logo:", error.message);
    process.exit(1);
  }
}

addLogo(); 