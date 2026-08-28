const mongoose = require('mongoose');

const alerteSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['climatique', 'phytosanitaire', 'marche'],
      required: [true, 'Le type d\'alerte est obligatoire']
    },
    titre: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Le message est obligatoire'],
      trim: true,
      maxlength: [300, 'Le message ne doit pas dépasser 300 caractères (contrainte SMS)']
    },
    // Vide ou absent = alerte envoyée à tous les cantons
    cantonsConcernes: {
      type: [String],
      enum: ['Mororo', 'Guinglaye', 'Balda'],
      default: []
    },
    creePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true
    },
    nombreDestinataires: {
      type: Number,
      default: 0
    },
    statut: {
      type: String,
      enum: ['en_attente', 'envoyee', 'echec'],
      default: 'en_attente'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alerte', alerteSchema);