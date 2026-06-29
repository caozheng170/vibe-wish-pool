import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence } from 'framer-motion';
import { analyzeWish, mockAnalyze } from '../lib/analyzeWish';
import { createWish, updateWishAnalysis } from '../lib/supabase';
import { isHfSpaceConfigured, isSupabaseConfigured } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { PromptGuidePanel } from '../components/wish/PromptGuidePanel';
import { PROMPT_GUIDE_KIND_META } from '../types/promptGuide';

const schema = z.object({
  title: z.string().min(2, '标题至少 2 个字').max(80),
  description: z.string().min(10, '请至少描述 10 个字的需求或痛点').max(4000),
});

type FormData = z.infer<typeof schema>;

const DESCRIPTION_PLACEHOLDER = `可以先写背景：你现在手头有什么、哪里最烦？

再写功能：希望工具帮你做哪些步骤、按什么规则处理？

最后写产出：最终要得到什么页面、文件或结果？`;

export function WishNew() {
  const navigate = useNavigate();
  const { user, isConfigured } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSubmitting(true);

    try {
      const userId = user?.id ?? 'demo-guest';

      if (isConfigured && !user) {
        setError('请先登录后再提交许愿');
        setSubmitting(false);
        return;
      }

      const wish = await createWish({
        title: data.title,
        description: data.description,
        userId,
      });

      setAnalyzing(true);
      setSubmitting(false);

      const analysis = isHfSpaceConfigured()
        ? await analyzeWish(wish.id, data.description)
        : mockAnalyze(data.description);

      await updateWishAnalysis(wish.id, analysis);
      navigate(`/wish/${wish.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败');
      setSubmitting(false);
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 h-16 w-16 animate-spin rounded-full border-2 border-neon-purple/30 border-t-neon-cyan" />
        <p className="font-mono text-xs tracking-widest text-neon-purple">
          AGNES ANALYSIS // IN PROGRESS
        </p>
        <h2 className="mt-3 font-display text-xl tracking-wide">硅基介入中…</h2>
        <p className="mt-2 text-sm text-text-muted">正在解析需求语义并判断实现路径</p>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto px-4 py-12 transition-[max-width] duration-500 ease-out ${
        hintsOpen ? 'max-w-6xl' : 'max-w-2xl'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-neon-pink">TRANSMIT // NEW WISH</p>
          <h1 className="mt-2 font-display text-3xl tracking-wide">发射许愿</h1>
          <p className="mt-3 max-w-xl text-text-muted">
            描述你希望的软件工具，或工作中耗时的流程痛点。不确定怎么写？展开右侧参考示例即可。
          </p>
        </div>

        <button
          type="button"
          onClick={() => setHintsOpen((open) => !open)}
          aria-expanded={hintsOpen}
          className={`mt-1 shrink-0 rounded-lg border px-4 py-2 font-mono text-xs tracking-wide transition ${
            hintsOpen
              ? 'border-neon-purple/50 bg-neon-purple/15 text-neon-purple'
              : 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:border-neon-cyan/60'
          }`}
        >
          {hintsOpen ? '[ 收起提示 ▲ ]' : '[ 展开提示 ▼ ]'}
        </button>
      </div>

      {!isSupabaseConfigured() && (
        <GlassPanel className="mt-6 border-status-yellow/30 text-sm text-status-yellow">
          演示模式：未配置 Supabase 时可匿名提交，数据保存在本地 mock。
        </GlassPanel>
      )}

      {!isHfSpaceConfigured() && (
        <GlassPanel className="mt-4 border-neon-purple/30 text-sm text-neon-purple">
          HF Space 未配置：将使用本地 mock 分析。部署后在 Netlify 设置 VITE_HF_SPACE_URL。
        </GlassPanel>
      )}

      <div
        className={`mt-8 grid gap-6 transition-all duration-500 ${
          hintsOpen ? 'lg:grid-cols-5 lg:gap-8' : ''
        }`}
      >
        <div className={hintsOpen ? 'lg:col-span-2' : ''}>
          <GlassPanel>
            {hintsOpen && (
              <div className="mb-5 flex flex-wrap gap-2 border-b border-white/5 pb-4">
                {(Object.keys(PROMPT_GUIDE_KIND_META) as Array<
                  keyof typeof PROMPT_GUIDE_KIND_META
                >).map((kind) => {
                  const meta = PROMPT_GUIDE_KIND_META[kind];
                  return (
                    <span
                      key={kind}
                      className={`text-[10px] ${meta.colorClass}`}
                      title={meta.hint}
                    >
                      ● {meta.label}
                    </span>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="mb-2 block font-mono text-xs text-text-muted">
                  任务代号 / TITLE
                </label>
                <input
                  {...register('title')}
                  placeholder="例如：招标公告自动汇总助手"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-neon-cyan/50 focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-status-red">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs text-text-muted">
                  需求描述 / SIGNAL
                </label>
                <textarea
                  {...register('description')}
                  rows={hintsOpen ? 14 : 8}
                  placeholder={DESCRIPTION_PLACEHOLDER}
                  className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-neon-cyan/50 focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-status-red">{errors.description.message}</p>
                )}
                {hintsOpen && (
                  <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
                    参考右侧配色：黄=背景痛点，青=功能需求，绿=交付产出。按段落写即可，不必分栏。
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-status-red">{error}</p>}

              <NeonButton type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? '上传信号中…' : 'TRANSMIT WISH'}
              </NeonButton>
            </form>
          </GlassPanel>
        </div>

        <AnimatePresence mode="wait">
          {hintsOpen && (
            <div key="guide-panel" className="lg:col-span-3">
              <PromptGuidePanel />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
