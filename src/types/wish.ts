export type WishStatus = 'red' | 'yellow' | 'blue' | 'green';

export type AiPath = 1 | 2 | 3 | 4 | 5;

export interface Wish {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: WishStatus;
  ai_path: AiPath | null;
  ai_analysis: WishAnalysis | null;
  owner_reply: string | null;
  created_at: string;
  updated_at: string;
}

export interface WishAnalysis {
  summary: string;
  feasibility: 'high' | 'medium' | 'low';
  path: AiPath;
  path_reason: string;
  risks: string[];
  suggested_mvp: string;
}
