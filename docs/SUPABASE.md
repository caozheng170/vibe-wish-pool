# Supabase 配置指南

## 1. 创建项目

1. 打开 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → 选区域、设数据库密码
3. 等待项目就绪

## 2. 获取 API 凭证

**Project Settings → API**

| 项 | 用途 | 填到哪里 |
|----|------|----------|
| Project URL | 项目地址 | Netlify `VITE_SUPABASE_URL` |
| anon public key | 前端公开 key | Netlify `VITE_SUPABASE_ANON_KEY` |

⚠️ **service_role key 不要放进 Netlify / 前端**，仅本地或 Edge Function 使用。

---

## 3. 执行数据库脚本

**SQL Editor → New query**

1. 粘贴并运行 `supabase/schema.sql` 全文
2. 打开 `supabase/admin-policy.sql`，将 `REPLACE_WITH_ADMIN_EMAIL` 换成你的邮箱，再运行

示例（邮箱为 `you@example.com`）：

```sql
create policy "wishes_update_admin"
  on public.wishes for update
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('you@example.com')
  )
  with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('you@example.com')
  );
```

---

## 4. Authentication 设置

**Authentication → Providers → Email**

- 开启 **Email** provider
- 若仅自己用：可关闭 **Confirm email**（方便测试）
- 若公开注册：建议开启 Confirm email

### URL Configuration

**Authentication → URL Configuration**

| 字段 | 值（示例） |
|------|------------|
| **Site URL** | `https://your-site.netlify.app` |
| **Redirect URLs** | `https://your-site.netlify.app/**` |
| | `http://localhost:5173/**`（本地开发） |

自定义域名示例：

```
https://wish.yourdomain.com
https://wish.yourdomain.com/**
```

---

## 5. Netlify 环境变量

与 Supabase 对应：

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_EMAIL=you@example.com
```

`VITE_ADMIN_EMAIL` 必须与 `admin-policy.sql` 中的邮箱**完全一致**。

修改后：**Netlify → Clear cache and redeploy**

---

## 6. 验证清单

| 步骤 | 预期 |
|------|------|
| 访问 `/login` 注册/登录 | 成功跳转 |
| `/wish/new` 提交许愿 | `wishes` 表新增一行 |
| AI 分析后 | `ai_analysis`、`ai_path` 有值 |
| `/admin` 用管理员邮箱登录 | 可改状态灯和回复 |
| 其他邮箱访问 `/admin` | 显示无权限 |

---

## 7. 表结构速查

```
wishes
├── id (uuid)
├── user_id → auth.users
├── title, description
├── status: red | yellow | blue | green
├── ai_path: 1–5
├── ai_analysis (jsonb)
├── owner_reply
└── created_at, updated_at
```

---

## 8. 常见问题

### 登录后提交许愿报 RLS 错误

- 确认已登录（`auth.uid()` 有值）
- 确认 `user_id` 插入的是当前用户 id

### 管理页保存失败

- 确认已执行 `admin-policy.sql` 且邮箱正确
- 确认登录邮箱与 `VITE_ADMIN_EMAIL` 一致

### 本地能登录，Netlify 不能

- 检查 Supabase Redirect URLs 是否包含 Netlify 域名
- Site URL 是否设为生产域名
