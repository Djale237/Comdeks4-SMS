// routes/assistantRoutes.js
const express = require('express');
const router = express.Router();
const { demander } = require('../controllers/assistantController');
const limiterAssistant = require('../middlewares/limiterAssistant');

// Route POST protégée par la limitation de débit
router.post('/', limiterAssistant, demander);

module.exports = router;