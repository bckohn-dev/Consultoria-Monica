import { db } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  const { id, quartos, precoMin, precoMax, garagem, suite } = req.query;

  try {
    // 🔍 Se estiver buscando por campo 'id' (slug público)
    if (id) {
      const snapshot = await db.collection('imoveis').where('id', '==', id).limit(1).get();
      if (snapshot.empty) {
        return res.status(404).json({ error: 'Imóvel não encontrado.' });
      }
      const doc = snapshot.docs[0];
      return res.status(200).json({ id: doc.id, ...doc.data() });
    }

    // 🔍 Caso contrário, listagem com filtros
    const snapshot = await db.collection('imoveis').get();
    const imoveis = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const resultado = imoveis.filter(imovel => {
      const quartosNum = Number(imovel.quartos);
      const precoNum = Number(imovel.preco);

      if (quartos) {
        const filtroQuartos = parseInt(quartos);
        if (!isNaN(filtroQuartos)) {
          if (filtroQuartos === 3 && quartosNum < 3) return false;
          if (filtroQuartos < 3 && quartosNum !== filtroQuartos) return false;
        }
      }

      if (precoMin) {
        const min = parseFloat(precoMin);
        if (!isNaN(min) && precoNum < min) return false;
      }

      if (precoMax) {
        const max = parseFloat(precoMax);
        if (!isNaN(max) && precoNum > max) return false;
      }

      if (garagem !== undefined) {
        const filtroGaragem = garagem === 'true';
        const imovelGaragem = !!imovel.garagem;
        if (imovelGaragem !== filtroGaragem) return false;
      }

      if (suite !== undefined) {
        const filtroSuite = suite === 'true';
        const imovelSuite = !!imovel.suite;
        if (imovelSuite !== filtroSuite) return false;
      }

      return true;
    });

    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return res.status(500).json({ error: 'Erro ao buscar imóveis com filtros.' });
  }
}
