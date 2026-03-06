'use client';
// ============================================
// MYCELIUM — Prestige Panel
// ============================================

import { GameState } from '@/lib/types';
import {
  calculateFBEGain,
  getFBEMultiplier,
  areMutationsUnlocked,
  areAspectsUnlocked,
  isCosmicBloomUnlocked,
  getCosmicBloomMultiplier,
  LINEAGE_MUTATIONS,
  ASPECT_AWAKENINGS,
} from '@/lib/prestige';
import { formatNumber } from '@/lib/formatNumber';

interface PrestigePanelProps {
  state: GameState;
  onPrestige: () => void;
  onBuyMutation: (id: string) => void;
  onBuyAspect: (id: string) => void;
}

export default function PrestigePanel({ state, onPrestige, onBuyMutation, onBuyAspect }: PrestigePanelProps) {
  const notation = state.settings.notation;
  const fbeGain = calculateFBEGain(state.stats.totalSporesEarned);
  const currentMultiplier = getFBEMultiplier(state.prestige.totalFBE);
  const afterMultiplier = getFBEMultiplier(state.prestige.totalFBE + fbeGain);

  return (
    <div className="prestige-panel">
      <div className="panel-header">
        <span className="panel-icon">✨</span>
        <span>FRUITING CYCLES</span>
        <span className="panel-count">×{state.prestige.timesPrestiged}</span>
      </div>

      <div className="prestige-scroll">
        {/* Prestige explanation */}
        <div className="prestige-info-box">
          <div className="prestige-info-title">🍄 What is a Fruiting Cycle?</div>
          <div className="prestige-info-text">
            Reset your progress in exchange for permanent Fruiting Body Essence (FBE).
            Each FBE gives +1% to ALL production forever. Your Substrate Coverage is preserved.
          </div>
        </div>

        {/* Current FBE */}
        <div className="prestige-stats">
          <div className="prestige-stat">
            <span className="stat-label">Total FBE</span>
            <span className="stat-value glow-cyan">{formatNumber(state.prestige.totalFBE, notation)}</span>
          </div>
          <div className="prestige-stat">
            <span className="stat-label">Spendable FBE</span>
            <span className="stat-value glow-green">{formatNumber(state.prestige.currentFBE, notation)}</span>
          </div>
          <div className="prestige-stat">
            <span className="stat-label">Production Bonus</span>
            <span className="stat-value glow-purple">×{currentMultiplier.toFixed(2)}</span>
          </div>
        </div>

        {/* Prestige button */}
        <div className="prestige-action">
          {fbeGain > 0 ? (
            <>
              <div className="fbe-gain-preview">
                Gain <span className="glow-cyan">{formatNumber(fbeGain, notation)} FBE</span>
                <br />
                <span className="gain-detail">Bonus: ×{currentMultiplier.toFixed(2)} → ×{afterMultiplier.toFixed(2)}</span>
              </div>
              <button className="prestige-button" onClick={onPrestige}>
                🍄 BEGIN FRUITING CYCLE 🍄
              </button>
              <div className="prestige-warning">
                ⚠️ This will reset your spores, mass, buildings, and upgrades!
              </div>
            </>
          ) : (
            <div className="prestige-locked">
              <div className="locked-icon">🔒</div>
              <div>Earn at least <span className="glow-cyan">1B spores</span> to prestige</div>
              <div className="locked-progress">
                Current: {formatNumber(state.stats.totalSporesEarned, notation)} / 1B
              </div>
            </div>
          )}
        </div>

        {/* Lineage Mutations */}
        {areMutationsUnlocked(state.prestige.totalFBE) && (
          <div className="prestige-section">
            <div className="section-title glow-green">🧬 Lineage Mutations</div>
            <div className="section-desc">Permanent building-specific bonuses</div>
            <div className="mutation-list">
              {LINEAGE_MUTATIONS.map(mut => {
                const owned = state.prestige.lineageMutations.includes(mut.id);
                const canAfford = state.prestige.currentFBE >= mut.costFBE;
                return (
                  <div key={mut.id} className={`mutation-card ${owned ? 'owned' : canAfford ? 'can-afford' : 'cannot-afford'}`}>
                    <div className="mutation-name">{mut.name}</div>
                    <div className="mutation-desc">{mut.description}</div>
                    {owned ? (
                      <div className="mutation-owned">✅ ACTIVE</div>
                    ) : (
                      <button
                        className="mutation-buy"
                        disabled={!canAfford}
                        onClick={() => onBuyMutation(mut.id)}
                      >
                        {formatNumber(mut.costFBE, notation)} FBE
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Aspect Awakenings */}
        {areAspectsUnlocked(state.prestige.totalFBE) && (
          <div className="prestige-section">
            <div className="section-title glow-purple">🌀 Aspect Awakenings</div>
            <div className="section-desc">Gameplay-changing permanent perks</div>
            <div className="mutation-list">
              {ASPECT_AWAKENINGS.map(asp => {
                const owned = state.prestige.aspectAwakenings.includes(asp.id);
                const canAfford = state.prestige.currentFBE >= asp.costFBE;
                return (
                  <div key={asp.id} className={`mutation-card ${owned ? 'owned' : canAfford ? 'can-afford' : 'cannot-afford'}`}>
                    <div className="mutation-name">{asp.name}</div>
                    <div className="mutation-desc">{asp.description}</div>
                    {owned ? (
                      <div className="mutation-owned">✅ ACTIVE</div>
                    ) : (
                      <button
                        className="mutation-buy"
                        disabled={!canAfford}
                        onClick={() => onBuyAspect(asp.id)}
                      >
                        {formatNumber(asp.costFBE, notation)} FBE
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cosmic Bloom */}
        {isCosmicBloomUnlocked(state.prestige.totalFBE) && (
          <div className="prestige-section">
            <div className="section-title glow-amber">🌌 Cosmic Bloom</div>
            <div className="section-desc">Meta-multiplier from total lifetime FBE</div>
            <div className="cosmic-display">
              <div className="cosmic-level">Level {state.prestige.cosmicBloomLevel}</div>
              <div className="cosmic-mult">×{getCosmicBloomMultiplier(state.prestige.cosmicBloomLevel).toFixed(1)} to ALL production</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
