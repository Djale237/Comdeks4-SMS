const asyncHandler = require('../middlewares/asyncHandler');
const statsService = require('../services/statsService');

// GET /api/stats — vue d'ensemble pour le tableau de bord (admin uniquement)
exports.obtenirVueEnsemble = asyncHandler(async (req, res) => {
    const stats = await statsService.obtenirVueEnsemble();
    res.json({ success: true, data: stats });
});