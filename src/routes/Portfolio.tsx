import { portfolioProjects } from '../data/portfolio';
import { ProjectCard } from '../components/portfolio/ProjectCard';

export function Portfolio() {
  const sorted = [...portfolioProjects].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-mono text-xs tracking-widest text-neon-cyan">ARCHIVE // FULL</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">
        已落地任务档案
      </h1>
      <p className="mt-4 max-w-2xl text-text-muted">
        范本合同、供应商筛选、交互实验、音乐创作工作流——每个项目附带在线链接、功能说明与首批提示词。
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {sorted.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
