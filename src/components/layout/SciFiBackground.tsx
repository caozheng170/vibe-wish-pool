import type { ReactNode } from 'react';

interface SciFiBackgroundProps {
  children: ReactNode;
  /** 首页 flower 风：无网格光晕，避免与 scroll 视频打架 */
  minimal?: boolean;
}

export function SciFiBackground({ children, minimal = false }: SciFiBackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-x-hidden ${minimal ? 'bg-[#010101]' : 'bg-deep'}`}>
      {!minimal && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(123,97,255,0.15) 0%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[600px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)',
            }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
