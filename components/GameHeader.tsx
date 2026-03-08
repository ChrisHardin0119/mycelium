'use client';
// ============================================
// MYCELIUM — Game Header (Spore Counter + Click Area)
// ============================================

import { useState, useCallback } from 'react';
import { GameState } from '@/lib/types';
import { getTotalProduction, getClickValue } from '@/lib/gameEngine';
import { formatNumber } from '@/lib/formatNumber';

interface GameHeaderProps {
  state: GameState;
  onClick: () => void;
}

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

let floatId = 0;

export default function GameHeader({ state, onClick }: GameHeaderProps) {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const production = getTotalProduction(state);
  const clickValue = getClickValue(state);
  const notation = state.settings.notation;

  const handleClick = useCallback((e: React.MouseEvent) => {
    onClick();

    // Create floating number
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++floatId;

    setFloatingNumbers(prev => [...prev, { id, value: clickValue, x, y }]);

    // Remove after animation
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(f => f.id !== id));
    }, 1000);
  }, [onClick, clickValue]);

  // Glow intensity based on SPS (more production = brighter glow)
  const glowIntensity = Math.min(1, Math.log10(Math.max(1, production.sporesPerSecond)) / 10);

  return (
    <div className="game-header">
      {/* Main spore display */}
      <div className="spore-display">
        <div className="spore-count" style={{ textShadow: `0 0 ${10 + glowIntensity * 30}px rgba(0, 212, 255, ${0.3 + glowIntensity * 0.7})` }}>
          {formatNumber(state.resources.spores, notation)}
        </div>
        <div className="spore-label">SPORES</div>
        <div className="sps-display">
          {formatNumber(production.sporesPerSecond, notation)}/sec
        </div>
      </div>

      {/* Secondary resources */}
      <div className="secondary-resources">
        {(state.resources.myceliumMass > 0 || state.stats.totalSporesEarned > 5000) && (
          <div className="resource-pill mass-pill">
            <span className="resource-icon">🧬</span>
            <span className="resource-value">{formatNumber(state.resources.myceliumMass, notation)}</span>
            <span className="resource-name">Mass</span>
            {(production.myceliumMassPerSecond || 0) !== 0 && (
              <span className={`resource-rate ${(production.myceliumMassPerSecond || 0) < 0 ? 'rate-negative' : ''}`}>
                {(production.myceliumMassPerSecond || 0) > 0 ? '+' : ''}{formatNumber(production.myceliumMassPerSecond || 0, notation)}/s
              </span>
            )}
          </div>
        )}
        {(state.resources.substrateCoverage > 0 || state.prestige.timesPrestiged > 0) && (
          <div className="resource-pill coverage-pill">
            <span className="resource-icon">🗺️</span>
            <span className="resource-value">{state.resources.substrateCoverage.toFixed(2)}%</span>
            <span className="resource-name">Coverage</span>
          </div>
        )}
      </div>

      {/* Click area */}
      <div className="click-area" onClick={handleClick}>
        <div className="mushroom-sprite" style={{
          filter: `drop-shadow(0 0 ${8 + glowIntensity * 20}px rgba(0, 212, 255, ${0.4 + glowIntensity * 0.6})) drop-shadow(0 0 ${4 + glowIntensity * 10}px rgba(168, 85, 247, ${0.3 + glowIntensity * 0.5}))`
        }}>
          🍄
        </div>
        <div className="click-hint">
          +{formatNumber(clickValue, notation)} per click
        </div>

        {/* Floating numbers */}
        {floatingNumbers.map(f => (
          <div
            key={f.id}
            className="floating-number"
            style={{ left: f.x, top: f.y }}
          >
            +{formatNumber(f.value, notation)}
          </div>
        ))}
      </div>

      {/* FBE display if prestiged */}
      {state.prestige.totalFBE > 0 && (
        <div className="fbe-display">
          <span className="fbe-icon">✨</span>
          <span className="fbe-value">{formatNumber(state.prestige.totalFBE, notation)} FBE</span>
          <span className="fbe-bonus">(+{(state.prestige.totalFBE)}% bonus)</span>
        </div>
      )}
    </div>
  );
}
