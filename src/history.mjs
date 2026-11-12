// Local-demo layout history only; do not use for private information.
const clone=x=>structuredClone(x);
export class LayoutStateManager {
  constructor({maxHistory=50,storage=null}={}){
    if(!Number.isInteger(maxHistory)||maxHistory<1)throw new RangeError("maxHistory must be positive integer");
    this._maxHistory=maxHistory;this._storage=storage;this._stacks=new Map();
    if(storage)this._load();
  }
  _load(){
    try{
      const data=JSON.parse(this._storage.getItem("layout_state_manager")||"{}");
      if(!data||typeof data!=="object"||Array.isArray(data))return;
      for(const [viewer,s] of Object.entries(data)){
        if(!s||!Array.isArray(s.history)||!Number.isInteger(s.index)||s.index<-1||s.index>=s.history.length)continue;
        // Keep the selected snapshot when a smaller limit trims persisted history.
        // Prefer the newest window, moving it back only to retain that selection.
        const start=Math.min(Math.max(0,s.history.length-this._maxHistory),Math.max(0,s.index));
        this._stacks.set(viewer,{history:clone(s.history.slice(start,start+this._maxHistory)),index:s.index-start});
      }
    }catch{/*Corrupt demo storage: empty state; do not claim successful restore.*/}
  }
  _persist(){
    if(!this._storage)return false;
    try{this._storage.setItem("layout_state_manager",JSON.stringify(Object.fromEntries(this._stacks)));return true;}
    catch{return false;}
  }
  getState(viewer){const s=this._stacks.get(viewer);return s&&s.index>=0?clone(s.history[s.index]):null;}
  push(viewer,layout,{concurrencyToken}={}){
    if(typeof viewer!=="string"||!viewer||!layout||typeof layout!=="object")throw new TypeError("Invalid layout state");
    const s=this._stacks.get(viewer)??{history:[],index:-1};
    s.history=s.history.slice(0,s.index+1);
    s.history.push({layout:clone(layout),token:concurrencyToken??null,at:new Date().toISOString()});
    if(s.history.length>this._maxHistory)s.history=s.history.slice(-this._maxHistory);
    s.index=s.history.length-1;this._stacks.set(viewer,s);this._persist();return this.getState(viewer);
  }
  undo(viewer){const s=this._stacks.get(viewer);if(!s||s.index<=0)return null;s.index--;this._persist();return this.getState(viewer);}
  redo(viewer){const s=this._stacks.get(viewer);if(!s||s.index>=s.history.length-1)return null;s.index++;this._persist();return this.getState(viewer);}
  reset(viewer){this._stacks.delete(viewer);this._persist();}
}
