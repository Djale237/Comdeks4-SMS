const Produit = require('../models/Produit');
const calendrierService = require('../services/calendrierService');

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
            // NOUVEAU : ajout de l'option 2 "Calendrier agricole", Quitter passe donc en position 3
            reponse = 'CON Bienvenue sur COMDEKS4\n1. Consulter un prix\n2. Calendrier agricole\n3. Quitter';
        } else if (etapes.length === 1 && etapes[0] === '3') {
            reponse = "END Merci d'avoir utilise COMDEKS4.";
        } else if (etapes.length === 1 && etapes[0] === '1') {
            const menu = CANTONS.map((c, i) => `${i + 1}. ${c}`).join('\n');
            reponse = `CON Choisissez un canton:\n${menu}`;
        } else if (etapes.length === 1 && etapes[0] === '2') {
            // NOUVEAU : sous-menu du calendrier agricole
            const menu = calendrierService.CULTURES.map((c, i) => `${i + 1}. ${c}`).join('\n');
            reponse = `CON Choisissez une culture:\n${menu}`;
        } else if (etapes.length === 2 && etapes[0] === '1') {
            const canton = CANTONS[parseInt(etapes[1], 10) - 1];
            if (!canton) {
                reponse = 'END Choix invalide. Veuillez recommencer.';
            } else {
                const menu = PRODUITS.map((p, i) => `${i + 1}. ${p}`).join('\n');
                reponse = `CON Choisissez un produit:\n${menu}`;
            }
        } else if (etapes.length === 2 && etapes[0] === '2') {
            // NOUVEAU : affichage du calendrier de la culture choisie
            const culture = calendrierService.CULTURES[parseInt(etapes[1], 10) - 1];
            if (!culture) {
                reponse = 'END Choix invalide. Veuillez recommencer.';
            } else {
                const calendrier = await calendrierService.obtenirCalendrier(culture);
                if (!calendrier || calendrier.etapes.length === 0) {
                    reponse = `END Calendrier non disponible pour ${culture}.`;
                } else {
                    const lignes = calendrier.etapes.map(e => `- ${e.nom}: ${e.periode}`).join('\n');
                    reponse = `END Calendrier ${culture}:\n${lignes}`;
                }
            }
        } else if (etapes.length === 3 && etapes[0] === '1') {
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