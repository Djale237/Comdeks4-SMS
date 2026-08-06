const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const asyncHandler = require('./asyncHandler'); // si présent dans ton projet, sinon bloc try/catch

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérifie si le header Authorization commence bien par 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentification requise' });
  }

  // Extrait le token
  const token = authHeader.split(' ')[1];

  try {
    // Vérifie le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attache l'utilisateur à la requête (sans le mot de passe)
    req.utilisateur = await Utilisateur.findById(decoded.id);

    if (!req.utilisateur) {
      return res.status(401).json({ success: false, error: 'Utilisateur introuvable' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token invalide ou expiré' });
  }
});

module.exports = protect;