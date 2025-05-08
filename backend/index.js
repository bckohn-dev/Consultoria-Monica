const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder
app.use('/imoveis', express.static(path.join(__dirname, 'uploads/imoveis')));

// Endpoint to list properties
app.get('/api/imoveis', async (req, res) => {
  try {
    const { precoMin, precoMax, quartos } = req.query;
    let query = db.collection('imoveis');

    if (precoMin) query = query.where('preco', '>=', parseInt(precoMin));
    if (precoMax) query = query.where('preco', '<=', parseInt(precoMax));
    if (quartos) query = query.where('quartos', '==', parseInt(quartos));

    const snapshot = await query.get();
    const imoveis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(imoveis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));