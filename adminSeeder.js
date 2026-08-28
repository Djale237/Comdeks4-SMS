// adminSeeder.js
// --- SCRIPT DE CRÉATION UNIQUE DU COMPTE ADMINISTRAREUR ---
// Ce script permet d'insérer le premier compte admin (Djenabou)
// directement dans MongoDB Atlas pour débuter les tests de sécurité.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Utilisateur = require('./models/Utilisateur'); // Vérifie bien le chemin vers ton modèle
const connectDB = require('./config/db'); // Vérifie bien le chemin vers ta config db

// 1. Charger les variables d'environnement (.env)
dotenv.config();

// 2. Fonction principale d'insertion
const creerAdmin = async () => {
    try {
        // --- DONNÉES DE L'ADMINISTRATEUR À CRÉER ---
        // Ce bloc doit impérativement être défini AVANT d'être utilisé.
        const adminData = {
            nom: 'Djenabou Admin Taskflow', // Ton nom complet
            telephone: '+237691986810',   // ⚠️ REMPLACE PAR TON VRAI NUMÉRO (Format international)
            motDePasse: 'Djale0809',   // ⚠️ REMPLACE PAR UN MOT DE PASSE TRÈS SOLIDE
            role: 'admin',                 // Obligatoire pour le nouveau modèle (Sécurisation)
            canton: 'Mororo'              // Obligatoire pour le nouveau modèle
        };
        // Connexion à MongoDB Atlas
        console.log('⏳ Connexion à MongoDB Atlas...');
        await connectDB();

        // 3. Vérifier si l'admin existe déjà (sécurité pour éviter les doublons)
        // Note : On utilise 'telephone' car c'est le nouvel identifiant unique.
        const adminExiste = await Utilisateur.findOne({ telephone: adminData.telephone });
        if (adminExiste) {
            console.log(`⚠️ Le compte Administrateur pour le numéro ${adminData.telephone} existe déjà.`);
            mongoose.connection.close();
            process.exit();
        }

        console.log(`⏳ Création du compte Administrateur pour ${adminData.nom}...`);

        // 4. Création de l'utilisateur
        // Note : Le hachage du mot de passe est géré AUTOMATIQUEMENT
        // par le middleware pre-save dans models/Utilisateur.js[cite: 1].
        const nouvelAdmin = await Utilisateur.create(adminData);

        console.log(`✅ Compte Administrateur créé avec succès pour ${nouvelAdmin.nom} !`);
        console.log('📱 Identifiant (Téléphone) :', nouvelAdmin.telephone);
        console.log('🔒 Le mot de passe a été haché de manière sécurisée (bcrypt).');

        // Fermeture propre de la connexion
        mongoose.connection.close();
        console.log('🔌 Connexion DB fermée.');
        process.exit();

    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'admin :', error.message);
        // Si l'erreur vient de la validation MongoDB, on ferme proprement
        if(mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Exécuter le script
creerAdmin();