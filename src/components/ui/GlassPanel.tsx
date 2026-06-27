import type { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  scanline?: boolean;
}

export function GlassPanel({ children, className = '', scanline = false }: GlassPanelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-neon-cyan/20 bg-white/[0.04] p-6 shadow-[0_0_24px_rgba(0,240,255,0.08)] backdrop-blur-xl ${scanline ? 'scanline' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
