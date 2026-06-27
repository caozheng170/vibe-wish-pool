import type { WishStatus } from '../../types/wish';
import { WISH_STATUS_LABELS } from '../../lib/constants';

const styles: Record<WishStatus, string> = {
  red: 'bg-status-red text-status-red shadow-[0_0_12px_#ff3b3b]',
  yellow: 'bg-status-yellow text-status-yellow shadow-[0_0_12px_#ffd24a]',
  blue: 'bg-status-blue text-status-blue shadow-[0_0_12px_#3d8bff] animate-[pulse-glow_2s_ease-in-out_infinite]',
  green: 'bg-status-green text-status-green shadow-[0_0_12px_#00ff9d]',
};

interface StatusOrbProps {
  status: WishStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function StatusOrb({ status, showLabel = false, size = 'sm' }: StatusOrbProps) {
  const dim = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5';

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block rounded-full ${dim} ${styles[status]}`} />
      {showLabel && (
        <span className="text-xs text-text-muted">{WISH_STATUS_LABELS[status]}</span>
      )}
    </span>
  );
}
