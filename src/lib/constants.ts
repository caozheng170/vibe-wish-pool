import type { AiPath, WishStatus } from '../types/wish';

export const WISH_STATUS_LABELS: Record<WishStatus, string> = {
  red: '未开始',
  yellow: '暂不可行',
  blue: '开发中',
  green: '原型完成',
};

export const AI_PATH_LABELS: Record<AiPath, string> = {
  1: 'VIBE CODING',
  2: '低代码工作流',
  3: '高代码智能体',
  4: '龙虾 + Skill',
  5: '短期内难实现',
};

export const FEASIBILITY_LABELS = {
  high: '高可行性',
  medium: '中等可行性',
  low: '低可行性',
} as const;

export const SITE_NAME = 'Vibe Coding 许愿池';

export const isSupabaseConfigured = (): boolean =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isHfSpaceConfigured = (): boolean =>
  Boolean(import.meta.env.VITE_HF_SPACE_URL);

export const isAdminEmail = (email: string | undefined): boolean => {
  const admin = import.meta.env.VITE_ADMIN_EMAIL;
  return Boolean(admin && email && email.toLowerCase() === admin.toLowerCase());
};
