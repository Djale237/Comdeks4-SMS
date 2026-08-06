const Produit = require('../models/Produit');

// 1. Lister tous les produits
exports.listerProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json({ success: true, count: produits.length, data: produits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Obtenir par canton et nom
exports.obtenirParCantonEtNom = async (req, res) => {
  try {
    const { canton, nom } = req.params;
    const produit = await Produit.findOne({ canton, nom });
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.status(200).json({ success: true, data: produit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Créer un produit
exports.creerProduit = async (req, res) => {
  try {
    const nouveauProduit = await Produit.create(req.body);
    res.status(201).json({ success: true, data: nouveauProduit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. Mettre à jour un produit
exports.mettreAJourProduit = async (req, res) => {
  try {
    const produitAjour = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: produitAjour });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Supprimer un produit
exports.supprimerProduit = async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};