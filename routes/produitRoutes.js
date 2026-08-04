const express = require('express');
const router = express.Router();
const { getProduits } = require('../controllers/produitController');

// Route GET pour récupérer la liste
router.get('/', getProduits);

module.exports = router;