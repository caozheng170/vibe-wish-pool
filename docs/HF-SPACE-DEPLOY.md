# HF Space 一键部署

将 `hf-space/` 发布到 **[caozheng/vibe-wish-analyzer](https://huggingface.co/spaces/caozheng/vibe-wish-analyzer)**。

## 方式 A：hf CLI（推荐）

```powershell
cd d:\OPC

# 1. 登录（浏览器授权）
& "$env:LOCALAPPDATA\Programs\Python\Python311\Scripts\hf.exe" auth login
# 若 hf 已在 PATH：hf auth login

# 2. 部署
py scripts/deploy_hf_space.py
```

## 方式 B：Access Token

1. 打开 [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. 新建 **Write** 权限 token
3. PowerShell：

```powershell
cd d:\OPC
$env:HF_TOKEN = "hf_xxxxxxxx"
py scripts/deploy_hf_space.py
```

## 部署后：配置 Space Secrets

Space → **Settings → Repository secrets**

| Secret | 值 |
|--------|-----|
| `CLOUD_BASE_URL` | `https://apihub.agnes-ai.com/v1` |
| `CLOUD_API_KEY` | Agnes API Key（勿提交 Git） |
| `CLOUD_TEXT_MODEL` | `agnes-2.0-flash` |

等待 Space 构建完成后测试：

```powershell
curl -X POST "https://caozheng-vibe-wish-analyzer.hf.space/analyze" `
  -H "Content-Type: application/json" `
  -d '{\"wish_id\":\"test\",\"description\":\"我需要一个 Excel 自动汇总工具\"}'
```

## Netlify 环境变量

```
VITE_HF_SPACE_URL=https://caozheng-vibe-wish-analyzer.hf.space
```

改完后 Netlify **Clear cache and redeploy**。

## 你的 HF 主页

[https://huggingface.co/spaces/caozheng](https://huggingface.co/spaces/caozheng)
