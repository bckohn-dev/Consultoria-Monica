import { randomUUID } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { db, storage } from './_firebaseAdmin.js';
import { requireAdmin } from './_adminAccess.js';
import { propertyCollection, isPreview } from './_properties.js';
import { propertyInput, documentId, imageInput } from './_propertyValidation.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET','POST','PATCH','DELETE'].includes(req.method)) {
    res.setHeader('Allow','GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  try {
    const user = await requireAdmin(req);
    const collection = propertyCollection(db);
    const action = req.query?.action;
    if (req.method === 'GET') {
      if (action === 'session') return res.status(200).json({ email: user.email, preview: isPreview() });
      const snapshot = await collection.get();
      return res.status(200).json({ preview: isPreview(), imoveis: snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id })) });
    }
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { throw Object.assign(new Error('Dados inválidos.'),{status:400}); } }
    if (req.method === 'POST' && action === 'seed') {
      if (!isPreview()) return res.status(403).json({ error: 'Disponível apenas no ambiente de teste.' });
      const existing = await collection.limit(1).get();
      if (!existing.empty) return res.status(409).json({ error: 'O catálogo de teste já foi preparado.' });
      const source = await db.collection('imoveis').get();
      if (source.size > 450) return res.status(400).json({ error: 'A cópia requer preparação manual para este volume.' });
      const batch = db.batch();
      source.docs.forEach(doc => batch.create(collection.doc(doc.id), doc.data()));
      await batch.commit();
      return res.status(200).json({ copied: source.size });
    }
    if (req.method === 'POST' && action === 'upload') {
      const { bytes, type } = imageInput(body);
      const ext = { 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' }[type];
      const bucket = storage.bucket();
      const path = (isPreview() ? 'imoveis-preview/' : 'imoveis/') + randomUUID() + '.' + ext;
      const token = randomUUID();
      await bucket.file(path).save(bytes, { resumable: false, metadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } } });
      return res.status(201).json({ url: 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(path) + '?alt=media&token=' + token });
    }
    if (req.method === 'POST') {
      const id = documentId(body?.id);
      const data = propertyInput(body);
      await collection.doc(id).create({ ...data, id, updatedAt: FieldValue.serverTimestamp() });
      return res.status(201).json({ id });
    }
    const id = documentId(req.query?.id);
    const reference = collection.doc(id);
    if (req.method === 'PATCH') {
      const data = propertyInput(body);
      // Preserve existing IDs and fields not managed by this form.
      await reference.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
      return res.status(200).json({ ok: true });
    }
    // Delete only existing records; keep Storage files for recovery and shared images.
    await db.runTransaction(async transaction => {
      const doc = await transaction.get(reference);
      if (!doc.exists) throw Object.assign(new Error('Imóvel não encontrado.'),{status:404});
      const archive = db.collection(isPreview() ? 'imoveis_preview_lixeira' : 'imoveis_lixeira').doc();
      transaction.set(archive, { originalId: doc.id, data: doc.data(), deletedAt: FieldValue.serverTimestamp(), deletedBy: user.uid });
      transaction.delete(reference);
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error.code === 6 || error.code === 'already-exists') return res.status(409).json({error:'Este identificador já existe. Escolha outro.'});
    if (error.code === 5 || error.code === 'not-found') return res.status(404).json({error:'Imóvel não encontrado.'});
    const status = error.status || 500;
    if (status === 500) console.error('Falha na API administrativa:', error.code || 'internal');
    return res.status(status).json({ error: status === 500 ? 'Não foi possível concluir. Tente novamente.' : error.message });
  }
}
