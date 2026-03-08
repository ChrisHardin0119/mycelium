'use client';
// ============================================
// MYCELIUM — Main Game Page
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameSettings, Resources } from '@/lib/types';
import { createInitialState, processClick, purchaseBuilding, purchaseUpgrade, getTotalProduction } from '@/lib/gameEngine';
import { performSporulation, calculateFBEGain, LINEAGE_MUTATIONS, ASPECT_AWAKENINGS } from '@/lib/sporulation';
import { loadGame, saveGame } from '@/lib/saveLoad';
import { calculateOfflineGains } from '@/lib/gameEngine';
import { useGameLoop } from '@/hooks/useGameLoop';
import { checkAchievements, getAchievementDef } from '@/lib/achievements';
import { checkNewMilestones } from '@/lib/milestones';
import { canPurchaseTalent, TALENTS } from '@/lib/talents';
import { checkHiddenAchievements, getHiddenAchievementDef, getHiddenAchievementBonus, HiddenCheckContext } from '@/lib/hiddenAchievements';
import { getStrategyMultiplier } from '@/lib/strategies';

import GameHeader from '@/components/GameHeader';
import StrategyPanel from '@/components/StrategyPanel';
import BuildingList from '@/components/BuildingList';
import UpgradePanel from '@/components/UpgradePanel';
import SporulationPanel from '@/components/SporulationPanel';
import TalentsPanel from '@/components/TalentsPanel';
import HiddenAchievementsPanel from '@/components/HiddenAchievementsPanel';
import StatsPanel from '@/components/StatsPanel';
import OfflineGains from '@/components/OfflineGains';
import MusicToggle from '@/components/MusicToggle';
import { playSFX } from '@/components/MusicToggle';
import SettingsMenu from '@/components/SettingsMenu';
import AchievementToast from '@/components/AchievementToast';
import NextUnlockBar from '@/components/NextUnlockBar';
import StickyResources from '@/components/StickyResources';
import GoldenSpore from '@/components/GoldenSpore';
import type { BuyMode } from '@/components/BuildingList';

type Tab = 'buildings' | 'upgrades' | 'talents' | 'strategies' | 'secrets' | 'sporulation' | 'stats';

