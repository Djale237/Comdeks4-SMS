const Produit = require('../models/Produit');

const CANTONS = (Produit.schema.path('canton') && Produit.schema.path('canton').enumValues && Produit.schema.path('canton').enumValues.length > 0) 
    ? Produit.schema.path('canton').enumValues 
    : ['Mororo', 'Balda', 'Guinglaye'];

const PRODUITS = (Produit.schema.path('nom') && Produit.schema.path('nom').enumValues && Produit.schema.path('nom').enumValues.length > 0)
    ? Produit.schema.path('nom').enumValues
    : ['Maïs', 'Mil Rouge', 'Sorgho', 'Fourrage Hydroponique (Orge)'];

const gererUssd = async (req, res) => {
    res.set('Content-Type', 'text/plain');
    try {
        const { text = '' } = req.body;
        const etapes = text === '' ? [] : text.split('*');
        let reponse = '';

        if (etapes.length === 0) {
            reponse = 'CON Bienvenue sur COMDEKS4\n1. Consulter un prix\n2. Quitter';
        } else if (etapes.length === 1 && etapes[0] === '2') {
            reponse = "END Merci d'avoir utilise COMDEKS4.";
        } else if (etapes.length === 1 && etapes[0] === '1') {
            const menu = CANTONS.map((c, i) => `${i + 1}. ${c}`).join('\n');
            reponse = `CON Choisissez un canton:\n${menu}`;
        } else if (etapes.length === 2) {
            const canton = CANTONS[parseInt(etapes[1], 10) - 1];
            if (!canton) {
                reponse = 'END Choix invalide. Veuillez recommencer.';
            } else {
                const menu = PRODUITS.map((p, i) => `${i + 1}. ${p}`).join('\n');
                reponse = `CON Choisissez un produit:\n${menu}`;
            }
        } else if (etapes.length === 3) {
            const canton = CANTONS[parseInt(etapes[1], 10) - 1];
            const nom = PRODUITS[parseInt(etapes[2], 10) - 1];

            if (!canton || !nom) {
                reponse = 'END Choix invalide. Veuillez recommencer.';
            } else {
                const tousProduits = await Produit.find({
                    nom: { $regex: new RegExp(nom, 'i') },
                    $or: [
                        { canton: { $regex: new RegExp(canton, 'i') } },
                        { localisation: { $regex: new RegExp(canton, 'i') } }
                    ]
                });

                if (!tousProduits || tousProduits.length === 0) {
                    reponse = `END Aucune donnee disponible pour ${nom} a ${canton}.`;
                } else {
                    const unitesVues = new Set();
                    const produitsUniques = tousProduits.filter(p => {
                        const uniteSimplifiee = p.unite ? p.unite.toLowerCase().replace(/\s+/g, '') : '';
                        if (unitesVues.has(uniteSimplifiee) || uniteSimplifiee === '1kg') {
                            return false;
                        }
                        unitesVues.add(uniteSimplifiee);
                        return true;
                    });

                    const listePrix = produitsUniques
                        .map(p => `- ${p.unite || 'Unité'} : ${p.prix} FCFA`)
                        .join('\n');

                    reponse = `END Tarifs ${nom} (${canton}) :\n${listePrix}`;
                }
            }
        } else {
            reponse = 'END Session invalide. Veuillez recommencer.';
        }

        res.send(reponse);
    } catch (error) {
        console.error('Erreur USSD:', error.message);
        res.send('END Une erreur est survenue. Veuillez reessayer plus tard.');
    }
};

module.exports = { gererUssd };