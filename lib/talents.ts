// ============================================
// MYCELIUM — Mycelial Talents (FBE Skill Tree)
// RPG-style permanent upgrades bought with FBE
// ============================================

export interface Talent {
  id: string;
  name: string;
  description: string;
  icon: string;
  branch: 'growth' | 'efficiency' | 'automation' | 'mastery';
  tier: 1 | 2 | 3; // tier within branch
  costFBE: number;
  effect: TalentEffect;
  requires?: string[]; // talent IDs that must be owned first
  repeatable?: boolean; // can buy multiple times?
  maxStacks?: number; // if repeatable, max stacks
}

export interface TalentEffect {
  type:
    | 'production_mult' // multiply all production
    | 'click_mult' // multiply click value
    | 'cost_reduction' // reduce building costs
    | 'building_mult' // multiply specific building
    | 'all_building_mult' // multiply all building base output
    | 'synergy_mult' // multiply synergy bonuses
    | 'fbe_mult' // multiply future FBE gains
    | 'offline_mult' // multiply offline gains
    | 'auto_click' // auto clicks per second
    | 'click_percent_sps' // increase % of SPS added per click
    | 'starting_spores' // start each run with spores
    | 'coverage_mult' // multiply coverage gains
    | 'mass_mult' // multiply mass gains
    | 'golden_freq' // increase golden spore frequency
    | 'golden_mult' // multiply golden spore rewards
    | 'unlock_feature'; // unlock a specific game feature
  value: number;
  targetBuildingId?: string; // for building_mult
}

// ============================================
// GROWTH BRANCH — Raw production power
// ============================================
const GROWTH_TALENTS: Talent[] = [
  // --- Tier 1 (cheap, early) ---
  {
    id: 'talent_vigor_1',
    name: 'Mycelial Vigor I',
    description: '+10% all production',
    icon: '💪',
    branch: 'growth',
    tier: 1,
    costFBE: 25,
    effect: { type: 'production_mult', value: 1.10 },
    repeatable: true,
    maxStacks: 5,
  },
  {
    id: 'talent_deep_roots',
    name: 'Deep Roots',
    description: '+25% Root Colonizer production',
    icon: '🌿',
    branch: 'growth',
    tier: 1,
    costFBE: 30,
    effect: { type: 'building_mult', value: 1.25, targetBuildingId: 'root_colonizer' },
  },
  {
    id: 'talent_fertile_ground',
    name: 'Fertile Ground',
    description: 'Start each run with 100 spores',
    icon: '🌍',
    branch: 'growth',
    tier: 1,
    costFBE: 20,
    effect: { type: 'starting_spores', value: 100 },
  },
  {
    id: 'talent_click_power_1',
    name: 'Focused Strike I',
    description: '+25% click power',
    icon: '👊',
    branch: 'growth',
    tier: 1,
    costFBE: 20,
    effect: { type: 'click_mult', value: 1.25 },
    repeatable: true,
    maxStacks: 5,
  },

  // --- Tier 2 (mid-cost) ---
  {
    id: 'talent_vigor_2',
    name: 'Mycelial Vigor II',
    description: '+25% all production',
    icon: '💪',
    branch: 'growth',
    tier: 2,
    costFBE: 150,
    effect: { type: 'production_mult', value: 1.25 },
    requires: ['talent_vigor_1'],
    repeatable: true,
    maxStacks: 3,
  },
  {
    id: 'talent_mass_production',
    name: 'Mass Production',
    description: '+50% mycelium mass gains',
    icon: '🏋️',
    branch: 'growth',
    tier: 2,
    costFBE: 200,
    effect: { type: 'mass_mult', value: 1.5 },
    requires: ['talent_vigor_1'],
  },
  {
    id: 'talent_territory',
    name: 'Territorial Dominance',
    description: '+50% substrate coverage gains',
    icon: '🗺️',
    branch: 'growth',
    tier: 2,
    costFBE: 200,
    effect: { type: 'coverage_mult', value: 1.5 },
    requires: ['talent_vigor_1'],
  },
  {
    id: 'talent_click_sps',
    name: 'Resonant Clicks',
    description: 'Clicks now give 10% of SPS (was 5%)',
    icon: '🔔',
    branch: 'growth',
    tier: 2,
    costFBE: 250,
    effect: { type: 'click_percent_sps', value: 0.10 },
    requires: ['talent_click_power_1'],
  },

  // --- Tier 3 (expensive) ---
  {
    id: 'talent_vigor_3',
    name: 'Mycelial Vigor III',
    description: '+50% all production',
    icon: '💪',
    branch: 'growth',
    tier: 3,
    costFBE: 500,
    effect: { type: 'production_mult', value: 1.50 },
    requires: ['talent_vigor_2'],
    repeatable: true,
    maxStacks: 3,
  },
  {
    id: 'talent_fertile_2',
    name: 'Abundant Soil',
    description: 'Start each run with 10,000 spores',
    icon: '🌍',
    branch: 'growth',
    tier: 3,
    costFBE: 400,
    effect: { type: 'starting_spores', value: 10000 },
    requires: ['talent_fertile_ground'],
  },
];

