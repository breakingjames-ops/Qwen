// Generic, mock-only module registry. No production authorization.
export const SAFE_SUMMARY_FIELDS = Object.freeze(["id","kind","title","group","summary","nextAction","status","dueAt","verifiedAt","validUntil","presentationEligible","span"]);
export const AdapterContract = Object.freeze({
  REQUIRED_FIELDS: Object.freeze(["id","kind","title","group"]),
  SAFE_SUMMARY_FIELDS
});
const CAPABILITIES = new Set(["summary","detail","presentation"]);
function nonempty(value){return typeof value==="string" && value.trim().length>0;}
export class ModuleRegistry {
  constructor(){this._definitions=new Map();}
  register(definition){
    if(!definition || typeof definition!=="object" || !nonempty(definition.id)) throw new TypeError("Registry: missing id");
    for(const field of ["kind","title","group"]){
      if(!nonempty(definition[field]))throw new TypeError(`Registry ${definition.id}: invalid ${field}`);
    }
    if(this._definitions.has(definition.id))throw new Error(`Registry: duplicate id ${definition.id}`);
    if(!Array.isArray(definition.capabilities)||!definition.capabilities.includes("summary")||definition.capabilities.some(c=>!CAPABILITIES.has(c))||new Set(definition.capabilities).size!==definition.capabilities.length){
      throw new TypeError(`Registry ${definition.id}: invalid capabilities`);
    }
    if(definition.presentationEligible!==undefined && typeof definition.presentationEligible!=="boolean")throw new TypeError("Invalid presentationEligible");
    if(definition.presentationEligible && !definition.capabilities.includes("presentation"))throw new TypeError("Presentation capability required");
    const copy={...definition,capabilities:Object.freeze([...definition.capabilities])};
    this._definitions.set(definition.id,Object.freeze(copy));
    return this;
  }
  get(id){return this._definitions.get(id);}
  list(){return [...this._definitions.values()];}
  hasCapability(id,capability){return Boolean(this._definitions.get(id)?.capabilities.includes(capability));}
}
