import { portfolioProjects } from './portfolio';
import type { PortfolioProject } from '../types/portfolio';
import type { PromptGuide } from '../types/promptGuide';

/** 已标注分段的首批提示词，用于许愿页「展开提示」参考 */
export const promptGuides: PromptGuide[] = [
  {
    slug: 'supplier-screening',
    sections: [
      {
        kind: 'context',
        text: `手头有2个excel文件，都是多sheet的：文件1是供应商信息表，几个sheet的表头大致相同，来自表1里的筛选条件包含4项：字段名分别为「供应商主营」、「注册资本」、「供应商资质」、「联系地址」。`,
      },
      {
        kind: 'requirement',
        text: `接下来是一个层层筛选的逻辑过程：
- 如果用户在「输入产品名称」空格里填入「劳务」，则首先是对文件1的全工作簿范围内「供应商主营」字段里做模糊搜索；
- 在「输入联系地址」空格里填入「湖州」，则表示在之前基础上，对「联系地址」字段里包含「湖州」的做全工作范围内的搜索；
- 在「输入资质条件」空格里填入「ISO」，则表示在之前筛选基础上，「供应商资质」字段里包含「ISO」的要过滤出来；
- 在「输入最低注册资本」空格里填入「200」，则表示在此前过滤基础上找到「注册资本」至少是200万元的单位。

经过层层筛选后，得到N家符合以上条件的，我们将把其「供应商名称」里的内容，依次作为文件2里的搜索关键词去通配搜索。如有匹配到的，表示他们至少是参加过投标/中标的，即名称出现在「投标单位」字段或者是「中标单位」字段里。`,
      },
      {
        kind: 'deliverable',
        text: `查询结果把匹配到的行里各字段信息都带出来，比如：招标项目名称、投标单位/中标单位、中标单价、中标总价等，并且能直观显示他参与投标了几次、中标过几次。

我需要做这么一个平台：只要我上传2个表格文件，并填入至少1个筛选条件，就能快速帮助我筛选出来。全程不需要用到模型，只是代替原先在excel里的多次筛选动作及2个表格文件里来回辅助的反复和累赘过程。`,
      },
    ],
  },
  {
    slug: 'contract-generator',
    sections: [
      {
        kind: 'context',
        text: `法务部给了设备采购合同模板，我想做一个应用：业务员填好必填字段后，系统自动把内容填入 Word 模板，生成最终合同文档。`,
      },
      {
        kind: 'requirement',
        text: `需要采集的数据包括：

一、合同与商事主体基本信息
合同编号、设备名称（用于合同标题）、甲方公司全称、乙方公司全称、签订地点、签订日期。

二、标的物、供货范围与工期
设备部件明细表（部件名称、规格型号、材质、品牌、数量、含税单价、产地/进口品牌等），支持增删行；合同总价（大小写）、备品备件清单、生产工期（预付款后X天）、安装调试工期。

三、付款与质保
付款比例与期限（如签约后X日内付X%）、各阶段付款节点、设备质保年限。

四、交货与物流
交货地点；技术资料邮寄信息（收件人、地址、联系方式）。

五、特别约定与联络信息
特别条款；甲乙双方联系人、地址、电话、邮箱。`,
      },
      {
        kind: 'deliverable',
        text: `我手头有法务给的 PDF 合同模板，但最终希望应用能输出 Word（.docx）文件，把用户填写的数据写入标准合同正文。`,
      },
    ],
  },
];

export function getGuideableProjects(): PortfolioProject[] {
  const slugs = new Set(promptGuides.map((g) => g.slug));
  return portfolioProjects.filter((p) => slugs.has(p.slug));
}

export function getPromptGuide(slug: string): PromptGuide | undefined {
  return promptGuides.find((g) => g.slug === slug);
}

export function pickRandomGuideSlug(): string {
  const pool = promptGuides.map((g) => g.slug);
  return pool[Math.floor(Math.random() * pool.length)]!;
}
