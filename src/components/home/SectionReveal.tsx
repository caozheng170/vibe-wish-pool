import { useEffect, useRef, useState, type ReactNode } from 'react';

interface SectionRevealProps {
  subtitle: string;
  title: ReactNode;
  children?: ReactNode;
}

export function SectionReveal({ subtitle, title, children }: SectionRevealProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative flex min-h-screen items-end justify-center px-4 pb-24 md:px-10 md:pb-32">
      <div
        ref={innerRef}
        className={`relative z-10 w-full max-w-4xl text-center transition-all duration-1000 ease-out ${
          visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-md'
        }`}
      >
        <p className="font-mono text-xs tracking-[0.25em] text-neon-purple/75 uppercase">
          {subtitle}
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-wide md:text-5xl lg:text-6xl">
          {title}
        </h2>
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
