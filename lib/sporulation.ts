// ============================================
// MYCELIUM — Sporulation System (formerly Prestige)
// ============================================

import { GameState, LineageMutation, AspectAwakening } from './types';
import { getAchievementTrackMultiplier } from './achievementBonuses';
import { getTalentMultiplier, getTalentStartingSpores } from './talents';
import { getHiddenAchievementBonus } from './hiddenAchievements';

// --- FBE (Fruiting Body Essence) Calculation ---
// Based on total spores earned this run
// Formula: floor(sqrt(totalSporesEarned / 1e9))
// You need ~1B spores for first sporulation (1 FBE minimum)
export function calculateFBEGain(totalSporesEarned: number, achievementMultiplier: number = 1): number {
  if (totalSporesEarned < 1e9) return 0;
  const base = Math.floor(Math.sqrt(totalSporesEarned / 1e9));
  return Math.floor(base * achievementMultiplier);
}

// --- FBE Production Bonus ---
// Each FBE gives +1% to all production (multiplicative with other bonuses)
export function getFBEMultiplier(totalFBE: number): number {
  return 1 + (totalFBE * 0.01);
}

// --- Cosmic Bloom ---
// Meta-multiplier based on total lifetime FBE
// Unlocks at 50,000 FBE
// Each level multiplies ALL production
export function getCosmicBloomLevel(totalFBE: number): number {
  if (totalFBE < 50000) return 0;
  return Math.floor(Math.log2(totalFBE / 50000)) + 1;
}

export function getCosmicBloomMultiplier(level: number): number {
  if (level <= 0) return 1;
  return 1 + (level * 0.5); // +50% per level
}

// --- Lineage Mutations ---
// Building-specific permanent bonuses, unlocked at 2,000 FBE
export const LINEAGE_MUTATIONS: LineageMutation[] = [
  {
    id: 'mut_root_speed',
    name: 'Rapid Colonization',
    description: 'Root Colonizers produce 5x more spores permanently.',
    buildingId: 'root_colonizer',
    effect: 'multiply_5x',
    costFBE: 100
  },
  {
    id: 'mut_breaker_chain',
    name: 'Chain Decomposition',
    description: 'Organic Breakers produce 5x more spores permanently.',
    buildingId: 'organic_breaker',
    effect: 'multiply_5x',
    costFBE: 100
  },
  {
    id: 'mut_acid_deep',
    name: 'Deep Acid Wells',
    description: 'Soil Acidifiers produce 5x more spores permanently.',
    buildingId: 'soil_acidifier',
    effect: 'multiply_5x',
    costFBE: 150
  },
  {
    id: 'mut_transport_express',
    name: 'Express Highways',
    description: 'Nutrient Transporters produce 5x more of everything permanently.',
    buildingId: 'nutrient_transporter',
    effect: 'multiply_5x',
    costFBE: 250
  },
  {
    id: 'mut_enzyme_overdrive',
    name: 'Enzyme Overdrive',
    description: 'Enzyme Specialists produce 5x more spores permanently.',
    buildingId: 'enzyme_specialist',
    effect: 'multiply_5x',
    costFBE: 300
  },
  {
    id: 'mut_territory_blitz',
    name: 'Territory Blitz',
    description: 'Territory Expanders produce 5x more of everything permanently.',
    buildingId: 'territory_expander',
    effect: 'multiply_5x',
    costFBE: 500
  },
  {
    id: 'mut_plant_bond',
    name: 'Unbreakable Bond',
    description: 'Plant Partners produce 5x more of everything permanently.',
    buildingId: 'plant_partner',
    effect: 'multiply_5x',
    costFBE: 750
  },
  {
    id: 'mut_defense_fortress',
    name: 'Living Fortress',
    description: 'Pathogen Defense produces 5x more spores permanently.',
    buildingId: 'pathogen_defense',
    effect: 'multiply_5x',
    costFBE: 1000
  },
];

// --- Aspect Awakenings ---
// Gameplay-changing perks, unlocked at 10,000 FBE
export const ASPECT_AWAKENINGS: AspectAwakening[] = [
  {
    id: 'aspect_auto_click',
    name: 'Autonomous Growth',
    description: 'Gain 5 automatic clicks per second.',
    effect: 'auto_click_5',
    costFBE: 2000
  },
  {
    id: 'aspect_cheap_buildings',
    name: 'Efficient Architecture',
    description: 'All buildings cost 10% less.',
    effect: 'cost_reduction_10',
    costFBE: 3000
  },
  {
    id: 'aspect_synergy_king',
    name: 'Network Resonance',
    description: 'All synergy bonuses are tripled.',
    effect: 'synergy_triple',
    costFBE: 5000
  },
  {
    id: 'aspect_mass_converter',
    name: 'Mass Converter',
    description: 'All buildings produce 50% of their spore output as Mycelium Mass too.',
    effect: 'mass_converter_50',
    costFBE: 7500
  },
  {
    id: 'aspect_coverage_rush',
    name: 'Substrate Rush',
    description: 'Substrate Coverage gains are tripled.',
    effect: 'coverage_triple',
    costFBE: 10000
  },
];

// --- Sporulation Reset ---
export function performSporulation(state: GameState): GameState {
  const sporulationMult = getAchievementTrackMultiplier('sporulation', state.unlockedAchievements);
  const talentFBEMult = getTalentMultiplier('fbe_mult', state.prestige.talents);
  const hiddenFBEMult = getHiddenAchievementBonus('fbe_mult', state.unlockedHiddenAchievements);
  const fbeGain = calculateFBEGain(state.stats.totalSporesEarned, sporulationMult * talentFBEMult * hiddenFBEMult);
  if (fbeGain <= 0) return state; // Can't sporulate yet

  const newPrestige = {
    ...state.prestige,
    totalFBE: state.prestige.totalFBE + fbeGain,
    currentFBE: state.prestige.currentFBE + fbeGain,
    timesPrestiged: state.prestige.timesPrestiged + 1,
    cosmicBloomLevel: getCosmicBloomLevel(state.prestige.totalFBE + fbeGain),
  };

  // Track fastest sporulation
  const runTime = state.stats.totalTimePlayed;
  const fastestPrestige = state.stats.fastestPrestige === null
    ? runTime
    : Math.min(state.stats.fastestPrestige, runTime);

  // Starting spores from talents + hidden achievements
  const startingSpores = getTalentStartingSpores(state.prestige.talents)
    + getHiddenAchievementBonus('starting_spores', state.unlockedHiddenAchievements);

  return {
    ...state,
    resources: {
      spores: startingSpores,
      myceliumMass: 0,
      substrateCoverage: state.resources.substrateCoverage, // coverage persists!
    },
    buildings: [],
    purchasedUpgrades: [],
    prestige: newPrestige,
    stats: {
      ...state.stats,
      totalSporesEarned: 0,
      totalClicks: 0,
      totalSporesFromClicks: 0,
      totalTimePlayed: 0,
      highestSPS: 0,
      fastestPrestige,
      // totalBuildingsPurchased persists
    },
    lastTickTime: Date.now(),
  };
}

// Keep old name as alias for backwards compatibility
export const performPrestige = performSporulation;

// Check if lineage mutations are unlocked
export function areMutationsUnlocked(totalFBE: number): boolean {
  return totalFBE >= 2000;
}

// Check if aspect awakenings are unlocked
export function areAspectsUnlocked(totalFBE: number): boolean {
  return totalFBE >= 10000;
}

// Check if cosmic bloom is unlocked
export function isCosmicBloomUnlocked(totalFBE: number): boolean {
  return totalFBE >= 50000;
}
