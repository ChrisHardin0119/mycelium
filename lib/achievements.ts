// ============================================
// MYCELIUM — Achievement Definitions
// ============================================

import { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // --- Early milestones (first 2 minutes) ---
  {
    id: 'first_spore',
    name: 'First Contact',
    description: 'Click for the very first time',
    icon: '👆',
    condition: { type: 'click_count', value: 1 },
  },
  {
    id: 'ten_clicks',
    name: 'Getting the Hang of It',
    description: 'Click 10 times',
    icon: '🖱️',
    condition: { type: 'click_count', value: 10 },
  },
  {
    id: 'first_50_spores',
    name: 'Spore Cloud',
    description: 'Earn 50 total spores',
    icon: '🌫️',
    condition: { type: 'spores_earned', value: 50 },
  },
  {
    id: 'first_100_spores',
    name: 'Centennial Bloom',
    description: 'Earn 100 total spores',
    icon: '💯',
    condition: { type: 'spores_earned', value: 100 },
  },
  {
    id: 'first_building',
    name: 'Foundation Laid',
    description: 'Purchase your first building',
    icon: '🏗️',
    condition: { type: 'buildings_owned', value: 1 },
  },
  {
    id: 'five_buildings',
    name: 'Growing Network',
    description: 'Own 5 buildings total',
    icon: '🌐',
    condition: { type: 'buildings_owned', value: 5 },
  },

  // --- Early-mid milestones ---
  {
    id: 'sps_1',
    name: 'Passive Income',
    description: 'Reach 1 spore per second',
    icon: '⏱️',
    condition: { type: 'sps_reached', value: 1 },
  },
  {
    id: 'sps_10',
    name: 'Trickle Becomes Stream',
    description: 'Reach 10 spores per second',
    icon: '💧',
    condition: { type: 'sps_reached', value: 10 },
  },
  {
    id: 'sps_100',
    name: 'River of Spores',
    description: 'Reach 100 spores per second',
    icon: '🌊',
    condition: { type: 'sps_reached', value: 100 },
  },
  {
    id: 'spores_1k',
    name: 'Kiloculture',
    description: 'Earn 1,000 total spores',
    icon: '🔢',
    condition: { type: 'spores_earned', value: 1_000 },
  },
  {
    id: 'spores_10k',
    name: 'Spore Storm',
    description: 'Earn 10,000 total spores',
    icon: '⛈️',
    condition: { type: 'spores_earned', value: 10_000 },
  },
  {
    id: 'spores_100k',
    name: 'Underground Empire',
    description: 'Earn 100,000 total spores',
    icon: '👑',
    condition: { type: 'spores_earned', value: 100_000 },
  },
  {
    id: 'spores_1m',
    name: 'Megamycelium',
    description: 'Earn 1,000,000 total spores',
    icon: '🏰',
    condition: { type: 'spores_earned', value: 1_000_000 },
  },
  {
    id: 'click_50',
    name: 'Clicker Apprentice',
    description: 'Click 50 times',
    icon: '🎯',
    condition: { type: 'click_count', value: 50 },
  },
  {
    id: 'click_100',
    name: 'Clicker Adept',
    description: 'Click 100 times',
    icon: '🏅',
    condition: { type: 'click_count', value: 100 },
  },
  {
    id: 'click_500',
    name: 'Clicker Master',
    description: 'Click 500 times',
    icon: '🏆',
    condition: { type: 'click_count', value: 500 },
  },
  {
    id: 'ten_buildings',
    name: 'Budding Colony',
    description: 'Own 10 buildings total',
    icon: '🏘️',
    condition: { type: 'buildings_owned', value: 10 },
  },
  {
    id: 'twenty_buildings',
    name: 'Fungal Metropolis',
    description: 'Own 20 buildings total',
    icon: '🌆',
    condition: { type: 'buildings_owned', value: 20 },
  },
  {
    id: 'sps_1k',
    name: 'Industrial Decomposition',
    description: 'Reach 1,000 spores per second',
    icon: '🏭',
    condition: { type: 'sps_reached', value: 1_000 },
  },
  {
    id: 'sps_10k',
    name: 'Spore Tsunami',
    description: 'Reach 10,000 spores per second',
    icon: '🌋',
    condition: { type: 'sps_reached', value: 10_000 },
  },

  // --- Prestige milestones ---
  {
    id: 'first_prestige',
    name: 'Fruiting Cycle',
    description: 'Prestige for the first time',
    icon: '✨',
    condition: { type: 'prestige_count', value: 1 },
  },
  {
    id: 'prestige_3',
    name: 'Cycle Veteran',
    description: 'Prestige 3 times',
    icon: '🔄',
    condition: { type: 'prestige_count', value: 3 },
  },
  {
    id: 'prestige_5',
    name: 'Eternal Return',
    description: 'Prestige 5 times',
    icon: '♾️',
    condition: { type: 'prestige_count', value: 5 },
  },

  // --- Big number milestones ---
  {
    id: 'spores_1b',
    name: 'Billionaire Bloom',
    description: 'Earn 1 billion total spores',
    icon: '💰',
    condition: { type: 'spores_earned', value: 1_000_000_000 },
  },
  {
    id: 'spores_1t',
    name: 'Trillion Tendrils',
    description: 'Earn 1 trillion total spores',
    icon: '🌌',
    condition: { type: 'spores_earned', value: 1_000_000_000_000 },
  },
];

// Helper: check which achievements are newly unlocked
export function checkAchievements(
  state: {
    unlockedAchievements: string[];
    stats: { totalSporesEarned: number; totalClicks: number; highestSPS: number; totalBuildingsPurchased: number };
    prestige: { timesPrestiged: number };
    buildings: { id: string; count: number }[];
    resources: { substrateCoverage: number };
  }
): string[] {
  const newlyUnlocked: string[] = [];
  const totalBuildings = state.buildings.reduce((sum, b) => sum + b.count, 0);

  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievements.includes(ach.id)) continue;

    let met = false;
    switch (ach.condition.type) {
      case 'spores_earned':
        met = state.stats.totalSporesEarned >= ach.condition.value;
        break;
      case 'buildings_owned':
        met = totalBuildings >= ach.condition.value;
        break;
      case 'prestige_count':
        met = state.prestige.timesPrestiged >= ach.condition.value;
        break;
      case 'click_count':
        met = state.stats.totalClicks >= ach.condition.value;
        break;
      case 'sps_reached':
        met = state.stats.highestSPS >= ach.condition.value;
        break;
      case 'coverage_reached':
        met = state.resources.substrateCoverage >= ach.condition.value;
        break;
    }

    if (met) newlyUnlocked.push(ach.id);
  }

  return newlyUnlocked;
}

export function getAchievementDef(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
