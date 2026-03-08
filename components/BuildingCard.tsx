'use client';
// ============================================
// MYCELIUM — Individual Building Card
// ============================================

import { BuildingDefinition, GameState } from '@/lib/types';
import { getBuildingCost } from '@/lib/buildings';
import { getCostMultiplier, getBuildingProductionRate, getResourcePenalties } from '@/lib/gameEngine';
import { formatNumber } from '@/lib/formatNumber';
import { getNextMilestone, getMilestoneMultiplier } from '@/lib/milestones';

type BuyMode = 1 | 5 | 10 | 100 | 'max';

interface BuildingCardProps {
  def: BuildingDefinition;
  owned: number;
  state: GameState;
  onPurchase: (buildingId: string) => void;
  onPurchaseMultiple: (buildingId: string, count: number) => void;
  buyMode: BuyMode;
}

// Calculate how many of a building you can afford
function getMaxAffordable(def: BuildingDefinition, owned: number, state: GameState, costMult: number): number {
  let count = 0;
  let testOwned = owned;
  let sporesLeft = state.resources.spores;
  let massLeft = state.resources.myceliumMass;
  const coverageLeft = state.resources.substrateCoverage;

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

  // Use the full cost multiplier (aspect + achievements + talents + hidden)
  const costMult = getCostMultiplier(state);

  // Determine actual buy count
  const maxAffordable = getMaxAffordable(def, owned, state, costMult);
  let actualBuyCount: number;
  if (buyMode === 'max') {
    actualBuyCount = maxAffordable;
  } else {
    actualBuyCount = Math.min(buyMode, maxAffordable);
  }

  const canAfford = actualBuyCount > 0;

  // Show cost for the displayed buy amount
  // ALWAYS show at least the cost of the next 1 purchase so the user can see what they need
  const singleCost = getBuildingCost(def, owned);
  let showSpores: number;
  let showMass: number;
  let showCoverage: number;

  if (buyMode === 1) {
    showSpores = singleCost.spores * costMult;
    showMass = singleCost.myceliumMass * costMult;
    showCoverage = singleCost.substrateCoverage;
  } else if (buyMode === 'max') {
    if (maxAffordable > 0) {
      const bulkCost = getBulkCost(def, owned, maxAffordable, costMult);
      showSpores = bulkCost.spores;
      showMass = bulkCost.mass;
      showCoverage = singleCost.substrateCoverage;
    } else {
      // Can't afford any — show cost of next single purchase
      showSpores = singleCost.spores * costMult;
      showMass = singleCost.myceliumMass * costMult;
      showCoverage = singleCost.substrateCoverage;
    }
  } else {
    // x5, x10, x100 — show total cost for that many (or as many as affordable + remaining)
    const bulkCost = getBulkCost(def, owned, buyMode, costMult);
    showSpores = bulkCost.spores;
    showMass = bulkCost.mass;
    showCoverage = singleCost.substrateCoverage;
  }

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
    : buyMode === 1
      ? 'BUY'
      : `BUY ${buyMode}`;

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
        {owned > 0 ? (
          <>
            {/* Show actual production with all multipliers + resource penalties */}
            {(() => {
              const prod = getBuildingProductionRate(def.id, owned, state);
              const { massPenalty, coveragePenalty } = getResourcePenalties(state);
              const combinedPenalty = massPenalty * coveragePenalty;
              const actualSPS = prod.sporesPerSecond * combinedPenalty;
              const hasPenalty = combinedPenalty < 0.99;
              return (
                <>
                  +{formatNumber(actualSPS, notation)} SPS
                  {hasPenalty && (
                    <span className="penalty-indicator" title={`Resource penalty: ${(combinedPenalty * 100).toFixed(0)}% efficiency`}>
                      {' '}⚠️ {(combinedPenalty * 100).toFixed(0)}%
                    </span>
                  )}
                  {(prod.myceliumMassPerSecond || 0) !== 0 && (
                    <span> | {(prod.myceliumMassPerSecond || 0) > 0 ? '+' : ''}{formatNumber(prod.myceliumMassPerSecond || 0, notation)} Mass/s</span>
                  )}
                  {(prod.substrateCoveragePerSecond || 0) > 0 && (
                    <span> | +{(prod.substrateCoveragePerSecond || 0).toFixed(3)} Cov/s</span>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <>
            {/* Before purchase, show base rate with penalty preview */}
            {(() => {
              const { massPenalty, coveragePenalty } = getResourcePenalties(state);
              const combinedPenalty = massPenalty * coveragePenalty;
              const actualBase = def.baseProduction.sporesPerSecond * combinedPenalty;
              const hasPenalty = combinedPenalty < 0.99;
              return (
                <>
                  +{formatNumber(actualBase, notation)} SPS
                  {hasPenalty && (
                    <span className="penalty-indicator" title={`Resource penalty: ${(combinedPenalty * 100).toFixed(0)}% efficiency`}>
                      {' '}⚠️ {(combinedPenalty * 100).toFixed(0)}%
                    </span>
                  )}
                  {def.baseProduction.myceliumMassPerSecond && (
                    <span> | +{formatNumber(def.baseProduction.myceliumMassPerSecond, notation)} Mass/s</span>
                  )}
                </>
              );
            })()}
          </>
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
