// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler'); // Importe ton asyncHandler existant (aaa.png)
const Utilisateur = require('../models/Utilisateur'); // Assure-toi que le nom du fichier est correct

// @desc    Middleware de protection (Vérification du token JWT)
// @access  Privé
exports.proteger = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Vérifier si le token est présent dans les headers (Authorization: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Récupérer le token (on sépare 'Bearer' du token réel)
      token = req.headers.authorization.split(' ')[1];

      // 2. Décoder et vérifier le token avec ta clé secrète (.env)
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Récupérer l'utilisateur à partir de l'ID du token (+ exclure le mot de passe pour la sécurité)
      req.utilisateur = await Utilisateur.findById(decode.id).select('-motDePasse');

      // Si l'utilisateur n'existe plus en BD
      if (!req.utilisateur) {
        res.status(401);
        throw new Error('Utilisateur non trouvé avec cet ID');
      }

      // Passer au middleware suivant
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Non autorisé, échec de la vérification du token');
    }
  }

  // Si pas de token dans les headers
  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, aucun token fourni');
  }
});

// @desc    Middleware d'autorisation (Vérification du rôle)
// @access  Privé
exports.autoriserRoles = (...roles) => {
  return (req, res, next) => {
    // req.utilisateur a été défini par le middleware 'proteger' juste avant
    // rôles possibles définis dans ton use case (image_1.png) : 'admin', 'producteur', 'acheteur'
    if (!req.utilisateur || !roles.includes(req.utilisateur.role)) {
      res.status(403); // Interdit (Forbidden)
      throw new Error(
        `Non autorisé, votre rôle '${req.utilisateur.role}' ne vous donne pas accès à cette ressource`
      );
    }
    // Si le rôle est autorisé
    next();
  };
};