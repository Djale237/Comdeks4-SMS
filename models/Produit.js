// models/Produit.js (Version MISE À JOUR pour Djenabou)
const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Un produit doit avoir un nom'],
        trim: true,
        enum: ['Maïs', 'Mil Rouge', 'Sorgho', 'Fourrage Hydroponique (Orge)']
    },
    description: {
        type: String,
        trim: true
    },
    // ✅ MODIFICATION : Le champ 'description' a été SUPPRIMÉ

    prix: {
        type: Number,
        required: [true, 'Un produit doit avoir un prix'],
        min: [0, 'Le prix ne peut pas être négatif']
    },
    unite: {
        type: String,
        required: [true, 'Un produit doit avoir une unité'],
        enum: ['sachet 1 kg', 'sac 5 kg', 'sac 10 kg', 'sac 25 kg', 'sac 100 kg']
    },
    localisation: {
        type: String,
        required: [true, 'Une localisation est obligatoire']
    },
    categorie: {
        type: String,
        required: [true, 'Une catégorie est obligatoire'],
        // ✅ MODIFICATION : Seuls "Céréale" ou "Farine" sont autorisés
        enum: ['Céréale', 'Farine']
    },
    estEnVedette: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Produit', produitSchema);