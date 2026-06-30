import { useEffect, useState } from 'react';

/** Hero 随滚动淡出：向下滚动约 30% 视口高度时 opacity 1 → 0 */
export function useHeroScrollFade(fadeViewportRatio = 0.3) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let raf = 0;
    const tick = () => {
      const threshold = window.innerHeight * fadeViewportRatio;
      const next = Math.max(0, 1 - window.scrollY / threshold);
      setOpacity(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fadeViewportRatio]);

  return opacity;
}
