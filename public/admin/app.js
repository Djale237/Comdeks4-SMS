document.addEventListener('DOMContentLoaded', () => {
  chargerProduits();
  chargerCalendrier();
  initFormulaires();
});

// Navigation entre les onglets du Dashboard
function changerOnglet(onglet) {
  document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
  document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

  const secCible = document.getElementById(`section-${onglet}`);
  const menuCible = document.getElementById(`menu-${onglet}`);

  if (secCible) secCible.style.display = 'block';
  if (menuCible) menuCible.classList.add('active');

  const titres = {
    vue: 'Panneau de Gestion Agricole',
    produits: 'Gestion des Produits et Prix',
    alertes: 'Diffusion d\'Alertes SMS',
    calendrier: 'Calendrier Agricole & Conseils'
  };
  document.getElementById('titre-page').innerText = titres[onglet] || 'Panneau de Gestion';
}

// 1. CHARGER ET AFFICHER LES PRODUITS AVEC MODIFICATION DE PRIX
async function chargerProduits() {
  const tableBody = document.getElementById('listeProduitsTable');
  try {
    const res = await fetch('/api/produits');
    const data = await res.json();
    const produits = Array.isArray(data) ? data : (data.data || []);
    
    document.getElementById('totalProduits').innerText = produits.length;
    tableBody.innerHTML = '';

    if (produits.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">Aucun produit disponible en base.</td></tr>';
      return;
    }

    produits.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><b>${p.nom}</b></td>
        <td>${p.categorie || 'Céréales'}</td>
        <td>${p.unite || 'N/A'}</td>
        <td>${p.localisation || p.canton || p.marche || 'Tous'}</td>
        <td>
          <input type="number" id="input-prix-${p._id}" value="${p.prix}" class="input-inline-prix"> FCFA
        </td>
        <td>
          <button onclick="modifierPrix('${p._id}')" class="btn-sm">Mettre à jour</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Erreur chargement produits:', err);
    if(tableBody) tableBody.innerHTML = '<tr><td colspan="6" style="color:red;">Erreur de connexion serveur.</td></tr>';
  }
}

// MODIFIER UN PRIX (PUT /api/produits/:id)
async function modifierPrix(id) {
  const input = document.getElementById(`input-prix-${id}`);
  if (!input) return;
  const nouveauPrix = input.value;
  
  try {
    const res = await fetch(`/api/produits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prix: Number(nouveauPrix) })
    });

    if (res.ok) {
      alert('✅ Prix mis à jour avec succès dans MongoDB Atlas !');
      chargerProduits();
    } else {
      const result = await res.json();
      alert(`❌ Échec de la mise à jour : ${result.message || 'Erreur serveur'}`);
    }
  } catch (err) {
    alert('❌ Erreur de réseau avec le serveur.');
  }
}

// 2. CHARGER LE CALENDRIER AGRICOLE
async function chargerCalendrier() {
  const container = document.getElementById('calendrierContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/calendrier');
    const data = await res.json();
    const calendriers = Array.isArray(data) ? data : (data.data || []);

    if (calendriers.length === 0) {
      container.innerHTML = '<p>Aucun calendrier enregistré.</p>';
      return;
    }

    let html = '';
    calendriers.forEach(c => {
      const nomCulture = c.culture || c.nom || 'Culture';
      html += `
        <div class="cal-card">
          <h4>🌾 Culture : ${nomCulture}</h4>
      `;

      if (c.etapes && Array.isArray(c.etapes) && c.etapes.length > 0) {
        html += '<ul style="padding-left: 20px;">';
        c.etapes.forEach(e => {
          html += `<li><b>${e.nom || e.etape || 'Étape'}</b> (${e.periode || 'N/A'}) : ${e.conseil || e.description || ''}</li>`;
        });
        html += '</ul>';
      } else {
        html += `<p>${c.conseil || c.description || 'Pas de détails fournis.'}</p>`;
      }

      html += '</div>';
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur calendrier:', err);
    container.innerHTML = '<p style="color:red;">Erreur de chargement du calendrier.</p>';
  }
}

// 3. ÉCOUTEURS DES FORMULAIRES (AJOUT PRODUIT, ALERTE, CALENDRIER)
function initFormulaires() {
  // Formulaire d'ajout de produit
  const fProduit = document.getElementById('ajoutProduitForm');
  if (fProduit) {
    fProduit.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('produitFeedback');
      
      const cantonChoisi = document.getElementById('pCanton').value;
      const rawCategorie = document.getElementById('pCategorie').value.trim();
      const rawUnite = document.getElementById('pUnite').value.trim();

      // Normalisation pour respecter les enums Mongoose
      // Exemple : "céréales" -> "Céréales", "Sac 10 kg" -> "sac 10 kg"
      const categorieFormatee = rawCategorie.charAt(0).toUpperCase() + rawCategorie.slice(1).toLowerCase();
      const uniteFormatee = rawUnite.toLowerCase();

      const payload = {
        nom: document.getElementById('pNom').value.trim(),
        categorie: categorieFormatee,
        unite: uniteFormatee,
        prix: Number(document.getElementById('pPrix').value),
        canton: cantonChoisi,
        localisation: cantonChoisi,
        marche: `Maroua / Cantons (${cantonChoisi})`
      };

      try {
        const res = await fetch('/api/produits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const result = await res.json();

        if (res.ok) {
          feedback.className = 'feedback success';
          feedback.innerText = '✅ Produit créé avec succès !';
          fProduit.reset();
          chargerProduits();
        } else {
          feedback.className = 'feedback error';
          const msgErreur = result.error || result.message || (result.errors ? Object.values(result.errors).map(e => e.message).join(', ') : JSON.stringify(result));
          feedback.innerText = `❌ Erreur : ${msgErreur}`;
        }
      } catch (err) {
        feedback.className = 'feedback error';
        feedback.innerText = '❌ Erreur de connexion au serveur.';
      }
    });
  }

  // Formulaire de diffusion d'alerte SMS
  const fAlerte = document.getElementById('alerteForm');
  if (fAlerte) {
    fAlerte.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('alerteFeedback');
      const payload = {
        type: document.getElementById('alerteType').value,
        titre: document.getElementById('alerteTitre').value,
        message: document.getElementById('alerteMessage').value,
        cantonsConcernes: document.getElementById('alerteCanton').value ? [document.getElementById('alerteCanton').value] : []
      };

      try {
        const res = await fetch('/api/alertes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          feedback.className = 'feedback success';
          feedback.innerText = '✅ Alerte envoyée par SMS avec succès !';
          fAlerte.reset();
        } else {
          feedback.className = 'feedback error';
          feedback.innerText = '❌ Échec de la diffusion de l\'alerte.';
        }
      } catch (err) {
        feedback.className = 'feedback error';
        feedback.innerText = '❌ Erreur de connexion réseau.';
      }
    });
  }

  // Formulaire d'ajout / mise à jour de calendrier
  const fCal = document.getElementById('calendrierForm');
  if (fCal) {
    fCal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('calFeedback');
      const payload = {
        culture: document.getElementById('calCulture').value.trim(),
        conseil: document.getElementById('calConseil').value.trim()
      };

      try {
        const res = await fetch('/api/calendrier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          feedback.className = 'feedback success';
          feedback.innerText = '✅ Calendrier enregistré avec succès !';
          fCal.reset();
          chargerCalendrier();
        } else {
          feedback.className = 'feedback error';
          feedback.innerText = '❌ Erreur lors de l\'enregistrement du calendrier.';
        }
      } catch (err) {
        feedback.className = 'feedback error';
        feedback.innerText = '❌ Erreur réseau.';
      }
    });
  }
}