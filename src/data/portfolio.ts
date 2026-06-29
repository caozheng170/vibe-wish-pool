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
    initial_prompt: `请帮我实现一个"透明物理幕布，手势交互"网页作品，要求使用单文件HTML，技术栈为 p5.js + MediaPipe Hands + Canvas 2D。

核心效果：
屏幕中悬挂一块透明、柔软、有液态光泽的物理幕布。幕布本身几乎透明，不是黑色实体板，也不能像规则网格。底层是摄像头实时画面，幕布后方可以上传图片或视频。用户用拇指和食指 pinch 捏合时抓住幕布，向上甩动会掀起幕布，向下甩动会落回，露出或遮住后方媒体。

技术要求：
1. 单文件 HTML，可直接运行。
2. 使用 p5.js 创建 Canvas 2D。
3. 使用 MediaPipe Hands 做双手手势识别。
4. 鼠标和触摸要作为 fallback。
5. 移动端禁止滚动和双指缩放，设置 touch-action: none。

画面层级：
1. 底层：全屏摄像头实时画面。
2. 中层：上传的图片或视频，固定在幕布初始位置后方。
3. 顶层：透明物理幕布。
4. 幕布需要使用 ctx.clip() 裁剪后再绘制摄像头或光泽层，制造"透明伪装"的感觉。

布料物理：
1. 使用 Verlet cloth。
2. 网格大小建议 38×35 或更高，但要保证性能。
3. 顶行 pin 住。
4. friction 约 0.96。
5. gravity 约 0.1。
6. solver iterations 约 8–12。
7. stick stiffness 约 0.25–0.35。
8. 增加低强度 bend constraint，让布更软，不像硬板。
9. 每个点带随机偏移，用于掀起时产生自然不规则形变。
10. 加 Perlin noise 或 sin 微风扰动，让幕布有轻微呼吸感。
11. 松手后不要整块吸顶卡死，掀起状态要有 liftPulse 衰减机制，让布自然回弹或回落。

手势识别：
1. MediaPipe Hands 支持双手。
2. pinch 使用拇指 tip 和食指 tip。
3. 坐标取两指中点。
4. x 轴需要镜像，以匹配前置摄像头画面。
5. pinch 判断不要只用固定距离，要使用"相对手掌尺度 + 绝对距离兜底"。
6. 例如：
   pinchRatio = thumbIndexDistance / palmSpan
   按下：pinchRatio < 0.34 或 distance < 0.055
   松开：pinchRatio > 0.42 且 distance > 0.075
7. 加 hysteresis 防抖，避免捏合状态抖动。
8. 帧间手部跟踪使用最近点匹配，半径约 200px。
9. 抓取半径约 150–160px。
10. 抓取点不要太多，建议 30–40 个点，否则甩起时会整块卡住。
11. 右下角显示手势调试信息，例如当前 pinch ratio 和 distance。

甩动机制：
1. 松手瞬间根据垂直速度 vy 判断：
   vy < -15：触发上甩
   vy > 15：触发落回
2. 上甩时只给局部或上半部分短暂 liftPulse，而不是整块布永久吸到顶部。
3. liftPulse 每帧衰减，例如乘以 0.985。
4. liftPulse 很小时，自动回到正常状态。
5. 上甩只添加短暂惯性冲量，不要永久拉住所有点。
6. 避免幕布全部卡在顶部或左右角落。

视觉要求：
1. 幕布必须是透明的，不要铺深色实体底。
2. 不要显示明显的规则方格、网格线、矩形块面。
3. 不要逐个 quad 画强烈明暗块，否则会像很多方块拼起来。
4. 使用轻量透明 veil：
   中心轻微白色透明
   边缘轻微暗角
   整体保持能看见背后画面
5. 使用少量不规则流动曲线表现褶皱：
   不是横平竖直网格
   曲线要随布料节点变化
   alpha 要低
6. 添加一条或几条斜向珠光高光，让它更像透明软膜/丝绸/液态膜。
7. 边缘要柔和：
   内圈淡黑 alpha 很低
   外圈淡白 alpha 约 0.4 左右
   strokeWeight 约 1–3
   shadowBlur 不要太大，避免卡顿
8. 整体视觉要像"透明物理幕布""柔软液态薄膜"，不要像黑色板子或硬矩形。

性能要求：
1. 不要在每帧大量使用 ctx.filter = blur。
2. 不要每帧大量创建径向渐变。
3. 不要逐个网格 quad 做高强度填充。
4. 渲染要轻量、流畅。
5. 可以用少量曲线高光和低透明渐变代替复杂阴影。
6. 如果性能不足，优先减少折痕线数量，而不是降低手势识别。

UI：
1. 启动遮罩 + Start 按钮。
2. 右下角上传媒体按钮。
3. 翻转摄像头按钮。
4. 媒体缩放滑块。
5. 右上角"眼睛"图标用于隐藏/显示 UI。
6. 未上传媒体时显示深灰占位和提示文字。
7. 支持窗口 resize 后重建 canvas 和布料网格。
8. 布料初始尺寸自适应屏幕，在屏幕约 0.85×0.55 区域内。`,
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
    initial_prompt: `帮我制作一个网页，标题是"QAZ AI音乐创作工坊"。

作为 AI 音乐生成，首先是歌词生成和提示词生成，为此我做了 2 个工作流，链接分别是：

歌词生成：
http://*.*.*.*:3005/chat/flow/9e7c5d437b414d91aa6f807a7e7fcf48

风格提示词生成：
http://*.*.*.*:3005/chat/flow/8b689571b0a84a0092112d587eb83e5a

将其融入到网页，并能点击后跳转链接，方便打开他们。

接着下方可以挂 2 个 AI 音乐创作平台的链接，分别是 Suno 平台和妙响平台，链接分别是：
https://suno.com/create
https://music.douyin.com/studio/create

当然 Suno 平台那里得在旁边注一个小圈符号，用鼠标悬停后小字提示"国内网络无法点击打开"。

另外下方再挂上 2 个我的音乐代表作，歌曲分别是《云团小太阳》和《小学生啦》，这 2 首歌曲的播放链接分别是：
https://music.163.com/#/song?id=3343859105
《小学生啦》@汽水音乐 https://qishui.douyin.com/s/iQXeNGpK/

网页得做的炫酷，时尚，潮流感十足。`,
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
