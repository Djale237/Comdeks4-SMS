require('dotenv').config();

// Correctif DNS Windows
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');

// --- IMPORTS DES MODÈLES ET ROUTES ---
const Produit = require('./models/Produit');
const produitRoutes = require('./routes/produitRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(express.static(__dirname));

// Initialisation SDK Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Connexion BDD MongoDB Atlas
console.log('⏳ Connexion à MongoDB Atlas en cours...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err.message));

// ==========================================
// 1. ROUTES D'AUTHENTIFICATION & PRODUITS
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/produits', produitRoutes);

// ==========================================
// 2. ROUTE ASSISTANT IA AGRICOLE BOGO
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un message.' });
    }

    const produitsBDD = await Produit.find();
    const contextePrix = JSON.stringify(produitsBDD, null, 2);

    const promptSysteme = `
Tu es un assistant agricole virtuel intelligent pour la région de Bogo (Extrême-Nord du Cameroun).
Voici la liste des produits et tarifs réels enregistrés en base de données :

${contextePrix}

Consignes :
1. Réponds de manière polie, claire et concise.
2. Donne les prix exacts en FCFA selon les formats disponibles (sachet 1 kg, sac 5 kg, sac 10 kg, sac 25 kg, sac 100 kg).
3. Si la demande concerne Guinglaye, Balda, Mororo ou Bogo centre, confirme que ces tarifs s'appliquent à ces zones.

Question : "${message}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: promptSysteme,
    });

    const texteReponse = typeof response.text === 'function' ? response.text() : response.text;

    res.status(200).json({
      success: true,
      reponse: texteReponse
    });

  } catch (error) {
    console.error('❌ Erreur détaillée Gemini :', error);

    const isQuotaError = 
      error.status === 429 || 
      (error.message && (error.message.includes("429") || error.message.includes("Quota exceeded")));

    if (isQuotaError) {
      return res.status(200).json({
        success: true,
        reponse: "L'assistant agricole est temporairement très sollicité (limite de requêtes gratuites atteinte). Veuillez repatienter 1 à 2 minutes avant d'envoyer votre prochain message."
      });
    }

    res.status(500).json({
      success: false,
      message: `Erreur serveur : ${error.message}`
    });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));