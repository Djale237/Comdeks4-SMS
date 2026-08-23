const asyncHandler = require('../middlewares/asyncHandler');
const assistantService = require('../services/assistantService');

exports.demander = asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Le champ "question" est requis' 
        });
    }

    const reponse = await assistantService.demanderAssistant(question.trim());

    res.json({ 
        success: true, 
        data: { reponse } 
    });
});