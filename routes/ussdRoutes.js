const express = require('express');
const router = express.Router();
const { gererUssd } = require('../controllers/ussdController');
const verifierSecretPasserelle = require('../middlewares/verifierSecretPasserelle');

// Route POST pour traiter les sessions USSD
// En local/développement, on permet les appels directs du simulateur frontend
router.post('/', (req, res, next) => {
    // Si la requête vient d'Africa's Talking en prod, on peut vérifier le secret,
    // sinon on passe directement au contrôleur pour le simulateur local
    if (req.headers['x-at-secret'] || process.env.NODE_ENV === 'production') {
        return verifierSecretPasserelle(req, res, next);
    }
    next();
}, gererUssd);

module.exports = router;