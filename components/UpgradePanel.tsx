'use client';
// ============================================
// MYCELIUM — Upgrade Panel
// ============================================

import { GameState } from '@/lib/types';
import { UPGRADES, isUpgradeUnlocked } from '@/lib/upgrades';
import { formatNumber } from '@/lib/formatNumber';
import UpgradeCard from './UpgradeCard';

interface UpgradePanelProps {
  state: GameState;
  onPurchase: (upgradeId: string) => void;
}

export default function UpgradePanel({ state, onPurchase }: UpgradePanelProps) {
  const notation = state.settings.notation;

  // Available upgrades: unlocked + not purchased
  const available = UPGRADES.filter(u =>
    !state.purchasedUpgrades.includes(u.id) &&
    isUpgradeUnlocked(u, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)
  );

  // Locked upgrades: not unlocked + not purchased
  const locked = UPGRADES.filter(u =>
    !state.purchasedUpgrades.includes(u.id) &&
    !isUpgradeUnlocked(u, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)
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
        {/* Available upgrades */}
        {available.length === 0 && locked.length === 0 && (
          <div className="empty-panel">
            <div className="empty-icon">🔬</div>
            <div className="empty-text">All upgrades purchased!</div>
          </div>
        )}

        {available.map(def => (
          <UpgradeCard
            key={def.id}
            def={def}
            state={state}
            onPurchase={onPurchase}
          />
        ))}

        {/* Locked upgrades — visible but greyed out */}
        {locked.length > 0 && (
          <>
            <div className="locked-divider">
              <span className="locked-divider-text">🔒 LOCKED ({locked.length})</span>
            </div>
            {locked.map(def => (
              <div key={def.id} className="upgrade-card locked-upgrade">
                <div className="upgrade-card-top">
                  <span className="upgrade-icon locked-icon">🔒</span>
                  <div className="upgrade-info">
                    <div className="upgrade-name locked-name">{def.name}</div>
                    <div className="upgrade-desc">{def.description}</div>
                  </div>
                </div>
                <div className="locked-requirement">
                  {def.unlockCondition.type === 'building' && (
                    <span>Requires {def.unlockCondition.buildingCount} {def.unlockCondition.buildingId?.replace(/_/g, ' ')}</span>
                  )}
                  {def.unlockCondition.type === 'spores' && (
                    <span>Earn {formatNumber(def.unlockCondition.sporesEarned || 0, notation)} total spores</span>
                  )}
                  {def.unlockCondition.type === 'prestige' && (
                    <span>Requires {def.unlockCondition.prestigeCount} Sporulation{(def.unlockCondition.prestigeCount || 0) > 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="locked-costs">
                  <span className="locked-cost-label">Cost:</span>
                  <span className="locked-cost-value">🍄 {formatNumber(def.cost.spores, notation)}</span>
                  {def.cost.myceliumMass && def.cost.myceliumMass > 0 && (
                    <span className="locked-cost-value">🧬 {formatNumber(def.cost.myceliumMass, notation)}</span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
