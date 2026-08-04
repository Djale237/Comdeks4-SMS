const Produit = require('../models/Produit');

// Obtenir tous les produits
const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json({
      success: true,
      count: produits.length,
      data: produits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
};

module.exports = {
  getProduits
};const Produit = require('../models/Produit');

// Obtenir tous les produits
const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json({
      success: true,
      count: produits.length,
      data: produits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
};

module.exports = {
  getProduits
};