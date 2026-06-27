import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Wish } from '../types/wish';
import { fetchWishById } from '../lib/supabase';
import { WISH_STATUS_LABELS } from '../lib/constants';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { StatusOrb } from '../components/ui/StatusOrb';
import { AiAnalysisPanel } from '../components/wish/AiAnalysisPanel';

export function WishDetail() {
  const { id } = useParams<{ id: string }>();
  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchWishById(id)
      .then(setWish)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="py-20 text-center font-mono text-sm text-text-muted">加载中…</p>
    );
  }

  if (!wish) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-text-muted">许愿信号不存在</p>
        <NeonButton to="/wish" className="mt-4">
          返回许愿池
        </NeonButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/wish" className="font-mono text-xs text-neon-cyan hover:underline">
        ← 返回许愿池
      </Link>

      <div className="mt-6 flex flex-wrap items-start gap-4">
        <StatusOrb status={wish.status} size="md" />
        <div>
          <p className="font-mono text-xs text-text-muted">
            STATUS: {WISH_STATUS_LABELS[wish.status].toUpperCase()}
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-wide">{wish.title}</h1>
          <p className="mt-1 font-mono text-[10px] text-text-muted">
            {new Date(wish.created_at).toLocaleString('zh-CN')}
          </p>
        </div>
      </div>

      <GlassPanel className="mt-8">
        <p className="font-mono text-xs text-text-muted">ORIGINAL SIGNAL</p>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed">{wish.description}</p>
      </GlassPanel>

      {wish.ai_analysis && (
        <div className="mt-6">
          <AiAnalysisPanel analysis={wish.ai_analysis} />
        </div>
      )}

      {wish.owner_reply && (
        <GlassPanel className="mt-6 border-neon-cyan/30">
          <p className="font-mono text-xs text-neon-cyan">OWNER REPLY // 人工回复</p>
          <p className="mt-3 leading-relaxed">{wish.owner_reply}</p>
        </GlassPanel>
      )}

      {!wish.owner_reply && wish.status === 'red' && (
        <GlassPanel className="mt-6 border-white/10">
          <p className="text-sm text-text-muted">
            等待人工评估中… 我会回复是否可开发原型并更新状态灯。
          </p>
        </GlassPanel>
      )}
    </div>
  );
}
