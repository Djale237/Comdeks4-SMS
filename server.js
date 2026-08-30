require('dotenv').config();

// Correctif DNS Windows
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- IMPORTS DES MODÈLES ET ROUTES ---
const Produit = require('./models/Produit');
const produitRoutes = require('./routes/produitRoutes');
const authRoutes = require('./routes/authRoutes');
const ussdRoutes = require('./routes/ussdRoutes');
const smsRoutes = require('./routes/smsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const calendrierRoutes = require('./routes/calendrierRoutes');
const alerteRoutes = require('./routes/alerteRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
// Impératif pour les formulaires envoyés par les passerelles USSD/SMS
app.use(express.urlencoded({ extended: true }));

// --- PAGES STATIQUES & FRONTEND ---
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/simulator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'simulator', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html')));

// Connexion BDD MongoDB Atlas
console.log('⏳ Connexion à MongoDB Atlas en cours...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err.message));

// ==========================================
// 1. ROUTES DE L'APPLICATION
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/calendrier', calendrierRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/alertes', alerteRoutes);
app.use('/api/sms', smsRoutes);

// Route Assistant IA avec Function Calling
app.use('/api/assistant', assistantRoutes);

// Middlewares 404 et gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));