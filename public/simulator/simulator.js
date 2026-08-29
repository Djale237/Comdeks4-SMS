const smsForm = document.getElementById('smsForm');
const smsText = document.getElementById('smsText');
const phoneNum = document.getElementById('phoneNum');
const chatBox = document.getElementById('chatBox');

smsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = smsText.value.trim();
  const from = phoneNum.value.trim();

  if (!text) return;

  // Afficher le message envoyé dans le chat
  appendMessage(text, 'sent');
  smsText.value = '';

  try {
    // Envoi de la requête au backend (compatible Africa's Talking / Express)
    const response = await fetch('/api/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text: text, from: from })
    });

    const data = await response.text();
    
    // Afficher la réponse du serveur dans la bulle SMS
    appendMessage(data || "Aucune réponse reçue du serveur.", 'received');
  } catch (err) {
    appendMessage("❌ Erreur de connexion avec le serveur backend.", 'system');
  }
});

function appendMessage(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}