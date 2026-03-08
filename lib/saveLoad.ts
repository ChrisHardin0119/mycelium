// ============================================
// MYCELIUM — Save/Load System
// ============================================

import { GameState, SAVE_VERSION } from './types';
import { createInitialState, calculateOfflineGains } from './gameEngine';

const SAVE_KEY = 'mycelium_save';
const SETTINGS_KEY = 'mycelium_settings';

export function saveGame(state: GameState): void {
  try {
    const saveData = {
      ...state,
      lastSaveTime: Date.now(),
      version: SAVE_VERSION,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): { state: GameState; offlineSeconds: number } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw) as GameState;

    // Version check — migrate if needed in the future
    if (saved.version !== SAVE_VERSION) {
      console.log('Save version mismatch, migrating...');
    }

    // Ensure new fields exist for backwards compatibility
    if (!saved.prestige.talents) {
      saved.prestige.talents = [];
    }
    if (!saved.unlockedHiddenAchievements) {
      saved.unlockedHiddenAchievements = [];
    }
    if (saved.stats.totalGoldenSporesCollected === undefined) {
      saved.stats.totalGoldenSporesCollected = 0;
    }
    if (saved.stats.totalSaves === undefined) {
      saved.stats.totalSaves = 0;
    }
    if (!saved.activeStrategies) {
      saved.activeStrategies = [];
    }

    // Calculate time away
    const now = Date.now();
    const lastSave = saved.lastSaveTime || now;
    const offlineSeconds = Math.max(0, (now - lastSave) / 1000);

    // Cap offline gains at 24 hours
    const cappedOffline = Math.min(offlineSeconds, 86400);

    // Apply offline gains
    if (cappedOffline > 60) { // Only calculate if away > 1 minute
      const gains = calculateOfflineGains(saved, cappedOffline);
      saved.resources.spores += gains.spores;
      saved.resources.myceliumMass += gains.myceliumMass;
      saved.resources.substrateCoverage = Math.min(100,
        saved.resources.substrateCoverage + gains.substrateCoverage);
      saved.stats.totalSporesEarned += gains.spores;
    }

    saved.lastTickTime = now;
    saved.lastSaveTime = now;

    return { state: saved, offlineSeconds: cappedOffline };
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {
    console.error('Failed to delete save:', e);
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function exportSave(state: GameState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch {
    return '';
  }
}

export function importSave(encoded: string): GameState | null {
  try {
    const decoded = JSON.parse(atob(encoded));
    if (decoded && decoded.version) {
      return decoded as GameState;
    }
    return null;
  } catch {
    return null;
  }
}
