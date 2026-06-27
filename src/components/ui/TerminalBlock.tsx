import { useState, type ReactNode } from 'react';

interface TerminalBlockProps {
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function TerminalBlock({
  title = 'INITIAL PROMPT // 首批提示词',
  children,
  defaultOpen = false,
}: TerminalBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-neon-purple/30 bg-black/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-neon-purple/10 px-4 py-2 font-mono text-xs tracking-wide text-neon-purple hover:bg-neon-purple/15"
      >
        <span>{title}</span>
        <span>{open ? '[ 收起 ▲ ]' : '[ 展开 ▼ ]'}</span>
      </button>
      {open && (
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-text-primary/90">
          {children}
          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-neon-cyan" />
        </pre>
      )}
    </div>
  );
}
