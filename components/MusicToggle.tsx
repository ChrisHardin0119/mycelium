'use client';
// ============================================
// MYCELIUM — Music Toggle + Audio Manager
// ============================================

import { useState, useEffect, useRef } from 'react';

interface MusicToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

// We'll use Web Audio API to generate a simple ambient chiptune loop
// This avoids needing external audio files
export default function MusicToggle({ enabled, onToggle }: MusicToggleProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enabled && !isPlayingRef.current) {
      startMusic();
    } else if (!enabled && isPlayingRef.current) {
      stopMusic();
    }

    return () => {
      stopMusic();
    };
  }, [enabled]);

  function startMusic() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.08; // Very quiet background
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      isPlayingRef.current = true;

      // Simple ambient mycelium chiptune — evolving notes
      const notes = [
        // Mysterious underground scale (C minor pentatonic, octave 3-4)
        130.81, 155.56, 174.61, 196.00, 233.08,
        261.63, 311.13, 349.23, 392.00, 466.16,
      ];

      let noteIndex = 0;
      let step = 0;

      function playNote() {
        if (!audioContextRef.current || !gainNodeRef.current) return;
        const ctx = audioContextRef.current;

        // Main tone
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Alternate between wave types for variety
        osc.type = step % 4 === 0 ? 'triangle' : step % 4 === 2 ? 'sine' : 'square';

        const note = notes[noteIndex % notes.length];
        osc.frequency.value = note;

        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(noteGain);
        noteGain.connect(gainNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);

        // Sometimes add a harmony
        if (step % 3 === 0) {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.value = note * 1.5; // Perfect fifth
          gain2.gain.setValueAtTime(0, ctx.currentTime);
          gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc2.connect(gain2);
          gain2.connect(gainNodeRef.current);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 1.2);
        }

        // Progress through notes in a pattern
        noteIndex += [1, 2, 1, 3, -1, 2, 1, -2][step % 8];
        if (noteIndex < 0) noteIndex += notes.length;
        step++;
      }

      // Play a note every ~600ms for ambient feel
      playNote();
      intervalRef.current = setInterval(playNote, 600);
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  function stopMusic() {
    isPlayingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }

  return (
    <button
      className="music-toggle"
      onClick={onToggle}
      title={enabled ? 'Mute music' : 'Play music'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}

// SFX helper for click/purchase/prestige sounds
export function playSFX(type: 'click' | 'purchase' | 'prestige' | 'upgrade') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    switch (type) {
      case 'click':
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.05);
        break;

      case 'purchase':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
        break;

      case 'upgrade':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
        break;

      case 'prestige':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.8);
        break;
    }

    setTimeout(() => ctx.close().catch(() => {}), 1000);
  } catch {
    // Audio not supported
  }
}
