'use client';
// ============================================
// MYCELIUM — Main Game Page
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameSettings, Resources } from '@/lib/types';
import { createInitialState, processClick, purchaseBuilding, purchaseUpgrade, getTotalProduction } from '@/lib/gameEngine';
import { performPrestige, calculateFBEGain, LINEAGE_MUTATIONS, ASPECT_AWAKENINGS } from '@/lib/prestige';
import { loadGame, saveGame } from '@/lib/saveLoad';
import { calculateOfflineGains } from '@/lib/gameEngine';
import { useGameLoop } from '@/hooks/useGameLoop';
import { checkAchievements, getAchievementDef } from '@/lib/achievements';

import GameHeader from '@/components/GameHeader';
import BuildingList from '@/components/BuildingList';
import UpgradePanel from '@/components/UpgradePanel';
import PrestigePanel from '@/components/PrestigePanel';
import StatsPanel from '@/components/StatsPanel';
import OfflineGains from '@/components/OfflineGains';
import MusicToggle from '@/components/MusicToggle';
import { playSFX } from '@/components/MusicToggle';
import SettingsMenu from '@/components/SettingsMenu';
import AchievementToast from '@/components/AchievementToast';
import NextUnlockBar from '@/components/NextUnlockBar';

type Tab = 'buildings' | 'upgrades' | 'prestige' | 'stats';

export default function GamePage() {
  const [state, setState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('buildings');
  const [showSettings, setShowSettings] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  const [offlineData, setOfflineData] = useState<{ gains: Resources; seconds: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; icon: string; name: string; description: string }[]>([]);
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
        // Add to unlocked list
        setState(prev => {
          if (!prev) return prev;
          return { ...prev, unlockedAchievements: [...prev.unlockedAchievements, ...newIds] };
        });
        // Show toasts
        const newToasts = newIds.map(id => {
          const def = getAchievementDef(id);
          return { id, icon: def?.icon || '🏆', name: def?.name || id, description: def?.description || '' };
        });
        setToasts(prev => [...prev, ...newToasts]);
        // Play SFX
        if (state.settings.sfxEnabled) playSFX('upgrade');
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
      const result = purchaseBuilding(prev, buildingId);
      return result || prev;
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

  const handlePrestige = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;
      const fbeGain = calculateFBEGain(prev.stats.totalSporesEarned);
      if (fbeGain <= 0) return prev;
      if (state?.settings.sfxEnabled) playSFX('prestige');
      return performPrestige(prev);
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
          <button className="save-btn" onClick={() => { saveGame(state); }}>💾</button>
        </div>
      </div>

      {/* Main game header - click area + resources */}
      <GameHeader state={state} onClick={handleClick} />

      {/* Next unlock progress bar */}
      <NextUnlockBar state={state} />

      {/* Tab navigation */}
      <div className="tab-bar">
        {([
          ['buildings', '🏗️', 'Build'],
          ['upgrades', '⬆️', 'Upgrade'],
          ['prestige', '✨', 'Prestige'],
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

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'buildings' && (
          <BuildingList state={state} onPurchase={handlePurchaseBuilding} />
        )}
        {activeTab === 'upgrades' && (
          <UpgradePanel state={state} onPurchase={handlePurchaseUpgrade} />
        )}
        {activeTab === 'prestige' && (
          <PrestigePanel
            state={state}
            onPrestige={handlePrestige}
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
