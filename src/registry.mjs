// src/registry.mjs
// Verified module registry and documented adapter/plugin interfaces.
// Defines the safe summary/detail contract for the modular dashboard.

/**
 * @typedef {Object} ModuleDefinition
 * @property {string} id - Unique module identifier
 * @property {string} kind - Module type/category
 * @property {string} title - Display title
 * @property {string} group - Logical grouping
 * @property {string[]} capabilities - Supported render contracts (e.g., 'summary', 'detail', 'presentation')
 * @property {boolean} presentationEligible - Whether module can be shown in 16:9 presentation mode
 */

export class ModuleRegistry {
  constructor() {
    /** @type {Map<string, ModuleDefinition>} */
    this._definitions = new Map();
  }

  /**
   * Registers and freezes a module definition.
   * @param {ModuleDefinition} definition
   */
  register(definition) {
    if (!definition || typeof definition.id !== "string" || !definition.id) {
      throw new Error("Registry: missing id");
    }
    if (!definition.kind || typeof definition.kind !== "string") {
      throw new Error(`Registry ${definition.id}: missing kind`);
    }
    if (!Array.isArray(definition.capabilities)) {
      throw new Error(`Registry ${definition.id}: capabilities must be an array`);
    }
    this._definitions.set(definition.id, Object.freeze({ ...definition }));
    return this;
  }

  get(id) { return this._definitions.get(id); }
  list() { return Array.from(this._definitions.values()); }

  hasCapability(id, capability) {
    const def = this.get(id);
    return def && Array.isArray(def.capabilities) && def.capabilities.includes(capability);
  }
}

/**
 * Adapter interface for module data sources.
 * Implementations must return projections that respect server-side filtering.
 * Note: Matches the SAFE_FIELDS array currently in src/model.mjs to ensure compatibility.
 */
export const AdapterContract = Object.freeze({
  REQUIRED_FIELDS: ["id", "kind", "title", "group"],
  SAFE_SUMMARY_FIELDS: [
    "id", "kind", "title", "group", "summary", "nextAction", "status",
    "dueAt", "verifiedAt", "validUntil", "presentationEligible", "span"
  ]
});
