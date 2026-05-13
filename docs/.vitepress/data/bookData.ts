/**
 * 书籍分类：参照实体书电商/图书馆常见架位（虚构作品、人文社科、传记科普等），再为每本书打标。
 */
export const BOOK_CATEGORY_FILTERS = [
  { label: "全部", value: "all" },
  { label: "外国文学·小说", value: "world_fiction" },
  { label: "中国文学·小说", value: "china_fiction" },
  { label: "历史读物", value: "popular_history" },
  { label: "哲学·思想", value: "philosophy" },
  { label: "社会科学", value: "social_sciences" },
  { label: "经济·商业", value: "economics_biz" },
  { label: "文化·通识", value: "culture_humanities" },
  { label: "传记·回忆录", value: "biography_memoir" },
  { label: "科普·自然科学", value: "science_nature" },
  { label: "心理·成长励志", value: "psychology_growth" },
  { label: "艺术·传媒", value: "arts_media" },
  { label: "计算机·互联网", value: "computer_it" },
] as const;

export type BookCategoryFilterValue = (typeof BOOK_CATEGORY_FILTERS)[number]["value"];
export type BookCategoryTag = Exclude<BookCategoryFilterValue, "all">;

// 书籍数据类型（与 musicData 类似：id + category[] 用于筛选）
export interface BookItem {
  id: number;
  title: string;
  author: string;
  cover: string;
  thumb?: string;
  category: BookCategoryTag[];
  note: string;
  read: number;
}

export const bookList: BookItem[] = [
  {
    id: 1,
    title: "明朝那些事儿",
    author: "当年明月",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/ming_chao.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/ming_chao.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["popular_history", "culture_humanities"],
    note: "以幽默诙谐的笔法讲述明朝历史，让严肃的历史变得生动有趣。",
    read: 90,
  },
  {
    id: 2,
    title: "金钱不能买什么",
    author: "迈克尔·桑德尔",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/what_money_cant_buy.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/what_money_cant_buy.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["philosophy", "economics_biz", "social_sciences"],
    note: "探讨市场逻辑如何渗透到生活的各个领域，反思金钱与道德的边界",
    read: 80,
  },
  {
    id: 3,
    title: "中国文化课",
    author: "余秋雨",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/chinese_culture_course.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/chinese_culture_course.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["culture_humanities", "popular_history", "arts_media"],
    note: "以通俗的方式全面讲解中国文化史，从甲骨文到明清小说，展现中华文明的脉络与精髓",
    read: 70,
  },
  {
    id: 4,
    title: "了不起的盖茨比",
    author: "弗朗西斯·斯科特·基·菲茨杰拉德",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/the_great_gatsby.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/the_great_gatsby.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["world_fiction"],
    note: "20世纪美国文学的经典之作，探讨美国梦与人性",
    read: 100,
  },
  {
    id: 5,
    title: "呼啸山庄",
    author: "艾米莉·勃朗特",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/Wuthering-Heights.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/Wuthering-Heights.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["world_fiction", "psychology_growth"],
    note: "爱与恨的极致交织，荒原上的永恒悲剧",
    read: 60,
  },
  {
    id: 6,
    title: "钢铁是怎样炼成的",
    author: "尼古拉·奥斯特洛夫斯基",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/How_the_Steel_Was_Tempered.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/books/How_the_Steel_Was_Tempered.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["world_fiction", "psychology_growth", "biography_memoir"],
    note: "保尔·柯察金的成长史诗，诠释生命的意义与信仰的力量",
    read: 100,
  },
];
