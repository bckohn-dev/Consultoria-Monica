const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');
const serviceAccount = require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1); // Exit if initialization fails
}

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder (fixed case)
app.use('/imoveis', express.static(path.join(__dirname, 'Uploads/imoveis')));

// Endpoint to list properties
app.get('/api/imoveis', async (req, res) => {
  try {
    const { precoMin, precoMax, quartos } = req.query;
    let query = db.collection('imoveis');

    if (precoMin) query = query.where('preco', '>=', parseInt(precoMin));
    if (precoMax) query = query.where('preco', '<=', parseInt(precoMax));
    if (quartos) query = query.where('quartos', '==', parseInt(quartos));

    const snapshot = await query.get();
    console.log('Firestore snapshot size:', snapshot.size); // Log query result
    const imoveis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(imoveis);
  } catch (error) {
    console.error('Error in /api/imoveis:', error); // Detailed error log
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));