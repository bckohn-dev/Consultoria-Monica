import { db } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  const { id, quartos, precoMin, precoMax, garagem, suite } = req.query;

  try {
    // 🔍 Se estiver buscando por ID específico
    if (id) {
      const doc = await db.collection('imoveis').doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ erro: 'Imóvel não encontrado' });
      }
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

      // Filtro por quartos
      if (quartos) {
        const filtroQuartos = parseInt(quartos);
        if (!isNaN(filtroQuartos)) {
          if (filtroQuartos === 3 && quartosNum < 3) return false;
          if (filtroQuartos < 3 && quartosNum !== filtroQuartos) return false;
        }
      }

      // Filtro por preço mínimo
      if (precoMin) {
        const min = parseFloat(precoMin);
        if (!isNaN(min) && precoNum < min) return false;
      }

      // Filtro por preço máximo
      if (precoMax) {
        const max = parseFloat(precoMax);
        if (!isNaN(max) && precoNum > max) return false;
      }

      // Filtro por garagem
      if (garagem !== undefined) {
        const filtroGaragem = garagem === 'true';
        const imovelGaragem = !!imovel.garagem;
        if (imovelGaragem !== filtroGaragem) return false;
      }

      // Filtro por suíte
      if (suite !== undefined) {
        const filtroSuite = suite === 'true';
        const imovelSuite = !!imovel.suite;
        if (imovelSuite !== filtroSuite) return false;
      }

      return true;
    });

    console.log("📦 Imóveis após filtro:", resultado.length);
    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return res.status(500).json({ error: 'Erro ao buscar imóveis com filtros.' });
  }
}
