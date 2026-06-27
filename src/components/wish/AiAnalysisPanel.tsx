import type { WishAnalysis } from '../../types/wish';
import { FEASIBILITY_LABELS } from '../../lib/constants';
import { GlassPanel } from '../ui/GlassPanel';
import { PathCategoryBadge } from './PathCategoryBadge';

interface AiAnalysisPanelProps {
  analysis: WishAnalysis;
}

export function AiAnalysisPanel({ analysis }: AiAnalysisPanelProps) {
  return (
    <GlassPanel scanline className="border-neon-purple/30">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-neon-purple">
            AGNES ANALYSIS // NODE-7
          </p>
          <h3 className="font-display text-lg tracking-wide text-text-primary">
            硅基介入报告
          </h3>
        </div>
        <PathCategoryBadge path={analysis.path} />
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="mb-1 font-mono text-xs text-text-muted">SUMMARY</dt>
          <dd className="text-sm leading-relaxed">{analysis.summary}</dd>
        </div>
        <div>
          <dt className="mb-1 font-mono text-xs text-text-muted">FEASIBILITY</dt>
          <dd className="text-sm text-neon-cyan">
            {FEASIBILITY_LABELS[analysis.feasibility]}
          </dd>
        </div>
        <div>
          <dt className="mb-1 font-mono text-xs text-text-muted">PATH REASON</dt>
          <dd className="text-sm leading-relaxed">{analysis.path_reason}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="mb-1 font-mono text-xs text-text-muted">RISKS</dt>
          <dd>
            <ul className="list-inside list-disc space-y-1 text-sm text-text-muted">
              {analysis.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="mb-1 font-mono text-xs text-text-muted">SUGGESTED MVP</dt>
          <dd className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3 text-sm">
            {analysis.suggested_mvp}
          </dd>
        </div>
      </dl>
    </GlassPanel>
  );
}
