// models/Produit.js (Version MISE À JOUR pour Djenabou)
const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Un produit doit avoir un nom'],
        trim: true,
        // ✅ MODIFICATION : "Maïs" tout court est maintenant autorisé
        enum: ['Mil Rouge', 'Sorgho', 'Maïs', 'Fourrage Hydroponique (Orge)']
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
        // ✅ MODIFICATION : Ajout des nouvelles tailles de sacs
        enum: ['1kg', '5kg', '15kg', '25kg', '100kg']
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