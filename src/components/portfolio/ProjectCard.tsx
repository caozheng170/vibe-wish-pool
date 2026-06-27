import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PortfolioProject } from '../../types/portfolio';
import { GlassPanel } from '../ui/GlassPanel';
import { NeonButton } from '../ui/NeonButton';
import { TerminalBlock } from '../ui/TerminalBlock';

interface ProjectCardProps {
  project: PortfolioProject;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <GlassPanel className="flex h-full flex-col">
        <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-neon-cyan/10 bg-gradient-to-br from-deep-light to-neon-purple/10">
          <div className="text-center">
            <p className="font-display text-2xl tracking-widest text-neon-cyan/80">
              {project.title.slice(0, 2).toUpperCase()}
            </p>
            <p className="mt-1 font-mono text-xs text-text-muted">{project.slug}</p>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          {project.tech_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg tracking-wide text-text-primary">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-neon-cyan/80">{project.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
          {project.description}
        </p>

        {project.platform_note && (
          <p className="mt-3 font-mono text-[10px] tracking-wide text-neon-purple/80">
            {project.platform_note}
          </p>
        )}

        <div className="mt-4 space-y-3">
          <TerminalBlock>{project.initial_prompt}</TerminalBlock>
          <div className="flex flex-wrap gap-2">
            <NeonButton to={`/portfolio/${project.slug}`} variant="ghost">
              查看档案
            </NeonButton>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-neon-pink/40 px-4 py-2 font-display text-xs tracking-widest text-neon-pink uppercase transition hover:bg-neon-pink/10"
            >
              在线访问 ↗
            </a>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

export function ProjectCardCompact({ project }: { project: PortfolioProject }) {
  return (
    <Link to={`/portfolio/${project.slug}`}>
      <GlassPanel className="transition hover:border-neon-cyan/40">
        <h3 className="font-display text-sm tracking-wide">{project.title}</h3>
        <p className="mt-1 text-xs text-text-muted">{project.tagline}</p>
      </GlassPanel>
    </Link>
  );
}
