import axios from 'axios';
import { readFilters, matchesFilters } from '../../shared/catalogFilters.js';
// All visitor reads use a static CDN object; filters never call the database/API.
export const catalogApi = {
  async get(path,{params={},signal}={}) {
    const {data:snapshot}=await axios.get('/catalogo-publico/catalogo.json',{signal});
    if(snapshot.schemaVersion!==1 || !Array.isArray(snapshot.entries)) throw new Error('Catálogo inválido');
    let data;
    if(path==='/destaques') {
      data=snapshot.entries.filter(entry=>entry.property.destaque && entry.highlightPhoto)
        .sort((a,b)=>Number(a.property.destaqueOrdem||0)-Number(b.property.destaqueOrdem||0))
        .map(entry=>({...entry.property,foto:entry.highlightPhoto}));
    } else if(path.startsWith('/api/imoveis/')) {
      const id=decodeURIComponent(path.slice('/api/imoveis/'.length));
      data=snapshot.entries.find(entry=>entry.documentId===id || entry.property.id===id)?.property;
      if(!data) throw new Error('Imóvel não encontrado');
    } else {
      const filters=readFilters(params);
      data=snapshot.entries.map(entry=>entry.property).filter(property=>matchesFilters(property,filters));
    }
    return {data};
  },
};
