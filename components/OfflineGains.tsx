'use client';
// ============================================
// MYCELIUM — Offline Gains Popup
// ============================================

import { Resources } from '@/lib/types';
import { formatNumber, formatTime } from '@/lib/formatNumber';

interface OfflineGainsProps {
  gains: Resources;
  offlineSeconds: number;
  onClose: () => void;
}

export default function OfflineGains({ gains, offlineSeconds, onClose }: OfflineGainsProps) {
  return (
    <div className="offline-overlay">
      <div className="offline-popup">
        <div className="offline-title">🍄 Welcome Back 🍄</div>
        <div className="offline-subtitle">
          Your network grew while you were away for {formatTime(offlineSeconds)}
        </div>

        <div className="offline-gains">
          {gains.spores > 0 && (
            <div className="offline-gain-row">
              <span className="gain-icon">🍄</span>
              <span className="gain-amount glow-cyan">+{formatNumber(gains.spores)}</span>
              <span className="gain-label">Spores</span>
            </div>
          )}
          {gains.myceliumMass > 0 && (
            <div className="offline-gain-row">
              <span className="gain-icon">🧬</span>
              <span className="gain-amount glow-green">+{formatNumber(gains.myceliumMass)}</span>
              <span className="gain-label">Mycelium Mass</span>
            </div>
          )}
          {gains.substrateCoverage > 0 && (
            <div className="offline-gain-row">
              <span className="gain-icon">🗺️</span>
              <span className="gain-amount glow-purple">+{gains.substrateCoverage.toFixed(4)}%</span>
              <span className="gain-label">Substrate Coverage</span>
            </div>
          )}
        </div>

        <div className="offline-note">
          (Offline production runs at 50% speed)
        </div>

        <button className="offline-close" onClick={onClose}>
          CONTINUE GROWING
        </button>
      </div>
    </div>
  );
}
