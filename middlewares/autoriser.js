// Middleware factory : n'autorise l'accès qu'aux rôles listés en argument.
// S'utilise APRÈS `protect`, qui a déjà attaché req.utilisateur.
const autoriser = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.utilisateur.role)) {
      return res.status(403).json({
        success: false,
        error: `Rôle '${req.utilisateur.role}' non autorisé pour cette action`,
      });
    }
    next();
  };
};

module.exports = autoriser;