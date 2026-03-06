// ============================================
// MYCELIUM — Upgrade Definitions
// ============================================

import { UpgradeDefinition } from './types';

export const UPGRADES: UpgradeDefinition[] = [
  // ---- TIER 1 UPGRADES ----
  {
    id: 'stronger_roots',
    name: 'Stronger Roots',
    description: 'Root Colonizers produce 2x more spores.',
    cost: { spores: 100 },
    effect: { type: 'multiply_building', targetBuildingId: 'root_colonizer', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'root_colonizer', buildingCount: 10 },
    icon: '💪',
    tier: 1
  },
  {
    id: 'deep_roots',
    name: 'Deep Roots',
    description: 'Root Colonizers produce 3x more spores.',
    cost: { spores: 5000 },
    effect: { type: 'multiply_building', targetBuildingId: 'root_colonizer', value: 3 },
    unlockCondition: { type: 'building', buildingId: 'root_colonizer', buildingCount: 25 },
    icon: '⬇️',
    tier: 1
  },
  {
    id: 'efficient_decomposition',
    name: 'Efficient Decomposition',
    description: 'Organic Matter Breakers produce 2x more spores.',
    cost: { spores: 1000 },
    effect: { type: 'multiply_building', targetBuildingId: 'organic_breaker', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'organic_breaker', buildingCount: 10 },
    icon: '🔬',
    tier: 1
  },
  {
    id: 'acid_potency',
    name: 'Acid Potency',
    description: 'Soil Acidifiers produce 2x more spores.',
    cost: { spores: 11000 },
    effect: { type: 'multiply_building', targetBuildingId: 'soil_acidifier', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'soil_acidifier', buildingCount: 10 },
    icon: '🧫',
    tier: 1
  },
  {
    id: 'click_boost_1',
    name: 'Thicker Hyphae',
    description: 'Clicking produces 2x more spores.',
    cost: { spores: 500 },
    effect: { type: 'multiply_click', value: 2 },
    unlockCondition: { type: 'spores', sporesEarned: 200 },
    icon: '👆',
    tier: 1
  },
  {
    id: 'click_boost_2',
    name: 'Rhizomorphs',
    description: 'Clicking produces 5x more spores.',
    cost: { spores: 50000 },
    effect: { type: 'multiply_click', value: 5 },
    unlockCondition: { type: 'spores', sporesEarned: 20000 },
    icon: '✊',
    tier: 1
  },

  // ---- TIER 2 UPGRADES ----
  {
    id: 'highway_efficiency',
    name: 'Highway Efficiency',
    description: 'Nutrient Transporters produce 2x more of everything.',
    cost: { spores: 120000, myceliumMass: 50 },
    effect: { type: 'multiply_building', targetBuildingId: 'nutrient_transporter', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'nutrient_transporter', buildingCount: 10 },
    icon: '🛤️',
    tier: 2
  },
  {
    id: 'enzyme_cocktail',
    name: 'Enzyme Cocktail',
    description: 'Enzyme Specialists produce 2x more spores.',
    cost: { spores: 1300000 },
    effect: { type: 'multiply_building', targetBuildingId: 'enzyme_specialist', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'enzyme_specialist', buildingCount: 10 },
    icon: '🍹',
    tier: 2
  },
  {
    id: 'territorial_aggression',
    name: 'Territorial Aggression',
    description: 'Territory Expanders produce 2x more of everything.',
    cost: { spores: 14000000, myceliumMass: 500 },
    effect: { type: 'multiply_building', targetBuildingId: 'territory_expander', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'territory_expander', buildingCount: 10 },
    icon: '⚔️',
    tier: 2
  },
  {
    id: 'mass_production',
    name: 'Mass Production',
    description: 'All buildings produce 1.5x more Mycelium Mass.',
    cost: { spores: 500000, myceliumMass: 200 },
    effect: { type: 'multiply_all', value: 1.5 },
    unlockCondition: { type: 'spores', sporesEarned: 200000 },
    icon: '📦',
    tier: 2
  },
  {
    id: 'synergy_network_1',
    name: 'Synergy Network I',
    description: 'All building synergies are 50% stronger.',
    cost: { spores: 2000000 },
    effect: { type: 'synergy_boost', value: 1.5 },
    unlockCondition: { type: 'spores', sporesEarned: 1000000 },
    icon: '🔗',
    tier: 2
  },

  // ---- TIER 3 UPGRADES ----
  {
    id: 'deep_symbiosis',
    name: 'Deep Symbiosis',
    description: 'Plant Partners produce 3x more of everything.',
    cost: { spores: 200000000, myceliumMass: 5000 },
    effect: { type: 'multiply_building', targetBuildingId: 'plant_partner', value: 3 },
    unlockCondition: { type: 'building', buildingId: 'plant_partner', buildingCount: 10 },
    icon: '🤝',
    tier: 3
  },
  {
    id: 'immune_response',
    name: 'Immune Response',
    description: 'Pathogen Defense Rings produce 2x more spores.',
    cost: { spores: 3300000000 },
    effect: { type: 'multiply_building', targetBuildingId: 'pathogen_defense', value: 2 },
    unlockCondition: { type: 'building', buildingId: 'pathogen_defense', buildingCount: 10 },
    icon: '🦠',
    tier: 3
  },
  {
    id: 'guild_mastery',
    name: 'Guild Mastery',
    description: 'Decomposer Guild produces 3x more of everything.',
    cost: { spores: 51000000000, myceliumMass: 50000 },
    effect: { type: 'multiply_building', targetBuildingId: 'decomposer_guild', value: 3 },
    unlockCondition: { type: 'building', buildingId: 'decomposer_guild', buildingCount: 10 },
    icon: '👑',
    tier: 3
  },
  {
    id: 'synergy_network_2',
    name: 'Synergy Network II',
    description: 'All building synergies are doubled.',
    cost: { spores: 10000000000 },
    effect: { type: 'synergy_boost', value: 2 },
    unlockCondition: { type: 'spores', sporesEarned: 5000000000 },
    icon: '🔗',
    tier: 3
  },
  {
    id: 'click_boost_3',
    name: 'Explosive Sporulation',
    description: 'Clicking produces 10x more spores.',
    cost: { spores: 1000000000 },
    effect: { type: 'multiply_click', value: 10 },
    unlockCondition: { type: 'spores', sporesEarned: 500000000 },
    icon: '💥',
    tier: 3
  },

  // ---- TIER 4 UPGRADES (post-prestige) ----
  {
    id: 'surface_breach',
    name: 'Surface Breach',
    description: 'Fruiting Bodies produce 3x more of everything.',
    cost: { spores: 750000000000, myceliumMass: 500000 },
    effect: { type: 'multiply_building', targetBuildingId: 'fruiting_body', value: 3 },
    unlockCondition: { type: 'building', buildingId: 'fruiting_body', buildingCount: 10 },
    icon: '🌋',
    tier: 4
  },
  {
    id: 'wind_rider',
    name: 'Wind Rider',
    description: 'Atmospheric Dispersal produces 3x more of everything.',
    cost: { spores: 10000000000000, myceliumMass: 5000000 },
    effect: { type: 'multiply_building', targetBuildingId: 'spore_dispersal', value: 3 },
    unlockCondition: { type: 'building', buildingId: 'spore_dispersal', buildingCount: 10 },
    icon: '🌪️',
    tier: 4
  },
  {
    id: 'forest_dominion',
    name: 'Forest Dominion',
    description: 'Forest Matrix produces 5x more of everything.',
    cost: { spores: 1000000000000000, myceliumMass: 250000000 },
    effect: { type: 'multiply_building', targetBuildingId: 'forest_matrix', value: 5 },
    unlockCondition: { type: 'building', buildingId: 'forest_matrix', buildingCount: 10 },
    icon: '🏰',
    tier: 4
  },
  {
    id: 'global_network',
    name: 'Global Network',
    description: 'All buildings produce 2x more spores.',
    cost: { spores: 100000000000000 },
    effect: { type: 'multiply_all', value: 2 },
    unlockCondition: { type: 'prestige', prestigeCount: 2 },
    icon: '🌍',
    tier: 4
  },
];

// Helper: get upgrade by ID
export function getUpgradeDef(id: string): UpgradeDefinition | undefined {
  return UPGRADES.find(u => u.id === id);
}

// Helper: check if upgrade is unlocked
export function isUpgradeUnlocked(
  def: UpgradeDefinition,
  totalSporesEarned: number,
  buildings: { id: string; count: number }[],
  timesPrestiged: number
): boolean {
  const cond = def.unlockCondition;
  switch (cond.type) {
    case 'always': return true;
    case 'spores': return totalSporesEarned >= (cond.sporesEarned || 0);
    case 'building': {
      const b = buildings.find(b => b.id === cond.buildingId);
      return (b?.count || 0) >= (cond.buildingCount || 0);
    }
    case 'prestige': return timesPrestiged >= (cond.prestigeCount || 0);
    default: return false;
  }
}
