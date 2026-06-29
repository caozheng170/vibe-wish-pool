export type PromptGuideKind = 'context' | 'requirement' | 'deliverable';

export interface PromptGuideSection {
  kind: PromptGuideKind;
  text: string;
}

export interface PromptGuide {
  slug: string;
  sections: PromptGuideSection[];
}

export const PROMPT_GUIDE_KIND_META: Record<
  PromptGuideKind,
  { label: string; hint: string; colorClass: string; borderClass: string; bgClass: string }
> = {
  context: {
    label: '背景痛点',
    hint: '现状、重复劳动、为什么需要这个工具',
    colorClass: 'text-status-yellow',
    borderClass: 'border-status-yellow/40',
    bgClass: 'bg-status-yellow/10',
  },
  requirement: {
    label: '功能需求',
    hint: '具体规则、字段、流程、交互细节',
    colorClass: 'text-neon-cyan',
    borderClass: 'border-neon-cyan/40',
    bgClass: 'bg-neon-cyan/10',
  },
  deliverable: {
    label: '交付产出',
    hint: '最终页面、文件格式、交付形态',
    colorClass: 'text-status-green',
    borderClass: 'border-status-green/40',
    bgClass: 'bg-status-green/10',
  },
};
