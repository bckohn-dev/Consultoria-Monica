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
    console.log('Firestore snapshot size:', snapshot.size); // Log query result
    const imoveis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(imoveis);
  } catch (error) {
    console.error('Error in /api/imoveis:', error); // Detailed error log
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para adicionar um imóvel
app.post('/api/imoveis', async (req, res) => {
  try {
    const novoImovel = req.body;
    const docRef = await db.collection('imoveis').add(novoImovel);
    res.status(201).json({ id: docRef.id, ...novoImovel });
  } catch (error) {
    console.error('Erro ao adicionar imóvel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para editar um imóvel
app.put('/api/imoveis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID recebido no backend:', id); // Log para depuração
    const dadosAtualizados = req.body;
    await db.collection('imoveis').doc(id).update(dadosAtualizados);
    res.json({ id, ...dadosAtualizados });
  } catch (error) {
    console.error('Erro ao editar imóvel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para remover um imóvel
app.delete('/api/imoveis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('imoveis').doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover imóvel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para buscar imagens do carrossel
app.get('/api/carrossel', async (req, res) => {
  try {
    const snapshot = await db.collection('carrossel').get();
    const carrossel = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome || data.Nome, // Padroniza o campo 'nome'
        foto: data.foto,
      };
    });
    res.json(carrossel);
  } catch (error) {
    console.error('Erro ao buscar carrossel:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));