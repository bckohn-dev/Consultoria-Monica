// /api/destaques.js
import { db } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  try {
    const ordenar = (req.query.ordenar ?? 'sim') !== 'nao';
    let snap;

    // 1) Tenta com orderBy (fica bonito se o índice existir)
    if (ordenar) {
      try {
        snap = await db
          .collection('imoveis')
          .where('destaque', '==', true)
          .orderBy('destaqueOrdem', 'asc')
          .get();
      } catch (e) {
        // 2) Se faltar índice, cai pro plano B sem orderBy
        console.warn('Sem índice para orderBy(destaqueOrdem); usando fallback.', e.message);
        snap = await db
          .collection('imoveis')
          .where('destaque', '==', true)
          .get();
      }
    } else {
      // pedido explícito para não ordenar (ordenar=nao)
      snap = await db
        .collection('imoveis')
        .where('destaque', '==', true)
        .get();
    }

    if (snap.empty) return res.status(200).json([]);

    // Normaliza os campos esperados pelo carrossel
    const destaques = snap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: data.id ?? doc.id,                  // seu slug público já usado pela rota de detalhes
          nome: data.nome ?? 'Imóvel',
          foto: data.foto ?? data.imagens?.[0] ?? null,
        };
      })
      .filter((d) => d.foto); // só envia se tiver imagem

    return res.status(200).json(destaques);
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    return res.status(500).json({ error: 'Erro ao buscar destaques', detail: error?.message });
  }
}
