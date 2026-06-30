import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../data/portfolio';
import { NeonButton } from '../components/ui/NeonButton';
import { ScrollVideoBackground } from '../components/home/ScrollVideoBackground';
import { ParticlesCanvas } from '../components/home/ParticlesCanvas';
import { FixedFeaturedCards } from '../components/home/FixedFeaturedCards';
import { SectionReveal } from '../components/home/SectionReveal';
import { useHeroScrollFade } from '../hooks/useHeroScrollFade';
import { CARDS_TRIGGER_ID } from '../lib/homeScroll';

const STEP_TITLE_COLORS = [
  'text-neon-cyan/90',
  'text-neon-purple/90',
  'text-status-yellow/90',
  'text-status-green/90',
] as const;

const steps = [
  { n: '01', title: '描述需求', desc: '登录后描述工具需求或流程痛点' },
  { n: '02', title: 'Agnes 分析', desc: 'AI 判断可行性并给出实现路径' },
  { n: '03', title: '人工评估', desc: '回复是否可开发并更新状态灯' },
  { n: '04', title: '原型落地', desc: '蓝灯开发中 → 绿灯进入作品集' },
];

export function Home() {
  const featured = getFeaturedProjects().slice(0, 3);
  const heroOpacity = useHeroScrollFade(0.3);

  return (
    <>
      <ScrollVideoBackground />
      <ParticlesCanvas />
      <FixedFeaturedCards projects={featured} />

      <div id="content" className="relative z-[2]">
        <section
          id="hero"
          className="relative flex min-h-screen w-full flex-col"
          style={{ opacity: heroOpacity }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-28 pt-24 text-center md:pb-32">
            <p className="font-mono text-xs tracking-[0.25em] text-neon-purple/80 uppercase">
              // VIBE CODING · 氛围编程
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-3xl leading-[1.25] font-bold tracking-wide md:text-5xl lg:text-6xl">
              <span className="block text-[#c8d6e5]">
                你提
                <span className="ml-1 text-neon-cyan drop-shadow-[0_0_24px_rgba(0,240,255,0.35)]">
                  痛点
                </span>
                <span className="text-text-muted/60">/</span>
                <span className="text-neon-purple/90 drop-shadow-[0_0_20px_rgba(123,97,255,0.3)]">
                  需求
                </span>
              </span>
              <span className="mt-2 block md:mt-3">
                <span className="text-[#8b9cb3]">我做</span>
                <span className="gradient-text glow-text ml-1.5">工具/应用</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[#9ca3af] md:text-base">
              浏览已落地项目，或在许愿池发射你的工具需求
              <span className="text-text-muted/70"> · </span>
              <span className="text-neon-cyan/70">AI 初筛</span>
              <span className="text-text-muted/50"> + </span>
              <span className="text-status-green/80">人工跟进</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4">
              <NeonButton to="/wish/new">发射许愿</NeonButton>
              <NeonButton to="/portfolio" variant="ghost">
                浏览作品集
              </NeonButton>
            </div>
          </div>

          <div className="relative z-10 flex justify-center pb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6 animate-bounce text-[#6b7280]"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </section>

        <div className="h-[150vh]" aria-hidden />
        <div id={CARDS_TRIGGER_ID} className="h-[200vh]" aria-hidden />
        <div className="h-[100vh]" aria-hidden />

        <SectionReveal
          subtitle="PROTOCOL // HOW IT WORKS"
          title={
            <>
              <span className="text-neon-cyan drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                许愿池
              </span>
              <span className="text-[#8b9cb3]">运作</span>
              <span className="text-neon-purple/90 drop-shadow-[0_0_18px_rgba(123,97,255,0.25)]">
                流程
              </span>
            </>
          }
        >
          <div className="mx-auto grid max-w-3xl gap-6 text-left sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.n}
                className="rounded-lg border border-white/10 bg-black/30 p-5 backdrop-blur-sm"
              >
                <p className="font-display text-lg text-neon-cyan/50">{step.n}</p>
                <h3
                  className={`mt-1 font-display text-sm tracking-wide ${STEP_TITLE_COLORS[index] ?? 'text-[#c8d6e5]'}`}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/portfolio"
              className="font-mono text-xs text-neon-cyan transition hover:underline"
            >
              查看全部代表作 →
            </Link>
            <Link
              to="/wish"
              className="font-mono text-xs text-text-muted transition hover:text-white"
            >
              公开许愿池 →
            </Link>
          </div>
        </SectionReveal>
      </div>
    </>
  );
}
