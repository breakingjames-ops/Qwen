import test from "node:test";
import assert from "node:assert/strict";
import {ModuleRegistry,AdapterContract} from "../src/registry.mjs";
import {MockServer} from "../src/mock-server.mjs";
import {RulesEngine} from "../src/rules.mjs";
import {LayoutStateManager} from "../src/history.mjs";
const date=new Date("2026-11-02T12:00:00Z");
test("registry rejects duplicates and invalid field types",()=>{
 const r=new ModuleRegistry();r.register({id:"x",kind:"task",title:"X",group:"A",capabilities:["summary"]});
 assert.throws(()=>r.register({id:"x",kind:"task",title:"Y",group:"A",capabilities:["summary"]}));
 assert.throws(()=>r.register({id:"y",kind:"task",title:3,group:"A",capabilities:["summary"]}));
 assert.equal(r.hasCapability("unknown","summary"),false);
});
test("nested capabilities and safe allowlist cannot mutate",()=>{
 const capabilities=["summary"];const r=new ModuleRegistry();
 r.register({id:"x",kind:"task",title:"X",group:"A",capabilities});
 capabilities.push("presentation");assert.equal(r.hasCapability("x","presentation"),false);
 assert.throws(()=>r.get("x").capabilities.push("presentation"),TypeError);
 assert.throws(()=>AdapterContract.SAFE_SUMMARY_FIELDS.push("secret"),TypeError);
});
test("re-ingesting removes stale viewer and snapshot references",()=>{
 const s=new MockServer({now:()=>date});
 s.ingest({id:"x",title:"X",allowedViewers:["one","two"],summary:{text:"safe"},secret:"private"});
 const first=s.getProjection("one");assert.equal(JSON.stringify(first).includes("private"),false);
 s.ingest({id:"x",title:"Y",allowedViewers:["two"]});
 assert.equal(s.getProjection("one").length,0);assert.equal(s.getProjection("two").length,1);
 first[0].summary.text="changed";assert.equal(s.getProjection("two")[0].summary,undefined);
});
test("rejected stale layout tokens and persisted layout readback",()=>{
 const s=new MockServer({now:()=>date});
 assert.equal(s.saveLayout("v",{mode:"equal"}).error,"MISSING_TOKEN");
 let a=s.saveLayout("v",{mode:"equal"},{expectedToken:"v0"});
 assert.equal(a.success,true);assert.equal(s.getLayout("v").layout.mode,"equal");
 assert.equal(s.saveLayout("v",{mode:"split"},{expectedToken:"v0"}).error,"CONFLICT");
 a.layout.mode="mutated";assert.equal(s.getLayout("v").layout.mode,"equal");
});
test("rules reject unsupported conditions and never activate stale cards",()=>{
 const r=new RulesEngine();
 assert.throws(()=>r.addRule({id:"x",moduleId:"a",action:"explode"}));
 assert.throws(()=>r.addRule({id:"x",moduleId:"a",action:"pin",when:{unknown:"x"}}));
 r.addRule({id:"ok",moduleId:"a",action:"pin",priority:2});
 assert.equal(r.evaluate([{id:"a",status:"stale"}]).actions.length,0);
 assert.equal(r.evaluate([{id:"a",status:"verified"}]).actions.length,1);
});
test("local history clones entries and persists undo / redo",()=>{
 const mock={data:null,getItem(){return this.data},setItem(_,v){this.data=v}};
 const m=new LayoutStateManager({storage:mock});
 const obj={mode:"equal"};m.push("v",obj);obj.mode="changed";assert.equal(m.getState("v").layout.mode,"equal");
 m.push("v",{mode:"split"});m.undo("v");
 const n=new LayoutStateManager({storage:mock});assert.equal(n.getState("v").layout.mode,"equal");
 assert.equal(n.redo("v").layout.mode,"split");
 assert.throws(()=>new LayoutStateManager({maxHistory:0}));
});
