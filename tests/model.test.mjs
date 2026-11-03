import test from "node:test";
import assert from "node:assert/strict";
import {projectForViewer, cleanLayout, visibleCards, moveCard, toggleCard, cycleSpan, needsAttention, evaluateRules} from "../src/model.mjs";
import {fixtureModules, demoRules} from "../src/fixtures.mjs";
const now = new Date("2026-11-02T12:00:00Z");
const a = projectForViewer(fixtureModules,"designer-one",now);
test("unauthorized subject gets no modules",()=>assert.deepEqual(projectForViewer(fixtureModules,"unknown",now),[]));
test("viewer separation enforced before projection",()=>{
  const b=projectForViewer(fixtureModules,"designer-two",now);
  assert.equal(b.some(m=>m.id==="notes"),false);
  assert.equal(a.some(m=>m.id==="notes"),true);
});
test("denied fields never leave mock projection",()=>{
  const malicious=[{id:"x",title:"Safe",allowedViewers:["designer-one"],secret:"never",rawSourceUrl:"bad",description:"private"}];
  const projected=projectForViewer(malicious,"designer-one",now);
  assert.equal(JSON.stringify(projected).includes("never"),false);
  assert.equal(JSON.stringify(projected).includes("private"),false);
});
test("expiry withholds action details",()=>{
  const inventory=a.find(x=>x.id==="inventory");
  assert.equal(inventory.status,"stale");
  assert.equal(inventory.nextAction,"");
  assert.equal(inventory.dueAt,null);
});
test("revocation removes records",()=>assert.equal(projectForViewer([{id:"z",title:"Z",allowedViewers:["designer-one"],revoked:true}],"designer-one",now).length,0));
test("layout normalizes unknown ids, invalid modes, and invalid spans",()=>{
  const l=cleanLayout({mode:"unsafe",order:["bogus","groceries","groceries"],spans:{groceries:100},hidden:["bogus"]},a);
  assert.equal(l.mode,"equal");assert.equal(l.order[0],"groceries");assert.equal(l.spans.groceries,1);assert.deepEqual(l.hidden,[]);
});
test("move, hide, resize and restore preserve others",()=>{
  let l=cleanLayout(null,a);let id=l.order[0];l=moveCard(l,a,id,1);
  assert.equal(l.order[1],id);l=toggleCard(l,a,id);
  assert.equal(visibleCards(a,l).some(c=>c.id===id),false);
  l=toggleCard(l,a,id);l=cycleSpan(l,a,id);
  assert.equal(l.spans[id],2);assert.equal(visibleCards(a,l).some(c=>c.id===id),true);
});
test("all layouts handle zero, one, and fifty modules",()=>{
  for (const n of [0,1,50,51]){let cards=Array.from({length:n},(_,i)=>({id:"c"+i,title:"Demo "+i}));
    const l=cleanLayout({mode:"mosaic"},cards);assert.equal(visibleCards(cards,l).length,n);assert.equal(new Set(l.order).size,n);}
});
test("only verified actionable items count as attention",()=>{
  const l=needsAttention(a,now);assert.equal(l.some(x=>x.id==="inventory"),false);
  assert.equal(l.every(x=>x.status==="verified"&&x.nextAction),true);
});
test("declarative rules produce deterministic trace",()=>{
  const result=evaluateRules(a,demoRules,{weekday:"Saturday"});
  assert.equal(result.trace.length,2);assert.equal(result.actions.length,2);
  assert.deepEqual(result.actions.map(x=>x.id),["demo-weekend","demo-verified"]);
});
test("malformed inputs fail closed",()=>{
  assert.deepEqual(projectForViewer(null,"designer-one"),[]);
  assert.deepEqual(projectForViewer(fixtureModules,null),[]);
});
