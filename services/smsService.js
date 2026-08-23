const AfricasTalking = require('africastalking')({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
});

const sms = AfricasTalking.SMS;

const envoyerSms = async (destinataire, message) => {
    try {
        if (!destinataire) {
            console.error('Erreur SMS: Aucun destinataire fourni');
            return;
        }

        const options = {
            to: [destinataire],
            message: message
        };

        // On n'ajoute 'from' que si la variable existe vraiment
        if (process.env.AT_SENDER_ID) {
            options.from = process.env.AT_SENDER_ID;
        }

        await sms.send(options);
        console.log(`✅ SMS envoyé avec succès à ${destinataire}`);
    } catch (error) {
        console.error('Erreur SMS:', error.message);
    }
};

module.exports = { envoyerSms };