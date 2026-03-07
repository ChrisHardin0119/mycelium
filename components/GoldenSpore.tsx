'use client';
// ============================================
// MYCELIUM — Golden Spore (Random Bonus Event)
// Appears every 2-5 minutes. Click it for a
// big bonus (10-60 seconds of production).
// ============================================

import { useState, useEffect, useCallback } from 'react';

interface GoldenSporeProps {
  sps: number; // current spores per second
  onCollect: (bonus: number) => void;
  sfxEnabled: boolean;
}

export default function GoldenSpore({ sps, onCollect, sfxEnabled }: GoldenSporeProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [bonusSeconds, setBonusSeconds] = useState(0);
  const [collected, setCollected] = useState(false);
  const [collectAmount, setCollectAmount] = useState(0);

  // Spawn golden spore on a random timer
  useEffect(() => {
    const scheduleNext = () => {
      // Random 120-300 seconds (2-5 min)
      const delay = (120 + Math.random() * 180) * 1000;
      return setTimeout(() => {
        // Random position (avoid edges)
        setPosition({
          x: 15 + Math.random() * 70,
          y: 20 + Math.random() * 50,
        });
        // Random bonus: 10-60 seconds of production, minimum 50 spores
        setBonusSeconds(10 + Math.floor(Math.random() * 50));
        setVisible(true);
        setCollected(false);

        // Auto-disappear after 15 seconds if not clicked
        setTimeout(() => {
          setVisible(false);
        }, 15000);
      }, delay);
    };

    // Also spawn one early (30-60s) for new players
    const firstDelay = (30 + Math.random() * 30) * 1000;
    const firstTimer = setTimeout(() => {
      setPosition({
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 50,
      });
      setBonusSeconds(15 + Math.floor(Math.random() * 15));
      setVisible(true);
      setCollected(false);
      setTimeout(() => setVisible(false), 15000);
    }, firstDelay);

    // Regular spawner
    let timer: NodeJS.Timeout;
    const loop = () => {
      timer = scheduleNext();
    };

    const interval = setInterval(() => {
      if (!visible) {
        loop();
      }
    }, 60000); // Check every minute

    // Also start the first regular one
    timer = scheduleNext();

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!visible || collected) return;

    const bonus = Math.max(50, sps * bonusSeconds);
    setCollectAmount(bonus);
    setCollected(true);
    onCollect(bonus);

    // Hide after showing the collected amount
    setTimeout(() => {
      setVisible(false);
      setCollected(false);
    }, 1500);
  }, [visible, collected, sps, bonusSeconds, onCollect]);

  if (!visible) return null;

  return (
    <div
      className={`golden-spore ${collected ? 'collected' : 'floating'}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onClick={handleClick}
    >
      <div className="golden-spore-icon">✨🍄✨</div>
      {collected ? (
        <div className="golden-spore-bonus">
          +{collectAmount >= 1000000
            ? (collectAmount / 1000000).toFixed(1) + 'M'
            : collectAmount >= 1000
              ? (collectAmount / 1000).toFixed(1) + 'K'
              : Math.floor(collectAmount)} spores!
        </div>
      ) : (
        <div className="golden-spore-label">CLICK ME!</div>
      )}
    </div>
  );
}
