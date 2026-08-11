const AfricasTalking = require('africastalking')({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
});

const sms = AfricasTalking.SMS;

const envoyerSms = async (destinataire, message) => {
    try {
        await sms.send({
            to: [destinataire],
            message,
            from: process.env.AT_SENDER_ID || undefined,
        });
    } catch (error) {
        console.error('Erreur SMS:', error.message);
    }
};

module.exports = { envoyerSms };
