import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/constants';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setMessage('Supabase 未配置。请在 Netlify 环境变量中设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY。');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/wish/new');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('注册成功！请查收邮件确认（若已开启）或直接登录。');
        setMode('login');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="font-mono text-xs tracking-widest text-neon-cyan">AUTH // IDENTITY NODE</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide">接入身份节点</h1>
      <p className="mt-3 text-sm text-text-muted">登录后可提交许愿并追踪状态</p>

      {!isSupabaseConfigured() && (
        <GlassPanel className="mt-6 border-status-yellow/30 text-sm text-status-yellow">
          Supabase 尚未配置，登录功能不可用。可先浏览作品集与演示许愿池。
        </GlassPanel>
      )}

      <GlassPanel className="mt-8">
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-lg border py-2 font-mono text-xs ${
              mode === 'login'
                ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                : 'border-white/10 text-text-muted'
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-lg border py-2 font-mono text-xs ${
              mode === 'register'
                ? 'border-neon-purple/50 bg-neon-purple/10 text-neon-purple'
                : 'border-white/10 text-text-muted'
            }`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-neon-cyan/50"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少 6 位）"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-neon-cyan/50"
          />
          {message && (
            <p className={`text-sm ${message.includes('成功') ? 'text-status-green' : 'text-status-red'}`}>
              {message}
            </p>
          )}
          <NeonButton type="submit" disabled={loading || !isSupabaseConfigured()} className="w-full">
            {loading ? '连接中…' : mode === 'login' ? 'LOGIN' : 'REGISTER'}
          </NeonButton>
        </form>
      </GlassPanel>
    </div>
  );
}
