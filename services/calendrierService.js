const CalendrierAgricole = require('../models/CalendrierAgricole');
const { normaliser } = require('../utils/normaliserTexte');

const CULTURES = ['Maïs', 'Mil', 'Sorgho'];
const CULTURES_PAR_CLE = Object.fromEntries(CULTURES.map((c) => [normaliser(c), c]));

const obtenirCalendrier = async (cultureBrute) => {
    const culture = CULTURES_PAR_CLE[normaliser(cultureBrute)] || cultureBrute;
    const calendrier = await CalendrierAgricole.findOne({ culture });
    return calendrier;
};

const obtenirTousLesCalendriers = async () => {
    return CalendrierAgricole.find({});
};

// Formatte le calendrier en texte court, adapté à un envoi SMS/USSD
const formaterPourSms = (calendrier) => {
    if (!calendrier || calendrier.etapes.length === 0) {
        return 'Calendrier non disponible pour cette culture.';
    }

    const lignes = calendrier.etapes
        .map((e) => `${e.nom} (${e.periode})`)
        .join(' | ');

    return `Calendrier ${calendrier.culture}: ${lignes}`;
};

// Crée ou remplace entièrement le calendrier d'une culture (upsert)
const definirCalendrier = async (culture, etapes) => {
    return CalendrierAgricole.findOneAndUpdate(
        { culture },
        { culture, etapes },
        { new: true, upsert: true, runValidators: true }
    );
};

module.exports = {
    CULTURES,
    obtenirCalendrier,
    obtenirTousLesCalendriers,
    formaterPourSms,
    definirCalendrier
};