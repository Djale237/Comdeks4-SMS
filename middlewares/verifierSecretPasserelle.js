const verifierSecretPasserelle = (req, res, next) => {
    if (req.query.secret !== process.env.GATEWAY_SECRET) {
        return res.status(403).send('Acces refuse');
    }
    next();
};

module.exports = verifierSecretPasserelle;