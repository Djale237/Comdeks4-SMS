const { GoogleGenerativeAI } = require('@google/generative-ai');
const Produit = require('../models/Produit');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Recherche locale directe dans MongoDB si l'IA est hors quota
const rechercheSecoursLocal = (produits, question) => {
    const q = question.toLowerCase();
    
    // Filtrage des produits qui correspondent aux mots de la question
    const trouves = produits.filter(p => {
        const nom = (p.nom || '').toLowerCase();
        const zones = (p.localisation || '').toLowerCase();
        return q.includes(nom) || zones.split(',').some(z => q.includes(z.trim().toLowerCase()));
    });

    if (trouves.length > 0) {
        const details = trouves.map(p => `${p.nom} à ${p.prix} FCFA (${p.unite})`).join(', ');
        return `[Mode Secours] Résultats trouvés en base : ${details}.`;
    }

    return "Désolé, aucun produit correspondant n'a été trouvé dans la base de données.";
};

const demanderAssistant = async (question) => {
    const produitsEnBase = await Produit.find({});

    if (!produitsEnBase || produitsEnBase.length === 0) {
        return "La base de données est actuellement vide.";
    }

    // 1. Tentative via l'API Gemini
    try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });

        const donneesBD = produitsEnBase.map(p => 
            `- Produit: ${p.nom}, Prix: ${p.prix} FCFA, Unité: ${p.unite}, Zones: ${p.localisation || 'Non spécifiée'}`
        ).join('\n');

        const prompt = `Tu es l'assistant de COMDEKS4. Réponds à la question en t'appuyant uniquement sur ces données :\n${donneesBD}\n\nQuestion : ${question}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.warn('[Assistant API Indisponible] Basculement sur la recherche locale...');
        // 2. Si l'API échoue (quota, réseau, 404), on renvoie la réponse locale
        return rechercheSecoursLocal(produitsEnBase, question);
    }
};

module.exports = {
    demanderAssistant
};