import { z } from 'zod';
import type { WishAnalysis } from '../types/wish';

const wishAnalysisSchema = z.object({
  summary: z.string(),
  feasibility: z.enum(['high', 'medium', 'low']),
  path: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  path_reason: z.string(),
  risks: z.array(z.string()),
  suggested_mvp: z.string(),
});

export function parseWishAnalysis(data: unknown): WishAnalysis {
  return wishAnalysisSchema.parse(data);
}

export async function analyzeWish(
  wishId: string,
  description: string,
): Promise<WishAnalysis> {
  const spaceUrl = import.meta.env.VITE_HF_SPACE_URL?.replace(/\/$/, '');
  if (!spaceUrl) {
    throw new Error('HF Space 未配置，请在环境变量中设置 VITE_HF_SPACE_URL');
  }

  const res = await fetch(`${spaceUrl}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wish_id: wishId, description }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI 分析失败 (${res.status}): ${text}`);
  }

  const data: unknown = await res.json();
  return parseWishAnalysis(data);
}

export function mockAnalyze(description: string): WishAnalysis {
  const lower = description.toLowerCase();
  let path: WishAnalysis['path'] = 1;
  let feasibility: WishAnalysis['feasibility'] = 'high';

  if (lower.includes('智能体') || lower.includes('agent')) {
    path = 3;
  } else if (lower.includes('工作流') || lower.includes('n8n') || lower.includes('dify')) {
    path = 2;
  } else if (lower.includes('skill') || lower.includes('cursor') || lower.includes('龙虾')) {
    path = 4;
  } else if (lower.includes('区块链') || lower.includes('实时协作') || lower.includes('百万用户')) {
    path = 5;
    feasibility = 'low';
  }

  return {
    summary: `需求概述：${description.slice(0, 120)}${description.length > 120 ? '…' : ''}`,
    feasibility,
    path,
    path_reason: `基于关键词与复杂度判断，推荐路径 ${path}：${path === 5 ? '短期落地成本较高' : '适合快速原型验证'}`,
    risks: ['需确认数据来源与权限', '需明确 MVP 范围'],
    suggested_mvp: '先做核心单点功能，2–5 天可验证价值的最小版本',
  };
}
