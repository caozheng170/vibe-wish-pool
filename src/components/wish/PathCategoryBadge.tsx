import type { AiPath } from '../../types/wish';
import { AI_PATH_LABELS } from '../../lib/constants';

interface PathCategoryBadgeProps {
  path: AiPath;
}

const colors: Record<AiPath, string> = {
  1: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10',
  2: 'border-neon-purple/50 text-neon-purple bg-neon-purple/10',
  3: 'border-status-blue/50 text-status-blue bg-status-blue/10',
  4: 'border-neon-pink/50 text-neon-pink bg-neon-pink/10',
  5: 'border-status-yellow/50 text-status-yellow bg-status-yellow/10',
};

export function PathCategoryBadge({ path }: PathCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs ${colors[path]}`}
    >
      <span className="font-display">PATH {path}</span>
      <span>{AI_PATH_LABELS[path]}</span>
    </span>
  );
}
