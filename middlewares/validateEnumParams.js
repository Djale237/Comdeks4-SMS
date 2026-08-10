// middlewares/validateEnumParams.js
const Produit = require('../models/Produit');

// Retourne la valeur enum correspondante (insensible à la casse), sinon la valeur d'origine
const normaliser = (texte, valeurs) => {
  if (!texte) return texte;
  const trouve = valeurs.find((v) => v.toLowerCase() === texte.toLowerCase());
  return trouve || texte;
};

const validateEnumParams = (req, res, next) => {
  const nomPath = Produit.schema.path('nom');
  const unitePath = Produit.schema.path('unite');

  const PRODUITS_VALIDES = nomPath ? nomPath.enumValues : [];
  const UNITES_VALIDES = unitePath ? unitePath.enumValues : [];

  // Normalise la casse pour accepter "mais", "SORGHO", "SAC 25 KG", etc.
  if (req.params.nom) req.params.nom = normaliser(req.params.nom, PRODUITS_VALIDES);
  if (req.params.unite) req.params.unite = normaliser(req.params.unite, UNITES_VALIDES);

  const { nom, unite } = req.params;

  if (nom && PRODUITS_VALIDES.length > 0 && !PRODUITS_VALIDES.includes(nom)) {
    return res.status(400).json({
      success: false,
      error: `Produit invalide. Valeurs acceptées: ${PRODUITS_VALIDES.join(', ')}`
    });
  }

  if (unite && UNITES_VALIDES.length > 0 && !UNITES_VALIDES.includes(unite)) {
    return res.status(400).json({
      success: false,
      error: `Unité invalide. Valeurs acceptées: ${UNITES_VALIDES.join(', ')}`
    });
  }

  next();
};

module.exports = validateEnumParams;