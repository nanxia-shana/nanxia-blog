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
    title: "春日清晨",
    date: "2024-04-01",
    category: "生活",
    excerpt: "阳光透过梧桐叶洒落在书桌，空气中弥漫着樱花的香气，这样的清晨适合读一本闲书，喝一杯热茶，什么也不做，只是发呆。",
    tags: ["春日", "日常", "闲适"],
    link: "/spiritual-food/notes/spring-morning/",
  },
  {
    title: "关于阅读的碎念",
    date: "2024-03-28",
    category: "文章",
    excerpt: "读书这件事，本就是私人的享受。不必追求速度，不必强求记住，那些读过的文字，早已融入你的骨血。",
    tags: ["阅读", "感悟", "碎念"],
    link: "/spiritual-food/notes/on-reading/",
  },
  {
    title: "城市漫步",
    date: "2024-03-15",
    category: "随笔",
    excerpt: "漫无目的地走在熟悉的街道，发现街角新开的咖啡店，橱窗里摆着刚烤好的可颂，香气扑鼻而来，这就是城市给我的惊喜。",
    tags: ["漫步", "城市", "生活"],
    link: "/spiritual-food/notes/city-walk/",
  },
  {
    title: "雨夜读书",
    date: "2024-03-10",
    category: "生活",
    excerpt: "窗外雨声淅沥，屋内灯火可亲，手捧一本旧书，这样的夜晚，就是人间好时节。",
    tags: ["雨", "夜晚", "读书"],
    link: "/spiritual-food/notes/reading-on-rainy-night/",
  },
  {
    title: "码农的日常",
    date: "2024-03-05",
    category: "随笔",
    excerpt: "一行代码调试半天，终于运行通过的时候，那种成就感，外人大概不会懂。",
    tags: ["编程", "日常", "工作"],
    link: "/spiritual-food/notes/coder-daily/",
  },
  {
    title: "观影记：星际穿越",
    date: "2024-02-28",
    category: "文章",
    excerpt: "爱穿越时空，在五维空间里，父爱就是那连接过去未来的坐标。",
    tags: ["电影", "影评", "诺兰"],
    link: "/spiritual-food/notes/interstellar-review/",
  },
  {
    title: "茶与咖啡",
    date: "2024-02-20",
    category: "生活",
    excerpt: "上午喝茶，下午喝咖啡，这是我的生活仪式感。不必强求，喜欢就好。",
    tags: ["茶", "咖啡", "仪式感"],
    link: "/spiritual-food/notes/tea-coffee/",
  },
  {
    title: "写代码的乐趣",
    date: "2024-02-15",
    category: "文章",
    excerpt: "当你把一个复杂的问题拆解，一步步写出优雅的代码，最后运行出正确结果的时候，那种乐趣，难以言表。",
    tags: ["编程", "乐趣", "思考"],
    link: "/spiritual-food/notes/joy-of-coding/",
  },
  {
    title: "冬去春来",
    date: "2024-02-04",
    category: "随笔",
    excerpt: "寒风渐渐退去，枝头冒出新芽，四季轮转，生生不息，我们又要出发了。",
    tags: ["季节", "自然", "感悟"],
    link: "/spiritual-food/notes/winter-to-spring/",
  },
  {
    title: "街角书店",
    date: "2024-01-28",
    category: "生活",
    excerpt: "在网购发达的今天，依然喜欢逛实体书店，指尖划过书页的感觉，无可替代。",
    tags: ["书店", "阅读", "城市"],
    link: "/spiritual-food/notes/cozy-bookstore/",
  },
];
