import { db } from "/api/_firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    const { quartos, precoMin, precoMax } = req.query;

    const snapshot = await db.collection('imoveis').get();
    const imoveis = [];

    snapshot.forEach(doc => {
      imoveis.push({ id: doc.id, ...doc.data() });
    });

    // Aplica os filtros manualmente
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

      return true;
    });

    console.log("📦 Imóveis após filtro:", resultado.length);
    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Erro ao buscar imóveis com filtros:', error);
    return res.status(500).json({ error: 'Erro ao buscar imóveis com filtros.' });
  }
}
