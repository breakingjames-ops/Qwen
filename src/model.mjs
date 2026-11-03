// Pure, fictional-data dashboard primitives. NOT production authentication.
export const MODES = Object.freeze(["equal", "mosaic", "grouped", "featured", "split"]);
const SAFE_FIELDS = Object.freeze(["id", "kind", "title", "group", "summary", "nextAction", "status", "dueAt", "verifiedAt", "validUntil", "presentationEligible", "span"]);

export function projectForViewer(records, viewer, now = new Date()) {
  if (!Array.isArray(records) || typeof viewer !== "string" || !viewer) return [];
  const instant = Number(new Date(now));
  return records.flatMap(record => {
    if (!record || !Array.isArray(record.allowedViewers) || !record.allowedViewers.includes(viewer) || record.revoked === true) return [];
    const safe = Object.fromEntries(SAFE_FIELDS.filter(field => Object.hasOwn(record, field)).map(field => [field, record[field]]));
    if (typeof safe.id !== "string" || typeof safe.title !== "string") return [];
    if (safe.validUntil && Number(new Date(safe.validUntil)) <= instant) {
      safe.summary = "Source expired; verification required.";
      safe.nextAction = "";
      safe.status = "stale";
      safe.dueAt = null;
    }
    return [safe];
  });
}

export function cleanLayout(input, cards) {
  const source = input && typeof input === "object" ? input : {};
  const ids = cards.map(card => card.id);
  const known = new Set(ids);
  const order = [...new Set(Array.isArray(source.order) ? source.order : [])].filter(id => known.has(id));
  const spans = {};
  for (const id of ids) {
    const value = source.spans && source.spans[id];
    spans[id] = [1, 2, 4].includes(value) ? value : 1;
  }
  return {
    mode: MODES.includes(source.mode) ? source.mode : "equal",
    order: [...order, ...ids.filter(id => !order.includes(id))],
    hidden: [...new Set(Array.isArray(source.hidden) ? source.hidden : [])].filter(id => known.has(id)),
    spans,
    featured: known.has(source.featured) ? source.featured : ids[0] ?? null
  };
}

export function visibleCards(cards, layout) {
  const clean = cleanLayout(layout, cards);
  const index = new Map(clean.order.map((id, n) => [id, n]));
  return cards.filter(c => !clean.hidden.includes(c.id))
    .sort((a,b) => (index.get(a.id) ?? Infinity) - (index.get(b.id) ?? Infinity));
}

export function moveCard(layout, cards, id, delta) {
  const next = cleanLayout(layout, cards);
  const i = next.order.indexOf(id), j = i + delta;
  if (i >= 0 && j >= 0 && j < next.order.length) [next.order[i], next.order[j]] = [next.order[j], next.order[i]];
  return next;
}

export function toggleCard(layout, cards, id) {
  const next = cleanLayout(layout, cards);
  if (!next.order.includes(id)) return next;
  next.hidden = next.hidden.includes(id) ? next.hidden.filter(x => x !== id) : [...next.hidden, id];
  return next;
}

export function cycleSpan(layout, cards, id) {
  const next = cleanLayout(layout, cards);
  if (next.order.includes(id)) next.spans[id] = ({ 1:2, 2:4, 4:1 })[next.spans[id]];
  return next;
}

export function needsAttention(cards, at = new Date()) {
  const stamp = Number(new Date(at));
  return cards.filter(card => card.status === "verified" && typeof card.nextAction === "string" && card.nextAction.length > 0)
    .map(card => ({ ...card, urgency: card.dueAt && Number(new Date(card.dueAt)) < stamp ? "overdue" : "upcoming" }))
    .sort((a,b) => (Number(new Date(a.dueAt ?? "9999-01-01")) || Infinity) - (Number(new Date(b.dueAt ?? "9999-01-01")) || Infinity));
}

export function defaultLayout(cards) {
  return cleanLayout({ mode: "equal" }, cards);
}

// Declarative mock rules; a real product must authorize and evaluate them on its server.
export function evaluateRules(cards, rules, context = {}) {
  const trace = [], accepted = [];
  for (const rule of Array.isArray(rules) ? rules : []) {
    if (!rule || !["pin", "hide", "feature"].includes(rule.action) || !cards.some(c => c.id === rule.moduleId)) continue;
    const matches = (!rule.when?.weekday || rule.when.weekday === context.weekday) &&
      (!rule.when?.status || cards.some(c => c.id === rule.moduleId && c.status === rule.when.status));
    trace.push({ ruleId: String(rule.id ?? ""), matches, action: rule.action });
    if (matches) accepted.push(rule);
  }
  accepted.sort((a,b) => (b.priority ?? 0)-(a.priority ?? 0) || String(a.id).localeCompare(String(b.id)));
  return { actions: accepted, trace };
}
