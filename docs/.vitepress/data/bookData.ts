// 书籍数据类型
export interface BookItem {
  title: string;           // 书名（必填）
  author: string;          // 作者
  cover: string;           // 封面图片路径
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
    cover: "/nanxia-blog/book-covers/ming_chao.jpeg",
    tags: ["人文社科", "通俗历史"],
    note: "以幽默诙谐的笔法讲述明朝历史，让严肃的历史变得生动有趣。",
    read: 90,
    category: "social-science",
  },
  {
    title: "三体",
    author: "刘慈欣",
    cover: "/nanxia-blog/book-covers/san_ti.jpeg",
    tags: ["文学", "科幻经典", "雨果奖"],
    note: "中国科幻的里程碑",
    read: 20,
    category: "literature",
  },
  {
    title: "了不起的盖茨比",
    author: "弗朗西斯·斯科特·基·菲茨杰拉德",
    cover: "/nanxia-blog/book-covers/the_great_gatsby.jpeg",
    tags: ["美国文学", "经典", "爵士时代"],
    note: "20世纪美国文学的经典之作，探讨美国梦与人性",
    read: 100,
    category: "literature",
  },
  {
    title: "文学少女",
    author: "野村美月",
    cover: "/nanxia-blog/book-covers/wen_shao.jpeg",
    tags: ["文学", "轻小说", "校园", "治愈"],
    note: "名著解读×校园青春，温暖治愈的轻小说时光",
    read: 100,
    category: "literature",
  },
  {
    title: "呼啸山庄",
    author: "艾米莉·勃朗特",
    cover: "/nanxia-blog/book-covers/Wuthering-Heights.jpeg",
    tags: ["哥特文学", "经典", "爱情", "复仇"],
    note: "爱与恨的极致交织，荒原上的永恒悲剧", 
    read: 60,
    category: "literature",
  },
  {
    title: "钢铁是怎样炼成的",
    author: "尼古拉·奥斯特洛夫斯基",
    cover: "/nanxia-blog/book-covers/How_the_Steel_Was_Tempered.jpeg",
    tags: ["苏联文学", "成长小说", "励志", "经典"],
    note: "保尔·柯察金的成长史诗，诠释生命的意义与信仰的力量",
    read: 100,
    category: "literature",
  },
  {
    title: "猫武士",
    author: "艾琳·亨特",
    cover: "/nanxia-blog/book-covers/Warriors.jpeg",
    tags: ["动物小说", "奇幻", "冒险", "成长"],
    note: "通过猫族社会的权力斗争与生存法则，探讨忠诚、勇气与自然法则的永恒命题",
    read: 50,
    category: "literature",
  },
]