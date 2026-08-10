const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Connexion à MongoDB (Atlas via MONGO_URI, sinon MongoDB en mémoire)
const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGO_URI;

    // Si pas d'URI valide (Atlas), on bascule sur MongoDB en mémoire
    if (!dbUrl || dbUrl.includes('mongodb.net')) {
      console.log('🔄 Connexion internet défaillante ou MONGO_URI absent. Bascule sur MongoDB en mémoire...');
      const mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
    }

    await mongoose.connect(dbUrl);
    console.log('📡 MongoDB connecté avec succès !');
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;