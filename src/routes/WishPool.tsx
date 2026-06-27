import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Wish, WishStatus } from '../types/wish';
import { fetchWishes } from '../lib/supabase';
import { WISH_STATUS_LABELS, isSupabaseConfigured } from '../lib/constants';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { StatusOrb } from '../components/ui/StatusOrb';
import { PathCategoryBadge } from '../components/wish/PathCategoryBadge';

export function WishPool() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WishStatus | 'all'>('all');

  useEffect(() => {
    fetchWishes()
      .then(setWishes)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all' ? wishes : wishes.filter((w) => w.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-neon-pink">SIGNAL // WISH POOL</p>
          <h1 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">公开许愿信号</h1>
          <p className="mt-3 max-w-xl text-text-muted">
            用户提交的工具需求与 AI 初筛结果。状态灯：
            红=未开始 · 黄=暂不可行 · 蓝=开发中 · 绿=原型完成
          </p>
        </div>
        <NeonButton to="/wish/new">发射许愿</NeonButton>
      </div>

      {!isSupabaseConfigured() && (
        <GlassPanel className="mt-6 border-status-yellow/30">
          <p className="font-mono text-xs text-status-yellow">
            DEMO MODE — 未配置 Supabase，当前展示示例数据。配置 VITE_SUPABASE_URL 后连接真实数据库。
          </p>
        </GlassPanel>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {(['all', 'red', 'yellow', 'blue', 'green'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
              filter === s
                ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                : 'border-white/10 text-text-muted hover:border-white/20'
            }`}
          >
            {s === 'all' ? '全部' : WISH_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-12 text-center font-mono text-sm text-text-muted">
          正在同步许愿信号…
        </p>
      ) : (
        <div className="mt-8 grid gap-4">
          {filtered.map((wish) => (
            <Link key={wish.id} to={`/wish/${wish.id}`}>
              <GlassPanel className="transition hover:border-neon-cyan/30">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <StatusOrb status={wish.status} size="md" />
                    <div>
                      <h2 className="font-display text-lg tracking-wide">{wish.title}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                        {wish.description}
                      </p>
                    </div>
                  </div>
                  {wish.ai_path && <PathCategoryBadge path={wish.ai_path} />}
                </div>
                {wish.ai_analysis && (
                  <p className="mt-3 border-t border-white/5 pt-3 text-xs text-text-muted">
                    AI：{wish.ai_analysis.summary}
                  </p>
                )}
              </GlassPanel>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-text-muted">暂无匹配的许愿信号</p>
          )}
        </div>
      )}
    </div>
  );
}
