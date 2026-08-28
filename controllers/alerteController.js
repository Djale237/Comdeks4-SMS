const asyncHandler = require('../middlewares/asyncHandler');
const alerteService = require('../services/alerteService');

// POST /api/alertes — réservé admin (voir routes/alerteRoutes.js)
exports.creerAlerte = asyncHandler(async (req, res) => {
    const { type, titre, message, cantonsConcernes } = req.body;

    if (!type || !titre || !message) {
        return res.status(400).json({
            success: false,
            error: 'Les champs "type", "titre" et "message" sont obligatoires'
        });
    }

    const alerte = await alerteService.creerEtDiffuserAlerte({
        type,
        titre,
        message,
        cantonsConcernes: cantonsConcernes || [],
        creePar: req.utilisateur._id
    });

    res.status(201).json({ success: true, data: alerte });
});

// GET /api/alertes — historique des alertes envoyées
exports.listerAlertes = asyncHandler(async (req, res) => {
    const alertes = await alerteService.listerAlertes();
    res.json({ success: true, data: alertes });
});