// ============================================
// MYCELIUM — Hidden Achievements (Secret Trophies)
// Each has a unique bonus when unlocked.
// ============================================

export interface HiddenAchievement {
  id: string;
  name: string;
  hint: string; // vague hint shown before unlock
  description: string; // full description shown after unlock
  icon: string;
  bonus: HiddenBonus;
  checkCondition: (ctx: HiddenCheckContext) => boolean;
}

export interface HiddenBonus {
  type: 'production_mult' | 'click_mult' | 'fbe_mult' | 'cost_reduction' | 'golden_spore_mult' |
        'mass_production' | 'coverage_production' | 'offline_mult' | 'starting_spores' | 'auto_clicks';
  value: number;
  label: string; // e.g. "+10% production"
}

export interface HiddenCheckContext {
  totalClicks: number;
  totalSporesEarned: number;
  totalTimePlayed: number; // seconds
  totalBuildingsPurchased: number;
  timesPrestiged: number;
  totalGoldenSporesCollected: number;
  totalSaves: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  currentSpores: number;
  currentMass: number;
  currentCoverage: number;
  highestSPS: number;
  buildings: { id: string; count: number }[];
  purchasedUpgrades: string[];
  unlockedAchievements: string[];
  totalFBE: number;
  talentCount: number;
  // Streak/session stats
  clicksThisSession: number;
  fastestPrestige: number | null;
  hasResetGame: boolean;
}