export default function GamePage() {
  const [state, setState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('buildings');
  const [showSettings, setShowSettings] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  const [offlineData, setOfflineData] = useState<{ gains: Resources; seconds: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; icon: string; name: string; description: string }[]>([]);
  const [buyMode, setBuyMode] = useState<BuyMode>(1);
  const achievementCheckRef = useRef(0);

  // Achievement checker — runs every ~500ms
  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      // Also update highestSPS live for achievement checking
      const production = getTotalProduction(state);
      const currentState = {
        ...state,
        stats: { ...state.stats, highestSPS: Math.max(state.stats.highestSPS, production.sporesPerSecond) },
      };
      const newIds = checkAchievements(currentState);
      if (newIds.length > 0) {
        setState(prev => {
          if (!prev) return prev;
          return { ...prev, unlockedAchievements: [...prev.unlockedAchievements, ...newIds] };
        });
        const newToasts = newIds.map(id => {
          const def = getAchievementDef(id);
          return { id, icon: def?.icon || '🏆', name: def?.name || id, description: def?.description || '' };
        });
        setToasts(prev => [...prev, ...newToasts]);
        if (state.settings.sfxEnabled) playSFX('upgrade');
      }

      // Check hidden achievements
      const hiddenCtx: HiddenCheckContext = {
        totalClicks: state.stats.totalClicks,
        totalSporesEarned: state.stats.totalSporesEarned,
        totalTimePlayed: state.stats.totalTimePlayed,
        totalBuildingsPurchased: state.stats.totalBuildingsPurchased,
        timesPrestiged: state.prestige.timesPrestiged,
        totalGoldenSporesCollected: state.stats.totalGoldenSporesCollected,
        totalSaves: state.stats.totalSaves,
        musicEnabled: state.settings.musicEnabled,
        sfxEnabled: state.settings.sfxEnabled,
        currentSpores: state.resources.spores,
        currentMass: state.resources.myceliumMass,
        currentCoverage: state.resources.substrateCoverage,
        highestSPS: state.stats.highestSPS,
        buildings: state.buildings,
        purchasedUpgrades: state.purchasedUpgrades,
        unlockedAchievements: state.unlockedAchievements,
        totalFBE: state.prestige.totalFBE,
        talentCount: state.prestige.talents.length,
        clicksThisSession: state.stats.totalClicks,
        fastestPrestige: state.stats.fastestPrestige,
        hasResetGame: false,
      };
      const hiddenIds = checkHiddenAchievements(hiddenCtx, state.unlockedHiddenAchievements);
      if (hiddenIds.length > 0) {
        setState(prev => {
          if (!prev) return prev;
          return { ...prev, unlockedHiddenAchievements: [...prev.unlockedHiddenAchievements, ...hiddenIds] };
        });
        const hiddenToasts = hiddenIds.map(id => {
          const def = getHiddenAchievementDef(id);
          return {
            id: `hidden_${id}`,
            icon: def?.icon || '🔮',
            name: `SECRET: ${def?.name || id}`,
            description: def?.bonus.label || '',
          };
        });
        setToasts(prev => [...prev, ...hiddenToasts]);
        if (state.settings.sfxEnabled) playSFX('prestige');
      }
    }, 500);
    return () => clearInterval(interval);
  }, [state]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Load game on mount
  useEffect(() => {
    const loaded = loadGame();
    if (loaded) {
      setState(loaded.state);
      if (loaded.offlineSeconds > 60 && loaded.state.settings.showOfflineGains) {
        const gains = calculateOfflineGains(loaded.state, Math.min(loaded.offlineSeconds, 86400));
        if (gains.spores > 0 || gains.myceliumMass > 0) {
          setOfflineData({ gains, seconds: loaded.offlineSeconds });
          setShowOffline(true);
        }
      }
    } else {
      setState(createInitialState());
    }
  }, []);

  // Game loop
  useGameLoop({
    state: state || createInitialState(),
    setState: setState as any,
    isPaused: isPaused || !state,
  });

  // Handlers
  const handleClick = useCallback(() => {
    setState(prev => prev ? processClick(prev) : prev);
    if (state?.settings.sfxEnabled) playSFX('click');
  }, [state?.settings.sfxEnabled]);

  const handlePurchaseBuilding = useCallback((buildingId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const oldCount = prev.buildings.find(b => b.id === buildingId)?.count || 0;
      const result = purchaseBuilding(prev, buildingId);
      if (!result) return prev;
      const newCount = result.buildings.find(b => b.id === buildingId)?.count || 0;

      // Check for milestone hits
      const newMilestones = checkNewMilestones(buildingId, oldCount, newCount);
      if (newMilestones.length > 0) {
        const milestoneToasts = newMilestones.map(m => ({
          id: `milestone_${m.buildingId}_${m.count}`,
          icon: m.icon,
          name: `MILESTONE: ${m.name}`,
          description: `x${m.multiplier} profit bonus!`,
        }));
        setToasts(t => [...t, ...milestoneToasts]);
        if (prev.settings.sfxEnabled) playSFX('upgrade');
      }

      return result;
    });
    if (state?.settings.sfxEnabled) playSFX('purchase');
  }, [state?.settings.sfxEnabled]);

  const handlePurchaseMultiple = useCallback((buildingId: string, count: number) => {
    setState(prev => {
      if (!prev) return prev;
      const oldCount = prev.buildings.find(b => b.id === buildingId)?.count || 0;
      let current = prev;
      for (let i = 0; i < count; i++) {
        const result = purchaseBuilding(current, buildingId);
        if (!result) break;
        current = result;
      }
      if (current === prev) return prev;
      const newCount = current.buildings.find(b => b.id === buildingId)?.count || 0;

      // Check for milestone hits across the bulk purchase
      const newMilestones = checkNewMilestones(buildingId, oldCount, newCount);
      if (newMilestones.length > 0) {
        const milestoneToasts = newMilestones.map(m => ({
          id: `milestone_${m.buildingId}_${m.count}`,
          icon: m.icon,
          name: `MILESTONE: ${m.name}`,
          description: `x${m.multiplier} profit bonus!`,
        }));
        setToasts(t => [...t, ...milestoneToasts]);
        if (prev.settings.sfxEnabled) playSFX('upgrade');
      }

      return current;
    });
    if (state?.settings.sfxEnabled) playSFX('purchase');
  }, [state?.settings.sfxEnabled]);

  const handlePurchaseUpgrade = useCallback((upgradeId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const result = purchaseUpgrade(prev, upgradeId);
      return result || prev;
    });
    if (state?.settings.sfxEnabled) playSFX('upgrade');
  }, [state?.settings.sfxEnabled]);

  const handleSporulate = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;
      const fbeGain = calculateFBEGain(prev.stats.totalSporesEarned);
      if (fbeGain <= 0) return prev;
      if (state?.settings.sfxEnabled) playSFX('prestige');
      return performSporulation(prev);
    });
  }, [state?.settings.sfxEnabled]);

  const handleBuyMutation = useCallback((mutId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const mut = LINEAGE_MUTATIONS.find(m => m.id === mutId);
      if (!mut) return prev;
      if (prev.prestige.currentFBE < mut.costFBE) return prev;
      if (prev.prestige.lineageMutations.includes(mutId)) return prev;
      return {
        ...prev,
        prestige: {
          ...prev.prestige,
          currentFBE: prev.prestige.currentFBE - mut.costFBE,
          lineageMutations: [...prev.prestige.lineageMutations, mutId],
        },
      };
    });
    if (state?.settings.sfxEnabled) playSFX('upgrade');
  }, [state?.settings.sfxEnabled]);

  const handleBuyTalent = useCallback((talentId: string) => {
    setState(prev => {
      if (!prev) return prev;
      if (!canPurchaseTalent(talentId, prev.prestige.talents, prev.prestige.currentFBE)) return prev;
      const talent = TALENTS.find(t => t.id === talentId);
      if (!talent) return prev;
      return {
        ...prev,
        prestige: {
          ...prev.prestige,
          currentFBE: prev.prestige.currentFBE - talent.costFBE,
          talents: [...prev.prestige.talents, talentId],
        },
      };
    });
    if (state?.settings.sfxEnabled) playSFX('upgrade');
  }, [state?.settings.sfxEnabled]);

  const handleBuyAspect = useCallback((aspId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const asp = ASPECT_AWAKENINGS.find(a => a.id === aspId);
      if (!asp) return prev;
      if (prev.prestige.currentFBE < asp.costFBE) return prev;
      if (prev.prestige.aspectAwakenings.includes(aspId)) return prev;
      return {
        ...prev,
        prestige: {
          ...prev.prestige,
          currentFBE: prev.prestige.currentFBE - asp.costFBE,
          aspectAwakenings: [...prev.prestige.aspectAwakenings, aspId],
        },
      };
    });
    if (state?.settings.sfxEnabled) playSFX('upgrade');
  }, [state?.settings.sfxEnabled]);

  const handleToggleStrategy = useCallback((stratId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const isActive = prev.activeStrategies.includes(stratId);
      return {
        ...prev,
        activeStrategies: isActive
          ? prev.activeStrategies.filter(id => id !== stratId)
          : [...prev.activeStrategies, stratId],
      };
    });
    if (state?.settings.sfxEnabled) playSFX('click');
  }, [state?.settings.sfxEnabled]);

  const handleGoldenSpore = useCallback((bonus: number) => {
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        resources: { ...prev.resources, spores: prev.resources.spores + bonus },
        stats: {
          ...prev.stats,
          totalSporesEarned: prev.stats.totalSporesEarned + bonus,
          totalGoldenSporesCollected: prev.stats.totalGoldenSporesCollected + 1,
        },
      };
    });
    // Show a toast
    setToasts(prev => [...prev, {
      id: `golden_${Date.now()}`,
      icon: '✨',
      name: 'LUCKY SPORE!',
      description: `Bonus spores collected!`,
    }]);
    if (state?.settings.sfxEnabled) playSFX('prestige');
  }, [state?.settings.sfxEnabled]);

  const handleUpdateSettings = useCallback((updates: Partial<GameSettings>) => {
    setState(prev => prev ? { ...prev, settings: { ...prev.settings, ...updates } } : prev);
  }, []);

  const handleResetGame = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    setShowSettings(false);
  }, []);

  const handleImportSave = useCallback((imported: GameState) => {
    setState(imported);
    setShowSettings(false);
  }, []);

  // Loading state
  if (!state) {
    return (
      <div className="loading-screen">
        <div className="loading-mushroom">🍄</div>
        <div className="loading-text">INITIALIZING MYCELIUM NETWORK...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Floating spore particles */}
      {state.settings.particleEffects && (
        <div className="particle-container">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="spore-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              opacity: 0.1 + Math.random() * 0.3,
              fontSize: `${4 + Math.random() * 8}px`,
            }}>
              ●
            </div>
          ))}
        </div>
      )}

      {/* Top bar */}
      <div className="top-bar">
        <div className="game-title">MYCELIUM</div>
        <div className="top-bar-actions">
          <MusicToggle
            enabled={state.settings.musicEnabled}
            onToggle={() => handleUpdateSettings({ musicEnabled: !state.settings.musicEnabled })}
          />
          <button className="settings-btn" onClick={() => setShowSettings(true)}>⚙️</button>
          <button className="save-btn" onClick={() => {
              setState(prev => prev ? { ...prev, stats: { ...prev.stats, totalSaves: prev.stats.totalSaves + 1 } } : prev);
              saveGame({ ...state, stats: { ...state.stats, totalSaves: state.stats.totalSaves + 1 } });
            }}>💾</button>
        </div>
      </div>

      {/* Main game header - click area + resources */}
      <GameHeader state={state} onClick={handleClick} />

      {/* Next unlock progress bar */}
      <NextUnlockBar state={state} />

      {/* Sticky resource bar + tab navigation */}
      <div className="sticky-nav-wrapper">
        <StickyResources state={state} />
        <div className="tab-bar">
          {([
            ['buildings', '🏗️', 'Build'],
            ['upgrades', '⬆️', 'Upgrade'],
            ['talents', '🧬', 'Talents'],
            ['strategies', '⚔️', 'Strategy'],
            ['secrets', '🔮', 'Secrets'],
            ['sporulation', '✨', 'Sporulate'],
            ['stats', '📊', 'Stats'],
          ] as [Tab, string, string][]).map(([tab, icon, label]) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="tab-icon">{icon}</span>
              <span className="tab-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'buildings' && (
          <BuildingList state={state} onPurchase={handlePurchaseBuilding} onPurchaseMultiple={handlePurchaseMultiple} buyMode={buyMode} onBuyModeChange={setBuyMode} />
        )}
        {activeTab === 'upgrades' && (
          <UpgradePanel state={state} onPurchase={handlePurchaseUpgrade} />
        )}
        {activeTab === 'talents' && (
          <TalentsPanel state={state} onBuyTalent={handleBuyTalent} />
        )}
        {activeTab === 'strategies' && (
          <StrategyPanel state={state} onToggleStrategy={handleToggleStrategy} />
        )}
        {activeTab === 'secrets' && (
          <HiddenAchievementsPanel state={state} />
        )}
        {activeTab === 'sporulation' && (
          <SporulationPanel
            state={state}
            onSporulate={handleSporulate}
            onBuyMutation={handleBuyMutation}
            onBuyAspect={handleBuyAspect}
          />
        )}
        {activeTab === 'stats' && (
          <StatsPanel state={state} />
        )}
      </div>

      {/* Offline gains popup */}
      {showOffline && offlineData && (
        <OfflineGains
          gains={offlineData.gains}
          offlineSeconds={offlineData.seconds}
          onClose={() => setShowOffline(false)}
        />
      )}

      {/* Golden Spore random bonus */}
      <GoldenSpore
        sps={getTotalProduction(state).sporesPerSecond}
        onCollect={handleGoldenSpore}
        sfxEnabled={state.settings.sfxEnabled}
        goldenMultiplier={getHiddenAchievementBonus('golden_spore_mult', state.unlockedHiddenAchievements) * getStrategyMultiplier('golden_spore_mult', state.activeStrategies)}
      />

      {/* Achievement toasts */}
      <AchievementToast toasts={toasts} onDismiss={dismissToast} />

      {/* Settings menu */}
      {showSettings && (
        <SettingsMenu
          state={state}
          onUpdateSettings={handleUpdateSettings}
          onResetGame={handleResetGame}
          onImport={handleImportSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
