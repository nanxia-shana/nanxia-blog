// 书籍数据类型
export interface BookItem {
  title: string;           // 书名（必填）
  author: string;          // 作者
  cover: string;           // 封面图片路径
  thumb?: string;          // 低质量缩略图（可选）
  tags: string[];          // 标签（数组）
  note: string;            // 笔记/简介
  read: number;            // 阅读进度（百分比）
  category: string;        // 分类标识
}

// 导出数据列表
export const bookList: BookItem[] = [
  {
    title: "明朝那些事儿",
    author: "当年明月",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/ming_chao.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/ming_chao.webp?imageView2/2/w/80/format/webp/q/50",
    tags: ["人文社科", "通俗历史"],
    note: "以幽默诙谐的笔法讲述明朝历史，让严肃的历史变得生动有趣。",
    read: 90,
    category: "social-science",
  },
  {
    title: "金钱不能买什么",
    author: "迈克尔·桑德尔",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/what_money_cant_buy.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/what_money_cant_buy.webp?imageView2/2/w/80/format/webp/q/50",
    tags: ["人文社科", "哲学", "经济学", "伦理"],
    note: "探讨市场逻辑如何渗透到生活的各个领域，反思金钱与道德的边界",
    read: 80,
    category: "social-science",
  },
  {
    title: "中国文化课",
    author: "余秋雨",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/chinese_culture_course.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/chinese_culture_course.webp?imageView2/2/w/80/format/webp/q/50",
    tags: ["人文社科", "中国文化", "历史", "美学"],
    note: "以通俗的方式全面讲解中国文化史，从甲骨文到明清小说，展现中华文明的脉络与精髓",
    read: 70,
    category: "social-science",
  },
  {
    title: "了不起的盖茨比",
    author: "弗朗西斯·斯科特·基·菲茨杰拉德",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/the_great_gatsby.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/the_great_gatsby.webp?imageView2/2/w/80/format/webp/q/50",
    tags: ["美国文学", "经典", "爵士时代"],
    note: "20世纪美国文学的经典之作，探讨美国梦与人性",
    read: 100,
    category: "literature",
  },
  {
    title: "呼啸山庄",
    author: "艾米莉·勃朗特",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/Wuthering-Heights.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/Wuthering-Heights.webp?imageView2/2/w/80/format/webp/q/50",
    tags: ["哥特文学", "经典", "爱情", "复仇"],
    note: "爱与恨的极致交织，荒原上的永恒悲剧",
    read: 60,
    category: "literature",
  },
  {
    title: "钢铁是怎样炼成的",
    author: "尼古拉·奥斯特洛夫斯基",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/How_the_Steel_Was_Tempered.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/How_the_Steel_Was_Tempered.webp?imageView2/2/w/80/format/webp/q/50",
    tags: ["苏联文学", "成长小说", "励志", "经典"],
    note: "保尔·柯察金的成长史诗，诠释生命的意义与信仰的力量",
    read: 100,
    category: "literature",
  },
];
