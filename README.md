# Vibe Coding 许愿池

科幻风个人站点：**作品集** + **许愿池** + **Agnes AI 初筛** + **四色状态灯管理**。

## 架构

| 层 | 技术 |
|----|------|
| 前端 | React + TypeScript + Vite + Tailwind → **Netlify** |
| AI 分析 | FastAPI → **HF Space** → Agnes API |
| 数据 | **Supabase** Auth + Postgres |

## 本地开发

```bash
npm install
cp .env.example .env.local   # 可选，未配置时使用 demo/mock
npm run dev
```

## 环境变量（Netlify）

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_HF_SPACE_URL=https://your-space.hf.space
VITE_ADMIN_EMAIL=your@email.com
```

**Agnes API Key 只放 HF Space Secrets：**

```
CLOUD_BASE_URL=https://apihub.agnes-ai.com/v1
CLOUD_API_KEY=sk-...
CLOUD_TEXT_MODEL=agnes-2.0-flash
```

## Supabase

在 Supabase SQL Editor 执行 `supabase/schema.sql`。

## HF Space

将 `hf-space/` 目录推送到 Hugging Face Space（Docker SDK）。

## 页面

- `/` 首页
- `/portfolio` 作品集（4 个已落地项目）
- `/wish` 公开许愿池
- `/wish/new` 发射许愿
- `/admin` 管理状态灯与回复

## 部署到 Netlify

**完整清单：[docs/DEPLOY.md](./docs/DEPLOY.md)**

| 文档 | 说明 |
|------|------|
| [docs/NETLIFY.md](./docs/NETLIFY.md) | Netlify 构建与环境变量 |
| [docs/SUPABASE.md](./docs/SUPABASE.md) | 数据库 + 登录 + 管理权限 |
| [docs/HF-SPACE.md](./docs/HF-SPACE.md) | Agnes AI 后端 Space |

快速摘要：

1. GitHub 连 Netlify，或本地 `npm run build` 后拖拽 `dist`
2. 在 Netlify 设置 4 个 `VITE_*` 环境变量（见 `.env.example`）
3. 改环境变量后 **Clear cache and redeploy**
4. Supabase 配置 Site URL / Redirect URLs 为你的 Netlify 域名

**站点（生产）：** https://famous-pegasus-a71b51.netlify.app/

**环境变量配置清单：** [docs/PRODUCTION-CONFIG.md](./docs/PRODUCTION-CONFIG.md)
