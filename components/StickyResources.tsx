'use client';
// ============================================
// MYCELIUM — Sticky Resource Bar
// Shows spore count + secondary resources
// Always visible at top when scrolling
// ============================================

import { GameState } from '@/lib/types';
import { getTotalProduction } from '@/lib/gameEngine';
import { formatNumber } from '@/lib/formatNumber';

interface StickyResourcesProps {
  state: GameState;
}

export default function StickyResources({ state }: StickyResourcesProps) {
  const production = getTotalProduction(state);
  const notation = state.settings.notation;

  return (
    <div className="sticky-resources">
      <div className="sticky-spores">
        <span className="sticky-spore-count">{formatNumber(state.resources.spores, notation)}</span>
        <span className="sticky-spore-label">spores</span>
        <span className="sticky-sps">({formatNumber(production.sporesPerSecond, notation)}/s)</span>
      </div>
      <div className="sticky-secondary">
        {(state.resources.myceliumMass > 0 || state.stats.totalSporesEarned > 5000) && (
          <span className="sticky-pill mass">
            🧬 {formatNumber(state.resources.myceliumMass, notation)}
          </span>
        )}
        {(state.resources.substrateCoverage > 0 || state.prestige.timesPrestiged > 0) && (
          <span className="sticky-pill coverage">
            🗺️ {state.resources.substrateCoverage.toFixed(1)}%
          </span>
        )}
        {state.prestige.totalFBE > 0 && (
          <span className="sticky-pill fbe">
            ✨ {formatNumber(state.prestige.totalFBE, notation)}
          </span>
        )}
      </div>
    </div>
  );
}
