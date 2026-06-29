import { SITE_NAME } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-xs tracking-widest text-text-muted">
            {SITE_NAME}
          </p>
        </div>
        <p className="font-mono text-[10px] text-text-muted">
          把工作中的痛点，编译成下一个工具 ·{' '}
          <a href="/admin" className="text-text-muted/50 hover:text-neon-cyan/60">
            admin
          </a>
        </p>
      </div>
    </footer>
  );
}
