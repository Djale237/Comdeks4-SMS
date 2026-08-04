// seederManuel.js (Mis à jour pour les 3 cantons)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Produit = require('./models/Produit'); // Vérifie bien le chemin vers ton modèle
const connectDB = require('./config/db'); // Vérifie bien le chemin vers ta config db

// 1. Charger les variables d'environnement (.env)
dotenv.config();

// 2. Les données de terrain de Djenabou (Mis à jour avec Fourrage dans les 3 cantons)
const produitsDjenabou = [
    // --- Produits de base de MORORO ---
    {
        nom: 'MAIS',
        unite: 'SAC_15KG',
        description: 'Maïs grain collecté à la boutique AJEOV Mororo (Canton de Mororo)'
    },
    {
        nom: 'MIL',
        unite: 'SAC_15KG',
        description: 'Mil grain collecté à la boutique AJEOV Mororo (Canton de Mororo)'
    },
    {
        nom: 'SORGHO',
        unite: 'SAC_100KG', 
        description: 'Sorgho grain centralisé (Canton de Mororo)'
    },
    // --- FOURRAGE dans les 3 CANTONS ---
    {
        nom: 'FOURRAGE',
        unite: 'BOTTES_FOURRAGE',
        description: 'Fourrage hydroponique expérimental (COMDEKS4 - Canton de Mororo)'
    },
    {
        nom: 'FOURRAGE',
        unite: 'BOTTES_FOURRAGE',
        description: 'Fourrage hydroponique expérimental (COMDEKS4 - Canton de Guinglaye)'
    },
    {
        nom: 'FOURRAGE',
        unite: 'BOTTES_FOURRAGE',
        description: 'Fourrage hydroponique expérimental (COMDEKS4 - Canton de Balda)'
    }
];

// 3. Fonction d'importation
const importerDonnees = async () => {
    try {
        // Connexion à la base de données
        await connectDB();

        // Nettoyage de la collection existante (Optionnel mais recommandé pour tes tests)
        await Produit.deleteMany();
        console.log('🗑️ Collection Produits nettoyée.');

        // Insertion des nouvelles données
        const produitsInsertis = await Produit.insertMany(produitsDjenabou);
        console.log('✅ 6 Produits (incluant le fourrage pour les 3 cantons) insérés avec succès !');
        console.log(produitsInsertis);

        // Fermeture de la connexion
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