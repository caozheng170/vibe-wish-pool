# 全栈部署清单

按顺序完成以下步骤，即可上线 **Vibe Coding 许愿池**。

## 阶段 1：代码入库

```powershell
cd d:\OPC
git init
git add .
git commit -m "feat: vibe coding wish pool MVP with Netlify config"
```

推送到 GitHub（已创建）：

```powershell
git remote add origin https://github.com/caozheng170/vibe-wish-pool.git
git branch -M main
git push -u origin main
```

仓库地址：**https://github.com/caozheng170/vibe-wish-pool**

## 阶段 2：HF Space（AI 后端）

详见 **[HF-SPACE.md](./HF-SPACE.md)**

- [ ] 创建 Docker Space，上传 `hf-space/`
- [ ] Secrets：`CLOUD_BASE_URL`、`CLOUD_API_KEY`、`CLOUD_TEXT_MODEL`
- [ ] curl 测试 `/analyze` 返回 JSON
- [ ] 记下 Space URL

## 阶段 3：Supabase（用户 + 数据）

详见 **[SUPABASE.md](./SUPABASE.md)**

- [ ] 新建项目，执行 `schema.sql`
- [ ] 执行 `admin-policy.sql`（替换管理员邮箱）
- [ ] 配置 Auth URL / Redirect URLs
- [ ] 复制 URL + anon key

## 阶段 4：Netlify（前端）

团队：**[pgraduate](https://app.netlify.com/teams/pgraduate/projects)** · 详见 **[NETLIFY.md](./NETLIFY.md)**

- [ ] Import GitHub 仓库
- [ ] 环境变量：

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_HF_SPACE_URL=
VITE_ADMIN_EMAIL=
```

- [ ] **Clear cache and deploy**
- [ ] 访问生产 URL 走一遍完整流程

## 阶段 5：验收

| 页面 | 检查 |
|------|------|
| `/` | 科幻首页 + 3 个精选项目 |
| `/portfolio` | 4 个项目 + 提示词折叠 |
| `/wish/new` | 提交 → AI 分析 → 详情页 |
| `/wish` | 公开列表 + 状态筛选 |
| `/login` | 注册/登录 |
| `/admin` | 管理员改灯 + 回复 |

## 文档索引

| 文档 | 内容 |
|------|------|
| [NETLIFY.md](./NETLIFY.md) | Netlify 构建、环境变量、拖拽部署 |
| [SUPABASE.md](./SUPABASE.md) | 数据库、RLS、Auth URL |
| [HF-SPACE.md](./HF-SPACE.md) | Agnes API、Space Secrets、CORS |

## 演示模式（可跳过 2、3 步）

未配置 Supabase / HF Space 时，站点仍可通过 Netlify 部署，使用 mock 数据运行。
