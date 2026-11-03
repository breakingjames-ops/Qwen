// src/rules.mjs
// Deterministic declarative rules with traceable precedence.

export class RulesEngine {
  constructor() {
    this._rules = [];
  }

  addRule(rule) {
    if (!rule || !rule.id || !rule.action) throw new Error("Invalid rule");
    this._rules.push({ ...rule, priority: rule.priority ?? 0 });
    // Sort by priority descending, then ID ascending for determinism
    this._rules.sort((a, b) => (b.priority || 0) - (a.priority || 0) || String(a.id).localeCompare(String(b.id)));
  }

  evaluate(cards, context = {}) {
    const trace = [];
    const accepted = [];

    for (const rule of this._rules) {
      const matches = this._match(rule, cards, context);
      trace.push({ ruleId: String(rule.id), matches, action: rule.action });
      if (matches) accepted.push(rule);
    }

    return { actions: accepted, trace };
  }

  _match(rule, cards, context) {
    const card = cards.find(c => c.id === rule.moduleId);
    if (!card) return false;

    if (rule.when) {
      if (rule.when.weekday && rule.when.weekday !== context.weekday) return false;
      if (rule.when.status && card.status !== rule.when.status) return false;
    }
    return true;
  }
}
