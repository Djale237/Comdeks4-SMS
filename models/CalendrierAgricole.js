const mongoose = require('mongoose');

const etapeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom de l\'étape est obligatoire'],
      trim: true
      // Ex: "Préparation du sol", "Semis", "Entretien/Sarclage", "Traitement phytosanitaire", "Récolte"
    },
    periode: {
      type: String,
      required: [true, 'La période est obligatoire'],
      trim: true
      // Ex: "Mai - Juin"
    },
    conseil: {
      type: String,
      trim: true,
      maxlength: [300, 'Le conseil ne doit pas dépasser 300 caractères (contrainte SMS)']
    }
  },
  { _id: false }
);

const calendrierSchema = new mongoose.Schema(
  {
    culture: {
      type: String,
      enum: ['Maïs', 'Mil', 'Sorgho'],
      required: [true, 'La culture est obligatoire'],
      unique: true
    },
    etapes: {
      type: [etapeSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CalendrierAgricole', calendrierSchema);