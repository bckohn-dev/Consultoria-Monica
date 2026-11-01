// Public catalog data only: internal fields and personal notes never leave the API.
const FIELDS = ['id','nome','descricao','preco','quartos','area','areaMin','areaMax','vagaGaragem','garagem','suite','foto','fotos','marca','prazoEntrega','destaque','destaqueOrdem'];
export function publicProperty(data, fallbackId) {
  const out = Object.fromEntries(FIELDS.filter(key => Object.hasOwn(data,key)).map(key => [key,data[key]]));
  out.id = typeof data.id === 'string' && data.id ? data.id : fallbackId;
  return out;
}
