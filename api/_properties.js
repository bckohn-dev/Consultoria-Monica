export const isPreview = () => process.env.VERCEL_ENV === 'preview';
export const propertyCollection = db => db.collection(isPreview() ? 'imoveis_preview' : 'imoveis');
