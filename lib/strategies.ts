// ============================================
// MYCELIUM — Strategy Modifiers (Realm Grinder-inspired)
// Toggleable bonuses that change your playstyle.
// Each strategy gives boosts to some things and
// penalties to others. Can switch any time.
// ============================================

export interface Strategy {
  id: string;
  name: string;
  icon: string;
  description: string;
  flavor: string;
  unlockCondition: StrategyUnlock;
  effects: StrategyEffect[];
}

export interface StrategyUnlock {
  type: 'always' | 'spores_earned' | 'prestige_count' | 'building_count' | 'fbe_total';
  value?: number;
}

export interface StrategyEffect {
  type: 'production_mult' | 'click_mult' | 'cost_mult' | 'mass_mult' | 'coverage_mult' |
        'fbe_mult' | 'golden_spore_mult' | 'offline_mult' | 'building_specific_mult';
  value: number; // multiplier (>1 = boost, <1 = penalty)
  buildingId?: string; // for building_specific_mult
  label: string; // display text like "+50% production" or "-20% click power"
}

export const STRATEGIES: Strategy[] = [
  // --- Alignment: Aggressive Growth ---
  {
    id: 'strat_aggressive',
    name: 'Aggressive Growth',
    icon: '⚔️',
    description: 'Push hard and fast. High production, but mass drains faster and costs rise.',
    flavor: '"Growth at any cost."',
    unlockCondition: { type: 'always' },
    effects: [
      { type: 'production_mult', value: 1.5, label: '+50% spore production' },
      { type: 'mass_mult', value: 0.6, label: '-40% mass production' },
      { type: 'cost_mult', value: 1.15, label: '+15% building costs' },
    ],
  },
  // --- Alignment: Symbiotic ---
  {
    id: 'strat_symbiotic',
    name: 'Symbiotic Harmony',
    icon: '🤝',
    description: 'Focus on balance. Moderate boosts to everything, great offline gains.',
    flavor: '"Cooperation is the oldest strategy."',
    unlockCondition: { type: 'always' },
    effects: [
      { type: 'production_mult', value: 1.15, label: '+15% spore production' },
      { type: 'mass_mult', value: 1.15, label: '+15% mass production' },
      { type: 'coverage_mult', value: 1.15, label: '+15% coverage production' },
      { type: 'offline_mult', value: 1.5, label: '+50% offline gains' },
    ],
  },
  // --- Alignment: Parasitic ---
  {
    id: 'strat_parasitic',
    name: 'Parasitic Drain',
    icon: '🦠',
    description: 'Clicks are king. Massive click power but buildings produce less.',
    flavor: '"Take everything. Give nothing back."',
    unlockCondition: { type: 'spores_earned', value: 10000 },
    effects: [
      { type: 'click_mult', value: 3.0, label: '+200% click power' },
      { type: 'production_mult', value: 0.7, label: '-30% building production' },
      { type: 'golden_spore_mult', value: 1.5, label: '+50% golden spore value' },
    ],
  },
  // --- Alignment: Decomposer ---
  {
    id: 'strat_decomposer',
    name: 'Decomposer Focus',
    icon: '♻️',
    description: 'Cheaper buildings and great mass production, but slower spore output.',
    flavor: '"From death, we create life."',
    unlockCondition: { type: 'spores_earned', value: 500000 },
    effects: [
      { type: 'cost_mult', value: 0.8, label: '-20% building costs' },
      { type: 'mass_mult', value: 2.0, label: '+100% mass production' },
      { type: 'production_mult', value: 0.8, label: '-20% spore production' },
    ],
  },
  // --- Alignment: Mycorrhizal ---
  {
    id: 'strat_mycorrhizal',
    name: 'Mycorrhizal Network',
    icon: '🌿',
    description: 'Coverage gains are supercharged. Great FBE multiplier, but clicks are weaker.',
    flavor: '"The network IS the resource."',
    unlockCondition: { type: 'prestige_count', value: 1 },
    effects: [
      { type: 'coverage_mult', value: 3.0, label: '+200% coverage production' },
      { type: 'fbe_mult', value: 1.3, label: '+30% FBE gain' },
      { type: 'click_mult', value: 0.5, label: '-50% click power' },
    ],
  },
  // --- Alignment: Sporulator ---
  {
    id: 'strat_sporulator',
    name: 'Sporulation Engine',
    icon: '✨',
    description: 'Built for prestige cycles. Huge FBE boost but everything else takes a hit.',
    flavor: '"The cycle is all that matters."',
    unlockCondition: { type: 'prestige_count', value: 3 },
    effects: [
      { type: 'fbe_mult', value: 2.0, label: '+100% FBE gain' },
      { type: 'production_mult', value: 0.75, label: '-25% spore production' },
      { type: 'cost_mult', value: 1.1, label: '+10% building costs' },
      { type: 'mass_mult', value: 0.8, label: '-20% mass production' },
    ],
  },
  // --- Alignment: Endurance ---
  {
    id: 'strat_endurance',
    name: 'Endurance Mode',
    icon: '🐢',
    description: 'For long runs. Incredible offline gains and cost reductions. Slow but steady.',
    flavor: '"Patience outlasts all competitors."',
    unlockCondition: { type: 'prestige_count', value: 5 },
    effects: [
      { type: 'offline_mult', value: 2.5, label: '+150% offline gains' },
      { type: 'cost_mult', value: 0.75, label: '-25% building costs' },
      { type: 'production_mult', value: 0.6, label: '-40% spore production' },
      { type: 'click_mult', value: 0.5, label: '-50% click power' },
    ],
  },
  // --- Alignment: Apex Predator ---
  {
    id: 'strat_apex',
    name: 'Apex Predator',
    icon: '👑',
    description: 'Massive boosts to everything... except costs. For the truly wealthy.',
    flavor: '"They called it a fungus. We called it an empire."',
    unlockCondition: { type: 'fbe_total', value: 100 },
    effects: [
      { type: 'production_mult', value: 2.0, label: '+100% spore production' },
      { type: 'click_mult', value: 2.0, label: '+100% click power' },
      { type: 'mass_mult', value: 1.5, label: '+50% mass production' },
      { type: 'cost_mult', value: 1.5, label: '+50% building costs' },
    ],
  },
];

// Helper: check if strategy is unlocked
export function isStrategyUnlocked(
  strat: Strategy,
  totalSporesEarned: number,
  timesPrestiged: number,
  totalFBE: number,
  totalBuildingsPurchased: number
): boolean {
  switch (strat.unlockCondition.type) {
    case 'always': return true;
    case 'spores_earned': return totalSporesEarned >= (strat.unlockCondition.value || 0);
    case 'prestige_count': return timesPrestiged >= (strat.unlockCondition.value || 0);
    case 'fbe_total': return totalFBE >= (strat.unlockCondition.value || 0);
    case 'building_count': return totalBuildingsPurchased >= (strat.unlockCondition.value || 0);
    default: return false;
  }
}

// Helper: get combined multiplier for a given effect type from active strategies
export function getStrategyMultiplier(
  effectType: StrategyEffect['type'],
  activeStrategyIds: string[],
  buildingId?: string
): number {
  let result = 1;
  for (const stratId of activeStrategyIds) {
    const strat = STRATEGIES.find(s => s.id === stratId);
    if (!strat) continue;
    for (const effect of strat.effects) {
      if (effect.type === effectType) {
        if (effectType === 'building_specific_mult') {
          if (effect.buildingId === buildingId) {
            result *= effect.value;
          }
        } else {
          result *= effect.value;
        }
      }
    }
  }
  return result;
}
