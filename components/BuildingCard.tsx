'use client';
// ============================================
// MYCELIUM — Individual Building Card
// ============================================

import { BuildingDefinition, GameState } from '@/lib/types';
import { getBuildingCost } from '@/lib/buildings';
import { formatNumber } from '@/lib/formatNumber';
import { getNextMilestone, getMilestoneMultiplier } from '@/lib/milestones';

type BuyMode = 1 | 10 | 'max';

interface BuildingCardProps {
  def: BuildingDefinition;
  owned: number;
  state: GameState;
  onPurchase: (buildingId: string) => void;
  onPurchaseMultiple: (buildingId: string, count: number) => void;
  buyMode: BuyMode;
}

// Calculate how many of a building you can afford
function getMaxAffordable(def: BuildingDefinition, owned: number, state: GameState): number {
  let count = 0;
  let testOwned = owned;
  let sporesLeft = state.resources.spores;
  let massLeft = state.resources.myceliumMass;
  const coverageLeft = state.resources.substrateCoverage;

  let costMult = 1;
  if (state.prestige.aspectAwakenings.includes('aspect_cheap_buildings')) {
    costMult = 0.9;
  }

  // Cap at 500 to avoid huge loops
  while (count < 500) {
    const cost = getBuildingCost(def, testOwned);
    const sporeCost = cost.spores * costMult;
    const massCost = cost.myceliumMass * costMult;

    if (sporesLeft < sporeCost) break;
    if (massCost > 0 && massLeft < massCost) break;
    if (cost.substrateCoverage > 0 && coverageLeft < cost.substrateCoverage) break;

    sporesLeft -= sporeCost;
    massLeft -= massCost;
    testOwned++;
    count++;
  }
  return count;
}

// Calculate total cost for N purchases
function getBulkCost(def: BuildingDefinition, owned: number, count: number, costMult: number): { spores: number; mass: number } {
  let totalSpores = 0;
  let totalMass = 0;
  for (let i = 0; i < count; i++) {
    const cost = getBuildingCost(def, owned + i);
    totalSpores += cost.spores * costMult;
    totalMass += cost.myceliumMass * costMult;
  }
  return { spores: totalSpores, mass: totalMass };
}

export default function BuildingCard({ def, owned, state, onPurchase, onPurchaseMultiple, buyMode }: BuildingCardProps) {
  const notation = state.settings.notation;
  const nextMilestone = getNextMilestone(def.id, owned);
  const currentMilestoneMult = getMilestoneMultiplier(def.id, owned);

  let costMult = 1;
  if (state.prestige.aspectAwakenings.includes('aspect_cheap_buildings')) {
    costMult = 0.9;
  }

  // Determine actual buy count
  const maxAffordable = getMaxAffordable(def, owned, state);
  let actualBuyCount: number;
  if (buyMode === 'max') {
    actualBuyCount = maxAffordable;
  } else if (buyMode === 10) {
    actualBuyCount = Math.min(10, maxAffordable);
  } else {
    actualBuyCount = Math.min(1, maxAffordable);
  }

  const canAfford = actualBuyCount > 0;

  // Show cost for the displayed buy amount
  const displayCount = buyMode === 'max' ? maxAffordable : (buyMode === 10 ? 10 : 1);
  const bulkCost = getBulkCost(def, owned, Math.min(displayCount, maxAffordable || 1), costMult);
  // For single buy, show exact next cost
  const singleCost = getBuildingCost(def, owned);
  const showSpores = buyMode === 1 ? singleCost.spores * costMult : bulkCost.spores;
  const showMass = buyMode === 1 ? singleCost.myceliumMass * costMult : bulkCost.mass;
  const showCoverage = singleCost.substrateCoverage;

  const tierColors: Record<number, string> = {
    1: '#22c55e',
    2: '#00d4ff',
    3: '#a855f7',
    4: '#f59e0b',
  };
  const tierColor = tierColors[def.tier] || '#22c55e';

  const handleBuy = () => {
    if (actualBuyCount <= 0) return;
    if (actualBuyCount === 1) {
      onPurchase(def.id);
    } else {
      onPurchaseMultiple(def.id, actualBuyCount);
    }
  };

  const buyLabel = buyMode === 'max'
    ? `BUY ${maxAffordable}`
    : buyMode === 10
      ? `BUY 10`
      : 'BUY';

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
          <span className={state.resources.spores >= showSpores ? 'cost-ok' : 'cost-bad'}>
            🍄 {formatNumber(showSpores, notation)}
          </span>
          {showMass > 0 && (
            <span className={state.resources.myceliumMass >= showMass ? 'cost-ok' : 'cost-bad'}>
              🧬 {formatNumber(showMass, notation)}
            </span>
          )}
          {showCoverage > 0 && (
            <span className={state.resources.substrateCoverage >= showCoverage ? 'cost-ok' : 'cost-bad'}>
              🗺️ {showCoverage}%
            </span>
          )}
        </div>
        <button
          className="buy-button"
          disabled={!canAfford}
          onClick={handleBuy}
          style={{ backgroundColor: canAfford ? tierColor : undefined }}
        >
          {buyLabel}
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
