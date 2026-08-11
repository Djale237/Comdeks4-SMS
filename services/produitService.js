// services/produitService.js
// Couche de service qui centralise l'accès aux données Produit,
// indépendamment du canal qui la consomme (API REST, USSD, SMS, etc.).
const Produit = require('../models/Produit');

const obtenirProduit = async (canton, nom) => {
    return await Produit.findOne({ canton, nom });
};

const listerProduitsParCanton = async (canton) => {
    return await Produit.find({ canton }).sort({ nom: 1 });
};

module.exports = { obtenirProduit, listerProduitsParCanton };
