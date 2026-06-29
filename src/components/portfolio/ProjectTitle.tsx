import type { ReactNode } from 'react';

const LATIN_RUN = /[A-Za-z0-9][A-Za-z0-9\s.&/'+-]*/g;

function splitTitleParts(title: string): Array<{ text: string; latin: boolean }> {
  const parts: Array<{ text: string; latin: boolean }> = [];
  let lastIndex = 0;

  for (const match of title.matchAll(LATIN_RUN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push({ text: title.slice(lastIndex, start), latin: false });
    }
    parts.push({ text: match[0], latin: true });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < title.length) {
    parts.push({ text: title.slice(lastIndex), latin: false });
  }

  return parts.length > 0 ? parts : [{ text: title, latin: false }];
}

interface ProjectTitleProps {
  title: string;
  className?: string;
  latinClassName?: string;
  chineseClassName?: string;
}

/** 项目标题：英文用 Rajdhani，中文用 Inter，避免 Orbitron 的 Q 等字母难以辨认 */
export function ProjectTitle({
  title,
  className = '',
  latinClassName = 'font-latin',
  chineseClassName = 'font-body font-semibold',
}: ProjectTitleProps) {
  const parts = splitTitleParts(title);

  const nodes: ReactNode[] = parts.map((part, index) =>
    part.latin ? (
      <span key={index} className={latinClassName}>
        {part.text}
      </span>
    ) : (
      <span key={index} className={chineseClassName}>
        {part.text}
      </span>
    ),
  );

  return <span className={className}>{nodes}</span>;
}
