const asyncHandler = require('../middlewares/asyncHandler');
const calendrierService = require('../services/calendrierService');

// GET /api/calendrier — liste des calendriers de toutes les cultures (public : utile aussi pour le futur frontend)
exports.listerCalendriers = asyncHandler(async (req, res) => {
    const calendriers = await calendrierService.obtenirTousLesCalendriers();
    res.json({ success: true, data: calendriers });
});

// GET /api/calendrier/:culture — calendrier d'une culture précise
exports.obtenirCalendrier = asyncHandler(async (req, res) => {
    const calendrier = await calendrierService.obtenirCalendrier(req.params.culture);

    if (!calendrier) {
        return res.status(404).json({ success: false, error: 'Culture introuvable' });
    }

    res.json({ success: true, data: calendrier });
});

// PUT /api/calendrier/:culture — admin uniquement : crée ou remplace les étapes d'une culture
exports.definirCalendrier = asyncHandler(async (req, res) => {
    const { etapes } = req.body;

    if (!Array.isArray(etapes) || etapes.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Le champ "etapes" doit être un tableau non vide (nom, periode, conseil)'
        });
    }

    if (!calendrierService.CULTURES.includes(req.params.culture)) {
        return res.status(400).json({
            success: false,
            error: `Culture invalide. Valeurs acceptées : ${calendrierService.CULTURES.join(', ')}`
        });
    }

    const calendrier = await calendrierService.definirCalendrier(req.params.culture, etapes);
    res.json({ success: true, data: calendrier });
});