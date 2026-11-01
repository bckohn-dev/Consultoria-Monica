// Only Vercel's explicit production environment can select live catalog data.
export const dataEnvironment = () => process.env.VERCEL_ENV === 'production' ? 'production' : process.env.VERCEL_ENV === 'preview' ? 'preview' : 'development';
// Kept for the existing API/UI contract: true means a non-production sandbox.
export const isPreview = () => dataEnvironment() !== 'production';
export const propertyCollectionName = () => ({production:'imoveis',preview:'imoveis_preview',development:'imoveis_dev'})[dataEnvironment()];
export const propertyCollection = db => db.collection(propertyCollectionName());
export const archiveCollectionName = () => propertyCollectionName() + '_lixeira';
export const imagePrefix = () => ({production:'imoveis/',preview:'imoveis-preview/',development:'imoveis-dev/'})[dataEnvironment()];
