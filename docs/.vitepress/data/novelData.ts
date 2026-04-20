// 网络小说数据类型
export interface NovelItem {
  title: string; // 小说中文名（必填）
  author: string; // 作者
  cover: string; // 封面图片路径
  thumb?: string; // 低质量缩略图（可选）
  category: string; // 分类
  tags: string[]; // 标签
  status: string; // 状态（连载/完结）
  note: string; // 个人笔记
}

// 导出数据列表
export const novelList: NovelItem[] = [
  {
    title: "诡秘之主",
    author: "爱潜水的乌贼",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/guimei.webp",
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/guimei.webp?imageView2/2/w/80/format/webp/q/50",
    category: "literature",
    tags: ["西方魔幻", "克苏鲁", "智斗"],
    status: "完结",
    note: "蒸汽朋克+克苏鲁+塔罗牌，开创了一个新流派，每一个序列都美得像一首诗",
  },
  {
    title: "三体",
    author: "刘慈欣",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/santi.webp",
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/santi.webp?imageView2/2/w/80/format/webp/q/50",
    category: "technology",
    tags: ["科幻", "宇宙", "人性"],
    status: "完结",
    note: "中国科幻的天花板，宇宙就是一座黑暗森林，每个文明都是带枪的猎人",
  },
  {
    title: "凡人修仙传",
    author: "忘语",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/fanren.webp",
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/fanren.webp?imageView2/2/w/80/format/webp/q/50",
    category: "literature",
    tags: ["仙侠", "草根", "修真"],
    status: "完结",
    note: "一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子，开启了修仙之路",
  },
  {
    title: "盗墓笔记",
    author: "南派三叔",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/daomu.webp",
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/daomu.webp?imageView2/2/w/80/format/webp/q/50",
    category: "literature",
    tags: ["悬疑", "盗墓", "冒险"],
    status: "完结",
    note: "比鬼神更可怕的，是人心",
  },
  {
    title: "全职高手",
    author: "蝴蝶蓝",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/quansheng.webp",
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/novels/quansheng.webp?imageView2/2/w/80/format/webp/q/50",
    category: "literature",
    tags: ["电竞", "竞技", "群像"],
    status: "完结",
    note: "如果喜欢，就把这一切当作是荣耀，而不是炫耀",
  },
];
