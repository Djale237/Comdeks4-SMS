const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    // Numéro de téléphone comme identifiant principal (adapté au contexte SMS/USSD)
    telephone: {
      type: String,
      required: [true, 'Le numéro de téléphone est obligatoire'],
      unique: true,
      trim: true
    },
    motDePasse: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
      select: false // Exclu par défaut des requêtes pour ne jamais exposer le hash
    },
    role: {
      type: String,
      enum: ['agriculteur', 'commercant', 'admin'],
      default: 'agriculteur'
    },
    canton: {
      type: String,
      enum: ['Mororo', 'Guinglaye', 'Balda']
    }
  },
  { timestamps: true }
);

// Hachage automatique avant sauvegarde (seulement si le mot de passe est modifié)
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// Méthode pour comparer le mot de passe saisi avec le hash en base
utilisateurSchema.methods.comparerMotDePasse = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);