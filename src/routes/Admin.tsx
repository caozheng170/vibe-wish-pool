import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { Wish, WishStatus } from '../types/wish';
import { fetchWishes, updateWishAdmin } from '../lib/supabase';
import { WISH_STATUS_LABELS } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { StatusOrb } from '../components/ui/StatusOrb';

export function Admin() {
  const { user, isAdmin, isConfigured, loading: authLoading } = useAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [selected, setSelected] = useState<Wish | null>(null);
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState<WishStatus>('red');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchWishes().then(setWishes);
  }, []);

  useEffect(() => {
    if (selected) {
      setReply(selected.owner_reply ?? '');
      setStatus(selected.status);
    }
  }, [selected]);

  if (authLoading) return null;

  if (isConfigured && !user) {
    return <Navigate to="/login" replace />;
  }

  if (isConfigured && !isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-text-muted">无管理权限</p>
        <p className="mt-2 font-mono text-xs text-text-muted">
          请在 Netlify 设置 VITE_ADMIN_EMAIL 为您的登录邮箱
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateWishAdmin(selected.id, { status, owner_reply: reply || null });
      const updated = { ...selected, status, owner_reply: reply || null };
      setWishes((prev) => prev.map((w) => (w.id === selected.id ? updated : w)));
      setSelected(updated);
      setMessage('已保存');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-mono text-xs text-neon-pink">ADMIN // CONTROL NODE</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide">任务控制面板</h1>
      <p className="mt-2 text-sm text-text-muted">
        登录身份：{user?.email ?? 'demo'} · 更新状态灯与人工回复
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {wishes.map((wish) => (
            <button
              key={wish.id}
              type="button"
              onClick={() => setSelected(wish)}
              className={`w-full text-left transition ${
                selected?.id === wish.id ? 'ring-1 ring-neon-cyan/50' : ''
              }`}
            >
              <GlassPanel className="flex items-start gap-3 py-4">
                <StatusOrb status={wish.status} size="md" />
                <div>
                  <p className="font-display text-sm">{wish.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-text-muted">
                    {wish.description}
                  </p>
                </div>
              </GlassPanel>
            </button>
          ))}
        </div>

        <GlassPanel>
          {selected ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg">{selected.title}</h2>
              <p className="text-sm text-text-muted">{selected.description}</p>

              <div>
                <label className="mb-2 block font-mono text-xs text-text-muted">
                  状态灯
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as WishStatus)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                >
                  {(Object.keys(WISH_STATUS_LABELS) as WishStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {WISH_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs text-text-muted">
                  人工回复
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                  placeholder="是否可开发原型、预计时间、需要澄清的问题…"
                />
              </div>

              {message && (
                <p className="text-sm text-status-green">{message}</p>
              )}

              <NeonButton onClick={handleSave} disabled={saving}>
                {saving ? '保存中…' : '保存更新'}
              </NeonButton>
            </div>
          ) : (
            <p className="py-12 text-center text-text-muted">选择左侧许愿进行管理</p>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
