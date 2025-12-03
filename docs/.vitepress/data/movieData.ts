// 电影数据类型
export interface MovieItem {
  title: string; // 电影中文名（必填）
  originalTitle?: string; // 原始片名（非必填）
  director: string; // 导演
  year: number; // 上映年份
  country: string; // 制片国家（数组）
  genre: string[]; // 类型标签（数组）
  runtime: number; // 时长（分钟）
  cover: string; // 封面图片路径
  cast: string[]; // 主演阵容（数组）
  tags: string[]; // 自定义标签
  note: string; // 观看笔记
}

// 导出数据列表
export const moiveList: MovieItem[] = [
  {
    title: "肖申克的救赎  ", // 电影中文名（必填）
    originalTitle: "The Shawshank Redemption", // 原始片名（非必填）
    director: "弗兰克·德拉邦特", // 导演
    year: 1994, // 上映年份
    country: "美国", // 制片国家
    genre: ["剧情", "犯罪"], // 类型标签（数组）
    runtime: 142, // 时长（分钟）
    cover: "/nanxia-blog/movie-covers/shawshank-redemption.jpeg", // 封面图片路径
    cast: ["蒂姆·罗宾斯", "摩根·弗里曼"], // 主演阵容（数组）
    tags: ["希望", "体制化", "经典"], // 自定义标签
    note: "自由意志与人性救赎的永恒命题，结尾震撼人心", // 观看笔记
  },
]