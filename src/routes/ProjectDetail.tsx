import { Link } from 'react-router-dom';
import { getProjectBySlug } from '../data/portfolio';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { TerminalBlock } from '../components/ui/TerminalBlock';
import { PathCategoryBadge } from '../components/wish/PathCategoryBadge';

interface Props {
  slug: string;
}

export function ProjectDetail({ slug }: Props) {
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-text-muted">项目不存在</p>
        <NeonButton to="/portfolio" className="mt-4">
          返回作品集
        </NeonButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/portfolio" className="font-mono text-xs text-neon-cyan hover:underline">
        ← 返回作品集
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-text-muted">{project.slug}</p>
          <h1 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-2 text-neon-cyan">{project.tagline}</p>
        </div>
        <PathCategoryBadge path={project.ai_path} />
      </div>

      <GlassPanel className="mt-8">
        <p className="leading-relaxed text-text-primary">{project.description}</p>
        <ul className="mt-6 space-y-2">
          {project.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-text-muted">
              <span className="text-neon-cyan">✦</span>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/10 px-2 py-1 font-mono text-xs text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </GlassPanel>

      <div className="mt-6">
        <TerminalBlock defaultOpen>{project.initial_prompt}</TerminalBlock>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-neon-pink/50 bg-neon-pink/10 px-6 py-3 font-display text-xs tracking-widest text-neon-pink uppercase transition hover:bg-neon-pink/20"
        >
          在线访问 ↗
        </a>
        <NeonButton to="/wish/new" variant="ghost">
          我也想要类似工具 →
        </NeonButton>
      </div>
    </div>
  );
}