// ============================================
// EFFICIENCY BRANCH — Cost reduction & smarter buying
// ============================================
const EFFICIENCY_TALENTS: Talent[] = [
  // --- Tier 1 ---
  {
    id: 'talent_bargain_1',
    name: 'Bargain Hunter I',
    description: '-5% all building costs',
    icon: '🏷️',
    branch: 'efficiency',
    tier: 1,
    costFBE: 25,
    effect: { type: 'cost_reduction', value: 0.95 },
    repeatable: true,
    maxStacks: 5,
  },
  {
    id: 'talent_offline_1',
    name: 'Persistent Hyphae I',
    description: '+25% offline production',
    icon: '🌙',
    branch: 'efficiency',
    tier: 1,
    costFBE: 30,
    effect: { type: 'offline_mult', value: 1.25 },
    repeatable: true,
    maxStacks: 4,
  },
  {
    id: 'talent_synergy_1',
    name: 'Network Weaving I',
    description: '+15% all synergy bonuses',
    icon: '🕸️',
    branch: 'efficiency',
    tier: 1,
    costFBE: 40,
    effect: { type: 'synergy_mult', value: 1.15 },
    repeatable: true,
    maxStacks: 5,
  },

  // --- Tier 2 ---
  {
    id: 'talent_bargain_2',
    name: 'Bargain Hunter II',
    description: '-10% all building costs',
    icon: '🏷️',
    branch: 'efficiency',
    tier: 2,
    costFBE: 175,
    effect: { type: 'cost_reduction', value: 0.90 },
    requires: ['talent_bargain_1'],
    repeatable: true,
    maxStacks: 3,
  },
  {
    id: 'talent_offline_2',
    name: 'Persistent Hyphae II',
    description: '+50% offline production',
    icon: '🌙',
    branch: 'efficiency',
    tier: 2,
    costFBE: 200,
    effect: { type: 'offline_mult', value: 1.50 },
    requires: ['talent_offline_1'],
  },
  {
    id: 'talent_synergy_2',
    name: 'Network Weaving II',
    description: '+30% all synergy bonuses',
    icon: '🕸️',
    branch: 'efficiency',
    tier: 2,
    costFBE: 250,
    effect: { type: 'synergy_mult', value: 1.30 },
    requires: ['talent_synergy_1'],
    repeatable: true,
    maxStacks: 3,
  },

  // --- Tier 3 ---
  {
    id: 'talent_bargain_3',
    name: 'Master Negotiator',
    description: '-20% all building costs',
    icon: '🏷️',
    branch: 'efficiency',
    tier: 3,
    costFBE: 600,
    effect: { type: 'cost_reduction', value: 0.80 },
    requires: ['talent_bargain_2'],
  },
  {
    id: 'talent_offline_3',
    name: 'Eternal Mycelium',
    description: 'Offline production at 100% rate (was 50%)',
    icon: '🌙',
    branch: 'efficiency',
    tier: 3,
    costFBE: 750,
    effect: { type: 'offline_mult', value: 2.0 },
    requires: ['talent_offline_2'],
  },
];

