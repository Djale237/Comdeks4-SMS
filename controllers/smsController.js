const Produit = require('../models/Produit');
const { envoyerSms } = require('../services/smsService');
const { normaliser } = require('../utils/normaliserTexte');

const CANTONS = (Produit.schema.path('canton') && Produit.schema.path('canton').enumValues && Produit.schema.path('canton').enumValues.length > 0)
    ? Produit.schema.path('canton').enumValues 
    : ['Mororo', 'Balda', 'Guinglaye'];

const PRODUITS = (Produit.schema.path('nom') && Produit.schema.path('nom').enumValues && Produit.schema.path('nom').enumValues.length > 0)
    ? Produit.schema.path('nom').enumValues
    : ['Maïs', 'Mil Rouge', 'Sorgho', 'Fourrage Hydroponique (Orge)'];

const CANTONS_PAR_CLE = Object.fromEntries(CANTONS.map((c) => [normaliser(c), c]));
const PRODUITS_PAR_CLE = Object.fromEntries(PRODUITS.map((p) => [normaliser(p), p]));

const gererSms = async (req, res) => {
    res.status(200).send('OK');

    const { from, text = '' } = req.body;
    
    // Nettoyage des mots de liaison
    const mots = text
        .trim()
        .replace(/\b(du|de|d|la|le)\b/gi, '')
        .split(/\s+/)
        .map(normaliser)
        .filter(Boolean);

    let reponseSms = '';

    try {
        if (mots[0] !== 'PRIX' || mots.length < 3) {
            reponseSms = 'Format invalide. Envoyez PRIX PRODUIT CANTON (Ex: PRIX MIL ROUGE BALDA)';
        } else {
            const cantonBrut = mots[mots.length - 1];
            const produitBrut = mots.slice(1, mots.length - 1).join(' ');

            const canton = CANTONS_PAR_CLE[cantonBrut] || cantonBrut;
            const nom = PRODUITS_PAR_CLE[produitBrut] || produitBrut;

            const produits = await Produit.find({
                nom: { $regex: new RegExp(nom, 'i') },
                $or: [
                    { canton: { $regex: new RegExp(canton, 'i') } },
                    { localisation: { $regex: new RegExp(canton, 'i') } }
                ]
            });

            if (!produits || produits.length === 0) {
                reponseSms = `Aucune donnee disponible pour ${nom} a ${canton}.`;
            } else {
                const unitesVues = new Set();
                const produitsUniques = produits.filter(p => {
                    const u = p.unite ? p.unite.toLowerCase().replace(/\s+/g, '') : '';
                    if (unitesVues.has(u) || u === '1kg') return false;
                    unitesVues.add(u);
                    return true;
                });

                const listePrix = produitsUniques
                    .map(p => `${p.unite || 'Unité'}: ${p.prix} FCFA`)
                    .join(', ');

                reponseSms = `${nom} a ${canton}: ${listePrix}.`;
            }
        }

        console.log(`\n----------------------------------------`);
        console.log(`📩 SMS reçu de : ${from}`);
        console.log(`💬 Message : "${text}"`);
        console.log(`📤 Réponse SMS préparée : "${reponseSms}"`);
        console.log(`----------------------------------------\n`);

        try {
            await envoyerSms(from, reponseSms);
        } catch (apiError) {
            console.log(`⚠️ (Mode Dev) L'API Africa's Talking a renvoyé ${apiError.message}`);
        }

    } catch (error) {
        console.error('Erreur traitement SMS:', error.message);
    }
};

module.exports = { gererSms };