const express = require('express');
const router = express.Router();
const { gererUssd } = require('../controllers/ussdController');
const verifierSecretPasserelle = require('../middlewares/verifierSecretPasserelle');

router.post('/', verifierSecretPasserelle, gererUssd);

module.exports = router;