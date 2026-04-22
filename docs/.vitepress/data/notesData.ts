// 随笔笔记数据类型
export interface NoteItem {
  title: string; // 文章标题
  date: string; // 发布日期
  category: string; // 分类
  excerpt: string; // 摘要
  cover?: string; // 封面图片
  tags: string[]; // 标签
  link: string; // 文章链接
}

// 导出数据列表 - 示例数据
export const noteList: NoteItem[] = [
  {
    title: "追逐",
    date: "2025-08-08",
    category: "生活",
    excerpt:
      "我们穷极一生在追逐什么？从童年的棒棒糖到中年的房贷车贷，从父母的唠叨到病床上的回首。或许人生本没有意义，重要的是此刻的感受，让过程快乐。",
    tags: ["人生感悟", "成长", "意义", "当下"],
    link: "/nanxia-blog/spiritual-food/note/zhuizhu",
  },
];
