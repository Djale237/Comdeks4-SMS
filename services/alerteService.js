const Alerte = require('../models/Alerte');
const Utilisateur = require('../models/Utilisateur');
const { envoyerSms } = require('./smsService');

// Préfixe visuel selon le type, pour que le producteur identifie l'urgence dès les premiers mots du SMS
const PREFIXES = {
    climatique: '[ALERTE CLIMAT]',
    phytosanitaire: '[ALERTE MALADIE]',
    marche: '[INFO MARCHE]'
};

// Crée l'alerte en base, trouve les producteurs concernés (par canton) et diffuse par SMS.
// cantonsConcernes vide = tous les cantons.
const creerEtDiffuserAlerte = async ({ type, titre, message, cantonsConcernes = [], creePar }) => {
    const alerte = await Alerte.create({ type, titre, message, cantonsConcernes, creePar });

    const filtre = { role: 'agriculteur' };
    if (cantonsConcernes.length > 0) {
        filtre.canton = { $in: cantonsConcernes };
    }

    const destinataires = await Utilisateur.find(filtre).select('telephone');

    const prefixe = PREFIXES[type] || '[ALERTE]';
    const texteSms = `${prefixe} ${titre} - ${message}`.slice(0, 300);

    let envoisReussis = 0;

    for (const destinataire of destinataires) {
        try {
            await envoyerSms(destinataire.telephone, texteSms);
            envoisReussis += 1;
        } catch (error) {
            console.error(`Échec envoi alerte à ${destinataire.telephone}:`, error.message);
        }
    }

    alerte.nombreDestinataires = envoisReussis;
    alerte.statut = envoisReussis > 0 ? 'envoyee' : 'echec';
    await alerte.save();

    console.log(`📢 Alerte "${titre}" diffusée à ${envoisReussis}/${destinataires.length} producteur(s)`);

    return alerte;
};

const listerAlertes = async () => {
    return Alerte.find({}).populate('creePar', 'nom role').sort({ createdAt: -1 });
};

module.exports = { creerEtDiffuserAlerte, listerAlertes };