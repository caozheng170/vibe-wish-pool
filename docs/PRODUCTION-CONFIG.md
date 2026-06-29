# 生产环境配置清单

**站点：** https://famous-pegasus-a71b51.netlify.app/  
**Netlify 团队：** [pgraduate](https://app.netlify.com/teams/pgraduate/projects)  
**GitHub：** [caozheng170/vibe-wish-pool](https://github.com/caozheng170/vibe-wish-pool)

---

## 当前状态

| 功能 | 状态 |
|------|------|
| 首页 / 作品集 | ✅ 已上线 |
| 许愿池 UI | ✅ 可用 |
| 登录 / 真实数据 | ⏳ 需 Supabase |
| Agnes AI 分析 | ⏳ 需 HF Space |
| 管理后台 | ⏳ 需 Supabase + ADMIN_EMAIL |

未配变量时站点以 **演示模式** 运行（mock 许愿 + mock AI）。

---

## 第一步：Netlify 环境变量

路径：**Site configuration → Environment variables → Add a variable**

勾选 **Production**（建议 Deploy previews 也勾上）。

| 变量名 | 填什么 | 必填 |
|--------|--------|------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL | 登录/许愿必配 |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public | 登录/许愿必配 |
| `VITE_HF_SPACE_URL` | HF Space 根地址，见下方 | AI 分析必配 |
| `VITE_ADMIN_EMAIL` | 您的登录邮箱（管理 `/admin`） | 管理必配 |

### 示例（把 xxx 换成真实值）

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_HF_SPACE_URL=https://caozheng-vibe-wish-analyzer.hf.space
VITE_ADMIN_EMAIL=you@example.com
```

⚠️ **不要**在 Netlify 填 `CLOUD_API_KEY`（Agnes Key 只放 HF Space Secrets）。

### 保存后必须重新部署

**Deploys → Trigger deploy → Clear cache and deploy site**

`VITE_*` 在构建时写入，不 redeploy 不会生效。

---

## 第二步：Supabase

### 2.1 建表

SQL Editor 执行：

1. `supabase/schema.sql`
2. `supabase/admin-policy.sql`（把 `REPLACE_WITH_ADMIN_EMAIL` 换成您的邮箱）

### 2.2 Auth URL（用您的 Netlify 地址）

**Authentication → URL Configuration**

| 字段 | 值 |
|------|-----|
| Site URL | `https://famous-pegasus-a71b51.netlify.app` |
| Redirect URLs | `https://famous-pegasus-a71b51.netlify.app/**` |
| | `http://localhost:5173/**` |

---

## 第三步：HF Space（Agnes 后端）

Space 目标：**https://huggingface.co/spaces/caozheng/vibe-wish-analyzer**

部署见 [HF-SPACE-DEPLOY.md](./HF-SPACE-DEPLOY.md)。

### Space Secrets

| Secret | 值 |
|--------|-----|
| `CLOUD_BASE_URL` | `https://apihub.agnes-ai.com/v1` |
| `CLOUD_API_KEY` | Agnes API Key（轮换后的新 Key） |
| `CLOUD_TEXT_MODEL` | `agnes-2.0-flash` |
| `ALLOWED_ORIGINS` | `https://famous-pegasus-a71b51.netlify.app` |

构建完成后 Netlify 填：

```
VITE_HF_SPACE_URL=https://caozheng-vibe-wish-analyzer.hf.space
```

（若 Space 名称不同，以 HF 实际 URL 为准）

---

## 第四步：验收

| 检查项 | URL |
|--------|-----|
| 首页 | https://famous-pegasus-a71b51.netlify.app/ |
| 作品集 | /portfolio |
| 登录 | /login |
| 发射许愿 | /wish/new → 应调真实 Agnes（非 mock） |
| 管理 | /admin（仅 ADMIN_EMAIL） |

---

## 推荐配置顺序

1. **Supabase** 建项目 + 跑 SQL + 填 Netlify 前 2 个变量 + redeploy → 测登录  
2. **HF Space** 部署 + Secrets + `VITE_HF_SPACE_URL` + redeploy → 测许愿分析  
3. 填 **`VITE_ADMIN_EMAIL`** + 跑 admin-policy.sql → 测 `/admin`

每步改 Netlify 变量后都要 **Clear cache and redeploy**。