// ============================================
// AUTOMATION BRANCH — Auto-clicks, golden spores
// ============================================
const AUTOMATION_TALENTS: Talent[] = [
  // --- Tier 1 ---
  {
    id: 'talent_auto_1',
    name: 'Autonomous Growth I',
    description: '1 auto-click per second',
    icon: '🤖',
    branch: 'automation',
    tier: 1,
    costFBE: 35,
    effect: { type: 'auto_click', value: 1 },
  },
  {
    id: 'talent_golden_freq_1',
    name: 'Lucky Spores I',
    description: '+25% golden spore frequency',
    icon: '🍀',
    branch: 'automation',
    tier: 1,
    costFBE: 40,
    effect: { type: 'golden_freq', value: 1.25 },
    repeatable: true,
    maxStacks: 4,
  },
  {
    id: 'talent_golden_mult_1',
    name: 'Golden Harvest I',
    description: '+25% golden spore rewards',
    icon: '🪙',
    branch: 'automation',
    tier: 1,
    costFBE: 40,
    effect: { type: 'golden_mult', value: 1.25 },
    repeatable: true,
    maxStacks: 4,
  },

  // --- Tier 2 ---
  {
    id: 'talent_auto_2',
    name: 'Autonomous Growth II',
    description: '3 auto-clicks per second',
    icon: '🤖',
    branch: 'automation',
    tier: 2,
    costFBE: 200,
    effect: { type: 'auto_click', value: 3 },
    requires: ['talent_auto_1'],
  },
  {
    id: 'talent_golden_freq_2',
    name: 'Lucky Spores II',
    description: '+50% golden spore frequency',
    icon: '🍀',
    branch: 'automation',
    tier: 2,
    costFBE: 250,
    effect: { type: 'golden_freq', value: 1.50 },
    requires: ['talent_golden_freq_1'],
  },
  {
    id: 'talent_golden_mult_2',
    name: 'Golden Harvest II',
    description: '+50% golden spore rewards',
    icon: '🪙',
    branch: 'automation',
    tier: 2,
    costFBE: 250,
    effect: { type: 'golden_mult', value: 1.50 },
    requires: ['talent_golden_mult_1'],
  },

  // --- Tier 3 ---
  {
    id: 'talent_auto_3',
    name: 'Autonomous Growth III',
    description: '10 auto-clicks per second',
    icon: '🤖',
    branch: 'automation',
    tier: 3,
    costFBE: 600,
    effect: { type: 'auto_click', value: 10 },
    requires: ['talent_auto_2'],
  },
  {
    id: 'talent_golden_combo',
    name: 'Midas Mycelia',
    description: 'Golden spores give +100% rewards AND appear +100% more often',
    icon: '👑',
    branch: 'automation',
    tier: 3,
    costFBE: 800,
    effect: { type: 'golden_mult', value: 2.0 },
    requires: ['talent_golden_freq_2', 'talent_golden_mult_2'],
  },
];

// ============================================
// MASTERY BRANCH — Meta-progression (FBE gains, prestige speed)
// ============================================
const MASTERY_TALENTS: Talent[] = [
  // --- Tier 1 ---
  {
    id: 'talent_fbe_1',
    name: 'Fruiting Efficiency I',
    description: '+10% FBE from sporulation',
    icon: '🍄',
    branch: 'mastery',
    tier: 1,
    costFBE: 30,
    effect: { type: 'fbe_mult', value: 1.10 },
    repeatable: true,
    maxStacks: 5,
  },
  {
    id: 'talent_all_buildings_1',
    name: 'Universal Blueprint I',
    description: '+10% base production for ALL buildings',
    icon: '📐',
    branch: 'mastery',
    tier: 1,
    costFBE: 50,
    effect: { type: 'all_building_mult', value: 1.10 },
    repeatable: true,
    maxStacks: 5,
  },

  // --- Tier 2 ---
  {
    id: 'talent_fbe_2',
    name: 'Fruiting Efficiency II',
    description: '+25% FBE from sporulation',
    icon: '🍄',
    branch: 'mastery',
    tier: 2,
    costFBE: 300,
    effect: { type: 'fbe_mult', value: 1.25 },
    requires: ['talent_fbe_1'],
    repeatable: true,
    maxStacks: 3,
  },
  {
    id: 'talent_all_buildings_2',
    name: 'Universal Blueprint II',
    description: '+25% base production for ALL buildings',
    icon: '📐',
    branch: 'mastery',
    tier: 2,
    costFBE: 350,
    effect: { type: 'all_building_mult', value: 1.25 },
    requires: ['talent_all_buildings_1'],
    repeatable: true,
    maxStacks: 3,
  },

  // --- Tier 3 ---
  {
    id: 'talent_fbe_3',
    name: 'Fruiting Mastery',
    description: '+50% FBE from sporulation',
    icon: '🍄',
    branch: 'mastery',
    tier: 3,
    costFBE: 1000,
    effect: { type: 'fbe_mult', value: 1.50 },
    requires: ['talent_fbe_2'],
  },
  {
    id: 'talent_all_buildings_3',
    name: 'Architect of Decay',
    description: '2x base production for ALL buildings',
    icon: '📐',
    branch: 'mastery',
    tier: 3,
    costFBE: 1500,
    effect: { type: 'all_building_mult', value: 2.0 },
    requires: ['talent_all_buildings_2'],
  },
];

