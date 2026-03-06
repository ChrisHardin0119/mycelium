'use client';
// ============================================
// MYCELIUM — Game Loop Hook
// ============================================

import { useEffect, useRef, useCallback } from 'react';
import { GameState } from '@/lib/types';
import { processTick } from '@/lib/gameEngine';
import { saveGame } from '@/lib/saveLoad';

interface UseGameLoopOptions {
  state: GameState;
  setState: (updater: (prev: GameState) => GameState) => void;
  isPaused: boolean;
}

export function useGameLoop({ state, setState, isPaused }: UseGameLoopOptions) {
  const lastTickRef = useRef(Date.now());
  const saveTimerRef = useRef(0);
  const frameRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (isPaused) {
      frameRef.current = requestAnimationFrame(tick);
      return;
    }

    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000; // seconds
    lastTickRef.current = now;

    // Cap delta to prevent huge jumps (e.g., tab was backgrounded)
    const cappedDelta = Math.min(delta, 5);

    if (cappedDelta > 0.01) { // Only tick if meaningful time passed
      setState(prev => processTick(prev, cappedDelta));
    }

    // Auto-save check
    saveTimerRef.current += delta;
    if (saveTimerRef.current >= state.settings.autoSaveInterval) {
      saveTimerRef.current = 0;
      // We save on the next tick to avoid blocking
      setState(prev => {
        saveGame(prev);
        return prev;
      });
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [isPaused, setState, state.settings.autoSaveInterval]);

  useEffect(() => {
    lastTickRef.current = Date.now();
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [tick]);

  // Save on page unload
  useEffect(() => {
    const handleUnload = () => {
      saveGame(state);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [state]);
}
