import type { PortfolioProject } from '../../types/portfolio';

function isImageScreenshot(url: string): boolean {
  return /\.(png|jpe?g|webp|gif)$/i.test(url);
}

interface ProjectScreenshotProps {
  project: PortfolioProject;
  className?: string;
}

export function ProjectScreenshot({ project, className = '' }: ProjectScreenshotProps) {
  if (isImageScreenshot(project.screenshot_url)) {
    return (
      <img
        src={project.screenshot_url}
        alt={`${project.title} 截图`}
        className={`h-full w-full object-cover object-top ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-deep-light to-neon-purple/10">
      <div className="text-center">
        <p className="font-display text-2xl tracking-widest text-neon-cyan/80">
          {project.title.slice(0, 2).toUpperCase()}
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted">{project.slug}</p>
      </div>
    </div>
  );
}
