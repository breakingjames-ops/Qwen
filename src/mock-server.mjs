// Isolated, in-memory policy demonstration. Not real authentication or persistence.
import { SAFE_SUMMARY_FIELDS } from "./registry.mjs";
const clone = value => structuredClone(value);
function timestamp(value) { const n=Date.parse(value); return Number.isFinite(n)?n:NaN; }
export class MockServer {
  constructor({now=()=>new Date()}={}){
    this._now=now;this._store=new Map();this._revocations=new Set();this._grants=new Map();
    this._layouts=new Map();this._history=[];
  }
  ingest(record, concurrencyToken="v1"){
    if(!record || typeof record.id!=="string" || !record.id || !Array.isArray(record.allowedViewers) || record.allowedViewers.some(v=>typeof v!=="string"||!v))throw new TypeError("Invalid record/viewers");
    const fresh=clone(record);
    this._store.set(fresh.id,fresh);
    // Replace, do not accumulate, grants for this id.
    for(const grants of this._grants.values())grants.delete(fresh.id);
    for(const viewer of new Set(fresh.allowedViewers)){
      if(!this._grants.has(viewer))this._grants.set(viewer,new Set());
      this._grants.get(viewer).add(fresh.id);
    }
    this._log("ingest",fresh.id,{concurrencyToken});
    return this;
  }
  revoke(moduleId){
    if(!this._store.has(moduleId))return false;
    this._revocations.add(moduleId);this._log("revoke",moduleId);return true;
  }
  getProjection(viewerId,{now}={}){
    if(typeof viewerId!=="string"||!viewerId)return Object.freeze([]);
    const instant=now===undefined?Number(new Date(this._now())):Number(new Date(now));
    if(!Number.isFinite(instant))return Object.freeze([]);
    const output=[];
    for(const id of this._grants.get(viewerId)??[]){
      if(this._revocations.has(id))continue;
      const raw=this._store.get(id);
      if(!raw?.allowedViewers?.includes(viewerId))continue;
      const safe=Object.fromEntries(SAFE_SUMMARY_FIELDS.filter(k=>Object.hasOwn(raw,k)).map(k=>[k,clone(raw[k])]));
      if(typeof safe.id!=="string"||typeof safe.title!=="string")continue;
      if(safe.validUntil!=null && (!Number.isFinite(timestamp(safe.validUntil))||timestamp(safe.validUntil)<=instant)){
        safe.summary="Source expired; verification required.";safe.nextAction="";safe.status="stale";safe.dueAt=null;
      }
      output.push(Object.freeze(safe));
    }
    return Object.freeze(output);
  }
  getLayout(viewerId){
    const entry=this._layouts.get(viewerId);
    return entry?{layout:clone(entry.layout),token:entry.token}:{layout:null,token:"v0"};
  }
  saveLayout(viewerId,layout,{expectedToken}={}){
    const old=this.getLayout(viewerId);
    if(expectedToken==null){this._log("conflict",viewerId,{error:"MISSING_TOKEN"});return {success:false,error:"MISSING_TOKEN",currentToken:old.token};}
    if(typeof viewerId!=="string"||!viewerId||!layout||typeof layout!=="object"||Array.isArray(layout))return {success:false,error:"INVALID"};
    if(expectedToken!==old.token){this._log("conflict",viewerId,{error:"CONFLICT"});return {success:false,error:"CONFLICT",currentToken:old.token};}
    const token=`v${Number(old.token.slice(1))+1}`;
    this._layouts.set(viewerId,{layout:clone(layout),token});
    this._log("save_layout",viewerId,{token});
    return {success:true,viewerId,layout:clone(layout),savedAt:new Date(this._now()).toISOString(),concurrencyToken:token};
  }
  _log(action,target,meta={}){
    this._history.push({action,target,meta:clone(meta),at:new Date(this._now()).toISOString()});
  }
  getHistory(){return clone(this._history);}
}
