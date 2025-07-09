// Script pour insérer un utilisateur dans la base MongoDB (réutilisable)
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DATABASE = process.env.MONGODB_DB || "atsInfo";
const COLLECTION = process.env.MONGODB_COLLECTION || "users";

// Récupérer les arguments de la ligne de commande
const [,, email, password, name = "Utilisateur", role = "user"] = process.argv;

if (!email || !password) {
  console.log("\nUtilisation : node insertTestUser.js email password [name] [role]\n");
  process.exit(1);
}

async function insertUser() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const collection = db.collection(COLLECTION);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      mail: email,
      password: hashedPassword,
      role
    };

    const existing = await collection.findOne({ mail: user.mail });
    if (existing) {
      console.log("Un utilisateur avec cet email existe déjà.");
    } else {
      await collection.insertOne(user);
      console.log(`Utilisateur inséré avec succès ! Email : ${email} | Nom : ${name} | Rôle : ${role}`);
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion :", err.message);
  } finally {
    await client.close();
  }
}

insertUser();

// Script de migration pour mettre à jour les anciens devis
if (require.main === module && process.argv.includes('--migrate-devis')) {
  const { MongoClient: MongoClientMigration } = require("mongodb");
  require("dotenv").config();

  const uriMigration = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const DATABASE_MIGRATION = process.env.MONGODB_DB || "atsInfo";
  const COLLECTION_MIGRATION = "estimate";

  async function migrateDevisClients() {
    const client = new MongoClientMigration(uriMigration);
    try {
      await client.connect();
      const db = client.db(DATABASE_MIGRATION);
      const collection = db.collection(COLLECTION_MIGRATION);

      const devis = await collection.find({ "client.name": { $exists: true }, $or: [ { "client.nom_de_entreprise": { $exists: false } }, { "client.nom_de_entreprise": "" } ] }).toArray();
      let updatedCount = 0;
      for (const d of devis) {
        const update = {};
        if (d.client && d.client.name && !d.client.nom_de_entreprise) {
          update["client.nom_de_entreprise"] = d.client.name;
        }
        // Ajoute d'autres migrations de champs ici si besoin
        if (Object.keys(update).length > 0) {
          await collection.updateOne({ _id: d._id }, { $set: update });
          updatedCount++;
        }
      }
      console.log(`Migration terminée. ${updatedCount} devis mis à jour.`);
    } catch (err) {
      console.error("Erreur lors de la migration :", err.message);
    } finally {
      await client.close();
    }
  }

  migrateDevisClients();
} 