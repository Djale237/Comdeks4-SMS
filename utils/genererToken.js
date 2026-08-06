const jwt = require('jsonwebtoken');

const genererToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur._id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

module.exports = genererToken;