// ============================================
// ALL TALENTS
// ============================================
export const TALENTS: Talent[] = [
  ...GROWTH_TALENTS,
  ...EFFICIENCY_TALENTS,
  ...AUTOMATION_TALENTS,
  ...MASTERY_TALENTS,
];

export function getTalentDef(id: string): Talent | undefined {
  return TALENTS.find(t => t.id === id);
}

// Get all talents for a branch
export function getTalentsByBranch(branch: Talent['branch']): Talent[] {
  return TALENTS.filter(t => t.branch === branch);
}

// Check if a talent can be purchased
export function canPurchaseTalent(
  talentId: string,
  ownedTalents: string[],
  currentFBE: number
): boolean {
  const talent = getTalentDef(talentId);
  if (!talent) return false;

  // Check FBE
  if (currentFBE < talent.costFBE) return false;

  // Check prerequisites
  if (talent.requires) {
    for (const req of talent.requires) {
      if (!ownedTalents.includes(req)) return false;
    }
  }

  // Check if already owned (non-repeatable)
  if (!talent.repeatable && ownedTalents.includes(talentId)) return false;

  // Check max stacks for repeatable
  if (talent.repeatable && talent.maxStacks) {
    const currentStacks = ownedTalents.filter(t => t === talentId).length;
    if (currentStacks >= talent.maxStacks) return false;
  }

  return true;
}

// Get the number of stacks owned for a talent
export function getTalentStacks(talentId: string, ownedTalents: string[]): number {
  return ownedTalents.filter(t => t === talentId).length;
}

// Calculate combined multiplier for a talent effect type
export function getTalentMultiplier(
  effectType: TalentEffect['type'],
  ownedTalents: string[],
  targetBuildingId?: string
): number {
  let multiplier = 1;
  for (const talentId of ownedTalents) {
    const talent = getTalentDef(talentId);
    if (!talent) continue;
    if (talent.effect.type !== effectType) continue;
    if (targetBuildingId && talent.effect.targetBuildingId && talent.effect.targetBuildingId !== targetBuildingId) continue;
    multiplier *= talent.effect.value;
  }
  return multiplier;
}

// Get total auto-clicks per second from talents
export function getTalentAutoClicks(ownedTalents: string[]): number {
  let total = 0;
  for (const talentId of ownedTalents) {
    const talent = getTalentDef(talentId);
    if (!talent) continue;
    if (talent.effect.type === 'auto_click') {
      total = Math.max(total, talent.effect.value); // take highest tier, not cumulative
    }
  }
  return total;
}

// Get starting spores from talents
export function getTalentStartingSpores(ownedTalents: string[]): number {
  let total = 0;
  for (const talentId of ownedTalents) {
    const talent = getTalentDef(talentId);
    if (!talent) continue;
    if (talent.effect.type === 'starting_spores') {
      total = Math.max(total, talent.effect.value); // take highest tier
    }
  }
  return total;
}

// Get the click SPS percentage from talents (default is 0.05 = 5%)
export function getTalentClickSPSPercent(ownedTalents: string[]): number {
  let best = 0.05; // default
  for (const talentId of ownedTalents) {
    const talent = getTalentDef(talentId);
    if (!talent) continue;
    if (talent.effect.type === 'click_percent_sps') {
      best = Math.max(best, talent.effect.value);
    }
  }
  return best;
}

// Branch display info
export const BRANCH_INFO = {
  growth: { name: 'Growth', icon: '🌱', color: 'green', description: 'Raw production power and click strength' },
  efficiency: { name: 'Efficiency', icon: '⚙️', color: 'cyan', description: 'Cost reduction, synergies, and offline gains' },
  automation: { name: 'Automation', icon: '🤖', color: 'amber', description: 'Auto-clicks and golden spore boosts' },
  mastery: { name: 'Mastery', icon: '🎓', color: 'purple', description: 'Meta-progression and FBE multiplication' },
} as const;
