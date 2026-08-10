const express = require('express');
const router = express.Router();

// Importation des contrôleurs
const {
  listerProduits,
  obtenirParNomEtUnite,
  creerProduit,
  mettreAJourProduit,
  supprimerProduit,
} = require('../controllers/produitController');

// Importation des middlewares
const validateEnumParams = require('../middlewares/validateEnumParams');
const protect = require('../middlewares/protect');
const autoriser = require('../middlewares/autoriser');

// --- ROUTES PUBLIQUES ---
router.get('/', listerProduits);
router.get('/:nom/:unite', validateEnumParams, obtenirParNomEtUnite);

// --- ROUTES PROTÉGÉES (Admin & Commerçant) ---
router.post('/', protect, autoriser('admin', 'commercant'), creerProduit);
router.put('/:id', protect, autoriser('admin', 'commercant'), mettreAJourProduit);
router.delete('/:id', protect, autoriser('admin'), supprimerProduit);

module.exports = router;