// ============================================
// MYCELIUM — Core Game Engine
// ============================================

import { GameState, Resources, OwnedBuilding, BuildingProduction } from './types';
import { BUILDINGS, getBuildingDef, getBuildingCost } from './buildings';
import { UPGRADES, getUpgradeDef } from './upgrades';
import { getFBEMultiplier, getCosmicBloomMultiplier, LINEAGE_MUTATIONS, ASPECT_AWAKENINGS } from './prestige';

// --- Calculate per-second production for a single building ---
function getBuildingProductionRate(
  buildingId: string,
  count: number,
  state: GameState
): BuildingProduction {
  const def = getBuildingDef(buildingId);
  if (!def || count === 0) return { sporesPerSecond: 0 };

  let sps = def.baseProduction.sporesPerSecond * count;
  let mps = (def.baseProduction.myceliumMassPerSecond || 0) * count;
  let cps = (def.baseProduction.substrateCoveragePerSecond || 0) * count;

  // Apply upgrades
  let buildingMultiplier = 1;
  let allMultiplier = 1;
  let synergyBoost = 1;

  for (const upgradeId of state.purchasedUpgrades) {
    const upDef = getUpgradeDef(upgradeId);
    if (!upDef) continue;

    switch (upDef.effect.type) {
      case 'multiply_building':
        if (upDef.effect.targetBuildingId === buildingId) {
          buildingMultiplier *= upDef.effect.value;
        }
        break;
      case 'multiply_all':
        allMultiplier *= upDef.effect.value;
        break;
      case 'synergy_boost':
        synergyBoost *= upDef.effect.value;
        break;
    }
  }

  // Apply synergies from OTHER buildings
  let synergyMultiplier = 1;
  for (const otherBuilding of state.buildings) {
    const otherDef = getBuildingDef(otherBuilding.id);
    if (!otherDef) continue;

    for (const syn of otherDef.synergies) {
      if (syn.targetBuildingId === buildingId) {
        switch (syn.bonusType) {
          case 'add_percent':
            synergyMultiplier += (syn.bonusValue / 100) * otherBuilding.count * synergyBoost;
            break;
          case 'multiply':
            synergyMultiplier *= 1 + (syn.bonusValue * otherBuilding.count * synergyBoost);
            break;
          case 'add_flat':
            sps += syn.bonusValue * otherBuilding.count * synergyBoost;
            break;
        }
      }
    }
  }

  // Aspect awakening: synergy triple
  if (state.prestige.aspectAwakenings.includes('aspect_synergy_king')) {
    synergyMultiplier = 1 + (synergyMultiplier - 1) * 3;
  }

  // Lineage mutations (5x for specific buildings)
  let mutationMultiplier = 1;
  for (const mutId of state.prestige.lineageMutations) {
    const mut = LINEAGE_MUTATIONS.find(m => m.id === mutId);
    if (mut && mut.buildingId === buildingId) {
      mutationMultiplier *= 5;
    }
  }

  // FBE bonus
  const fbeMultiplier = getFBEMultiplier(state.prestige.totalFBE);

  // Cosmic bloom
  const cosmicMultiplier = getCosmicBloomMultiplier(state.prestige.cosmicBloomLevel);

  const totalMult = buildingMultiplier * allMultiplier * synergyMultiplier * mutationMultiplier * fbeMultiplier * cosmicMultiplier;

  sps *= totalMult;
  mps *= totalMult;
  cps *= totalMult;

  // Aspect awakening: mass converter
  if (state.prestige.aspectAwakenings.includes('aspect_mass_converter')) {
    mps += sps * 0.5;
  }

  // Aspect awakening: coverage rush
  if (state.prestige.aspectAwakenings.includes('aspect_coverage_rush')) {
    cps *= 3;
  }

  return {
    sporesPerSecond: sps,
    myceliumMassPerSecond: mps,
    substrateCoveragePerSecond: cps,
  };
}

// --- Calculate total production per second ---
export function getTotalProduction(state: GameState): BuildingProduction {
  let totalSPS = 0;
  let totalMPS = 0;
  let totalCPS = 0;

  for (const building of state.buildings) {
    const prod = getBuildingProductionRate(building.id, building.count, state);
    totalSPS += prod.sporesPerSecond;
    totalMPS += (prod.myceliumMassPerSecond || 0);
    totalCPS += (prod.substrateCoveragePerSecond || 0);
  }

  return {
    sporesPerSecond: totalSPS,
    myceliumMassPerSecond: totalMPS,
    substrateCoveragePerSecond: totalCPS,
  };
}

// --- Calculate click value ---
export function getClickValue(state: GameState): number {
  let base = 1;

  // Click multiplier from upgrades
  for (const upgradeId of state.purchasedUpgrades) {
    const upDef = getUpgradeDef(upgradeId);
    if (upDef && upDef.effect.type === 'multiply_click') {
      base *= upDef.effect.value;
    }
  }

  // FBE bonus applies to clicks too
  base *= getFBEMultiplier(state.prestige.totalFBE);

  // Also add 1% of SPS per click (makes clicking always feel worthwhile)
  const production = getTotalProduction(state);
  base += production.sporesPerSecond * 0.01;

  return base;
}

