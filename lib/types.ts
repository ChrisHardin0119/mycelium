// ============================================
// MYCELIUM — Core Type Definitions
// ============================================

// --- Resources ---
export interface Resources {
  spores: number;
  myceliumMass: number;
  substrateCoverage: number; // percentage 0-100
}

// --- Buildings ---
export interface BuildingDefinition {
  id: string;
  name: string;
  description: string;
  flavor: string;
  tier: 1 | 2 | 3 | 4;
  baseCost: BuildingCost;
  baseProduction: BuildingProduction;
  costMultiplier: number; // typically 1.15
  unlockCondition: UnlockCondition;
  synergies: Synergy[];
  icon: string; // emoji for now
}

export interface BuildingCost {
  spores: number;
  myceliumMass?: number;
  substrateCoverage?: number; // minimum % required
}

export interface BuildingProduction {
  sporesPerSecond: number;
  myceliumMassPerSecond?: number;
  substrateCoveragePerSecond?: number;
}

export interface UnlockCondition {
  type: 'spores' | 'building' | 'prestige' | 'always';
  buildingId?: string;
  buildingCount?: number;
  sporesEarned?: number;
  prestigeCount?: number;
}

export interface Synergy {
  targetBuildingId: string;
  bonusType: 'multiply' | 'add_flat' | 'add_percent';
  bonusValue: number;
  description: string;
}

export interface OwnedBuilding {
  id: string;
  count: number;
}

// --- Upgrades ---
export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  cost: BuildingCost;
  effect: UpgradeEffect;
  unlockCondition: UnlockCondition;
  icon: string;
  tier: 1 | 2 | 3 | 4;
}

export interface UpgradeEffect {
  type: 'multiply_building' | 'multiply_all' | 'multiply_click' | 'add_sps' | 'synergy_boost' | 'unlock_resource';
  targetBuildingId?: string;
  value: number;
}

// --- Prestige ---
export interface PrestigeState {
  totalFBE: number; // Fruiting Body Essence (lifetime)
  currentFBE: number; // spendable FBE
  timesPrestiged: number;
  lineageMutations: string[]; // selected mutation IDs
  aspectAwakenings: string[]; // selected aspect IDs
  cosmicBloomLevel: number;
}

export interface LineageMutation {
  id: string;
  name: string;
  description: string;
  buildingId: string;
  effect: string;
  costFBE: number;
}

export interface AspectAwakening {
  id: string;
  name: string;
  description: string;
  effect: string;
  costFBE: number;
}

// --- Achievements ---
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: 'spores_earned' | 'buildings_owned' | 'prestige_count' | 'click_count' | 'sps_reached' | 'coverage_reached';
  value: number;
  buildingId?: string;
}

// --- Game State ---
export interface GameState {
  resources: Resources;
  buildings: OwnedBuilding[];
  purchasedUpgrades: string[];
  prestige: PrestigeState;
  unlockedAchievements: string[];
  stats: GameStats;
  settings: GameSettings;
  lastSaveTime: number;
  lastTickTime: number;
  version: number;
}

export interface GameStats {
  totalSporesEarned: number;
  totalClicks: number;
  totalSporesFromClicks: number;
  totalTimePlayed: number; // seconds
  highestSPS: number;
  fastestPrestige: number | null; // seconds
  totalBuildingsPurchased: number;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  notation: 'standard' | 'scientific' | 'engineering';
  autoSaveInterval: number; // seconds
  showOfflineGains: boolean;
  particleEffects: boolean;
}

// --- UI State (not saved) ---
export interface UIState {
  activeTab: 'buildings' | 'upgrades' | 'prestige' | 'stats';
  showSettings: boolean;
  showOfflinePopup: boolean;
  offlineGains: Resources | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'achievement' | 'unlock' | 'prestige' | 'milestone';
  timestamp: number;
}

// --- Save format version ---
export const SAVE_VERSION = 1;
