'use client';
// ============================================
// MYCELIUM — Achievement Toast Popup
// ============================================

import { useState, useEffect } from 'react';

interface ToastItem {
  id: string;
  icon: string;
  name: string;
  description: string;
}

interface AchievementToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function AchievementToast({ toasts, onDismiss }: AchievementToastProps) {
  return (
    <div className="achievement-toast-container">
      {toasts.map((toast, index) => (
        <SingleToast key={toast.id} toast={toast} index={index} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function SingleToast({ toast, index, onDismiss }: { toast: ToastItem; index: number; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Stagger the entrance
    const showTimer = setTimeout(() => setVisible(true), index * 200);
    // Auto-dismiss after 4 seconds
    const hideTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 500);
    }, 4000 + index * 200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, index, onDismiss]);

  return (
    <div
      className={`achievement-toast ${visible ? 'toast-enter' : ''} ${exiting ? 'toast-exit' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => {
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 500);
      }}
    >
      {/* Particle burst on entry */}
      {visible && !exiting && (
        <div className="toast-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="toast-particle"
              style={{
                '--angle': `${i * 45}deg`,
                '--distance': `${20 + Math.random() * 30}px`,
                animationDelay: `${Math.random() * 0.2}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="toast-icon-wrap">
        <div className="toast-icon">{toast.icon}</div>
        <div className="toast-glow" />
      </div>
      <div className="toast-content">
        <div className="toast-label">ACHIEVEMENT UNLOCKED</div>
        <div className="toast-name">{toast.name}</div>
        <div className="toast-desc">{toast.description}</div>
      </div>
      <div className="toast-shine" />
    </div>
  );
}