export const HIDDEN_ACHIEVEMENTS: HiddenAchievement[] = [
  // --- Quirky / Meta Achievements ---
  {
    id: 'hid_silence',
    name: 'The Sound of Silence',
    hint: 'Some things are best experienced quietly...',
    description: 'Turn off both music AND sound effects',
    icon: '🔇',
    bonus: { type: 'production_mult', value: 1.05, label: '+5% production' },
    checkCondition: (ctx) => !ctx.musicEnabled && !ctx.sfxEnabled,
  },
  {
    id: 'hid_hoarder',
    name: 'Data Hoarder',
    hint: 'Save early, save often...',
    description: 'Save the game 10 times',
    icon: '💾',
    bonus: { type: 'offline_mult', value: 1.15, label: '+15% offline gains' },
    checkCondition: (ctx) => ctx.totalSaves >= 10,
  },
  {
    id: 'hid_paranoid',
    name: 'Paranoid Preserver',
    hint: 'You really, really like that save button...',
    description: 'Save the game 50 times',
    icon: '🛡️',
    bonus: { type: 'cost_reduction', value: 0.97, label: '-3% all costs' },
    checkCondition: (ctx) => ctx.totalSaves >= 50,
  },
  {
    id: 'hid_golden_hunter',
    name: 'Midas Touch',
    hint: 'Chase the golden glow...',
    description: 'Collect 10 golden spores',
    icon: '✨',
    bonus: { type: 'golden_spore_mult', value: 1.5, label: '+50% golden spore value' },
    checkCondition: (ctx) => ctx.totalGoldenSporesCollected >= 10,
  },
  {
    id: 'hid_golden_master',
    name: 'Leprechaun\'s Envy',
    hint: 'The golden ones fear your speed...',
    description: 'Collect 50 golden spores',
    icon: '🌟',
    bonus: { type: 'golden_spore_mult', value: 2.0, label: '+100% golden spore value' },
    checkCondition: (ctx) => ctx.totalGoldenSporesCollected >= 50,
  },

  // --- Click Achievements ---
  {
    id: 'hid_click_frenzy',
    name: 'Carpal Tunnel Candidate',
    hint: 'Your mouse fears you...',
    description: 'Click 5,000 times total',
    icon: '🖱️',
    bonus: { type: 'click_mult', value: 1.25, label: '+25% click power' },
    checkCondition: (ctx) => ctx.totalClicks >= 5000,
  },
  {
    id: 'hid_click_legend',
    name: 'The Finger of God',
    hint: 'Ten thousand taps of fury...',
    description: 'Click 10,000 times total',
    icon: '☝️',
    bonus: { type: 'click_mult', value: 1.5, label: '+50% click power' },
    checkCondition: (ctx) => ctx.totalClicks >= 10000,
  },

  // --- Prestige Achievements ---
  {
    id: 'hid_speed_run',
    name: 'Speed Sporer',
    hint: 'The cycle turns faster than expected...',
    description: 'Sporulate in under 10 minutes',
    icon: '⚡',
    bonus: { type: 'fbe_mult', value: 1.1, label: '+10% FBE gain' },
    checkCondition: (ctx) => ctx.fastestPrestige !== null && ctx.fastestPrestige < 600,
  },
  {
    id: 'hid_prestige_10',
    name: 'Eternal Gardener',
    hint: 'The cycle never ends...',
    description: 'Sporulate 10 times',
    icon: '♾️',
    bonus: { type: 'starting_spores', value: 1000, label: '+1K starting spores per run' },
    checkCondition: (ctx) => ctx.timesPrestiged >= 10,
  },

  // --- Resource Achievements ---
  {
    id: 'hid_mass_hoarder',
    name: 'Absolute Unit',
    hint: 'Grow beyond measure...',
    description: 'Accumulate 100,000 Mycelium Mass',
    icon: '🏋️',
    bonus: { type: 'mass_production', value: 1.2, label: '+20% mass production' },
    checkCondition: (ctx) => ctx.currentMass >= 100000,
  },
  {
    id: 'hid_full_coverage',
    name: 'Total Domination',
    hint: 'Leave no substrate untouched...',
    description: 'Reach 100% substrate coverage',
    icon: '🗺️',
    bonus: { type: 'coverage_production', value: 1.25, label: '+25% coverage production' },
    checkCondition: (ctx) => ctx.currentCoverage >= 100,
  },
  {
    id: 'hid_mass_crisis',
    name: 'Fungal Famine',
    hint: 'Sometimes the network starves...',
    description: 'Let your mass drop to 0',
    icon: '💀',
    bonus: { type: 'mass_production', value: 1.1, label: '+10% mass production' },
    checkCondition: (ctx) => ctx.currentMass <= 0 && ctx.totalBuildingsPurchased > 5,
  },
  {
    id: 'hid_coverage_crash',
    name: 'Network Collapse',
    hint: 'Overexpansion has consequences...',
    description: 'Let coverage drop below 25%',
    icon: '📉',
    bonus: { type: 'production_mult', value: 1.08, label: '+8% production' },
    checkCondition: (ctx) => ctx.currentCoverage < 25 && ctx.timesPrestiged > 0,
  },

  // --- Big Number Achievements ---
  {
    id: 'hid_sps_million',
    name: 'Spore Singularity',
    hint: 'The numbers ascend beyond comprehension...',
    description: 'Reach 10 million SPS',
    icon: '🌌',
    bonus: { type: 'production_mult', value: 1.15, label: '+15% production' },
    checkCondition: (ctx) => ctx.highestSPS >= 10_000_000,
  },
  {
    id: 'hid_trillion_spores',
    name: 'Cosmic Mycologist',
    hint: 'Numbers that would make astronomers blush...',
    description: 'Earn 1 quadrillion total spores',
    icon: '🔭',
    bonus: { type: 'production_mult', value: 1.25, label: '+25% production' },
    checkCondition: (ctx) => ctx.totalSporesEarned >= 1e15,
  },

  // --- Building-specific Achievements ---
  {
    id: 'hid_100_root',
    name: 'Root Supremacy',
    hint: 'Sometimes basics are best...',
    description: 'Own 100 Root Colonizers',
    icon: '🌱',
    bonus: { type: 'production_mult', value: 1.1, label: '+10% production' },
    checkCondition: (ctx) => {
      const root = ctx.buildings.find(b => b.id === 'root_colonizer');
      return (root?.count || 0) >= 100;
    },
  },
  {
    id: 'hid_all_buildings',
    name: 'Biodiversity',
    hint: 'Variety is the spice of the underground...',
    description: 'Own at least 1 of every building type',
    icon: '🌈',
    bonus: { type: 'production_mult', value: 1.2, label: '+20% production' },
    checkCondition: (ctx) => ctx.buildings.length >= 12 && ctx.buildings.every(b => b.count > 0),
  },

  // --- Time Achievements ---
  {
    id: 'hid_patient',
    name: 'Patience of Fungi',
    hint: 'Time is the greatest nutrient...',
    description: 'Play for 1 hour total',
    icon: '⏰',
    bonus: { type: 'offline_mult', value: 1.1, label: '+10% offline gains' },
    checkCondition: (ctx) => ctx.totalTimePlayed >= 3600,
  },
  {
    id: 'hid_dedicated',
    name: 'Mycelium Devotee',
    hint: 'The network knows loyalty...',
    description: 'Play for 10 hours total',
    icon: '🏅',
    bonus: { type: 'auto_clicks', value: 2, label: '+2 auto-clicks/sec' },
    checkCondition: (ctx) => ctx.totalTimePlayed >= 36000,
  },

  // --- Talent/FBE Achievements ---
  {
    id: 'hid_talent_collector',
    name: 'Polymath Fungus',
    hint: 'Knowledge has many branches...',
    description: 'Purchase 15 talents',
    icon: '🧠',
    bonus: { type: 'fbe_mult', value: 1.15, label: '+15% FBE gain' },
    checkCondition: (ctx) => ctx.talentCount >= 15,
  },
  {
    id: 'hid_fbe_whale',
    name: 'Essence Baron',
    hint: 'FBE flows like water through your network...',
    description: 'Accumulate 500 total FBE',
    icon: '💎',
    bonus: { type: 'fbe_mult', value: 1.2, label: '+20% FBE gain' },
    checkCondition: (ctx) => ctx.totalFBE >= 500,
  },
];

// Helper: get hidden achievement definition
export function getHiddenAchievementDef(id: string): HiddenAchievement | undefined {
  return HIDDEN_ACHIEVEMENTS.find(a => a.id === id);
}

// Helper: check newly unlocked hidden achievements
export function checkHiddenAchievements(
  ctx: HiddenCheckContext,
  alreadyUnlocked: string[]
): string[] {
  const newlyUnlocked: string[] = [];
  for (const ach of HIDDEN_ACHIEVEMENTS) {
    if (alreadyUnlocked.includes(ach.id)) continue;
    if (ach.checkCondition(ctx)) {
      newlyUnlocked.push(ach.id);
    }
  }
  return newlyUnlocked;
}

// Helper: calculate total hidden achievement bonus for a given type
export function getHiddenAchievementBonus(
  bonusType: HiddenBonus['type'],
  unlockedIds: string[]
): number {
  let result = bonusType === 'starting_spores' || bonusType === 'auto_clicks' ? 0 : 1;

  for (const id of unlockedIds) {
    const ach = getHiddenAchievementDef(id);
    if (!ach || ach.bonus.type !== bonusType) continue;

    if (bonusType === 'starting_spores' || bonusType === 'auto_clicks') {
      result += ach.bonus.value;
    } else {
      result *= ach.bonus.value;
    }
  }
  return result;
}
