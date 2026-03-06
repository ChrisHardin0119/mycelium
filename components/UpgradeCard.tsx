'use client';
// ============================================
// MYCELIUM — Individual Upgrade Card
// ============================================

import { UpgradeDefinition, GameState } from '@/lib/types';
import { formatNumber } from '@/lib/formatNumber';

interface UpgradeCardProps {
  def: UpgradeDefinition;
  state: GameState;
  onPurchase: (upgradeId: string) => void;
}

export default function UpgradeCard({ def, state, onPurchase }: UpgradeCardProps) {
  const notation = state.settings.notation;
  const canAfford =
    state.resources.spores >= def.cost.spores &&
    (!def.cost.myceliumMass || state.resources.myceliumMass >= def.cost.myceliumMass);

  const tierColors: Record<number, string> = {
    1: '#22c55e',
    2: '#00d4ff',
    3: '#a855f7',
    4: '#f59e0b',
  };
  const color = tierColors[def.tier] || '#22c55e';

  return (
    <div
      className={`upgrade-card ${canAfford ? 'can-afford' : 'cannot-afford'}`}
      onClick={() => canAfford && onPurchase(def.id)}
      style={{ borderColor: color + '40', cursor: canAfford ? 'pointer' : 'default' }}
    >
      <div className="upgrade-icon" style={{ color }}>{def.icon}</div>
      <div className="upgrade-info">
        <div className="upgrade-name" style={{ color }}>{def.name}</div>
        <div className="upgrade-desc">{def.description}</div>
        <div className="upgrade-cost">
          <span className={state.resources.spores >= def.cost.spores ? 'cost-ok' : 'cost-bad'}>
            🍄 {formatNumber(def.cost.spores, notation)}
          </span>
          {def.cost.myceliumMass && (
            <span className={state.resources.myceliumMass >= (def.cost.myceliumMass || 0) ? 'cost-ok' : 'cost-bad'}>
              🧬 {formatNumber(def.cost.myceliumMass, notation)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
