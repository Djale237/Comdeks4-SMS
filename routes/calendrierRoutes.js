const express = require('express');
const router = express.Router();
const { listerCalendriers, obtenirCalendrier, definirCalendrier } = require('../controllers/calendrierController');
const protect = require('../middlewares/protect');
const autoriser = require('../middlewares/autoriser');

// Consultation publique (utile pour le frontend web comme pour tester rapidement)
router.get('/', listerCalendriers);
router.get('/:culture', obtenirCalendrier);

// Seul un admin peut créer/modifier un calendrier
router.put('/:culture', protect, autoriser('admin'), definirCalendrier);

module.exports = router;