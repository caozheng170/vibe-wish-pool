---
title: Vibe Wish Analyzer
emoji: 🌊
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Vibe Wish Analyzer

「Vibe Coding 许愿池」AI 需求分析后端。接收许愿描述，调用 **Agnes API**，返回结构化 JSON（可行性 + 五类实现路径）。

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 健康检查 |
| POST | `/analyze` | 分析许愿 `{ "wish_id": "...", "description": "..." }` |

## Space Secrets（必配）

| Secret | 值 |
|--------|-----|
| `CLOUD_BASE_URL` | `https://apihub.agnes-ai.com/v1` |
| `CLOUD_API_KEY` | 你的 Agnes API Key |
| `CLOUD_TEXT_MODEL` | `agnes-2.0-flash` |

可选：`ALLOWED_ORIGINS` = `https://your-site.netlify.app`

## Netlify 环境变量

```
VITE_HF_SPACE_URL=https://caozheng-vibe-wish-analyzer.hf.space
```

（以实际 Space URL 为准）
