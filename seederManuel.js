// seederManuel.js (Pour les 3 cantons, aligné sur le schéma Produit)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Produit = require('./models/Produit');
const connectDB = require('./config/db');

// 1. Charger les variables d'environnement (.env)
dotenv.config();

// 2. Les données de terrain (alignées sur les enums du modèle Produit)
const produitsDjenabou = [
    {
        nom: 'Maïs',
        unite: 'sac 10 kg',
        prix: 1500,
        categorie: 'Céréale',
        description: 'Maïs grain collecté à la boutique AJEOV Mororo (Canton de Mororo)',
        localisation: 'Boutique AJEOV Mororo (Canton de Mororo)'
    },
    {
        nom: 'Mil Rouge',
        unite: 'sac 100 kg',
        prix: 9500,
        categorie: 'Céréale',
        description: 'Mil grain collecté à la boutique AJEOV Mororo (Canton de Mororo)',
        localisation: 'Boutique AJEOV Mororo (Canton de Mororo)'
    },
    {
        nom: 'Sorgho',
        unite: 'sac 100 kg',
        prix: 13000,
        categorie: 'Céréale',
        description: 'Sorgho grain centralisé (Canton de Mororo)',
        localisation: 'Canton de Mororo'
    },
    {
        nom: 'Fourrage Hydroponique (Orge)',
        unite: 'sac 5 kg',
        prix: 2500,
        categorie: 'Alimentation Animale',
        description: 'Fourrage hydroponique expérimental (COMDEKS4 - Canton de Mororo)',
        localisation: 'COMDEKS4 - Canton de Mororo'
    },
    {
        nom: 'Fourrage Hydroponique (Orge)',
        unite: 'sac 5 kg',
        prix: 2500,
        categorie: 'Alimentation Animale',
        description: 'Fourrage hydroponique expérimental (COMDEKS4 - Canton de Guinglaye)',
        localisation: 'COMDEKS4 - Canton de Guinglaye'
    },
    {
        nom: 'Fourrage Hydroponique (Orge)',
        unite: 'sac 5 kg',
        prix: 2500,
        categorie: 'Alimentation Animale',
        description: 'Fourrage hydroponique expérimental (COMDEKS4 - Canton de Balda)',
        localisation: 'COMDEKS4 - Canton de Balda'
    }
];

// 3. Fonction d'importation
const importerDonnees = async () => {
    try {
        await connectDB();

        // Nettoyage de la collection existante
        await Produit.deleteMany();
        console.log('🗑️ Collection Produits nettoyée.');

        // Insertion des nouvelles données (validation Mongoose active)
        const produitsInsertis = await Produit.insertMany(produitsDjenabou);
        console.log(`✅ ${produitsInsertis.length} produits (incluant le fourrage pour les 3 cantons) insérés avec succès !`);

        mongoose.connection.close();
        console.log('🔌 Connexion DB fermée.');
        process.exit();

    } catch (error) {
        console.error('❌ Erreur lors de l\'importation :', error.message);
        process.exit(1);
    }
};

// 4. Lancer l'importation
importerDonnees();
