import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeWish, mockAnalyze } from '../lib/analyzeWish';
import { createWish, updateWishAnalysis } from '../lib/supabase';
import { isHfSpaceConfigured, isSupabaseConfigured } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';

const schema = z.object({
  title: z.string().min(2, '标题至少 2 个字').max(80),
  description: z.string().min(10, '请至少描述 10 个字的需求或痛点').max(4000),
});

type FormData = z.infer<typeof schema>;

export function WishNew() {
  const navigate = useNavigate();
  const { user, isConfigured } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="font-mono text-xs tracking-widest text-neon-pink">TRANSMIT // NEW WISH</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide">发射许愿</h1>
      <p className="mt-3 text-text-muted">
        描述你希望的软件工具，或工作中耗时的流程痛点。提交后 Agnes 将自动分析可行性。
      </p>

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

      <GlassPanel className="mt-8">
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
              需求描述 / PAIN POINT
            </label>
            <textarea
              {...register('description')}
              rows={8}
              placeholder="描述你需要的工具功能，或当前工作流程中的痛点…"
              className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-neon-cyan/50 focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-status-red">{errors.description.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-status-red">{error}</p>}

          <NeonButton type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? '上传信号中…' : 'TRANSMIT WISH'}
          </NeonButton>
        </form>
      </GlassPanel>
    </div>
  );
}
