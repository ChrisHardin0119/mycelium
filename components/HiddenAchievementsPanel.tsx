'use client';
// ============================================
// MYCELIUM — Hidden Achievements Panel (Secrets Tab)
// ============================================

import { GameState } from '@/lib/types';
import { HIDDEN_ACHIEVEMENTS, getHiddenAchievementDef } from '@/lib/hiddenAchievements';

interface HiddenAchievementsPanelProps {
  state: GameState;
}

export default function HiddenAchievementsPanel({ state }: HiddenAchievementsPanelProps) {
  const unlocked = state.unlockedHiddenAchievements;
  const total = HIDDEN_ACHIEVEMENTS.length;
  const unlockedCount = unlocked.length;

  return (
    <div className="hidden-achievements-panel">
      <div className="panel-header">
        <span className="panel-icon">🔮</span>
        <span>SECRETS</span>
        <span className="panel-count">{unlockedCount}/{total}</span>
      </div>

      <div className="hidden-ach-intro">
        Hidden achievements are discovered by playing the game in unusual ways.
        Each one grants a permanent bonus!
      </div>

      <div className="hidden-ach-scroll">
        {/* Show unlocked ones first */}
        {HIDDEN_ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlocked.includes(ach.id);

          if (isUnlocked) {
            return (
              <div key={ach.id} className="hidden-ach-card unlocked">
                <div className="hidden-ach-icon">{ach.icon}</div>
                <div className="hidden-ach-info">
                  <div className="hidden-ach-name">{ach.name}</div>
                  <div className="hidden-ach-desc">{ach.description}</div>
                  <div className="hidden-ach-bonus">{ach.bonus.label}</div>
                </div>
              </div>
            );
          }

          // Locked — show hint only
          return (
            <div key={ach.id} className="hidden-ach-card locked">
              <div className="hidden-ach-icon">❓</div>
              <div className="hidden-ach-info">
                <div className="hidden-ach-name">???</div>
                <div className="hidden-ach-hint">{ach.hint}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
