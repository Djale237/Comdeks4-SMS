const express = require('express');
const router = express.Router();
const { obtenirVueEnsemble } = require('../controllers/statsController');
const protect = require('../middlewares/protect');
const autoriser = require('../middlewares/autoriser');

// Réservé admin : ce sont des données agrégées sur tous les utilisateurs/cantons
router.get('/', protect, autoriser('admin'), obtenirVueEnsemble);

module.exports = router;