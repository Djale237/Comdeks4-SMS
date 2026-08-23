// middlewares/limiterAssistant.js
const rateLimit = require('express-rate-limit');

// Limite le nombre de requêtes à l'assistant IA
const limiterAssistant = rateLimit({
    windowMs: 60 * 1000, // Fenêtre de 1 minute
    max: 10, // Maximum 10 questions par minute par adresse IP
    message: { 
        success: false, 
        error: 'Trop de requêtes. Veuillez patienter une minute avant de réessayer.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiterAssistant;