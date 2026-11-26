import { readPublicCatalog } from './_staticCatalog.js';
import { preparePublicRequest, sendPublicData, publicFailure } from './_publicRequest.js';
export default async function handler(req,res) {
  try {
    if(!preparePublicRequest(req,res,[])) return;
    const entries=await readPublicCatalog();
    return sendPublicData(req,res,entries.filter(entry=>entry.property.destaque).map(entry=>entry.highlightPhoto));
  }catch(error){return publicFailure(res,error);}
}
