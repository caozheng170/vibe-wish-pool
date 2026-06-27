import type { AiPath } from './wish';

export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  url: string;
  description: string;
  features: string[];
  initial_prompt: string;
  tech_tags: string[];
  ai_path: AiPath;
  platform_note?: string;
  screenshot_url: string;
  featured: boolean;
  sort_order: number;
}
