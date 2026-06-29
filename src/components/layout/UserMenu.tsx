import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/constants';
import { getSupabase } from '../../lib/supabase';
import { NeonButton } from '../ui/NeonButton';

function displayEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 4) return email;
  return `${local.slice(0, 3)}***@${domain}`;
}

export function UserMenu() {
  const { user, isAdmin, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    setOpen(false);
    navigate('/');
  };

  if (loading) {
    return (
      <span className="font-mono text-xs text-text-muted">…</span>
    );
  }

  if (!user) {
    return (
      <NeonButton to="/login" variant="ghost">
        登录/注册
      </NeonButton>
    );
  }

  const email = user.email ?? '用户';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-2 font-mono text-xs text-neon-cyan transition hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-purple/20 text-[10px] font-display text-neon-purple">
          {email.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[140px] truncate sm:inline">
          {displayEmail(email)}
        </span>
        <span className="text-text-muted">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-white/10 bg-deep-light/95 py-1 shadow-[0_0_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="border-b border-white/5 px-4 py-2">
            <p className="font-mono text-[10px] text-text-muted">已登录</p>
            <p className="mt-0.5 truncate text-xs text-text-primary">{email}</p>
            {isAdmin && (
              <p className="mt-1 font-mono text-[10px] text-neon-pink">ADMIN</p>
            )}
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              role="menuitem"
              className="block px-4 py-2 font-mono text-xs text-text-primary transition hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              管理面板
            </Link>
          )}
          {!isSupabaseConfigured() && (
            <p className="px-4 py-2 font-mono text-[10px] text-status-yellow">
              演示模式
            </p>
          )}
          <button
            type="button"
            role="menuitem"
            disabled={signingOut}
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left font-mono text-xs text-status-red transition hover:bg-status-red/10 disabled:opacity-50"
          >
            {signingOut ? '退出中…' : '用户退出'}
          </button>
        </div>
      )}
    </div>
  );
}
