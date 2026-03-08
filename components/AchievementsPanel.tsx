'use client';
// ============================================
// MYCELIUM — Achievements Panel
// Shows all regular achievements (unlocked + locked)
// ============================================

import { GameState } from '@/lib/types';
import { ACHIEVEMENTS } from '@/lib/achievements';

interface AchievementsPanelProps {
  state: GameState;
}

export default function AchievementsPanel({ state }: AchievementsPanelProps) {
  const unlockedSet = new Set(state.unlockedAchievements);
  const unlocked = ACHIEVEMENTS.filter(a => unlockedSet.has(a.id));
  const locked = ACHIEVEMENTS.filter(a => !unlockedSet.has(a.id));

  return (
    <div className="achievements-panel">
      <div className="ach-header">
        <div className="ach-title">Achievements</div>
        <div className="ach-progress">
          {unlocked.length} / {ACHIEVEMENTS.length} unlocked
        </div>
      </div>

      {/* Progress bar */}
      <div className="ach-progress-bar-track">
        <div
          className="ach-progress-bar-fill"
          style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
        />
      </div>

      {/* Unlocked achievements */}
      {unlocked.length > 0 && (
        <div className="ach-section">
          <div className="ach-section-label">Unlocked</div>
          <div className="ach-grid">
            {unlocked.map(ach => (
              <div key={ach.id} className="ach-card unlocked">
                <div className="ach-icon">{ach.icon}</div>
                <div className="ach-info">
                  <div className="ach-name">{ach.name}</div>
                  <div className="ach-desc">{ach.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked achievements */}
      {locked.length > 0 && (
        <div className="ach-section">
          <div className="ach-section-label">Locked</div>
          <div className="ach-grid">
            {locked.map(ach => (
              <div key={ach.id} className="ach-card locked">
                <div className="ach-icon">🔒</div>
                <div className="ach-info">
                  <div className="ach-name">{ach.name}</div>
                  <div className="ach-desc">{ach.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
