import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioProject } from '../../types/portfolio';
import { ProjectTitle } from '../portfolio/ProjectTitle';
import { CARDS_TRIGGER_ID } from '../../lib/homeScroll';

interface FixedFeaturedCardsProps {
  projects: PortfolioProject[];
}

export function FixedFeaturedCards({ projects }: FixedFeaturedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fixedCards = containerRef.current;
    const cardsGrid = gridRef.current;
    if (!fixedCards || !cardsGrid) return;

    let raf = 0;

    const tick = () => {
      const trigger = document.getElementById(CARDS_TRIGGER_ID);
      if (!trigger) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const triggerTop = rect.top + window.scrollY;
      const triggerHeight = rect.height;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const start = triggerTop - vh * 0.5;
      const end = triggerTop + triggerHeight - vh * 0.3;
      const range = end - start;

      let progress = range > 0 ? (scrollY - start) / range : 0;
      progress = Math.max(0, Math.min(1, progress));

      const isActive = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.3;
      const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.2)) / (vh * 0.2)));
      const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.3 - scrollY) / (vh * 0.3)));
      const containerOpacity = isActive ? Math.min(fadeIn, fadeOut) : 0;

      fixedCards.style.opacity = String(containerOpacity);
      fixedCards.style.pointerEvents = containerOpacity > 0.1 ? 'auto' : 'none';

      const isMobile = window.innerWidth < 768;
      const revealPct = progress * 130;
      const mask = isMobile
        ? `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 20}%)`
        : `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 15}%)`;

      cardsGrid.style.maskImage = mask;
      cardsGrid.style.webkitMaskImage = mask;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (projects.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed right-0 bottom-0 left-0 z-[4] px-4 pb-8 opacity-0 md:px-10 md:pb-10"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={gridRef}
        className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-10"
      >
        {projects.slice(0, 3).map((project) => (
          <article key={project.slug} className="text-left">
            <Link
              to={`/portfolio/${project.slug}`}
              className="block transition hover:opacity-90"
            >
              <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                <ProjectTitle title={project.title} />
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#d1d5db]">{project.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-neon-cyan transition hover:text-neon-cyan/80"
              >
                在线访问 ↗
              </a>
              <Link
                to={`/portfolio/${project.slug}`}
                className="font-mono text-xs text-text-muted transition hover:text-white"
              >
                查看档案 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
