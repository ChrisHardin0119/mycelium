'use client';
// ============================================
// MYCELIUM — Stats & Achievements Panel
// ============================================

import { GameState } from '@/lib/types';
import { formatNumber, formatTime } from '@/lib/formatNumber';
import { getTotalProduction } from '@/lib/gameEngine';

interface StatsPanelProps {
  state: GameState;
}

export default function StatsPanel({ state }: StatsPanelProps) {
  const notation = state.settings.notation;
  const production = getTotalProduction(state);

  return (
    <div className="stats-panel">
      <div className="panel-header">
        <span className="panel-icon">📊</span>
        <span>STATISTICS</span>
      </div>

      <div className="stats-scroll">
        {/* Production Stats */}
        <div className="stats-section">
          <div className="stats-section-title">Production</div>
          <div className="stat-row">
            <span>Spores per second</span>
            <span className="glow-cyan">{formatNumber(production.sporesPerSecond, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Mass per second</span>
            <span className="glow-green">{formatNumber(production.myceliumMassPerSecond || 0, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Coverage per second</span>
            <span className="glow-purple">{formatNumber((production.substrateCoveragePerSecond || 0) * 100, notation, 4)}%</span>
          </div>
          <div className="stat-row">
            <span>Highest SPS ever</span>
            <span>{formatNumber(state.stats.highestSPS, notation)}</span>
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="stats-section">
          <div className="stats-section-title">Lifetime</div>
          <div className="stat-row">
            <span>Total spores earned</span>
            <span>{formatNumber(state.stats.totalSporesEarned, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Total clicks</span>
            <span>{formatNumber(state.stats.totalClicks, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Spores from clicks</span>
            <span>{formatNumber(state.stats.totalSporesFromClicks, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Buildings purchased</span>
            <span>{formatNumber(state.stats.totalBuildingsPurchased, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Time played (this run)</span>
            <span>{formatTime(state.stats.totalTimePlayed)}</span>
          </div>
        </div>

        {/* Sporulation Stats */}
        <div className="stats-section">
          <div className="stats-section-title">Sporulation</div>
          <div className="stat-row">
            <span>Sporulations</span>
            <span className="glow-amber">{state.prestige.timesPrestiged}</span>
          </div>
          <div className="stat-row">
            <span>Total FBE</span>
            <span className="glow-cyan">{formatNumber(state.prestige.totalFBE, notation)}</span>
          </div>
          <div className="stat-row">
            <span>Mutations owned</span>
            <span>{state.prestige.lineageMutations.length}</span>
          </div>
          <div className="stat-row">
            <span>Aspects awakened</span>
            <span>{state.prestige.aspectAwakenings.length}</span>
          </div>
          {state.stats.fastestPrestige !== null && (
            <div className="stat-row">
              <span>Fastest sporulation</span>
              <span>{formatTime(state.stats.fastestPrestige)}</span>
            </div>
          )}
        </div>

        {/* Buildings owned */}
        <div className="stats-section">
          <div className="stats-section-title">Buildings Owned</div>
          {state.buildings.filter(b => b.count > 0).map(b => (
            <div key={b.id} className="stat-row">
              <span>{b.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              <span>{b.count}</span>
            </div>
          ))}
          {state.buildings.filter(b => b.count > 0).length === 0 && (
            <div className="empty-text">No buildings yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
