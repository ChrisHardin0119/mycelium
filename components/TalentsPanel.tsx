'use client';
// ============================================
// MYCELIUM — Talents Panel (FBE Skill Tree)
// ============================================

import { GameState } from '@/lib/types';
import {
  TALENTS,
  getTalentsByBranch,
  getTalentDef,
  canPurchaseTalent,
  getTalentStacks,
  BRANCH_INFO,
  Talent,
} from '@/lib/talents';
import { formatNumber } from '@/lib/formatNumber';
import { useState } from 'react';

interface TalentsPanelProps {
  state: GameState;
  onBuyTalent: (id: string) => void;
}

export default function TalentsPanel({ state, onBuyTalent }: TalentsPanelProps) {
  const notation = state.settings.notation;
  const [activeBranch, setActiveBranch] = useState<'growth' | 'efficiency' | 'automation' | 'mastery'>('growth');

  const branches = ['growth', 'efficiency', 'automation', 'mastery'] as const;
  const branchTalents = getTalentsByBranch(activeBranch);
  const info = BRANCH_INFO[activeBranch];

  // Group by tier
  const tier1 = branchTalents.filter(t => t.tier === 1);
  const tier2 = branchTalents.filter(t => t.tier === 2);
  const tier3 = branchTalents.filter(t => t.tier === 3);

  // Count total spent
  const totalSpent = state.prestige.talents.reduce((sum, id) => {
    const t = getTalentDef(id);
    return sum + (t?.costFBE || 0);
  }, 0);

  const totalTalents = state.prestige.talents.length;

  return (
    <div className="talents-panel">
      <div className="talents-header">
        <div className="talents-title">
          <span className="talents-icon">🌳</span>
          <span>MYCELIAL TALENTS</span>
        </div>
        <div className="talents-fbe-display">
          <span className="fbe-label">Spendable FBE:</span>
          <span className="fbe-value glow-green">{formatNumber(state.prestige.currentFBE, notation)}</span>
        </div>
        <div className="talents-summary">
          {totalTalents} talents · {formatNumber(totalSpent, notation)} FBE invested
        </div>
      </div>

      {/* Branch Tabs */}
      <div className="branch-tabs">
        {branches.map(b => {
          const bi = BRANCH_INFO[b];
          const count = state.prestige.talents.filter(id => {
            const t = getTalentDef(id);
            return t?.branch === b;
          }).length;
          return (
            <button
              key={b}
              className={`branch-tab ${activeBranch === b ? 'active' : ''} branch-${b}`}
              onClick={() => setActiveBranch(b)}
            >
              <span className="branch-tab-icon">{bi.icon}</span>
              <span className="branch-tab-name">{bi.name}</span>
              {count > 0 && <span className="branch-tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Branch Description */}
      <div className={`branch-desc branch-desc-${activeBranch}`}>
        {info.icon} {info.description}
      </div>

      {/* Talent Tiers */}
      <div className="talent-scroll">
        {[
          { label: 'Tier 1', talents: tier1 },
          { label: 'Tier 2', talents: tier2 },
          { label: 'Tier 3', talents: tier3 },
        ].map(({ label, talents }) => talents.length > 0 && (
          <div key={label} className="talent-tier">
            <div className="tier-label">{label}</div>
            <div className="talent-grid">
              {talents.map(talent => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  ownedTalents={state.prestige.talents}
                  currentFBE={state.prestige.currentFBE}
                  notation={notation}
                  onBuy={() => onBuyTalent(talent.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TalentCard({
  talent,
  ownedTalents,
  currentFBE,
  notation,
  onBuy,
}: {
  talent: Talent;
  ownedTalents: string[];
  currentFBE: number;
  notation: 'standard' | 'scientific' | 'engineering';
  onBuy: () => void;
}) {
  const stacks = getTalentStacks(talent.id, ownedTalents);
  const isOwned = stacks > 0;
  const isMaxed = talent.repeatable
    ? stacks >= (talent.maxStacks || 1)
    : isOwned;
  const canBuy = canPurchaseTalent(talent.id, ownedTalents, currentFBE);
  const meetsPrereqs = !talent.requires || talent.requires.every(r => ownedTalents.includes(r));

  let cardClass = 'talent-card';
  if (isMaxed) cardClass += ' maxed';
  else if (canBuy) cardClass += ' can-afford';
  else if (!meetsPrereqs) cardClass += ' locked';
  else cardClass += ' cannot-afford';

  return (
    <div className={cardClass}>
      <div className="talent-card-header">
        <span className="talent-card-icon">{talent.icon}</span>
        <span className="talent-card-name">{talent.name}</span>
      </div>
      <div className="talent-card-desc">{talent.description}</div>
      {talent.repeatable && (
        <div className="talent-stacks">
          {Array.from({ length: talent.maxStacks || 1 }, (_, i) => (
            <span key={i} className={`stack-pip ${i < stacks ? 'filled' : ''}`} />
          ))}
        </div>
      )}
      {!meetsPrereqs && (
        <div className="talent-prereq">
          🔒 Requires: {talent.requires!.map(r => getTalentDef(r)?.name || r).join(', ')}
        </div>
      )}
      {isMaxed ? (
        <div className="talent-maxed">✅ {talent.repeatable ? 'MAXED' : 'OWNED'}</div>
      ) : (
        <button
          className="talent-buy-btn"
          disabled={!canBuy}
          onClick={onBuy}
        >
          {formatNumber(talent.costFBE, notation)} FBE
        </button>
      )}
    </div>
  );
}
