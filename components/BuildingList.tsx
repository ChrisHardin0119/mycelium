'use client';
// ============================================
// MYCELIUM — Building List Panel
// ============================================

import { GameState } from '@/lib/types';
import { BUILDINGS, isBuildingUnlocked } from '@/lib/buildings';
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

  const unlockedBuildings = BUILDINGS.filter(b =>
    isBuildingUnlocked(b, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)
  );

  const nextLocked = BUILDINGS.find(b =>
    !isBuildingUnlocked(b, state.stats.totalSporesEarned, state.buildings, state.prestige.timesPrestiged)
  );

  return (
    <div className="building-list">
      <div className="panel-header">
        <span className="panel-icon">🏗️</span>
        <span>STRUCTURES</span>
        <span className="panel-count">{unlockedBuildings.length}/{BUILDINGS.length}</span>
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
        {unlockedBuildings.map(def => {
          const owned = state.buildings.find(b => b.id === def.id)?.count || 0;
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
        })}

        {nextLocked && (
          <div className="building-card locked">
            <div className="building-card-header">
              <div className="building-icon locked-icon">🔒</div>
              <div className="building-info">
                <div className="building-name locked-name">???</div>
                <div className="building-desc">
                  {nextLocked.unlockCondition.type === 'spores' && (
                    <>Earn {formatRequirement(nextLocked.unlockCondition.sporesEarned || 0)} total spores to unlock</>
                  )}
                  {nextLocked.unlockCondition.type === 'prestige' && (
                    <>Requires {nextLocked.unlockCondition.prestigeCount} Sporulation{(nextLocked.unlockCondition.prestigeCount || 0) > 1 ? 's' : ''}</>
                  )}
                  {nextLocked.unlockCondition.type === 'building' && (
                    <>Requires more buildings</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatRequirement(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1000000) return (n / 1000).toFixed(0) + 'K';
  if (n < 1000000000) return (n / 1000000).toFixed(0) + 'M';
  return (n / 1000000000).toFixed(0) + 'B';
}
