const normaliser = (texte = '') =>
    texte
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .trim();

module.exports = { normaliser };