// --- Process a game tick ---
export function processTick(state: GameState, deltaSeconds: number): GameState {
  const production = getTotalProduction(state);

  const sporeGain = production.sporesPerSecond * deltaSeconds;
  const massGain = (production.myceliumMassPerSecond || 0) * deltaSeconds;
  const coverageGain = (production.substrateCoveragePerSecond || 0) * deltaSeconds;

  // Auto-click from aspect awakening
  let autoClickGain = 0;
  if (state.prestige.aspectAwakenings.includes('aspect_auto_click')) {
    autoClickGain = getClickValue(state) * 5 * deltaSeconds;
  }

  const newSpores = state.resources.spores + sporeGain + autoClickGain;
  const newMass = state.resources.myceliumMass + massGain;
  const newCoverage = Math.min(100, state.resources.substrateCoverage + coverageGain);

  const newTotalEarned = state.stats.totalSporesEarned + sporeGain + autoClickGain;
  const currentSPS = production.sporesPerSecond;

  return {
    ...state,
    resources: {
      spores: newSpores,
      myceliumMass: newMass,
      substrateCoverage: newCoverage,
    },
    stats: {
      ...state.stats,
      totalSporesEarned: newTotalEarned,
      totalTimePlayed: state.stats.totalTimePlayed + deltaSeconds,
      highestSPS: Math.max(state.stats.highestSPS, currentSPS),
    },
    lastTickTime: Date.now(),
  };
}

// --- Handle a click ---
export function processClick(state: GameState): GameState {
  const clickValue = getClickValue(state);
  return {
    ...state,
    resources: {
      ...state.resources,
      spores: state.resources.spores + clickValue,
    },
    stats: {
      ...state.stats,
      totalClicks: state.stats.totalClicks + 1,
      totalSporesFromClicks: state.stats.totalSporesFromClicks + clickValue,
      totalSporesEarned: state.stats.totalSporesEarned + clickValue,
    },
  };
}

// --- Purchase a building ---
export function purchaseBuilding(state: GameState, buildingId: string): GameState | null {
  const def = getBuildingDef(buildingId);
  if (!def) return null;

  const owned = state.buildings.find(b => b.id === buildingId)?.count || 0;
  const cost = getBuildingCost(def, owned);

  // Apply cost reduction from aspect
  let costMult = 1;
  if (state.prestige.aspectAwakenings.includes('aspect_cheap_buildings')) {
    costMult = 0.9;
  }

  const finalSporeCost = cost.spores * costMult;
  const finalMassCost = cost.myceliumMass * costMult;

  // Check if player can afford
  if (state.resources.spores < finalSporeCost) return null;
  if (finalMassCost > 0 && state.resources.myceliumMass < finalMassCost) return null;
  if (cost.substrateCoverage > 0 && state.resources.substrateCoverage < cost.substrateCoverage) return null;

  // Deduct cost
  const newResources = {
    ...state.resources,
    spores: state.resources.spores - finalSporeCost,
    myceliumMass: state.resources.myceliumMass - finalMassCost,
  };

  // Add building
  const existingIdx = state.buildings.findIndex(b => b.id === buildingId);
  let newBuildings: OwnedBuilding[];
  if (existingIdx >= 0) {
    newBuildings = [...state.buildings];
    newBuildings[existingIdx] = { ...newBuildings[existingIdx], count: newBuildings[existingIdx].count + 1 };
  } else {
    newBuildings = [...state.buildings, { id: buildingId, count: 1 }];
  }

  return {
    ...state,
    resources: newResources,
    buildings: newBuildings,
    stats: {
      ...state.stats,
      totalBuildingsPurchased: state.stats.totalBuildingsPurchased + 1,
    },
  };
}

// --- Purchase an upgrade ---
export function purchaseUpgrade(state: GameState, upgradeId: string): GameState | null {
  const def = getUpgradeDef(upgradeId);
  if (!def) return null;
  if (state.purchasedUpgrades.includes(upgradeId)) return null;

  // Check cost
  if (state.resources.spores < def.cost.spores) return null;
  if (def.cost.myceliumMass && state.resources.myceliumMass < def.cost.myceliumMass) return null;

  return {
    ...state,
    resources: {
      ...state.resources,
      spores: state.resources.spores - def.cost.spores,
      myceliumMass: state.resources.myceliumMass - (def.cost.myceliumMass || 0),
    },
    purchasedUpgrades: [...state.purchasedUpgrades, upgradeId],
  };
}

// --- Calculate offline gains ---
export function calculateOfflineGains(state: GameState, offlineSeconds: number): Resources {
  // Offline production is 50% of normal rate (balances AFK vs active play)
  const production = getTotalProduction(state);
  const offlineRate = 0.5;

  return {
    spores: production.sporesPerSecond * offlineSeconds * offlineRate,
    myceliumMass: (production.myceliumMassPerSecond || 0) * offlineSeconds * offlineRate,
    substrateCoverage: (production.substrateCoveragePerSecond || 0) * offlineSeconds * offlineRate,
  };
}

// --- Create initial game state ---
export function createInitialState(): GameState {
  return {
    resources: { spores: 0, myceliumMass: 0, substrateCoverage: 0 },
    buildings: [],
    purchasedUpgrades: [],
    prestige: {
      totalFBE: 0,
      currentFBE: 0,
      timesPrestiged: 0,
      lineageMutations: [],
      aspectAwakenings: [],
      cosmicBloomLevel: 0,
    },
    unlockedAchievements: [],
    stats: {
      totalSporesEarned: 0,
      totalClicks: 0,
      totalSporesFromClicks: 0,
      totalTimePlayed: 0,
      highestSPS: 0,
      fastestPrestige: null,
      totalBuildingsPurchased: 0,
    },
    settings: {
      musicEnabled: true,
      sfxEnabled: true,
      notation: 'standard',
      autoSaveInterval: 30,
      showOfflineGains: true,
      particleEffects: true,
    },
    lastSaveTime: Date.now(),
    lastTickTime: Date.now(),
    version: 1,
  };
}
