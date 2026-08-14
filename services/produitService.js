// services/produitService.js
// Couche de service qui centralise l'accès aux données Produit,
// indépendamment du canal qui la consomme (API REST, USSD, SMS, etc.).
const Produit = require('../models/Produit');

const obtenirProduit = async (canton, nom) => {
    return await Produit.findOne({
        $or: [
            { canton: { $regex: new RegExp(canton, 'i') } },
            { localisation: { $regex: new RegExp(canton, 'i') } }
        ],
        nom: { $regex: new RegExp(nom, 'i') }
    });
};

const listerProduitsParCanton = async (canton) => {
    const produits = await Produit.find({
        $or: [
            { canton: { $regex: new RegExp(canton, 'i') } },
            { localisation: { $regex: new RegExp(canton, 'i') } }
        ]
    }).sort({ nom: 1 });

    // Si aucun filtre strict ne correspond, retourne tous les produits disponibles
    if (!produits || produits.length === 0) {
        return await Produit.find().sort({ nom: 1 });
    }

    return produits;
};

module.exports = { obtenirProduit, listerProduitsParCanton };