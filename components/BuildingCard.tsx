'use client';
// ============================================
// MYCELIUM — Individual Building Card
// ============================================

import { BuildingDefinition, GameState } from '@/lib/types';
import { getBuildingCost } from '@/lib/buildings';
import { formatNumber } from '@/lib/formatNumber';
import { getNextMilestone, getMilestoneMultiplier } from '@/lib/milestones';

interface BuildingCardProps {
  def: BuildingDefinition;
  owned: number;
  state: GameState;
  onPurchase: (buildingId: string) => void;
}

export default function BuildingCard({ def, owned, state, onPurchase }: BuildingCardProps) {
  const cost = getBuildingCost(def, owned);
  const notation = state.settings.notation;
  const nextMilestone = getNextMilestone(def.id, owned);
  const currentMilestoneMult = getMilestoneMultiplier(def.id, owned);

  // Apply cost reduction from aspect
  let costMult = 1;
  if (state.prestige.aspectAwakenings.includes('aspect_cheap_buildings')) {
    costMult = 0.9;
  }

  const finalSporeCost = cost.spores * costMult;
  const finalMassCost = cost.myceliumMass * costMult;

  const canAfford =
    state.resources.spores >= finalSporeCost &&
    (finalMassCost <= 0 || state.resources.myceliumMass >= finalMassCost) &&
    (cost.substrateCoverage <= 0 || state.resources.substrateCoverage >= cost.substrateCoverage);

  const tierColors: Record<number, string> = {
    1: '#22c55e', // green
    2: '#00d4ff', // cyan
    3: '#a855f7', // purple
    4: '#f59e0b', // amber
  };

  const tierColor = tierColors[def.tier] || '#22c55e';

  return (
    <div
      className={`building-card ${canAfford ? 'can-afford' : 'cannot-afford'}`}
      style={{ borderColor: tierColor + '40' }}
    >
      <div className="building-card-header">
        <div className="building-icon" style={{ color: tierColor }}>
          {def.icon}
        </div>
        <div className="building-info">
          <div className="building-name" style={{ color: tierColor }}>{def.name}</div>
          <div className="building-desc">{def.description}</div>
        </div>
        <div className="building-count" style={{ borderColor: tierColor }}>
          {owned}
        </div>
      </div>

      <div className="building-card-footer">
        <div className="building-costs">
          <span className={state.resources.spores >= finalSporeCost ? 'cost-ok' : 'cost-bad'}>
            🍄 {formatNumber(finalSporeCost, notation)}
          </span>
          {finalMassCost > 0 && (
            <span className={state.resources.myceliumMass >= finalMassCost ? 'cost-ok' : 'cost-bad'}>
              🧬 {formatNumber(finalMassCost, notation)}
            </span>
          )}
          {cost.substrateCoverage > 0 && (
            <span className={state.resources.substrateCoverage >= cost.substrateCoverage ? 'cost-ok' : 'cost-bad'}>
              🗺️ {cost.substrateCoverage}%
            </span>
          )}
        </div>
        <button
          className="buy-button"
          disabled={!canAfford}
          onClick={() => onPurchase(def.id)}
          style={{ backgroundColor: canAfford ? tierColor : undefined }}
        >
          BUY
        </button>
      </div>

      <div className="building-production">
        +{formatNumber(def.baseProduction.sporesPerSecond, notation)} SPS
        {def.baseProduction.myceliumMassPerSecond && (
          <span> | +{formatNumber(def.baseProduction.myceliumMassPerSecond, notation)} Mass/s</span>
        )}
      </div>

      {/* Milestone progress (AdCap-style) */}
      {owned > 0 && (
        <div className="milestone-section">
          {currentMilestoneMult > 1 && (
            <span className="milestone-current" style={{ color: tierColor }}>
              ⚡ x{currentMilestoneMult.toLocaleString()} bonus
            </span>
          )}
          {nextMilestone ? (
            <div className="milestone-next">
              <div className="milestone-next-label">
                Next: {owned}/{nextMilestone.count} → {nextMilestone.label}
              </div>
              <div className="milestone-bar-track">
                <div
                  className="milestone-bar-fill"
                  style={{
                    width: `${Math.min(100, (owned / nextMilestone.count) * 100)}%`,
                    backgroundColor: tierColor,
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="milestone-maxed">🏆 ALL MILESTONES REACHED</span>
          )}
        </div>
      )}
    </div>
  );
}
