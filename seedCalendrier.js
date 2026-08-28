// Script à exécuter une seule fois : node seedCalendrier.js
// Remplit les calendriers Maïs / Mil / Sorgho avec des données de base.
// ⚠️ Ces périodes sont indicatives (climat sahélo-soudanien, Extrême-Nord) —
// à faire valider/ajuster par les techniciens agricoles d'AJEOV avant mise en production.

require('dotenv').config();
const mongoose = require('mongoose');
const CalendrierAgricole = require('./models/CalendrierAgricole');

const donnees = [
    {
        culture: 'Maïs',
        etapes: [
            { nom: 'Préparation du sol', periode: 'Avril - Mai', conseil: 'Labour et epandage de fumure organique avant les premieres pluies.' },
            { nom: 'Semis', periode: 'Mai - Juin', conseil: 'Semer des les premieres pluies utiles (apres 20-30mm cumules).' },
            { nom: 'Entretien / Sarclage', periode: 'Juin - Aout', conseil: 'Sarclage et apport d\'engrais NPK puis uree en couverture.' },
            { nom: 'Surveillance phytosanitaire', periode: 'Juillet - Septembre', conseil: 'Surveiller la chenille legionnaire d\'automne sur les jeunes pousses.' },
            { nom: 'Récolte', periode: 'Septembre - Octobre', conseil: 'Recolter a maturite complete, secher avant stockage.' }
        ]
    },
    {
        culture: 'Mil',
        etapes: [
            { nom: 'Préparation du sol', periode: 'Avril - Mai', conseil: 'Preparation legere du sol, adapte aux sols sableux.' },
            { nom: 'Semis', periode: 'Juin - Juillet', conseil: 'Semis en poquets apres installation des pluies.' },
            { nom: 'Entretien / Sarclage', periode: 'Juillet - Aout', conseil: 'Demariage et sarclage precoce pour limiter la concurrence des adventices.' },
            { nom: 'Récolte', periode: 'Octobre - Novembre', conseil: 'Recolte des epis a maturite, avant les premieres attaques d\'oiseaux granivores.' }
        ]
    },
    {
        culture: 'Sorgho',
        etapes: [
            { nom: 'Préparation du sol', periode: 'Avril - Mai', conseil: 'Labour profond recommande sur sols lourds argileux.' },
            { nom: 'Semis', periode: 'Juin - Juillet', conseil: 'Semis direct ou repiquage selon la variete (sorgho de saison ou de decrue).' },
            { nom: 'Entretien / Sarclage', periode: 'Juillet - Septembre', conseil: 'Sarclage regulier, surveillance de la mouche des pousses en debut de cycle.' },
            { nom: 'Récolte', periode: 'Novembre - Decembre', conseil: 'Recolte tardive selon variete, secher avant battage.' }
        ]
    }
];

const executer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        for (const item of donnees) {
            await CalendrierAgricole.findOneAndUpdate(
                { culture: item.culture },
                item,
                { upsert: true, new: true, runValidators: true }
            );
            console.log(`✅ Calendrier "${item.culture}" enregistré`);
        }

        console.log('🌾 Seed terminé.');
    } catch (error) {
        console.error('Erreur seed calendrier:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

executer();