const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };
export function propertyInput(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('Dados inválidos.');
  const out = {};
  for (const [key, max] of [['nome',120],['descricao',12000],['prazoEntrega',80],['marca',40]]) {
    if (typeof value[key] !== 'string' || value[key].length > max) invalid('Verifique o campo ' + key + '.');
    out[key] = value[key].trim();
  }
  if (!out.nome) invalid('Informe o nome do imóvel.');
  for (const key of ['preco','quartos','areaMin','areaMax','destaqueOrdem']) {
    if (typeof value[key] !== 'number' || !Number.isFinite(value[key]) || value[key] < 0) invalid('Verifique o campo ' + key + '.');
    out[key] = value[key];
  }
  if (!Number.isInteger(out.quartos) || out.quartos > 50 || !Number.isInteger(out.destaqueOrdem)) invalid('Quartos e ordem devem ser números inteiros.');
  if (out.areaMin <= 0 || out.areaMax < out.areaMin) invalid('A área máxima deve ser maior ou igual à mínima.');
  if (!['','vibra','muda','tipu'].includes(out.marca)) invalid('Selecione uma marca válida.');
  for (const key of ['vagaGaragem','suite','destaque']) {
    if (typeof value[key] !== 'boolean') invalid('Verifique o campo ' + key + '.');
    out[key] = value[key];
  }
  if (!Array.isArray(value.fotos) || value.fotos.length > 20) invalid('Use até 20 imagens por imóvel.');
  function imageUrl(url) {
    if (typeof url !== 'string' || url.length > 3000) invalid('Imagem inválida.');
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') invalid('As imagens devem usar HTTPS.');
    } catch { invalid('Endereço de imagem inválido.'); }
    return url;
  }
  out.foto = imageUrl(value.foto);
  out.fotos = [...new Set(value.fotos.map(imageUrl))];
  return out;
}
export function documentId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(value)) invalid('Identificador de imóvel inválido.');
  return value;
}
export function imageInput(body) {
  if (!body || typeof body.data !== 'string' || body.data.length > 2800000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.data)) invalid('Envie uma imagem de até 2 MB.');
  const bytes = Buffer.from(body.data, 'base64');
  if (!bytes.length || bytes.length > 2 * 1024 * 1024) invalid('Envie uma imagem de até 2 MB.');
  const types = {
    'image/jpeg': bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
    'image/png': bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
    'image/webp': bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP',
  };
  if (!types[body.type]) invalid('Use uma imagem JPG, PNG ou WebP válida.');
  return { bytes, type: body.type };
}
