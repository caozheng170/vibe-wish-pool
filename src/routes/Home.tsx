import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../data/portfolio';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { StatusOrb } from '../components/ui/StatusOrb';

const steps = [
  { n: '01', title: '描述需求', desc: '注册登录后，在许愿池描述你想要的工具或工作流痛点' },
  { n: '02', title: 'Agnes 分析', desc: '硅基 AI 自动判断可行性，并给出五类实现路径' },
  { n: '03', title: '人工评估', desc: '我会回复是否可开发原型，并更新状态灯' },
  { n: '04', title: '原型落地', desc: '蓝灯开发中 → 绿灯上线，进入作品集档案' },
];

export function Home() {
  const featured = getFeaturedProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="relative py-16 text-center md:py-24">
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
          className="mt-4 font-display text-4xl font-bold tracking-wide md:text-6xl"
        >
          <span className="gradient-text glow-text">把痛点编译成工具</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted"
        >
          浏览已落地的 Vibe Coding 项目，或在许愿池发射你的下一个工具需求。
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

        <div className="mx-auto mt-12 flex max-w-md flex-wrap justify-center gap-6">
          {(['red', 'yellow', 'blue', 'green'] as const).map((s) => (
            <StatusOrb key={s} status={s} showLabel size="md" />
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs text-neon-cyan">ARCHIVE // DEPLOYED</p>
            <h2 className="font-display text-2xl tracking-wide">已完成的代表性应用网站工具</h2>
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
  );
}
