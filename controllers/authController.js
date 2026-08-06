const Utilisateur = require('../models/Utilisateur');
const genererToken = require('../utils/genererToken');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/inscription
// @access  Public
exports.inscription = asyncHandler(async (req, res) => {
  const { nom, telephone, motDePasse, role, canton } = req.body;

  const utilisateur = await Utilisateur.create({
    nom,
    telephone,
    motDePasse,
    role,
    canton
  });

  res.status(201).json({
    success: true,
    data: {
      id: utilisateur._id,
      nom: utilisateur.nom,
      role: utilisateur.role,
      token: genererToken(utilisateur),
    },
  });
});

// @desc    Connexion d'un utilisateur existant
// @route   POST /api/auth/connexion
// @access  Public
exports.connexion = asyncHandler(async (req, res) => {
  const { telephone, motDePasse } = req.body;

  if (!telephone || !motDePasse) {
    return res.status(400).json({ success: false, error: 'Téléphone et mot de passe requis' });
  }

  // .select('+motDePasse') est indispensable car le champ est masqué par défaut dans le modèle
  const utilisateur = await Utilisateur.findOne({ telephone }).select('+motDePasse');

  // Message générique pour éviter l'énumération des comptes
  if (!utilisateur || !(await utilisateur.comparerMotDePasse(motDePasse))) {
    return res.status(401).json({ success: false, error: 'Identifiants invalides' });
  }

  res.json({
    success: true,
    data: {
      id: utilisateur._id,
      nom: utilisateur.nom,
      role: utilisateur.role,
      token: genererToken(utilisateur),
    },
  });
});