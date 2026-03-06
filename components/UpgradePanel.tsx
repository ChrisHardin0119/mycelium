'use client';
// ============================================
// MYCELIUM — Upgrade Panel
// ============================================

import { GameState } from '@/lib/types';
import { UPGRADES, isUpgradeUnlocked } from '@/lib/upgrades';
import UpgradeCard from './UpgradeCard';

interface UpgradePanelProps {
  state: GameState;
  onPurchase: (upgradeId: string) => void;
}

export default function UpgradePanel({ state, onPurchase }: UpgradePanelProps) {
  // Available upgrades: unlocked + not purchased
  const available = UPGRADES.filter(u =>
    !state.purchasedUpgrades.includes(u.id) &&
    isUpgradeUnlocked(u, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)
  );

  const purchased = state.purchasedUpgrades.length;

  return (
    <div className="upgrade-panel">
      <div className="panel-header">
        <span className="panel-icon">⬆️</span>
        <span>UPGRADES</span>
        <span className="panel-count">{purchased}/{UPGRADES.length}</span>
      </div>

      <div className="upgrade-scroll">
        {available.length === 0 ? (
          <div className="empty-panel">
            <div className="empty-icon">🔬</div>
            <div className="empty-text">
              {purchased === UPGRADES.length
                ? 'All upgrades purchased!'
                : 'Keep growing to unlock more upgrades...'}
            </div>
          </div>
        ) : (
          available.map(def => (
            <UpgradeCard
              key={def.id}
              def={def}
              state={state}
              onPurchase={onPurchase}
            />
          ))
        )}
      </div>
    </div>
  );
}
