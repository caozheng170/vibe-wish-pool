from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
import json
import os
import re

app = FastAPI(title="Vibe Wish Analyzer")

_extra_origins = [
    o.strip()
    for o in os.environ.get("ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        *_extra_origins,
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """你是「Vibe Coding 许愿池」的需求分析 AI（Agnes）。
用户会描述他们想要的软件工具或工作流痛点。请分析并 ONLY 输出合法 JSON，不要 markdown。

JSON schema:
{
  "summary": "一两句话需求摘要",
  "feasibility": "high|medium|low",
  "path": 1-5 整数,
  "path_reason": "为什么选择该路径",
  "risks": ["风险1", "风险2"],
  "suggested_mvp": "最小可行版本建议"
}

path 含义:
1 = VIBE CODING（AI 辅助快速原型）
2 = 低代码工作流（n8n/Dify/Coze 等）
3 = 高代码智能体平台
4 = 龙虾 + Skill（Cursor Agent + Skill）
5 = 短期内难实现

判断务实，MVP 导向。"""


class AnalyzeRequest(BaseModel):
    wish_id: str
    description: str = Field(min_length=10)


class WishAnalysis(BaseModel):
    summary: str
    feasibility: str
    path: int
    path_reason: str
    risks: list[str]
    suggested_mvp: str


@app.get("/")
def health():
    return {"status": "ok", "service": "vibe-wish-analyzer"}


@app.post("/analyze", response_model=WishAnalysis)
async def analyze(req: AnalyzeRequest):
    base_url = os.environ.get("CLOUD_BASE_URL", "https://apihub.agnes-ai.com/v1").rstrip("/")
    api_key = os.environ.get("CLOUD_API_KEY")
    model = os.environ.get("CLOUD_TEXT_MODEL", "agnes-2.0-flash")

    if not api_key:
        raise HTTPException(status_code=500, detail="CLOUD_API_KEY not configured in Space Secrets")

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.description},
        ],
        "temperature": 0.3,
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            f"{base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Agnes API error: {resp.text}")

    data = resp.json()
    content = data["choices"][0]["message"]["content"]

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", content)
        if not match:
            raise HTTPException(status_code=502, detail="Failed to parse AI JSON")
        parsed = json.loads(match.group())

    return WishAnalysis(**parsed)
