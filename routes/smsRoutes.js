const express = require('express');
const router = express.Router();
const { gererSms } = require('../controllers/smsController');
const verifierSecretPasserelle = require('../middlewares/verifierSecretPasserelle');

router.post('/', gererSms);

module.exports = router;