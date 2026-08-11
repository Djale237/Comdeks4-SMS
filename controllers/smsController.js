const Produit = require('../models/Produit');
const { obtenirProduit } = require('../services/produitService');
const { envoyerSms } = require('../services/smsService');
const { normaliser } = require('../utils/normaliserTexte');

const CANTONS = Produit.schema.path('canton') ? Produit.schema.path('canton').enumValues : ['Mororo', 'Balda', 'Mokolo'];
const PRODUITS = Produit.schema.path('nom').enumValues;

const CANTONS_PAR_CLE = Object.fromEntries(CANTONS.map((c) => [normaliser(c), c]));
const PRODUITS_PAR_CLE = Object.fromEntries(PRODUITS.map((p) => [normaliser(p), p]));

const gererSms = async (req, res) => {
    // Accusé de réception immédiat à la passerelle (section 6.7 du document)
    res.sendStatus(200);

    const { from, text = '' } = req.body;
    const mots = text.trim().split(/\s+/).map(normaliser);

    try {
        if (mots[0] !== 'PRIX' || mots.length < 3) {
            await envoyerSms(from, 'Format invalide. Envoyez PRIX PRODUIT CANTON');
            return;
        }

        const nom = PRODUITS_PAR_CLE[mots[1]];
        const canton = CANTONS_PAR_CLE[mots[2]];

        if (!nom || !canton) {
            await envoyerSms(from, 'Produit ou canton non reconnu. Ex: PRIX MAIS MORORO');
            return;
        }

        const produit = await obtenirProduit(canton, nom);
        const message = produit
            ? `${produit.nom} a ${produit.canton}: ${produit.prix} FCFA/${produit.unite}.`
            : `Aucune donnee disponible pour ${nom} a ${canton}.`;

        await envoyerSms(from, message);
    } catch (error) {
        console.error('Erreur SMS:', error.message);
        await envoyerSms(from, 'Une erreur est survenue. Veuillez reessayer plus tard.');
    }
};

module.exports = { gererSms };