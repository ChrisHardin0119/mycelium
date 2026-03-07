// ============================================
// MYCELIUM — Prestige (re-exports from sporulation.ts)
// This file exists for backwards compatibility.
// All logic lives in sporulation.ts now.
// ============================================

export {
  calculateFBEGain,
  getFBEMultiplier,
  getCosmicBloomLevel,
  getCosmicBloomMultiplier,
  LINEAGE_MUTATIONS,
  ASPECT_AWAKENINGS,
  performSporulation,
  performPrestige,
  areMutationsUnlocked,
  areAspectsUnlocked,
  isCosmicBloomUnlocked,
} from './sporulation';
