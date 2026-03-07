'use client';
// ============================================
// MYCELIUM — Next Unlock Progress Bar
// ============================================

import { GameState } from '@/lib/types';
import { BUILDINGS, isBuildingUnlocked } from '@/lib/buildings';
import { formatNumber } from '@/lib/formatNumber';

interface NextUnlockBarProps {
  state: GameState;
}

export default function NextUnlockBar({ state }: NextUnlockBarProps) {
  // Find the next locked building
  const nextLocked = BUILDINGS.find(b =>
    !isBuildingUnlocked(b, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)
  );

  if (!nextLocked) return null; // All unlocked!

  const cond = nextLocked.unlockCondition;
  let progress = 0;
  let current = '';
  let target = '';
  let label = '';

  switch (cond.type) {
    case 'spores': {
      const needed = cond.sporesEarned || 0;
      progress = Math.min(1, state.stats.totalSporesEarned / needed);
      current = formatNumber(state.stats.totalSporesEarned, state.settings.notation);
      target = formatNumber(needed, state.settings.notation);
      label = `${current} / ${target} spores earned`;
      break;
    }
    case 'building': {
      const b = state.buildings.find(b => b.id === cond.buildingId);
      const have = b?.count || 0;
      const needed = cond.buildingCount || 0;
      progress = Math.min(1, have / needed);
      label = `${have} / ${needed} ${cond.buildingId?.replace(/_/g, ' ')}`;
      break;
    }
    case 'prestige': {
      const needed = cond.prestigeCount || 0;
      progress = Math.min(1, state.prestige.timesPrestiged / needed);
      label = `${state.prestige.timesPrestiged} / ${needed} Fruiting Cycles`;
      break;
    }
    default:
      return null;
  }

  const pct = Math.floor(progress * 100);

  return (
    <div className="next-unlock-bar">
      <div className="next-unlock-header">
        <span className="next-unlock-icon">🔓</span>
        <span className="next-unlock-title">NEXT UNLOCK</span>
        <span className="next-unlock-name">{nextLocked.icon} {nextLocked.name}</span>
      </div>
      <div className="next-unlock-track">
        <div
          className="next-unlock-fill"
          style={{ width: `${pct}%` }}
        />
        <div className="next-unlock-label">{label}</div>
      </div>
      <div className="next-unlock-percent">{pct}%</div>
    </div>
  );
}
