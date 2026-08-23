require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERREUR : La variable GEMINI_API_KEY n'est pas définie dans ton .env !");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function testerModeles() {
    console.log("🔍 Vérification de la clé API et recherche des modèles valides...\n");
    try {
        const response = await ai.models.list();
        console.log("✅ SUCCÈS ! Voici la liste exacte des modèles utilisables sur TA clé :");
        console.log("-----------------------------------------------------------------");
        
        for await (const model of response) {
            // Affiche le nom exact à utiliser
            console.log(`• ${model.name.replace('models/', '')}`);
        }
    } catch (error) {
        console.error("❌ ÉCHEC :", error.message);
    }
}

testerModeles();