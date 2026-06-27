# Netlify 部署指南 — Vibe Coding 许愿池

仓库：**https://github.com/caozheng170/vibe-wish-pool**

Netlify 团队：**[pgraduate](https://app.netlify.com/teams/pgraduate/projects)**

---

## 方式 C：Netlify CLI（本项目已内置）

项目已安装 `netlify-cli`（devDependency），可用 npm scripts：

| 命令 | 作用 |
|------|------|
| `npm run netlify:login` | 浏览器登录 Netlify 账号 |
| `npm run netlify:init` | 创建/关联站点（连 GitHub 仓库） |
| `npm run netlify:deploy:draft` | 构建 + 草稿部署（预览 URL） |
| `npm run netlify:deploy` | 构建 + **生产部署** |
| `npm run netlify:open` | 打开 Netlify 控制台 |
| `npm run netlify:env` | 查看环境变量 |

### CLI 首次部署流程

```powershell
cd d:\OPC

# 1. 登录（会打开浏览器）
npm run netlify:login

# 2. 初始化站点 — 选「Create & configure a new site」
#    Team 选择：pgraduate
#    建议勾选 Link this site to Git → 选 caozheng170/vibe-wish-pool
npm run netlify:init

# 或一步创建站点（指定团队 pgraduate）：
# npx netlify sites:create --account-slug pgraduate --name vibe-wish-pool
# npx netlify link

# 3. 设置环境变量（在 Netlify 网页或 CLI）
npx netlify env:set VITE_SUPABASE_URL "https://xxx.supabase.co"
npx netlify env:set VITE_SUPABASE_ANON_KEY "eyJ..."
npx netlify env:set VITE_HF_SPACE_URL "https://your-space.hf.space"
npx netlify env:set VITE_ADMIN_EMAIL "you@example.com"

# 4. 生产部署（会本地 build 并上传 dist）
npm run netlify:deploy
```

`netlify init` 完成后会在项目根目录生成 `.netlify/`（已 gitignore），记录 site id。

### 仅 CLI 手动部署（不连 Git 自动构建）

```powershell
npm run netlify:login
npx netlify sites:create --name vibe-wish-pool-caozheng
npx netlify link
npm run netlify:deploy
```

### 环境变量 via CLI

```powershell
# 写入并触发重新部署
npx netlify env:set VITE_ADMIN_EMAIL "you@example.com" --context production
npx netlify deploy --prod --build
```

---

## 方式 A：Git 连接（Dashboard，推荐持续集成）

### 1. 代码已在 GitHub

**https://github.com/caozheng170/vibe-wish-pool**

### 2. 在 Netlify 创建站点

团队 Dashboard：**https://app.netlify.com/teams/pgraduate/projects**

1. 打开上方链接 → **Add new site** → **Import an existing project**
2. 选择 **GitHub** → 选中仓库 `caozheng170/vibe-wish-pool`
4. Netlify 会自动读取根目录 `netlify.toml`，无需手填 Build settings：
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 20（来自 `netlify.toml` / `.nvmrc`）

5. 点击 **Deploy site**

> 首次部署可能只有演示模式（mock 数据），配置环境变量后需 **Trigger deploy → Clear cache and deploy site** 重新构建。

---

## 方式 B：拖拽部署（无需 Git）

```bash
cd d:\OPC
npm install
npm run build
```

将生成的 **`dist`** 文件夹拖到 Netlify **Deploys → Drag and drop** 区域。

⚠️ 拖拽方式**无法在 Netlify 注入 `VITE_*` 环境变量**，需在本地先建 `.env.production` 再 build：

```bash
# .env.production（不要提交到 Git）
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_HF_SPACE_URL=https://your-space.hf.space
VITE_ADMIN_EMAIL=you@example.com

npm run build
# 再拖拽 dist
```

---

## 环境变量（必配项）

路径：**Site configuration → Environment variables → Add a variable**

| 变量名 | 作用 | 示例 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | `https://abcdef.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase 公开 anon key | `eyJhbG...` |
| `VITE_HF_SPACE_URL` | HF Space 分析 API 根地址 | `https://user-vibe-analyzer.hf.space` |
| `VITE_ADMIN_EMAIL` | 管理后台允许的邮箱 | `you@example.com` |

**作用域建议：** Production + Deploy previews 都勾选（Preview 也要测许愿流程时）。

**切勿配置：** `CLOUD_API_KEY` — Agnes Key 只放在 HF Space Secrets。

### 修改环境变量后

`VITE_*` 在 **构建时** 打入 JS，改变量后必须：

**Deploys → Trigger deploy → Clear cache and deploy site**

---

## Supabase 回调 URL（登录必配）

Supabase Dashboard → **Authentication → URL Configuration**

| 项 | 值 |
|----|-----|
| Site URL | `https://你的站点.netlify.app` |
| Redirect URLs | `https://你的站点.netlify.app/**` |

本地开发可加：`http://localhost:5173/**`

---

## HF Space CORS

确保 `hf-space/app.py` 中 CORS 允许你的 Netlify 域名。当前已配置：

- `allow_origin_regex = r"https://.*\.netlify\.app"`

自定义域名部署后，在 Space 的 CORS 里追加你的域名。

---

## 自定义域名（可选）

**Site configuration → Domain management → Add a domain**

按提示在 DNS 添加 CNAME 或 Netlify DNS。绑定后记得同步更新 Supabase Redirect URLs。

---

## 部署检查清单

- [ ] `npm run build` 本地通过
- [ ] Netlify 4 个 `VITE_*` 环境变量已设置
- [ ] 重新 Deploy（Clear cache）
- [ ] 首页 `/`、作品集 `/portfolio` 正常
- [ ] `/wish/new` 提交后 AI 分析（或 mock）正常
- [ ] Supabase 登录 `/login` 正常
- [ ] `/admin` 仅 `VITE_ADMIN_EMAIL` 可访问

---

## 常见问题

### 刷新子路由 404

已配置 `netlify.toml` SPA fallback。若仍 404，确认站点根目录有 `netlify.toml` 且重新部署。

### 环境变量不生效

1. 变量名必须以 `VITE_` 开头  
2. 改完后必须 **Clear cache and redeploy**  
3. 拖拽部署需在本地 `.env.production` 构建

### AI 分析 CORS 报错

检查 `VITE_HF_SPACE_URL` 是否正确（无末尾多余路径，如 `/analyze` 由前端代码拼接）。

### 管理页无权限

`VITE_ADMIN_EMAIL` 必须与 Supabase 登录邮箱**完全一致**（大小写不敏感）。

---

## 项目内相关文件

| 文件 | 说明 |
|------|------|
| `netlify.toml` | 构建、SPA 路由、缓存、安全头 |
| `.nvmrc` | Node 20 |
| `.env.example` | 环境变量模板 |
| `.env.production` | 本地生产构建用（自行创建，已 gitignore） |
