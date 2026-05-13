/**
 * 网络小说分类：参照主流网文站「频道」维度（玄幻/仙侠/都市等），书目再归入多标签。
 */
export const NOVEL_CATEGORY_FILTERS = [
  { label: "全部", value: "all" },
  { label: "玄幻", value: "xuanhuan" },
  { label: "仙侠", value: "xianxia" },
  { label: "武侠", value: "wuxia" },
  { label: "奇幻", value: "qihuan" },
  { label: "西幻", value: "western_fantasy" },
  { label: "都市", value: "dushi" },
  { label: "科幻", value: "kehuan" },
  { label: "历史", value: "lishi" },
  { label: "军事", value: "junshi" },
  { label: "悬疑灵异", value: "xuanyi" },
  { label: "游戏", value: "youxi" },
  { label: "电竞竞技", value: "esports" },
  { label: "言情", value: "yanqing" },
  { label: "轻小说", value: "qing_xs" },
  { label: "同人", value: "tongren" },
  { label: "无限流", value: "wuxian" },
] as const;

export type NovelCategoryFilterValue = (typeof NOVEL_CATEGORY_FILTERS)[number]["value"];
export type NovelCategoryTag = Exclude<NovelCategoryFilterValue, "all">;

export interface NovelItem {
  id: number;
  title: string;
  author: string;
  cover: string;
  thumb?: string;
  category: NovelCategoryTag[];
  tags: string[];
  status: string;
  note: string;
}

export const novelList: NovelItem[] = [
  {
    id: 1,
    title: "诡秘之主",
    author: "爱潜水的乌贼",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/guimei.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/guimei.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xuanhuan", "xuanyi", "western_fantasy", "qihuan"],
    tags: ["玄幻", "奇幻", "悬疑", "克苏鲁"],
    status: "完结",
    note: "蒸汽朋克+克苏鲁+塔罗牌，开创了一个新流派，每一个序列都美得像一首诗",
  },
  {
    id: 2,
    title: "三体",
    author: "刘慈欣",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/san_ti.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/san_ti.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["kehuan"],
    tags: ["科幻", "宇宙", "人性"],
    status: "完结",
    note: "中国科幻的天花板，宇宙就是一座黑暗森林，每个文明都是带枪的猎人",
  },
  {
    id: 3,
    title: "凡人修仙传",
    author: "忘语",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/fanren.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/fanren.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xianxia"],
    tags: ["仙侠", "草根", "修真"],
    status: "完结",
    note: "一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子，开启了修仙之路",
  },
  {
    id: 4,
    title: "盗墓笔记",
    author: "南派三叔",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/daomu.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/daomu.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xuanyi", "dushi"],
    tags: ["悬疑", "盗墓", "冒险"],
    status: "完结",
    note: "比鬼神更可怕的，是人心",
  },
  {
    id: 5,
    title: "全职高手",
    author: "蝴蝶蓝",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/quansheng.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/quansheng.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["youxi", "esports", "dushi"],
    tags: ["游戏", "竞技", "群像"],
    status: "完结",
    note: "如果喜欢，就把这一切当作是荣耀，而不是炫耀",
  },
  {
    id: 6,
    title: "文学少女",
    author: "野村美月",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/wen_shao.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/wen_shao.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["qing_xs", "yanqing", "dushi"],
    tags: ["轻小说", "校园", "治愈", "名著解读"],
    status: "完结",
    note: "名著解读×校园青春，温暖治愈的轻小说时光",
  },
  {
    id: 7,
    title: "猫武士",
    author: "艾琳·亨特",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/Warriors.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/Warriors.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["qihuan", "western_fantasy"],
    tags: ["奇幻", "动物小说", "冒险", "成长"],
    status: "完结",
    note: "通过猫族社会的权力斗争与生存法则，探讨忠诚、勇气与自然法则的永恒命题",
  },
  {
    id: 8,
    title: "盘龙",
    author: "我吃西红柿",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/pan_long.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/pan_long.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xuanhuan", "qihuan"],
    tags: ["玄幻", "成长"],
    status: "完结",
    note: "龙血战士的成长史诗，从平凡少年到鸿蒙掌控者",
  },
  {
    id: 9,
    title: "吞噬星空",
    author: "我吃西红柿",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/tun_shi.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/tun_shi.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["kehuan", "xuanhuan"],
    tags: ["科幻", "星际", "进化"],
    status: "完结",
    note: "地球遭遇大涅盘后的星际冒险，罗峰的进化之路",
  },
  {
    id: 10,
    title: "道诡异仙",
    author: "狐尾的笔",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/dao_gui_yi_xian.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/dao_gui_yi_xian.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xianxia", "xuanyi", "xuanhuan", "wuxian"],
    tags: ["仙侠", "悬疑", "惊悚", "疯批"],
    status: "完结",
    note: "穿越修仙界与现代精神病院双向奔赴，我到底是疯子还是天才？",
  },
  {
    id: 11,
    title: "斗破苍穹",
    author: "天蚕土豆",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/dou_po.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/dou_po.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xuanhuan"],
    tags: ["玄幻", "斗气", "升级流"],
    status: "完结",
    note: "三十年河东，三十年河西，莫欺少年穷",
  },
  {
    id: 12,
    title: "遮天",
    author: "辰东",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/zhe_tian.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/zhe_tian.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xianxia", "xuanyi"],
    tags: ["仙侠", "九龙拉棺", "洪荒"],
    status: "完结",
    note: "九龙拉棺，开启星际漂流，在浩瀚的修仙世界",
  },
  {
    id: 13,
    title: "完美世界",
    author: "辰东",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/wan_mei_shi_jie.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/wan_mei_shi_jie.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["xianxia", "xuanhuan"],
    tags: ["仙侠", "荒天帝", "独断万古"],
    status: "完结",
    note: "一粒尘可填海，一根草斩尽日月星辰，弹指间遮天蔽日",
  },
  {
    id: 14,
    title: "龙族",
    author: "江南",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/long_zu.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/long_zu.webp?imageView2/2/w/80/format/webp/q/50",
    category: ["qihuan", "yanqing", "dushi", "western_fantasy"],
    tags: ["奇幻", "言情", "龙族", "热血"],
    status: "连载",
    note: "凡人少年与龙族的战争，每个人心中都有一个死小孩",
  },
];
