import { getAuth } from 'firebase-admin/auth';
import { app } from './_firebaseAdmin.js';
import { dataEnvironment } from './_properties.js';

export async function requireAdmin(req) {
  const origin = req.headers?.origin;
  if (origin) {
    const host = req.headers.host;
    const local = dataEnvironment() === 'development' && /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host || '');
    if (!host || (origin !== 'https://' + host && !(local && origin === 'http://' + host))) {
      throw Object.assign(new Error('Origem da solicitação não permitida.'), { status: 403 });
    }
  }
  const allowed = (process.env.ADMIN_EMAILS || '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
  if (!allowed.length) throw Object.assign(new Error('Acesso administrativo ainda não configurado.'), { status: 503 });
  const match = req.headers?.authorization?.match(/^Bearer (\S+)$/);
  if (!match) throw Object.assign(new Error('Entre na sua conta para continuar.'), { status: 401 });
  let user;
  try { user = await getAuth(app).verifyIdToken(match[1], true); }
  catch { throw Object.assign(new Error('Sua sessão expirou. Entre novamente.'), { status: 401 }); }
  if (!user.email_verified || !allowed.includes(user.email?.toLowerCase())) {
    throw Object.assign(new Error('Esta conta não tem acesso ao painel.'), { status: 403 });
  }
  return user;
}
