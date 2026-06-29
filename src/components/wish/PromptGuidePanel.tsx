import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getGuideableProjects,
  getPromptGuide,
  pickRandomGuideSlug,
} from '../../data/promptGuides';
import { PROMPT_GUIDE_KIND_META } from '../../types/promptGuide';

export function PromptGuidePanel() {
  const guideable = getGuideableProjects();
  const [slug, setSlug] = useState(() => pickRandomGuideSlug());

  const project = guideable.find((p) => p.slug === slug)!;
  const guide = getPromptGuide(slug)!;

  const shuffle = useCallback(() => {
    const others = guideable.filter((p) => p.slug !== slug);
    if (others.length === 0) return;
    const next = others[Math.floor(Math.random() * others.length)]!;
    setSlug(next.slug);
  }, [guideable, slug]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex h-full flex-col rounded-xl border border-neon-purple/30 bg-black/40 backdrop-blur-sm"
    >
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-neon-purple">
              REFERENCE // 写法参考
            </p>
            <h2 className="mt-1 font-display text-sm tracking-wide text-text-primary">
              {project.title}
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">{project.tagline}</p>
          </div>
          <button
            type="button"
            onClick={shuffle}
            className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] text-neon-cyan transition hover:border-neon-cyan/40 hover:bg-neon-cyan/10"
          >
            换一个示例 ↻
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(PROMPT_GUIDE_KIND_META) as Array<keyof typeof PROMPT_GUIDE_KIND_META>).map(
            (kind) => {
              const meta = PROMPT_GUIDE_KIND_META[kind];
              return (
                <span
                  key={kind}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] ${meta.borderClass} ${meta.bgClass} ${meta.colorClass}`}
                  title={meta.hint}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {meta.label}
                </span>
              );
            },
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        {guide.sections.map((section, index) => {
          const meta = PROMPT_GUIDE_KIND_META[section.kind];
          return (
            <div
              key={`${section.kind}-${index}`}
              className={`rounded-lg border-l-2 p-3 ${meta.borderClass} ${meta.bgClass}`}
            >
              <p className={`mb-1.5 font-mono text-[10px] tracking-wide ${meta.colorClass}`}>
                {meta.label}
                <span className="ml-2 font-normal text-text-muted">· {meta.hint}</span>
              </p>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-text-primary/90">
                {section.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-text-muted">
          左侧描述可按同样结构写：先讲痛点，再讲具体功能，最后说明要什么结果。不必完全一样，写清楚即可。
        </p>
        <Link
          to={`/portfolio/${project.slug}`}
          className="mt-2 inline-block font-mono text-[10px] text-neon-pink hover:underline"
        >
          查看完整项目档案 →
        </Link>
      </div>
    </motion.div>
  );
}
