'use client';
// ============================================
// MYCELIUM — Settings Menu
// ============================================

import { GameState, GameSettings } from '@/lib/types';
import { deleteSave, exportSave, importSave } from '@/lib/saveLoad';
import { createInitialState } from '@/lib/gameEngine';
import { useState } from 'react';

interface SettingsMenuProps {
  state: GameState;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onResetGame: () => void;
  onImport: (state: GameState) => void;
  onClose: () => void;
}

export default function SettingsMenu({ state, onUpdateSettings, onResetGame, onImport, onClose }: SettingsMenuProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExport = () => {
    const encoded = exportSave(state);
    navigator.clipboard.writeText(encoded).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleImport = () => {
    const imported = importSave(importText);
    if (imported) {
      onImport(imported);
      setShowImport(false);
      setImportText('');
    } else {
      alert('Invalid save data!');
    }
  };

  const handleReset = () => {
    deleteSave();
    onResetGame();
    setShowConfirmReset(false);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-menu">
        <div className="settings-header">
          <span>⚙️ SETTINGS</span>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          {/* Notation */}
          <div className="setting-row">
            <span className="setting-label">Number Notation</span>
            <select
              className="setting-select"
              value={state.settings.notation}
              onChange={e => onUpdateSettings({ notation: e.target.value as GameSettings['notation'] })}
            >
              <option value="standard">Standard (1.2M)</option>
              <option value="scientific">Scientific (1.20e6)</option>
              <option value="engineering">Engineering (1.20e6)</option>
            </select>
          </div>

          {/* Particle Effects */}
          <div className="setting-row">
            <span className="setting-label">Particle Effects</span>
            <button
              className={`setting-toggle ${state.settings.particleEffects ? 'on' : 'off'}`}
              onClick={() => onUpdateSettings({ particleEffects: !state.settings.particleEffects })}
            >
              {state.settings.particleEffects ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Offline Gains Popup */}
          <div className="setting-row">
            <span className="setting-label">Show Offline Gains</span>
            <button
              className={`setting-toggle ${state.settings.showOfflineGains ? 'on' : 'off'}`}
              onClick={() => onUpdateSettings({ showOfflineGains: !state.settings.showOfflineGains })}
            >
              {state.settings.showOfflineGains ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Save Management */}
          <div className="settings-section-title">Save Management</div>

          <div className="setting-row">
            <button className="settings-button" onClick={handleExport}>
              {copySuccess ? '✅ Copied!' : '📋 Export Save'}
            </button>
            <button className="settings-button" onClick={() => setShowImport(!showImport)}>
              📥 Import Save
            </button>
          </div>

          {showImport && (
            <div className="import-area">
              <textarea
                className="import-textarea"
                placeholder="Paste save data here..."
                value={importText}
                onChange={e => setImportText(e.target.value)}
              />
              <button className="settings-button import-btn" onClick={handleImport}>
                IMPORT
              </button>
            </div>
          )}

          {/* Reset */}
          <div className="settings-section-title danger">Danger Zone</div>
          {!showConfirmReset ? (
            <button className="settings-button danger-btn" onClick={() => setShowConfirmReset(true)}>
              🗑️ Reset ALL Progress
            </button>
          ) : (
            <div className="confirm-reset">
              <div className="confirm-text">Are you sure? This cannot be undone!</div>
              <button className="settings-button danger-btn" onClick={handleReset}>
                YES, DELETE EVERYTHING
              </button>
              <button className="settings-button" onClick={() => setShowConfirmReset(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
