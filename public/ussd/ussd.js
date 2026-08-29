let currentHistory = [];
let phoneNumber = '';
let serviceCode = '';
let isEnded = false;

const screenEl = document.getElementById('screen');
const startForm = document.getElementById('start-form');
const sessionControls = document.getElementById('session-controls');
const choiceForm = document.getElementById('choice-form');
const userInputEl = document.getElementById('userInput');
const btnCancel = document.getElementById('btn-cancel');

// 1. Démarrer la session USSD
startForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  phoneNumber = document.getElementById('phone').value;
  serviceCode = document.getElementById('serviceCode').value;

  currentHistory = [];
  isEnded = false;
  await appelerBackend('');

  startForm.style.display = 'none';
  sessionControls.style.display = 'flex';
  choiceForm.style.display = 'flex';
  btnCancel.textContent = 'Annuler / Raccrocher';
});

// 2. Envoyer un choix
choiceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputVal = userInputEl.value.trim();
  if (!inputVal || isEnded) return;

  currentHistory.push(inputVal);
  const textPayload = currentHistory.join('*');

  await appelerBackend(textPayload);
  userInputEl.value = '';
});

// 3. Bouton Annuler / Fermer
btnCancel.addEventListener('click', réinitialiserSession);

// Fonction de requête HTTP
async function appelerBackend(text) {
  try {
    screenEl.textContent = 'Chargement...';

    const res = await fetch('/api/ussd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        sessionId: `session_${Date.now()}`,
        serviceCode: serviceCode,
        phoneNumber: phoneNumber,
        text: text
      })
    });

    const data = await res.text();
    const cleanText = data.replace(/^(CON|END)\s*/, '');
    screenEl.textContent = cleanText;

    if (data.startsWith('END')) {
      isEnded = true;
      choiceForm.style.display = 'none';
      btnCancel.textContent = 'Fermer';
    }
  } catch (err) {
    screenEl.textContent = 'Erreur de connexion avec le serveur.';
    isEnded = true;
    choiceForm.style.display = 'none';
    btnCancel.textContent = 'Fermer';
  }
}

function réinitialiserSession() {
  currentHistory = [];
  isEnded = false;
  screenEl.textContent = 'Composez le code USSD pour démarrer.';
  startForm.style.display = 'flex';
  sessionControls.style.display = 'none';
  userInputEl.value = '';
}