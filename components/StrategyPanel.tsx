'use client';
// ============================================
// MYCELIUM — Strategy Panel (Toggleable Modifiers)
// ============================================

import { GameState } from '@/lib/types';
import { STRATEGIES, isStrategyUnlocked } from '@/lib/strategies';

interface StrategyPanelProps {
  state: GameState;
  onToggleStrategy: (stratId: string) => void;
}

export default function StrategyPanel({ state, onToggleStrategy }: StrategyPanelProps) {
  const active = state.activeStrategies;

  return (
    <div className="strategy-panel">
      <div className="panel-header">
        <span className="panel-icon">⚔️</span>
        <span>STRATEGIES</span>
        <span className="panel-count">{active.length} active</span>
      </div>

      <div className="strategy-intro">
        Toggle strategies to change your playstyle. Each one gives boosts to some things and penalties to others.
        You can activate multiple strategies at once!
      </div>

      <div className="strategy-scroll">
        {STRATEGIES.map(strat => {
          const unlocked = isStrategyUnlocked(
            strat,
            state.stats.totalSporesEarned,
            state.prestige.timesPrestiged,
            state.prestige.totalFBE,
            state.stats.totalBuildingsPurchased
          );
          const isActive = active.includes(strat.id);

          if (!unlocked) {
            return (
              <div key={strat.id} className="strategy-card locked">
                <div className="strategy-card-header">
                  <span className="strategy-icon">🔒</span>
                  <div className="strategy-info">
                    <div className="strategy-name">???</div>
                    <div className="strategy-desc">
                      {strat.unlockCondition.type === 'spores_earned' && `Earn ${Number(strat.unlockCondition.value).toLocaleString()} total spores`}
                      {strat.unlockCondition.type === 'prestige_count' && `Sporulate ${strat.unlockCondition.value} time${(strat.unlockCondition.value || 0) > 1 ? 's' : ''}`}
                      {strat.unlockCondition.type === 'fbe_total' && `Accumulate ${strat.unlockCondition.value} FBE`}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={strat.id}
              className={`strategy-card ${isActive ? 'active' : ''}`}
              onClick={() => onToggleStrategy(strat.id)}
            >
              <div className="strategy-card-header">
                <span className="strategy-icon">{strat.icon}</span>
                <div className="strategy-info">
                  <div className="strategy-name">{strat.name}</div>
                  <div className="strategy-desc">{strat.description}</div>
                </div>
                <div className={`strategy-toggle ${isActive ? 'on' : 'off'}`}>
                  {isActive ? 'ON' : 'OFF'}
                </div>
              </div>
              <div className="strategy-effects">
                {strat.effects.map((effect, i) => (
                  <span
                    key={i}
                    className={`strategy-effect ${effect.value >= 1 ? 'buff' : 'debuff'}`}
                  >
                    {effect.label}
                  </span>
                ))}
              </div>
              <div className="strategy-flavor">{strat.flavor}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
