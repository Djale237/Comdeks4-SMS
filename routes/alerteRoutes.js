const express = require('express');
const router = express.Router();
const { creerAlerte, listerAlertes } = require('../controllers/alerteController');
const protect = require('../middlewares/protect');
const autoriser = require('../middlewares/autoriser');

// Seul un admin peut déclencher une alerte (évite qu'un compte compromis spamme tous les producteurs)
router.post('/', protect, autoriser('admin'), creerAlerte);

// admin + commercant peuvent consulter l'historique
router.get('/', protect, autoriser('admin', 'commercant'), listerAlertes);

module.exports = router;