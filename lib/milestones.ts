// ============================================
// MYCELIUM — Adventure Capitalist-Style Milestones
// At specific ownership counts, buildings get
// permanent profit multipliers that keep early
// buildings relevant throughout the game.
// ============================================

import { Milestone } from './types';

// --- Milestone thresholds (AdCap-inspired) ---
// Every building gets multipliers at these counts:
//   10 → x2, 25 → x2, 50 → x3, 100 → x4, 150 → x2, 200 → x4, 300 → x5, 400 → x4, 500 → x5

const MILESTONE_TIERS = [
  { count: 10,  multiplier: 2,  label: 'x2' },
  { count: 25,  multiplier: 2,  label: 'x2' },
  { count: 50,  multiplier: 3,  label: 'x3' },
  { count: 100, multiplier: 4,  label: 'x4' },
  { count: 150, multiplier: 2,  label: 'x2' },
  { count: 200, multiplier: 4,  label: 'x4' },
  { count: 300, multiplier: 5,  label: 'x5' },
  { count: 400, multiplier: 4,  label: 'x4' },
  { count: 500, multiplier: 5,  label: 'x5' },
];

const BUILDING_IDS = [
  'root_colonizer',
  'organic_breaker',
  'soil_acidifier',
  'nutrient_transporter',
  'enzyme_specialist',
  'territory_expander',
  'plant_partner',
  'pathogen_defense',
  'decomposer_guild',
  'fruiting_body',
  'spore_dispersal',
  'forest_matrix',
];

const BUILDING_ICONS: Record<string, string> = {
  root_colonizer: '🌱',
  organic_breaker: '🍂',
  soil_acidifier: '🧪',
  nutrient_transporter: '🚇',
  enzyme_specialist: '⚗️',
  territory_expander: '🗺️',
  plant_partner: '🌿',
  pathogen_defense: '🛡️',
  decomposer_guild: '♻️',
  fruiting_body: '🍄',
  spore_dispersal: '💨',
  forest_matrix: '🌳',
};

const BUILDING_NAMES: Record<string, string> = {
  root_colonizer: 'Root Colonizer',
  organic_breaker: 'Organic Breaker',
  soil_acidifier: 'Soil Acidifier',
  nutrient_transporter: 'Nutrient Transporter',
  enzyme_specialist: 'Enzyme Specialist',
  territory_expander: 'Territory Expander',
  plant_partner: 'Plant Partner',
  pathogen_defense: 'Pathogen Defense',
  decomposer_guild: 'Decomposer Guild',
  fruiting_body: 'Fruiting Body',
  spore_dispersal: 'Spore Dispersal',
  forest_matrix: 'Forest Matrix',
};

// Generate all milestones for all buildings
export const MILESTONES: Milestone[] = BUILDING_IDS.flatMap(buildingId =>
  MILESTONE_TIERS.map(tier => ({
    buildingId,
    count: tier.count,
    multiplier: tier.multiplier,
    name: `${BUILDING_NAMES[buildingId]} ${tier.label} (${tier.count})`,
    icon: BUILDING_ICONS[buildingId],
  }))
);

// --- Get the total milestone multiplier for a building based on owned count ---
export function getMilestoneMultiplier(buildingId: string, ownedCount: number): number {
  let mult = 1;
  for (const tier of MILESTONE_TIERS) {
    if (ownedCount >= tier.count) {
      mult *= tier.multiplier;
    }
  }
  return mult;
}

// --- Get the next milestone for a building ---
export function getNextMilestone(buildingId: string, ownedCount: number): { count: number; multiplier: number; label: string } | null {
  for (const tier of MILESTONE_TIERS) {
    if (ownedCount < tier.count) {
      return { count: tier.count, multiplier: tier.multiplier, label: tier.label };
    }
  }
  return null; // All milestones reached!
}

// --- Get all reached milestones for a building ---
export function getReachedMilestones(buildingId: string, ownedCount: number): typeof MILESTONE_TIERS {
  return MILESTONE_TIERS.filter(tier => ownedCount >= tier.count);
}

// --- Check for newly reached milestones (returns milestones just hit) ---
export function checkNewMilestones(
  buildingId: string,
  oldCount: number,
  newCount: number
): Milestone[] {
  return MILESTONES.filter(
    m => m.buildingId === buildingId && oldCount < m.count && newCount >= m.count
  );
}
