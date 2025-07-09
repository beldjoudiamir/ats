require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = process.env.MONGODB_URI;
const DATABASE = "atsInfo";
const COLLECTION = "users";

async function createTestUser() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connecté à MongoDB Atlas');

    const db = client.db(DATABASE);
    const usersCollection = db.collection(COLLECTION);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ mail: 'admin@ats.com' });
    if (existingUser) {
      console.log('⚠️ Utilisateur admin@ats.com existe déjà');
      return;
    }

    // Créer un mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'utilisateur de test
    const testUser = {
      name: 'Administrateur ATS',
      mail: 'admin@ats.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(testUser);
    console.log('✅ Utilisateur de test créé avec succès');
    console.log('📋 Détails de connexion :');
    console.log('   Email: admin@ats.com');
    console.log('   Mot de passe: admin123');
    console.log('   Rôle: admin');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await client.close();
    console.log('🔌 Connexion fermée');
  }
}

createTestUser(); 