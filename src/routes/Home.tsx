import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../data/portfolio';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { StatusOrb } from '../components/ui/StatusOrb';
import { HeroAmbientCanvas } from '../components/home/HeroAmbientCanvas';
import { useHeroScrollFade } from '../hooks/useHeroScrollFade';

const steps = [
  { n: '01', title: '描述需求', desc: '注册登录后，在许愿池描述你想要的工具或工作流痛点' },
  { n: '02', title: 'Agnes 分析', desc: '硅基 AI 自动判断可行性，并给出五类实现路径' },
  { n: '03', title: '人工评估', desc: '我会回复是否可开发原型，并更新状态灯' },
  { n: '04', title: '原型落地', desc: '蓝灯开发中 → 绿灯上线，进入作品集档案' },
];

export function Home() {
  const featured = getFeaturedProjects();
  const heroOpacity = useHeroScrollFade(0.3);

  return (
    <>
      <HeroAmbientCanvas />

      <div className="relative z-10">
        <section
          id="hero"
          className="relative flex min-h-screen flex-col transition-opacity duration-150"
          style={{ opacity: heroOpacity }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-deep/20" />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-16 pt-28 text-center md:pb-24">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs tracking-[0.3em] text-neon-purple"
            >
              // VIBE CODING WISH NODE
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-4xl font-display text-3xl font-bold leading-tight tracking-wide md:text-5xl lg:text-6xl"
            >
              <span className="text-text-primary">你提痛点/需求</span>
              <br className="hidden sm:block" />
              <span className="sm:ml-2">
                <span className="relative inline-block">
                  <span
                    className="absolute bottom-1 left-0 h-2 w-full rounded-sm bg-neon-cyan/35 md:h-2.5"
                    aria-hidden
                  />
                  <span className="gradient-text glow-text relative">我做工具/应用</span>
                </span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-base text-text-muted md:text-lg"
            >
              浏览已落地的 Vibe Coding（氛围编程） 项目，或在许愿池发射你的工具需求。
              <br />
              AI 初筛 + 人工跟进，从红灯到绿灯。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <NeonButton to="/wish/new">发射许愿</NeonButton>
              <NeonButton to="/portfolio" variant="ghost">
                浏览作品集
              </NeonButton>
            </motion.div>

            <div className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-6 md:mt-12">
              {(['red', 'yellow', 'blue', 'green'] as const).map((s) => (
                <StatusOrb key={s} status={s} showLabel size="md" />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex justify-center pb-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-text-muted/60"
              aria-hidden
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </motion.div>
          </div>
        </section>

        <div className="border-t border-white/5 bg-deep/95 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <section className="mb-20">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="font-mono text-xs text-neon-cyan">ARCHIVE // DEPLOYED</p>
                  <h2 className="font-display text-2xl tracking-wide">
                    已完成的代表性应用网站工具
                  </h2>
                </div>
                <Link to="/portfolio" className="font-mono text-xs text-neon-cyan hover:underline">
                  查看全部 →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 font-mono text-xs text-neon-purple">PROTOCOL // HOW IT WORKS</p>
              <h2 className="mb-8 font-display text-2xl tracking-wide">许愿池运作流程</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step) => (
                  <GlassPanel key={step.n}>
                    <p className="font-display text-2xl text-neon-cyan/40">{step.n}</p>
                    <h3 className="mt-2 font-display text-sm tracking-wide">{step.title}</h3>
                    <p className="mt-2 text-sm text-text-muted">{step.desc}</p>
                  </GlassPanel>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
