import { useEffect, useRef } from 'react';

const GLYPHS = ['0', '1', '{', '}', '//', 'fn', '=>', 'AI', 'vibe', '0x', '…', 'npm', 'git'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: 'cyan' | 'purple' | 'pink';
}

interface CodeGlyph {
  x: number;
  y: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
}

interface NeonStreak {
  offset: number;
  speed: number;
  angle: number;
  width: number;
  color: string;
  phase: number;
}

function pickHue(): Particle['hue'] {
  const r = Math.random();
  if (r < 0.5) return 'cyan';
  if (r < 0.8) return 'purple';
  return 'pink';
}

function hueColor(hue: Particle['hue'], alpha: number): string {
  if (hue === 'cyan') return `rgba(0,240,255,${alpha})`;
  if (hue === 'purple') return `rgba(123,97,255,${alpha})`;
  return `rgba(255,45,149,${alpha})`;
}

export function HeroAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let glyphs: CodeGlyph[] = [];
    let streaks: NeonStreak[] = [];
    let raf = 0;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = window.innerWidth * window.innerHeight;
      const count = Math.min(120, Math.floor(area / 14000));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.45 + 0.15,
        hue: pickHue(),
      }));

      const glyphCount = Math.min(18, Math.floor(area / 80000));
      glyphs = Array.from({ length: glyphCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vy: -(Math.random() * 0.4 + 0.15),
        text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!,
        opacity: Math.random() * 0.12 + 0.04,
        size: Math.random() * 4 + 10,
      }));

      streaks = [
        { offset: 0, speed: 0.00018, angle: -0.55, width: 1.2, color: '0,240,255', phase: 0 },
        { offset: 0.3, speed: 0.00014, angle: -0.48, width: 0.8, color: '123,97,255', phase: 1.2 },
        { offset: 0.6, speed: 0.0002, angle: -0.62, width: 1, color: '255,45,149', phase: 2.4 },
      ];
    };

    const drawStreak = (streak: NeonStreak, t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cycle = ((t * streak.speed + streak.offset) % 1) * (w + h * 2);
      const cx = cycle - h;
      const cy = cycle * 0.6;
      const len = w * 0.35;
      const dx = Math.cos(streak.angle) * len;
      const dy = Math.sin(streak.angle) * len;
      const pulse = 0.35 + 0.25 * Math.sin(t * 0.002 + streak.phase);

      const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
      grad.addColorStop(0, `rgba(${streak.color},0)`);
      grad.addColorStop(0.45, `rgba(${streak.color},${pulse * 0.35})`);
      grad.addColorStop(0.55, `rgba(${streak.color},${pulse * 0.5})`);
      grad.addColorStop(1, `rgba(${streak.color},0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = streak.width;
      ctx.beginPath();
      ctx.moveTo(cx - dx, cy - dy);
      ctx.lineTo(cx + dx, cy + dy);
      ctx.stroke();
    };

    const tick = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = now - startTime;

      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, w, h);

      if (!reducedMotion) {
        for (const streak of streaks) {
          drawStreak(streak, t);
        }
      }

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hueColor(p.hue, p.opacity);
        ctx.fill();
      }

      ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
      for (const g of glyphs) {
        if (!reducedMotion) {
          g.y += g.vy;
          if (g.y < -20) {
            g.y = h + 20;
            g.x = Math.random() * w;
            g.text = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
          }
        }
        ctx.fillStyle = `rgba(200,214,229,${g.opacity})`;
        ctx.font = `500 ${g.size}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.fillText(g.text, g.x, g.y);
      }

      const bottomGrad = ctx.createLinearGradient(0, h * 0.35, 0, h);
      bottomGrad.addColorStop(0, 'rgba(5,8,16,0)');
      bottomGrad.addColorStop(0.55, 'rgba(5,8,16,0.45)');
      bottomGrad.addColorStop(1, 'rgba(5,8,16,0.92)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
