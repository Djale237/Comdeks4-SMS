// middlewares/validateEnumParams.js
const Produit = require('../models/Produit');

const capitaliser = (texte) => {
    if (!texte) return '';
    return texte.charAt(0).toUpperCase() + texte.slice(1).toLowerCase();
};

const validateEnumParams = (req, res, next) => {
    // Récupération sécurisée des enums au moment de la requête
    const cantonPath = Produit.schema.path('canton');
    const nomPath = Produit.schema.path('nom');

    const CANTONS_VALIDES = (cantonPath && cantonPath.enumValues) ? cantonPath.enumValues : [];
    const PRODUITS_VALIDES = (nomPath && nomPath.enumValues) ? nomPath.enumValues : [];

    if (req.params.canton) req.params.canton = capitaliser(req.params.canton);
    if (req.params.nom) req.params.nom = capitaliser(req.params.nom);

    const { canton, nom } = req.params;

    // Validation du canton si la liste enum existe dans le Schema
    if (canton && CANTONS_VALIDES.length > 0 && !CANTONS_VALIDES.includes(canton)) {
        return res.status(400).json({
            success: false,
            error: `Canton invalide. Valeurs acceptées: ${CANTONS_VALIDES.join(', ')}`
        });
    }

    // Validation du produit si la liste enum existe dans le Schema
    if (nom && PRODUITS_VALIDES.length > 0 && !PRODUITS_VALIDES.includes(nom)) {
        return res.status(400).json({
            success: false,
            error: `Produit invalide. Valeurs acceptées: ${PRODUITS_VALIDES.join(', ')}`
        });
    }

    next();
};

module.exports = validateEnumParams;