# HF Space 部署指南（Agnes AI 分析后端）

**一键部署脚本：** [HF-SPACE-DEPLOY.md](./HF-SPACE-DEPLOY.md)

目标 Space：**https://huggingface.co/spaces/caozheng/vibe-wish-analyzer**

你的 HF 主页：[caozheng/spaces](https://huggingface.co/spaces/caozheng)

## 1. 创建 Space

1. 打开 [https://huggingface.co/new-space](https://huggingface.co/new-space)
2. **Space name:** 如 `vibe-wish-analyzer`
3. **SDK:** Docker
4. **Visibility:** Public（或 Private + 自行处理访问）

## 2. 上传代码

将本仓库 `hf-space/` 目录下文件推送到 Space 仓库：

```
hf-space/
├── app.py
├── Dockerfile
├── requirements.txt
└── README.md
```

或使用 Hugging Face 网页 **Files → Upload files**。

## 3. 配置 Secrets

**Space → Settings → Repository secrets**

| Secret | 值 |
|--------|-----|
| `CLOUD_BASE_URL` | `https://apihub.agnes-ai.com/v1` |
| `CLOUD_API_KEY` | 你的 Agnes API Key（**勿泄露**） |
| `CLOUD_TEXT_MODEL` | `agnes-2.0-flash` |

可选：

| Secret | 值 |
|--------|-----|
| `ALLOWED_ORIGINS` | `https://your-site.netlify.app,https://your-domain.com` |

## 4. 等待构建

Space 构建完成后，API 根地址为：

```
https://<username>-<space-name>.hf.space
```

测试：

```bash
curl -X POST "https://YOUR-SPACE.hf.space/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"wish_id\":\"test\",\"description\":\"我需要一个 Excel 自动汇总工具\"}"
```

应返回 JSON：`summary`, `feasibility`, `path`, ...

## 5. 填入 Netlify

```
VITE_HF_SPACE_URL=https://YOUR-SPACE.hf.space
```

**不要**加 `/analyze` 后缀（前端代码会自动拼接）。

修改后 **Clear cache and redeploy**。

## 6. CORS

`app.py` 已允许：

- `https://*.netlify.app`
- `ALLOWED_ORIGINS` 环境变量中的自定义域名

若浏览器报 CORS 错误，在 Space Secrets 添加你的完整 Netlify URL。

## 7. 冷启动

免费 Space 休眠后首次请求可能 **30–60 秒**。前端已显示「硅基介入中…」加载态。

## 8. 安全提醒

- API Key **仅**存在于 HF Space Secrets
- 不要将 Key 提交到 Git 或 Netlify 环境变量
- 若 Key 曾泄露，立即在 Agnes 控制台轮换
