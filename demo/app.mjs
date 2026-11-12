import {cleanLayout, visibleCards, moveCard, cycleSpan, toggleCard, needsAttention} from "../src/model.mjs";
import {ModuleRegistry} from "../src/registry.mjs";
import {MockServer} from "../src/mock-server.mjs";
import {RulesEngine} from "../src/rules.mjs";
import {LayoutStateManager} from "../src/history.mjs";
import {fixtureModules, demoRules} from "../src/fixtures.mjs";
const root = document.getElementById("workspace"), attention = document.getElementById("attention");
const selectViewer = document.getElementById("viewer"), selectMode = document.getElementById("mode");
const status = document.getElementById("status");
const registry=new ModuleRegistry(),server=new MockServer(),rules=new RulesEngine();
function optionalStorage(){
  try{return globalThis.localStorage??null;}
  catch{return null;}
}
const storage=optionalStorage();
const layouts=new LayoutStateManager({storage});
for(const card of fixtureModules){
  registry.register({id:card.id,kind:card.kind,title:card.title,group:card.group,
    capabilities:card.presentationEligible===false?["summary","detail"]:["summary","detail","presentation"],
    presentationEligible:card.presentationEligible!==false});
  server.ingest(card);
}
for(const rule of demoRules)rules.addRule(rule);
let viewer=selectViewer.value,focused=null,presenting=false,focusReturnId=null;
const make = (tag, className, text) => {const e=document.createElement(tag); if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;};
const button = (label, fn, className="", id="", ariaLabel="") => {
  const el=make("button",className,label);el.type="button";
  if(id)el.id=id;if(ariaLabel)el.setAttribute("aria-label",ariaLabel);
  el.addEventListener("click",fn);return el;
};
function cards(){return server.getProjection(viewer);}
function load(){
  const saved=layouts.getState(viewer);
  const initial=cleanLayout(saved?.layout,cards());
  if(!saved)layouts.push(viewer,initial,{concurrencyToken:server.getLayout(viewer).token});
  return initial;
}
let layout=load();
function commitLayout(next,message){
  const expectedToken=server.getLayout(viewer).token;
  const result=server.saveLayout(viewer,next,{expectedToken});
  if(!result.success){status.textContent="Save rejected: "+result.error;return false;}
  layout=cleanLayout(next,cards());status.textContent=message+" — synthetic browser demo only.";return true;
}
function update(fn,message,focusId){
  const next=fn(layout);
  if(commitLayout(next,message)){layouts.push(viewer,layout,{concurrencyToken:server.getLayout(viewer).token});render(focusId);}
}
function cardView(item,view="tile"){
  const controlId=action=>"module-"+encodeURIComponent(item.id)+"-"+action;
  const section=make("article","module");section.dataset.moduleId=item.id;
  const heading=make("h3","",item.title); section.append(heading);
  const meta=make("p","meta",item.group+" · "+(item.status==="stale"?"Expired":"Synthetic sample")); section.append(meta);
  section.append(make("p","summary",item.summary));
  if(item.nextAction)section.append(make("p","next","Next: "+item.nextAction));
  const controls=make("div","card-controls");
  if(view!=="presentation") {
    controls.append(button("Open",()=>{focusReturnId=controlId("open");focused=item.id;presenting=false;render("focus-back");},"",controlId("open"),"Open "+item.title));
    controls.append(button("←",()=>update(x=>moveCard(x,cards(),item.id,-1),"Moved card"),"iconbtn",controlId("earlier"),"Move "+item.title+" earlier"));
    controls.append(button("→",()=>update(x=>moveCard(x,cards(),item.id,1),"Moved card"),"iconbtn",controlId("later"),"Move "+item.title+" later"));
    controls.append(button("Size",()=>update(x=>cycleSpan(x,cards(),item.id),"Changed span"),"",controlId("size"),"Change size of "+item.title));
    controls.append(button("Hide",()=>update(x=>toggleCard(x,cards(),item.id),"Hidden card","showHidden"),"",controlId("hide"),"Hide "+item.title));
    section.append(controls);
  }
  return section;
}
function renderAttention(items){
 attention.replaceChildren();
 const list=needsAttention(items).slice(0,4);
 const heading=make("h2","","Needs attention · sample tasks");attention.append(heading);
 if(!list.length){attention.append(make("p","meta","No verified example actions available."));return;}
 const wrap=make("div","attention-items");
 for(const item of list){
   const id="attention-"+encodeURIComponent(item.id);
   wrap.append(button(item.title+" · "+item.nextAction,()=>{focusReturnId=id;focused=item.id;presenting=false;render("focus-back");},"attention-link",id));
 }
 attention.append(wrap);
}
function renderContents(){
 const all=cards();layout=cleanLayout(layout,all);
 selectMode.value=layout.mode;root.replaceChildren();renderAttention(all);
 const visible=visibleCards(all,layout);
 if(presenting){
   root.className="presentation";
   root.append(make("p","warningline","MOCK PRESENTATION — no real session protection"));
   const top=make("div","presentation-top");top.append(make("h2","","Fictional adult display"),button("Exit presentation",()=>{presenting=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});render("present");},"","presentation-exit"));root.append(top);
   const grid=make("div","cards mosaic");for(const item of visible.filter(c=>c.presentationEligible).slice(0,6))grid.append(cardView(item,"presentation"));root.append(grid);return;
 }
 if(focused){
   const item=visible.find(c=>c.id===focused)??all.find(c=>c.id===focused);
   if(!item){focused=null;return render();}
   root.className="focus";root.append(button("← Back to dashboard",()=>{focused=null;render(focusReturnId);},"","focus-back"));
   root.append(make("h2","","Focus view · fictional content"));
   root.append(cardView(item,"focus"));
   root.append(make("p","meta","A real detail renderer must use the same authenticated, authorized server projection as its summary."));
   return;
 }
 root.className="dashboard "+layout.mode;
 const modeLabel=make("h2","dashboard-title","Your modules · "+layout.mode+" view");root.append(modeLabel);
 if(!visible.length){root.append(make("p","empty","All modules are hidden. Use “Restore hidden cards” to bring them back."));return;}
 const byGroup=layout.mode==="grouped" ? [...new Set(visible.map(c=>c.group))] : ["All"];
 for(const group of byGroup){
   const segment=make("div","group");
   if(layout.mode==="grouped")segment.append(make("h3","group-heading",group));
   const grid=make("div","cards "+(layout.mode==="equal"?"equal":"mosaic"));
   let subset=layout.mode==="grouped"?visible.filter(c=>c.group===group):visible;
   if(layout.mode==="featured")subset=[...subset].sort((a,b)=>a.id===layout.featured?-1:b.id===layout.featured?1:0);
   if(layout.mode==="split")subset=subset.slice(0,2);
   for(const item of subset){
     const itemEl=cardView(item);
     const span=layout.mode==="equal"?1:layout.mode==="featured"&&item===subset[0]?4:layout.mode==="split"?2:layout.spans[item.id];
     itemEl.classList.add("span-"+span);grid.append(itemEl);
   }
   segment.append(grid);root.append(segment);
 }
 if(layout.mode==="split")root.append(make("p","meta","Split mode shows the first two visible modules; reorder them to change the pair."));
 const evaluated=rules.evaluate(all,{weekday:new Date().toLocaleDateString("en-US",{weekday:"long"})});
 root.append(make("p","meta","Example rule engine: "+evaluated.actions.length+" condition(s) match. Rules do not auto-change this demo layout."));
}
function render(focusId=document.activeElement?.id){
  renderContents();
  root.setAttribute("role",presenting?"dialog":"region");
  root.setAttribute("aria-label",presenting?"Mock adult presentation":"Dashboard modules");
  if(presenting)root.setAttribute("aria-modal","true");else root.removeAttribute("aria-modal");
  for(const element of document.querySelectorAll("body > header, .toolbar, #status, #attention, body > footer"))element.inert=presenting;
  if(focusId)(document.getElementById(focusId)??document.getElementById("showHidden")).focus();
}
selectViewer.addEventListener("change",()=>{viewer=selectViewer.value;layout=load();focused=null;presenting=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});status.textContent="Simulated viewer only; not a real login.";render();});
selectMode.addEventListener("change",()=>{const next=selectMode.value;update(x=>({...x,mode:next}),"Changed layout mode");});
document.getElementById("undo").addEventListener("click",()=>{
  const value=layouts.undo(viewer);
  if(!value){status.textContent="Nothing to undo.";return;}
  if(!commitLayout(value.layout,"Undo")){layouts.redo(viewer);return;}render();
});
document.getElementById("redo").addEventListener("click",()=>{
  const value=layouts.redo(viewer);
  if(!value){status.textContent="Nothing to redo.";return;}
  if(!commitLayout(value.layout,"Redo")){layouts.undo(viewer);return;}render();
});
document.getElementById("reset").addEventListener("click",()=>{
  const next=cleanLayout(null,cards());
  if(commitLayout(next,"Reset")){layouts.reset(viewer);layouts.push(viewer,layout,{concurrencyToken:server.getLayout(viewer).token});focused=null;presenting=false;render();}
});
document.getElementById("showHidden").addEventListener("click",()=>update(x=>({...x,hidden:[]}),"Restored cards"));
document.getElementById("present").addEventListener("click",()=>{if(!window.confirm("This is a fictional UI demo, NOT a secure adult session. Show mock full-screen layout?"))return;focused=null;presenting=true;render("presentation-exit");if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});});
window.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&(presenting||focused)){
    const returnId=presenting?"present":focusReturnId;
    presenting=false;focused=null;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});render(returnId);
  }else if(event.key==="Tab"&&presenting){
    // Exit is the only interactive control in the mock presentation.
    event.preventDefault();document.getElementById("presentation-exit").focus();
  }
});
document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement&&presenting){presenting=false;render("present");}
});
render();
if(!storage)status.textContent="Browser storage is unavailable. Demo changes last only until this page closes.";
