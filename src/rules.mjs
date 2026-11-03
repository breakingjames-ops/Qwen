// Declarative demo rules. Policy filtering runs before these rules.
const ACTIONS=new Set(["pin","hide","feature"]);
const WHEN=new Set(["weekday","status"]);
export class RulesEngine {
  constructor(){this._rules=[];}
  addRule(rule){
    if(!rule||typeof rule.id!=="string"||!rule.id||typeof rule.moduleId!=="string"||!rule.moduleId||!ACTIONS.has(rule.action))throw new TypeError("Invalid rule");
    if(this._rules.some(x=>x.id===rule.id))throw new Error("Duplicate rule id");
    if(rule.priority!==undefined && !Number.isFinite(rule.priority))throw new TypeError("Invalid priority");
    if(rule.when!==undefined && (!rule.when||typeof rule.when!=="object"||Array.isArray(rule.when)||Object.keys(rule.when).some(k=>!WHEN.has(k)||typeof rule.when[k]!=="string")))throw new TypeError("Invalid when");
    const copy=Object.freeze({...rule,when:rule.when?Object.freeze({...rule.when}):undefined,priority:rule.priority??0});
    this._rules.push(copy);
    this._rules.sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
    return this;
  }
  evaluate(cards,context={}){
    const trace=[],accepted=[];
    for(const rule of this._rules){
      const card=Array.isArray(cards)?cards.find(c=>c.id===rule.moduleId):undefined;
      const matches=Boolean(card && (card.status!=="stale" || rule.action==="hide") && card.status!=="revoked" &&
        (!rule.when?.weekday || rule.when.weekday===context.weekday) &&
        (!rule.when?.status || rule.when.status===card.status));
      trace.push(Object.freeze({ruleId:rule.id,matches,action:rule.action}));
      if(matches)accepted.push(rule);
    }
    return {actions:Object.freeze(accepted),trace:Object.freeze(trace)};
  }
}
