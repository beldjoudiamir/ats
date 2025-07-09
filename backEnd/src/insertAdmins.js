// Script pour insérer plusieurs administrateurs dans la base MongoDB
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DATABASE = process.env.MONGODB_DB || "atsInfo";
const COLLECTION = process.env.MONGODB_COLLECTION || "users";

// Liste des administrateurs à créer
const admins = [
  {
    name: "Admin Principal",
    email: "admin@ats.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "LE PADRE",
    email: "le@padre.io",
    password: "Xman2025!",
    role: "admin"
  },
  {
    name: "Super Admin",
    email: "superadmin@ats.com",
    password: "SuperAdmin2025!",
    role: "admin"
  }
];

async function insertAdmins() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const collection = db.collection(COLLECTION);

    console.log("🚀 Début de l'insertion des administrateurs...\n");

    for (const admin of admins) {
      try {
        // Vérifier si l'admin existe déjà
        const existing = await collection.findOne({ mail: admin.email });
        
        if (existing) {
          console.log(`⚠️  Admin déjà existant : ${admin.name} (${admin.email})`);
        } else {
          // Hash du mot de passe
          const hashedPassword = await bcrypt.hash(admin.password, 10);
          
          const user = {
            name: admin.name,
            mail: admin.email,
            password: hashedPassword,
            role: admin.role
          };

          await collection.insertOne(user);
          console.log(`✅ Admin créé avec succès : ${admin.name} (${admin.email})`);
        }
      } catch (err) {
        console.error(`❌ Erreur lors de la création de ${admin.name}:`, err.message);
      }
    }

    console.log("\n🎉 Processus terminé !");
    
    // Afficher tous les admins existants
    console.log("\n📋 Liste des administrateurs dans la base :");
    const allAdmins = await collection.find({ role: "admin" }).toArray();
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.mail}) - Rôle: ${admin.role}`);
    });

  } catch (err) {
    console.error("❌ Erreur de connexion à la base de données :", err.message);
  } finally {
    await client.close();
  }
}

// Fonction pour ajouter un admin spécifique
async function addSpecificAdmin(name, email, password) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const collection = db.collection(COLLECTION);

    const existing = await collection.findOne({ mail: email });
    if (existing) {
      console.log(`⚠️  Admin déjà existant : ${name} (${email})`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      mail: email,
      password: hashedPassword,
      role: "admin"
    };

    await collection.insertOne(user);
    console.log(`✅ Admin créé avec succès : ${name} (${email})`);

  } catch (err) {
    console.error("❌ Erreur lors de la création :", err.message);
  } finally {
    await client.close();
  }
}

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2);

if (args.length >= 3) {
  // Mode : ajouter un admin spécifique
  const [name, email, password] = args;
  addSpecificAdmin(name, email, password);
} else {
  // Mode : ajouter tous les admins par défaut
  insertAdmins();
}

module.exports = { insertAdmins, addSpecificAdmin }; 