require('dotenv').config();

const dns = require('dns');
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {}

const mongoose = require('mongoose');
const Produit = require('./models/Produit');

async function seedDatabase() {
  try {
    console.log('⏳ Connexion à MongoDB Atlas en cours...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connexion MongoDB réussie !');

    const produitsExemple = [
      // --- MAÏS ---
      { nom: 'Maïs', prix: 200, unite: 'sachet 1 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Maïs', prix: 800, unite: 'sac 5 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Maïs', prix: 1500, unite: 'sac 10 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Maïs', prix: 3500, unite: 'sac 25 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Maïs', prix: 13000, unite: 'sac 100 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },

      // --- MIL ROUGE ---
      { nom: 'Mil Rouge', prix: 100, unite: 'sachet 1 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Mil Rouge', prix: 600, unite: 'sac 5 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Mil Rouge', prix: 1200, unite: 'sac 10 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Mil Rouge', prix: 2800, unite: 'sac 25 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Mil Rouge', prix: 9500, unite: 'sac 100 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },

      // --- SORGHO ---
      { nom: 'Sorgho', prix: 150, unite: 'sachet 1 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Sorgho', prix: 700, unite: 'sac 5 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Sorgho', prix: 1300, unite: 'sac 100 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Sorgho', prix: 3000, unite: 'sac 25 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' },
      { nom: 'Sorgho', prix: 13000, unite: 'sac 100 kg', categorie: 'Céréales', localisation: 'Maroua / Cantons (Guinglaye, Balda, Mororo, Bogo centre)' }
    ];

    console.log('⏳ Nettoyage de l\'ancienne collection...');
    await Produit.deleteMany({});

    console.log('⏳ Insertion des nouveaux produits (sachet 1kg, sacs 5kg, 10kg, 25kg, 100kg)...');
    await Produit.collection.insertMany(produitsExemple);

    console.log('🎉 BASE DE DONNÉES PEUPLÉE AVEC SUCCÈS !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du peuplement :', error.message);
    process.exit(1);
  }
}

seedDatabase();