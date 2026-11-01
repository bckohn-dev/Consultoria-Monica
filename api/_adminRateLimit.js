import { createHash } from 'node:crypto';
import { dataEnvironment } from './_properties.js';
// Distributed per-account write limit. No IPs, emails or tokens are stored.
export async function limitAdminWrites(db, uid, now = Date.now()) {
  const key = createHash('sha256').update(uid).digest('hex');
  const reference = db.collection('admin_write_limits').doc((dataEnvironment() + '-') + key);
  await db.runTransaction(async tx => {
    const snapshot = await tx.get(reference);
    const previous = snapshot?.exists ? snapshot.data() : {};
    const fresh = Number.isFinite(previous.start) && now - previous.start >= 0 && now - previous.start < 60000;
    const count = fresh ? Number(previous.count || 0) : 0;
    if (count >= 60) throw Object.assign(new Error('Limite de operações atingido. Aguarde um minuto.'), {status:429});
    tx.set(reference, { start: fresh ? previous.start : now, count: count + 1 });
  });
}
