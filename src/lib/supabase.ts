import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './constants';
import type { Wish } from '../types/wish';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
  }
  return client;
}

export async function fetchWishes(): Promise<Wish[]> {
  const supabase = getSupabase();
  if (!supabase) return getMockWishes();

  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Wish[];
}

export async function fetchWishById(id: string): Promise<Wish | null> {
  const supabase = getSupabase();
  if (!supabase) return getMockWishes().find((w) => w.id === id) ?? null;

  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Wish | null;
}

export async function createWish(input: {
  title: string;
  description: string;
  userId: string;
}): Promise<Wish> {
  const supabase = getSupabase();
  if (!supabase) {
    const mock: Wish = {
      id: crypto.randomUUID(),
      user_id: input.userId,
      title: input.title,
      description: input.description,
      status: 'red',
      ai_path: null,
      ai_analysis: null,
      owner_reply: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockWishes.unshift(mock);
    return mock;
  }

  const { data, error } = await supabase
    .from('wishes')
    .insert({
      title: input.title,
      description: input.description,
      user_id: input.userId,
      status: 'red',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Wish;
}

export async function updateWishAnalysis(
  id: string,
  analysis: Wish['ai_analysis'],
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    const wish = mockWishes.find((w) => w.id === id);
    if (wish) {
      wish.ai_analysis = analysis;
      wish.ai_path = analysis?.path ?? null;
      wish.updated_at = new Date().toISOString();
    }
    return;
  }

  const { error } = await supabase
    .from('wishes')
    .update({
      ai_analysis: analysis,
      ai_path: analysis?.path ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function updateWishAdmin(
  id: string,
  patch: Pick<Wish, 'status' | 'owner_reply'>,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    const wish = mockWishes.find((w) => w.id === id);
    if (wish) {
      Object.assign(wish, patch, { updated_at: new Date().toISOString() });
    }
    return;
  }

  const { error } = await supabase
    .from('wishes')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

const mockWishes: Wish[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user',
    title: '招标公告自动汇总助手',
    description: '每天从多个政府采购网站抓取公告，按关键词过滤并推送钉钉。',
    status: 'blue',
    ai_path: 2,
    ai_analysis: {
      summary: '多源抓取 + 关键词过滤 + 钉钉推送，适合低代码工作流实现。',
      feasibility: 'high',
      path: 2,
      path_reason: '定时抓取与通知链路清晰，n8n/Dify 可快速搭出 MVP。',
      risks: ['各站点反爬策略不同', '需稳定调度'],
      suggested_mvp: '先支持 1–2 个固定站点 + 关键词过滤',
    },
    owner_reply: '可以，先做 MVP，预计下周转蓝灯开发。',
    created_at: '2026-06-20T08:00:00.000Z',
    updated_at: '2026-06-22T10:00:00.000Z',
  },
  {
    id: 'demo-2',
    user_id: 'demo-user',
    title: '跨部门实时协同白板',
    description: '类似 Miro，支持 50 人同时编辑、版本回溯、权限体系。',
    status: 'yellow',
    ai_path: 5,
    ai_analysis: {
      summary: '高并发协同编辑 + 完整权限体系，工程量显著超出短期原型范围。',
      feasibility: 'low',
      path: 5,
      path_reason: '实时协同与权限属于平台级能力，短期难完整落地。',
      risks: ['CRDT/OT 复杂度高', '运维与安全要求高'],
      suggested_mvp: '降级为异步评论 + 静态画布分享',
    },
    owner_reply: null,
    created_at: '2026-06-18T08:00:00.000Z',
    updated_at: '2026-06-19T08:00:00.000Z',
  },
];

function getMockWishes(): Wish[] {
  return [...mockWishes];
}

export { getMockWishes };
