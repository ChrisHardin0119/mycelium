'use client';
// ============================================
// MYCELIUM — Building List Panel
// ============================================

import { GameState } from '@/lib/types';
import { BUILDINGS, isBuildingUnlocked, getBuildingCost } from '@/lib/buildings';
import { formatNumber } from '@/lib/formatNumber';
import BuildingCard from './BuildingCard';

export type BuyMode = 1 | 5 | 10 | 100 | 'max';

interface BuildingListProps {
  state: GameState;
  onPurchase: (buildingId: string) => void;
  onPurchaseMultiple: (buildingId: string, count: number) => void;
  buyMode: BuyMode;
  onBuyModeChange: (mode: BuyMode) => void;
}

export default function BuildingList({ state, onPurchase, onPurchaseMultiple, buyMode, onBuyModeChange }: BuildingListProps) {
  const notation = state.settings.notation;

  return (
    <div className="building-list">
      <div className="panel-header">
        <span className="panel-icon">🏗️</span>
        <span>STRUCTURES</span>
        <span className="panel-count">
          {BUILDINGS.filter(b => isBuildingUnlocked(b, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)).length}/{BUILDINGS.length}
        </span>
      </div>

      {/* Buy mode toggle */}
      <div className="buy-mode-toggle">
        {([1, 5, 10, 100, 'max'] as BuyMode[]).map(mode => (
          <button
            key={String(mode)}
            className={`buy-mode-btn ${buyMode === mode ? 'active' : ''}`}
            onClick={() => onBuyModeChange(mode)}
          >
            {mode === 'max' ? 'MAX' : `x${mode}`}
          </button>
        ))}
      </div>

      <div className="building-scroll">
        {BUILDINGS.map(def => {
          const unlocked = isBuildingUnlocked(def, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged);
          const owned = state.buildings.find(b => b.id === def.id)?.count || 0;

          if (unlocked) {
            return (
              <BuildingCard
                key={def.id}
                def={def}
                owned={owned}
                state={state}
                onPurchase={onPurchase}
                onPurchaseMultiple={onPurchaseMultiple}
                buyMode={buyMode}
              />
            );
          }

          // Locked building — show name, icon, cost, and unlock requirement
          const cost = getBuildingCost(def, 0);
          return (
            <div key={def.id} className="building-card locked-building">
              <div className="building-card-header">
                <div className="building-icon locked-icon">🔒</div>
                <div className="building-info">
                  <div className="building-name locked-name">{def.name}</div>
                  <div className="building-desc locked-desc">{def.description}</div>
                </div>
              </div>

              {/* Show unlock requirement */}
              <div className="locked-requirement">
                {def.unlockCondition.type === 'spores' && (
                  <span>🔓 Earn {formatNumber(def.unlockCondition.sporesEarned || 0, notation)} total spores to unlock</span>
                )}
                {def.unlockCondition.type === 'prestige' && (
                  <span>🔓 Requires {def.unlockCondition.prestigeCount} Sporulation{(def.unlockCondition.prestigeCount || 0) > 1 ? 's' : ''}</span>
                )}
                {def.unlockCondition.type === 'building' && (
                  <span>🔓 Requires more buildings</span>
                )}
              </div>

              {/* Show costs so player knows what to aim for */}
              <div className="locked-costs">
                <span className="locked-cost-label">Base Cost:</span>
                <span className="locked-cost-value">🍄 {formatNumber(cost.spores, notation)}</span>
                {cost.myceliumMass > 0 && (
                  <span className="locked-cost-value">🧬 {formatNumber(cost.myceliumMass, notation)}</span>
                )}
                {cost.substrateCoverage > 0 && (
                  <span className="locked-cost-value">🗺️ {cost.substrateCoverage}%</span>
                )}
              </div>

              {/* Show base production preview */}
              <div className="locked-production">
                +{formatNumber(def.baseProduction.sporesPerSecond, notation)} SPS
                {def.baseProduction.myceliumMassPerSecond && (
                  <span> | +{formatNumber(def.baseProduction.myceliumMassPerSecond, notation)} Mass/s</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
