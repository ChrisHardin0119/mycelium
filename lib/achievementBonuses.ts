// ============================================
// MYCELIUM — Achievement Bonuses
// Makes all 40 achievements give gameplay bonuses
// ============================================

export interface AchievementBonus {
  achievementId: string;
  track: 'production' | 'click' | 'cost' | 'synergy' | 'sporulation';
  multiplier: number; // e.g. 1.05 = +5%
  description: string;
}

// Map each achievement to a bonus
// Production Track: spores earned milestones → +1% to +15% production
// Click Track: click count milestones → +50% to +500% click value
// Cost Track: building count milestones → +5% to +30% cost reduction
// Synergy Track: network milestones → +10% to +50% synergy effect
// Sporulation Track: prestige milestones → +5% to +15% FBE gain
export const ACHIEVEMENT_BONUSES: AchievementBonus[] = [
  // --- Production Track (spores earned milestones) ---
  { achievementId: 'spores_100', track: 'production', multiplier: 1.01, description: '+1% production' },
  { achievementId: 'spores_1k', track: 'production', multiplier: 1.02, description: '+2% production' },
  { achievementId: 'spores_10k', track: 'production', multiplier: 1.03, description: '+3% production' },
  { achievementId: 'spores_100k', track: 'production', multiplier: 1.05, description: '+5% production' },
  { achievementId: 'spores_1m', track: 'production', multiplier: 1.05, description: '+5% production' },
  { achievementId: 'spores_10m', track: 'production', multiplier: 1.08, description: '+8% production' },
  { achievementId: 'spores_100m', track: 'production', multiplier: 1.08, description: '+8% production' },
  { achievementId: 'spores_1b', track: 'production', multiplier: 1.10, description: '+10% production' },
  { achievementId: 'spores_10b', track: 'production', multiplier: 1.12, description: '+12% production' },
  { achievementId: 'spores_100b', track: 'production', multiplier: 1.15, description: '+15% production' },

  // --- Click Track (click count milestones) ---
  { achievementId: 'clicks_10', track: 'click', multiplier: 1.50, description: '+50% click value' },
  { achievementId: 'clicks_100', track: 'click', multiplier: 1.50, description: '+50% click value' },
  { achievementId: 'clicks_500', track: 'click', multiplier: 2.00, description: '+100% click value' },
  { achievementId: 'clicks_1000', track: 'click', multiplier: 2.00, description: '+100% click value' },
  { achievementId: 'clicks_5000', track: 'click', multiplier: 3.00, description: '+200% click value' },
  { achievementId: 'clicks_10000', track: 'click', multiplier: 5.00, description: '+400% click value' },

  // --- Cost Track (building milestones) ---
  { achievementId: 'buildings_5', track: 'cost', multiplier: 0.95, description: '-5% costs' },
  { achievementId: 'buildings_10', track: 'cost', multiplier: 0.95, description: '-5% costs' },
  { achievementId: 'buildings_25', track: 'cost', multiplier: 0.90, description: '-10% costs' },
  { achievementId: 'buildings_50', track: 'cost', multiplier: 0.90, description: '-10% costs' },
  { achievementId: 'buildings_100', track: 'cost', multiplier: 0.85, description: '-15% costs' },
  { achievementId: 'buildings_200', track: 'cost', multiplier: 0.80, description: '-20% costs' },
  { achievementId: 'buildings_500', track: 'cost', multiplier: 0.70, description: '-30% costs' },

  // --- Synergy Track (network/diversity milestones) ---
  { achievementId: 'tier1_complete', track: 'synergy', multiplier: 1.10, description: '+10% synergy' },
  { achievementId: 'tier2_complete', track: 'synergy', multiplier: 1.15, description: '+15% synergy' },
  { achievementId: 'tier3_complete', track: 'synergy', multiplier: 1.20, description: '+20% synergy' },
  { achievementId: 'mass_100', track: 'synergy', multiplier: 1.10, description: '+10% synergy' },
  { achievementId: 'mass_10000', track: 'synergy', multiplier: 1.20, description: '+20% synergy' },
  { achievementId: 'coverage_10', track: 'synergy', multiplier: 1.15, description: '+15% synergy' },
  { achievementId: 'coverage_50', track: 'synergy', multiplier: 1.25, description: '+25% synergy' },
  { achievementId: 'sps_100', track: 'synergy', multiplier: 1.10, description: '+10% synergy' },
  { achievementId: 'sps_10000', track: 'synergy', multiplier: 1.20, description: '+20% synergy' },
  { achievementId: 'sps_1m', track: 'synergy', multiplier: 1.30, description: '+30% synergy' },
  { achievementId: 'sps_100m', track: 'synergy', multiplier: 1.50, description: '+50% synergy' },

  // --- Sporulation Track (prestige milestones) ---
  { achievementId: 'first_prestige', track: 'sporulation', multiplier: 1.05, description: '+5% FBE gain' },
  { achievementId: 'prestige_3', track: 'sporulation', multiplier: 1.10, description: '+10% FBE gain' },
  { achievementId: 'prestige_5', track: 'sporulation', multiplier: 1.15, description: '+15% FBE gain' },

  // --- Misc achievements → production track ---
  { achievementId: 'speed_demon', track: 'production', multiplier: 1.05, description: '+5% production' },
  { achievementId: 'golden_touch', track: 'production', multiplier: 1.03, description: '+3% production' },
  { achievementId: 'night_owl', track: 'click', multiplier: 1.50, description: '+50% click value' },
];

// Calculate combined multiplier for a track based on unlocked achievements
export function getAchievementTrackMultiplier(
  track: 'production' | 'click' | 'cost' | 'synergy' | 'sporulation',
  unlockedAchievements: string[]
): number {
  let multiplier = 1;
  for (const bonus of ACHIEVEMENT_BONUSES) {
    if (bonus.track === track && unlockedAchievements.includes(bonus.achievementId)) {
      multiplier *= bonus.multiplier;
    }
  }
  return multiplier;
}

// Get all bonuses for a specific achievement
export function getAchievementBonus(achievementId: string): AchievementBonus | undefined {
  return ACHIEVEMENT_BONUSES.find(b => b.achievementId === achievementId);
}

// Get total bonus summary for display
export function getAchievementBonusSummary(unlockedAchievements: string[]): {
  productionMultiplier: number;
  clickMultiplier: number;
  costMultiplier: number;
  synergyMultiplier: number;
  sporulationMultiplier: number;
} {
  return {
    productionMultiplier: getAchievementTrackMultiplier('production', unlockedAchievements),
    clickMultiplier: getAchievementTrackMultiplier('click', unlockedAchievements),
    costMultiplier: getAchievementTrackMultiplier('cost', unlockedAchievements),
    synergyMultiplier: getAchievementTrackMultiplier('synergy', unlockedAchievements),
    sporulationMultiplier: getAchievementTrackMultiplier('sporulation', unlockedAchievements),
  };
}
