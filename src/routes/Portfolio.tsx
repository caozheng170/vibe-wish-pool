import { portfolioProjects } from '../data/portfolio';
import { ProjectCard } from '../components/portfolio/ProjectCard';

export function Portfolio() {
  const sorted = [...portfolioProjects].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-mono text-xs tracking-widest text-neon-cyan">ARCHIVE // FULL</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">
        已完成的代表性应用网站工具
      </h1>
      <p className="mt-4 max-w-2xl text-text-muted">
        每个项目附带在线链接、功能说明与首批提示词。
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {sorted.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
