'use client';
// ============================================
// MYCELIUM — Building List Panel
// ============================================

import { useState } from 'react';
import { GameState } from '@/lib/types';
import { BUILDINGS, isBuildingUnlocked } from '@/lib/buildings';
import BuildingCard from './BuildingCard';

type BuyMode = 1 | 10 | 'max';

interface BuildingListProps {
  state: GameState;
  onPurchase: (buildingId: string) => void;
  onPurchaseMultiple: (buildingId: string, count: number) => void;
}

export default function BuildingList({ state, onPurchase, onPurchaseMultiple }: BuildingListProps) {
  const [buyMode, setBuyMode] = useState<BuyMode>(1);

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
        <button
          className={`buy-mode-btn ${buyMode === 1 ? 'active' : ''}`}
          onClick={() => setBuyMode(1)}
        >
          x1
        </button>
        <button
          className={`buy-mode-btn ${buyMode === 10 ? 'active' : ''}`}
          onClick={() => setBuyMode(10)}
        >
          x10
        </button>
        <button
          className={`buy-mode-btn ${buyMode === 'max' ? 'active' : ''}`}
          onClick={() => setBuyMode('max')}
        >
          MAX
        </button>
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
                    <>Requires {nextLocked.unlockCondition.prestigeCount} Fruiting Cycle{(nextLocked.unlockCondition.prestigeCount || 0) > 1 ? 's' : ''}</>
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
