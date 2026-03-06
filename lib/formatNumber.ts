// ============================================
// MYCELIUM — Number Formatting
// ============================================

const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc',
  'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc',
  'SpDc', 'OcDc', 'NoDc', 'Vg'
];

export function formatNumber(
  n: number,
  notation: 'standard' | 'scientific' | 'engineering' = 'standard',
  decimals: number = 1
): string {
  if (n < 0) return '-' + formatNumber(-n, notation, decimals);
  if (n === 0) return '0';
  if (!isFinite(n)) return '∞';

  if (notation === 'scientific') {
    if (n < 1000) return n.toFixed(decimals);
    const exp = Math.floor(Math.log10(n));
    const mantissa = n / Math.pow(10, exp);
    return `${mantissa.toFixed(2)}e${exp}`;
  }

  if (notation === 'engineering') {
    if (n < 1000) return n.toFixed(decimals);
    const exp = Math.floor(Math.log10(n));
    const engExp = Math.floor(exp / 3) * 3;
    const mantissa = n / Math.pow(10, engExp);
    return `${mantissa.toFixed(2)}e${engExp}`;
  }

  // Standard notation with suffixes
  if (n < 1000) {
    return n < 10 ? n.toFixed(decimals) : Math.floor(n).toString();
  }

  const tier = Math.floor(Math.log10(n) / 3);
  if (tier < SUFFIXES.length) {
    const suffix = SUFFIXES[tier];
    const scaled = n / Math.pow(1000, tier);
    return `${scaled.toFixed(decimals)}${suffix}`;
  }

  // Fallback for extremely large numbers
  const exp = Math.floor(Math.log10(n));
  const mantissa = n / Math.pow(10, exp);
  return `${mantissa.toFixed(2)}e${exp}`;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return `${d}d ${h}h`;
}

export function formatPercent(n: number, decimals: number = 2): string {
  return `${n.toFixed(decimals)}%`;
}
