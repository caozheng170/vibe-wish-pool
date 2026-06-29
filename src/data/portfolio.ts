import type { PortfolioProject } from '../types/portfolio';

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'supplier-screening',
    title: '供应商智能匹配平台',
    tagline: '支持多参投标表 · Excel 双表筛选匹配历史招投标',
    url: 'https://chipper-buttercream-dc9dbb.netlify.app/',
    description:
      '面向采购/招标场景：上传供应商信息表与投标/中标表，按产品、地址、资质、注册资本层层筛选，再跨表匹配历史投标记录，并输出处理日志。',
    features: [
      '文件1 供应商信息表 + 文件2 投标/中标表（支持多文件）',
      '产品名称、联系地址、资质、最低注册资本多维筛选',
      '跨表匹配投标单位/中标单位',
      '实时处理日志，解析行数与匹配进度可视',
    ],
    initial_prompt: `手头有2个excel文件，都是多sheet的：文件1是供应商信息表，几个sheet的表头大致相同，来自表1里的筛选条件包含4项：字段名分别为「供应商主营」、「注册资本」、「供应商资质」、「联系地址」。

接下来是一个层层筛选的逻辑过程：
- 如果用户在「输入产品名称」空格里填入「劳务」，则首先是对文件1的全工作簿范围内「供应商主营」字段里做模糊搜索；
- 在「输入联系地址」空格里填入「湖州」，则表示在之前基础上，对「联系地址」字段里包含「湖州」的做全工作范围内的搜索；
- 在「输入资质条件」空格里填入「ISO」，则表示在之前筛选基础上，「供应商资质」字段里包含「ISO」的要过滤出来；
- 在「输入最低注册资本」空格里填入「200」，则表示在此前过滤基础上找到「注册资本」至少是200万元的单位。

经过层层筛选后，得到N家符合以上条件的，我们将把其「供应商名称」里的内容，依次作为文件2里的搜索关键词去通配搜索。如有匹配到的，表示他们至少是参加过投标/中标的，即名称出现在「投标单位」字段或者是「中标单位」字段里。

查询结果把匹配到的行里各字段信息都带出来，比如：招标项目名称、投标单位/中标单位、中标单价、中标总价等，并且能直观显示他参与投标了几次、中标过几次。

我需要做这么一个平台：只要我上传2个表格文件，并填入至少1个筛选条件，就能快速帮助我筛选出来。全程不需要用到模型，只是代替原先在excel里的多次筛选动作及2个表格文件里来回辅助的反复和累赘过程。`,
    tech_tags: ['Excel', '招投标', '供应商筛选', 'Netlify'],
    ai_path: 1,
    platform_note: 'PLATFORM: Gemini · NO LLM IN RUNTIME',
    screenshot_url: '/portfolio/supplier-screening.png',
    featured: true,
    sort_order: 1,
  },
  {
    slug: 'contract-generator',
    title: '范本合同生成工具平台',
    tagline: 'ContractFlow Enterprise · 21 页 1:1 预览 · Word 导出',
    url: 'https://resilient-halva-5e66c5.netlify.app/',
    description:
      '设备采购与安装调试买卖合同在线填写：左侧六步向导录入，右侧 21 页标准排版实时预览，字段高亮联动，一键导出 Word。',
    features: [
      '六步向导：基本信息 → 附件明细 → 商务条件 → 付款质保 → 交货验收 → 签署盖章',
      '行业模板一键载入：离子离心机、螺杆空压机、工业机械臂等',
      '21 页 1:1 Word 对应预览，分页浏览',
      '导出标准 Word 文档',
    ],
    initial_prompt: `法务部给了设备采购合同模板，我想做一个应用：业务员填好必填字段后，系统自动把内容填入 Word 模板，生成最终合同文档。

需要采集的数据包括：

一、合同与商事主体基本信息
合同编号、设备名称（用于合同标题）、甲方公司全称、乙方公司全称、签订地点、签订日期。

二、标的物、供货范围与工期
设备部件明细表（部件名称、规格型号、材质、品牌、数量、含税单价、产地/进口品牌等），支持增删行；合同总价（大小写）、备品备件清单、生产工期（预付款后X天）、安装调试工期。

三、付款与质保
付款比例与期限（如签约后X日内付X%）、各阶段付款节点、设备质保年限。

四、交货与物流
交货地点；技术资料邮寄信息（收件人、地址、联系方式）。

五、特别约定与联络信息
特别条款；甲乙双方联系人、地址、电话、邮箱。

我手头有法务给的 PDF 合同模板，但最终希望应用能输出 Word（.docx）文件，把用户填写的数据写入标准合同正文。`,
    tech_tags: ['Google AI Studio', '合同生成', 'Word 导出', 'PDF 模板'],
    ai_path: 1,
    platform_note: 'PLATFORM: Google AI Studio · OUTPUT: .docx',
    screenshot_url: '/portfolio/contract-generator.png',
    featured: true,
    sort_order: 2,
  },
  {
    slug: 'liquid-veil',
    title: 'Liquid Veil',
    tagline: '透明物理幕布与手势控制 · p5.js + MediaPipe',
    url: 'https://ephemeral-halva-bd24f8.netlify.app/',
    description:
      '物理交互实验：摄像头实时画面 + Verlet 液态幕布，MediaPipe 手势捏合/抓取（GRABBED），支持电视幕布模式与亮度、缩放调节。',
    features: [
      '全屏摄像头 + 液态幕布物理效果',
      'MediaPipe 手势追踪与 GRABBED 状态',
      '电视幕布 / 清除幕布等模式切换',
      '亮度、缩放、连线、声音等实时控制',
      'M-Pipe Engine 就绪状态与 Ratio/Dist 调试信息',
    ],
    initial_prompt: '【待补充首批提示词】',
    tech_tags: ['p5.js', 'MediaPipe', 'Verlet', '交互实验'],
    ai_path: 1,
    screenshot_url: '/portfolio/liquid-veil.png',
    featured: true,
    sort_order: 3,
  },
  {
    slug: 'qaz-music-studio',
    title: 'QAZ AI 音乐创作工坊',
    tagline: 'AI Music Studio v1.2 · 歌词灵感 · 风格提示词 · 多平台入口',
    url: 'https://sage-eclair-192ed1.netlify.app/',
    description:
      '聚合歌词灵感引擎与风格提示词生成，一键跳转 Suno、妙响等创作平台，内置背景灵感合成器与代表作品集展示。',
    features: [
      '歌词灵感引擎 · 风格提示词生成（双创作流）',
      'Suno / 妙响创作平台外链入口',
      '代表作品集：云团小太阳、小学生啦等',
      'Internal Composer 背景灵感音乐',
    ],
    initial_prompt: '【待补充首批提示词】',
    tech_tags: ['AI 音乐', 'Suno', '歌词', '创作工作流'],
    ai_path: 2,
    screenshot_url: '/portfolio/qaz-music-studio.png',
    featured: false,
    sort_order: 4,
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): PortfolioProject[] {
  return portfolioProjects
    .filter((p) => p.featured)
    .sort((a, b) => a.sort_order - b.sort_order);
}
