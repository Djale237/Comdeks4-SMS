const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Importation du modèle de produit
const Produit = require('../models/Produit');

// Données de test qui respectent STRICTEMENT les enums de ton schéma
const seedProduits = [
  {
    nom: "Maïs", 
    categorie: "Semences",
    prixUnitaire: 1500, 
    canton: "Mororo", // Corrigé : 'Mororo' fait bien partie de la liste autorisée !
    description: "Semences à haut rendement adaptées à la saison locale.",
    stock: 50
  }
];

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    // Si Atlas est déconnecté, on utilise la mémoire
    if (!dbUrl || dbUrl.includes('mongodb.net')) {
      console.log('🔄 Connexion internet défaillante. Bascule sur MongoDB en mémoire...');
      const mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
    }

    await mongoose.connect(dbUrl);
    console.log('📡 MongoDB connecté avec succès !');

    // PEUPLEMENT AUTOMATIQUE AU DÉMARRAGE
    //const count = await Produit.countDocuments();
    //if (count === 0) {
      //console.log('🌱 Base de données vide. Insertion automatique des produits de test...');
      //await Produit.insertMany(seedProduits);
      //console.log('✅ Produits de test insérés avec succès !');
    //} else {
      //console.log('📦 Des produits existent déjà dans la base de données.');
    //}

  } catch (error) {
    console.error('❌ Erreur de connexion ou de peuplement :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;