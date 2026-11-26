import { storage } from './_firebaseAdmin.js';
import { dataEnvironment } from './_properties.js';
import { preparePublicRequest, sendPublicData, publicFailure } from './_publicRequest.js';

let cached;
let pending;
let retryAt = 0;

async function readImages() {
  const environment = dataEnvironment();
  if (cached?.environment === environment && cached.expires > Date.now()) return cached.urls;
  if (pending) return pending;
  if (Date.now() < retryAt) throw new Error('Storage retry backoff');
  pending = Promise.resolve().then(async () => {
    try {
      const [files] = await storage.bucket().getFiles({ prefix: 'carrossel/', autoPaginate: false, maxResults: 50 });
      const images = files.filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file.name));
      const urls = await Promise.all(images.map(async file => {
        const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 3600000 });
        return url;
      }));
      cached = { environment, urls, expires: Date.now() + 30000 };
      retryAt = 0;
      return urls;
    } catch (error) {
      retryAt = Date.now() + 5000;
      throw error;
    } finally {
      pending = null;
    }
  });
  return pending;
}

export default async function handler(req, res) {
  try {
    if (!preparePublicRequest(req, res, [])) return;
    if (process.env.FIREBASE_STORAGE_ENABLED === 'false') return sendPublicData(req, res, []);
    return sendPublicData(req, res, await readImages());
  } catch (error) {
    return publicFailure(res, error);
  }
}
