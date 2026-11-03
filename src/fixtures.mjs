// Entirely fictional prompts. Not actual family records, credentials, source IDs, or schedules.
const generic = [
  ["groceries","Groceries","Home","Review pantry staples","Compare list with simulated inventory"],
  ["dinners","Dinner Ideas","Home","Select a sample meal","Choose from fictional meal ideas"],
  ["lunches","Lunch Planner","Home","Review demo packing ideas","Show sample choices without pretending inventory"],
  ["chores","Household Tasks","Home","Inspect example task ledger","Review simulated task checkoffs"],
  ["budget","Budget Sandbox","Planning","Inspect fictional totals","No actual bank account or financial integration"],
  ["calendar","Demo Calendar","Planning","Review mock events","Example calendar with no real event links"],
  ["projects","Project Tracker","Projects","Prioritize the demo backlog","Track example development tasks"],
  ["maintenance","Maintenance","Projects","Review example inspection","Sample household maintenance task"],
  ["reading","Reading","Wellness","Choose a public-domain reading","Fictional content selection"],
  ["weather","Weather Mock","Home","Inspect example forecast","No weather provider requests"],
  ["inventory","Inventory Mock","Home","Review sample quantities","No real stock is inferred"],
  ["notes","Ideas","Projects","Compare layout recipes","Generic module ideas only"]
];
export const fixtureModules = generic.map(([id,title,group,nextAction,summary],i) => ({
  id, kind:"task_summary", title, group, nextAction, summary,
  status: i === 10 ? "unknown" : "verified",
  dueAt: i < 3 ? "2099-12-01T12:00:00Z" : null,
  verifiedAt: "2099-01-01T00:00:00Z",
  validUntil: i === 10 ? "2020-01-01T00:00:00Z" : null,
  allowedViewers: i === 11 ? ["designer-one"] : ["designer-one","designer-two"],
  presentationEligible: i === 4 ? false : true,
  span: 1
}));
export const demoRules = [
  { id: "demo-weekend", moduleId: "groceries", action: "pin", when: {weekday:"Saturday"}, priority:10 },
  { id: "demo-verified", moduleId: "projects", action: "feature", when: {status:"verified"}, priority:5 }
];
