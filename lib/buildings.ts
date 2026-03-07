// ============================================
// MYCELIUM — Building Definitions
// ============================================

import { BuildingDefinition } from './types';

export const BUILDINGS: BuildingDefinition[] = [
  // ---- TIER 1: Basic Decomposition (0-5 min) ----
  {
    id: 'root_colonizer',
    name: 'Root Colonizer',
    description: 'Tiny fungal threads that break into fresh soil. The first step of every great network.',
    flavor: '"From a single spore, empires grow."',
    tier: 1,
    baseCost: { spores: 5 },
    baseProduction: { sporesPerSecond: 0.5 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'always' },
    synergies: [
      {
        targetBuildingId: 'nutrient_transporter',
        bonusType: 'add_percent',
        bonusValue: 0.5,
        description: '+0.5% Nutrient Transporter output per Root Colonizer'
      }
    ],
    icon: '🌱'
  },
  {
    id: 'organic_breaker',
    name: 'Organic Matter Breaker',
    description: 'Enzymes that dissolve dead plant material into usable nutrients.',
    flavor: '"One organism\'s death is another\'s feast."',
    tier: 1,
    baseCost: { spores: 40 },
    baseProduction: { sporesPerSecond: 2 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 20 },
    synergies: [
      {
        targetBuildingId: 'enzyme_specialist',
        bonusType: 'add_percent',
        bonusValue: 1,
        description: '+1% Enzyme Specialist output per Organic Breaker'
      }
    ],
    icon: '🍂'
  },
  {
    id: 'soil_acidifier',
    name: 'Soil Acidifier',
    description: 'Secretes acids that soften rock and release trapped minerals.',
    flavor: '"Even stone yields to patience."',
    tier: 1,
    baseCost: { spores: 300 },
    baseProduction: { sporesPerSecond: 12 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 100 },
    synergies: [
      {
        targetBuildingId: 'territory_expander',
        bonusType: 'add_percent',
        bonusValue: 0.8,
        description: '+0.8% Territory Expander output per Soil Acidifier'
      }
    ],
    icon: '🧪'
  },

  // ---- TIER 2: Expansion & Symbiosis (5-20 min) ----
  {
    id: 'nutrient_transporter',
    name: 'Nutrient Transporter',
    description: 'Long-range hyphal highways that move resources across the network.',
    flavor: '"The Wood Wide Web runs on fungal fiber."',
    tier: 2,
    baseCost: { spores: 5000 },
    baseProduction: { sporesPerSecond: 60, myceliumMassPerSecond: 0.1 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 1500 },
    synergies: [
      {
        targetBuildingId: 'plant_partner',
        bonusType: 'add_percent',
        bonusValue: 2,
        description: '+2% Plant Partner output per Nutrient Transporter'
      }
    ],
    icon: '🚇'
  },
  {
    id: 'enzyme_specialist',
    name: 'Enzyme Specialist',
    description: 'Targeted enzyme factories that break down specific compounds with surgical precision.',
    flavor: '"Nature\'s lockpicks."',
    tier: 2,
    baseCost: { spores: 130000 },
    baseProduction: { sporesPerSecond: 260 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 50000 },
    synergies: [
      {
        targetBuildingId: 'decomposer_guild',
        bonusType: 'add_percent',
        bonusValue: 1.5,
        description: '+1.5% Decomposer Guild output per Enzyme Specialist'
      }
    ],
    icon: '⚗️'
  },
  {
    id: 'territory_expander',
    name: 'Territory Expander',
    description: 'Aggressive growth fronts that claim new underground territory.',
    flavor: '"The map is not the territory — the territory is ours."',
    tier: 2,
    baseCost: { spores: 1400000, myceliumMass: 100 },
    baseProduction: { sporesPerSecond: 1400, myceliumMassPerSecond: 0.5, substrateCoveragePerSecond: 0.005 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 500000 },
    synergies: [
      {
        targetBuildingId: 'pathogen_defense',
        bonusType: 'add_percent',
        bonusValue: 1.2,
        description: '+1.2% Pathogen Defense output per Territory Expander'
      }
    ],
    icon: '🗺️'
  },

  // ---- TIER 3: Ecosystem Control (20min - 1hr) ----
  {
    id: 'plant_partner',
    name: 'Plant Partner Network',
    description: 'Mycorrhizal bonds with plant roots. They feed us sugars, we feed them minerals.',
    flavor: '"A deal 400 million years in the making."',
    tier: 3,
    baseCost: { spores: 20000000, myceliumMass: 1000, substrateCoverage: 3 },
    baseProduction: { sporesPerSecond: 7800, myceliumMassPerSecond: 2, substrateCoveragePerSecond: 0.01 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 5000000 },
    synergies: [
      {
        targetBuildingId: 'fruiting_body',
        bonusType: 'add_percent',
        bonusValue: 3,
        description: '+3% Fruiting Body output per Plant Partner'
      }
    ],
    icon: '🌿'
  },
  {
    id: 'pathogen_defense',
    name: 'Pathogen Defense Ring',
    description: 'Antibiotic-producing zones that protect the network from bacterial invaders.',
    flavor: '"Penicillin was just the opening salvo."',
    tier: 3,
    baseCost: { spores: 330000000 },
    baseProduction: { sporesPerSecond: 44000, myceliumMassPerSecond: 5 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 100000000 },
    synergies: [
      {
        targetBuildingId: 'spore_dispersal',
        bonusType: 'add_percent',
        bonusValue: 2,
        description: '+2% Atmospheric Dispersal output per Pathogen Defense'
      }
    ],
    icon: '🛡️'
  },
  {
    id: 'decomposer_guild',
    name: 'Decomposer Guild',
    description: 'A coalition of specialized fungi working in concert to break down anything organic.',
    flavor: '"We are the recyclers. The circle closes through us."',
    tier: 3,
    baseCost: { spores: 5100000000, myceliumMass: 10000 },
    baseProduction: { sporesPerSecond: 260000, myceliumMassPerSecond: 15, substrateCoveragePerSecond: 0.01 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'spores', sporesEarned: 1000000000 },
    synergies: [
      {
        targetBuildingId: 'forest_matrix',
        bonusType: 'add_percent',
        bonusValue: 2.5,
        description: '+2.5% Forest Matrix output per Decomposer Guild'
      }
    ],
    icon: '♻️'
  },

  // ---- TIER 4: Surface Emergence (post-prestige) ----
  {
    id: 'fruiting_body',
    name: 'Fruiting Body Primer',
    description: 'The network pushes mushrooms to the surface. The world will know we are here.',
    flavor: '"They see the mushroom. They do not see the miles beneath."',
    tier: 4,
    baseCost: { spores: 75000000000, myceliumMass: 100000 },
    baseProduction: { sporesPerSecond: 1600000, myceliumMassPerSecond: 50, substrateCoveragePerSecond: 0.02 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'prestige', prestigeCount: 1 },
    synergies: [
      {
        targetBuildingId: 'root_colonizer',
        bonusType: 'multiply',
        bonusValue: 0.1,
        description: 'x0.1 multiplier to Root Colonizer per Fruiting Body (stacks)'
      }
    ],
    icon: '🍄'
  },
  {
    id: 'spore_dispersal',
    name: 'Atmospheric Spore Dispersal',
    description: 'Launch spores into the wind. Colonize distant lands without ever touching them.',
    flavor: '"We ride the breath of the world."',
    tier: 4,
    baseCost: { spores: 1000000000000, myceliumMass: 1000000, substrateCoverage: 25 },
    baseProduction: { sporesPerSecond: 10000000, myceliumMassPerSecond: 200, substrateCoveragePerSecond: 0.05 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'prestige', prestigeCount: 2 },
    synergies: [
      {
        targetBuildingId: 'organic_breaker',
        bonusType: 'multiply',
        bonusValue: 0.05,
        description: 'x0.05 multiplier to Organic Breaker per Atmospheric Dispersal (stacks)'
      }
    ],
    icon: '💨'
  },
  {
    id: 'forest_matrix',
    name: 'Symbiotic Forest Matrix',
    description: 'An entire forest bends to your will. Trees, soil, insects — all part of the network.',
    flavor: '"The forest doesn\'t belong to us. The forest IS us."',
    tier: 4,
    baseCost: { spores: 100000000000000, myceliumMass: 50000000, substrateCoverage: 50 },
    baseProduction: { sporesPerSecond: 65000000, myceliumMassPerSecond: 1000, substrateCoveragePerSecond: 0.1 },
    costMultiplier: 1.15,
    unlockCondition: { type: 'prestige', prestigeCount: 3 },
    synergies: [
      {
        targetBuildingId: 'plant_partner',
        bonusType: 'multiply',
        bonusValue: 0.15,
        description: 'x0.15 multiplier to Plant Partner per Forest Matrix (stacks)'
      }
    ],
    icon: '🌳'
  }
];

// Helper: get building definition by ID
export function getBuildingDef(id: string): BuildingDefinition | undefined {
  return BUILDINGS.find(b => b.id === id);
}

// Helper: calculate cost for next purchase
export function getBuildingCost(def: BuildingDefinition, owned: number): { spores: number; myceliumMass: number; substrateCoverage: number } {
  const mult = Math.pow(def.costMultiplier, owned);
  return {
    spores: Math.ceil(def.baseCost.spores * mult),
    myceliumMass: def.baseCost.myceliumMass ? Math.ceil(def.baseCost.myceliumMass * mult) : 0,
    substrateCoverage: def.baseCost.substrateCoverage || 0, // coverage requirement doesn't scale
  };
}

// Helper: check if building is unlocked
export function isBuildingUnlocked(
  def: BuildingDefinition,
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
