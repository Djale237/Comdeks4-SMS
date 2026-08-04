// models/Utilisateur.js
// --- MODÈLE UTILISATEUR CORRIGÉ (SANS FONCTION FLÉCHÉE) ---
// Cette version utilise des fonctions standards pour éviter l'erreur 'next is not a function'.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Utilisation explicite de bcryptjs

const utilisateurSchema = new mongoose.Schema(
    {
        // ... (tes champs restent les mêmes : nom, telephone, motDePasse, role, canton) ...
        nom: { type: String, required: [true, 'Le nom est obligatoire'] },
        telephone: { type: String, required: [true, 'Le téléphone est obligatoire'], unique: true },
        motDePasse: { type: String, required: [true, 'Le mot de passe est obligatoire'], select: false },
        role: { type: String, enum: ['agriculteur', 'commercant', 'admin'], default: 'agriculteur' },
        canton: { type: String, required: [true, 'Veuillez préciser votre canton'] }
    },
    { timestamps: true }
);

// --- LE MIDDLEWARE CORRIGÉ (PRE-SAVE) ---
// ⚠️ REGARDE BIEN ICI : declaration standard 'function(next)' OBLIGATOIRE
utilisateurSchema.pre('save', function(next) {
    const user = this; // 'this' fait reference à l'utilisateur en cours d'enregistrement

    // Si le mot de passe n'a pas été modifié (ex. simple mise à jour de profil), on passe
    if (!user.isModified('motDePasse')) {
        return next();
    }

    // Générer un 'salt' aléatoire
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err); // Passer l'erreur s'il y en a

        // Hacher le mot de passe avec le salt
        bcrypt.hash(user.motDePasse, salt, function(err, hash) {
            if (err) return next(err); // Passer l'erreur s'il y en a
            
            user.motDePasse = hash; // Remplacer le mot de passe en clair par le hash
            next(); // Appeler next pour continuer l'enregistrement
        });
    });
});

// ... (méthode de comparaison...) ...
utilisateurSchema.methods.comparerMotDePasse = async function (motDePasseSaisi) {
    return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);