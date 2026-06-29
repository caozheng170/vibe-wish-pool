import { Link, NavLink } from 'react-router-dom';
import { SITE_NAME } from '../../lib/constants';
import { UserMenu } from './UserMenu';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-display text-xs tracking-widest uppercase transition ${
    isActive ? 'text-neon-cyan glow-text' : 'text-text-muted hover:text-neon-cyan'
  }`;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-deep/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 font-display text-sm text-neon-cyan shadow-[0_0_16px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_24px_rgba(0,240,255,0.35)]">
            VC
          </span>
          <div>
            <p className="font-display text-sm tracking-widest text-text-primary">
              {SITE_NAME}
            </p>
            <p className="font-mono text-[10px] text-text-muted">WISH NODE v0.1</p>
          </div>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-4 overflow-x-auto md:gap-8">
          <NavLink to="/portfolio" className={navLinkClass}>
            作品集
          </NavLink>
          <NavLink to="/wish" className={navLinkClass}>
            许愿池
          </NavLink>
          <NavLink to="/wish/new" className={navLinkClass}>
            发射许愿
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
