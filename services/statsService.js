const Utilisateur = require('../models/Utilisateur');
const Produit = require('../models/Produit');
const Alerte = require('../models/Alerte');
const CalendrierAgricole = require('../models/CalendrierAgricole');

const obtenirVueEnsemble = async () => {
    const [
        totalUtilisateurs,
        utilisateursParCanton,
        utilisateursParRole,
        totalProduits,
        produitsParCategorie,
        totalAlertes,
        alertesParType,
        dernieresAlertes,
        totalCalendriers
    ] = await Promise.all([
        Utilisateur.countDocuments(),
        Utilisateur.aggregate([
            { $group: { _id: '$canton', total: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]),
        Utilisateur.aggregate([
            { $group: { _id: '$role', total: { $sum: 1 } } }
        ]),
        Produit.countDocuments(),
        Produit.aggregate([
            { $group: { _id: '$categorie', total: { $sum: 1 } } }
        ]),
        Alerte.countDocuments(),
        Alerte.aggregate([
            { $group: { _id: '$type', total: { $sum: 1 } } }
        ]),
        Alerte.find({}).sort({ createdAt: -1 }).limit(5).select('type titre nombreDestinataires statut createdAt'),
        CalendrierAgricole.countDocuments()
    ]);

    return {
        utilisateurs: {
            total: totalUtilisateurs,
            parCanton: utilisateursParCanton.map(g => ({ canton: g._id || 'Non renseigné', total: g.total })),
            parRole: utilisateursParRole.map(g => ({ role: g._id, total: g.total }))
        },
        produits: {
            total: totalProduits,
            parCategorie: produitsParCategorie.map(g => ({ categorie: g._id, total: g.total }))
        },
        alertes: {
            total: totalAlertes,
            parType: alertesParType.map(g => ({ type: g._id, total: g.total })),
            recentes: dernieresAlertes
        },
        calendriers: {
            total: totalCalendriers
        }
    };
};

module.exports = { obtenirVueEnsemble };