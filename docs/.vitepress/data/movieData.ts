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
    title: "肖申克的救赎", // 电影中文名（必填）
    originalTitle: "The Shawshank Redemption", // 原始片名（非必填）
    director: "弗兰克·德拉邦特", // 导演
    year: 1994, // 上映年份
    country: "美国", // 制片国家
    genre: ["剧情", "犯罪"], // 类型标签（数组）
    runtime: 142, // 时长（分钟）
    cover: "/nanxia-blog/movie-covers/shawshank-redemption.webp", // 封面图片路径
    cast: ["蒂姆·罗宾斯", "摩根·弗里曼"], // 主演阵容（数组）
    tags: ["希望", "体制化", "经典"], // 自定义标签
    note: "自由意志与人性救赎的永恒命题，结尾震撼人心", // 观看笔记
  },
  {
    title: "实习生",
    originalTitle: "The Intern",
    director: "南希·迈耶斯",
    year: 2015,
    country: "美国",
    genre: ["剧情", "喜剧"],
    runtime: 121,
    cover: "/nanxia-blog/movie-covers/the-intern.webp",
    cast: ["罗伯特·德尼罗", "安妮·海瑟薇"],
    tags: ["职场", "治愈", "人生感悟"],
    note: "退休老人重返职场，温暖治愈的人生故事",
  },
  {
    title: "阿甘正传",
    originalTitle: "Forrest Gump",
    director: "罗伯特·泽米吉斯",
    year: 1994,
    country: "美国",
    genre: ["剧情", "爱情", "传奇"],
    runtime: 142,
    cover: "/nanxia-blog/movie-covers/forrest-gump.webp",
    cast: ["汤姆·汉克斯", "罗宾·怀特"],
    tags: ["人生", "励志", "经典"],
    note: "傻人有傻福，一个傻子的美国百年传奇",
  },
  {
    title: "摔跤吧！爸爸",
    originalTitle: "Dangal",
    director: "涅提蒂瓦瑞",
    year: 2016,
    country: "印度",
    genre: ["剧情", "传记", "运动"],
    runtime: 161,
    cover: "/nanxia-blog/movie-covers/dangal.webp",
    cast: ["阿米尔·汗", "法缇玛·萨那·纱卡"],
    tags: ["女权", "体育", "亲情"],
    note: "父爱的梦想，女儿的荣耀，改变无数女性命运",
  },
  {
    title: "我不是药神",
    originalTitle: "Dying to Survive",
    director: "文牧野",
    year: 2018,
    country: "中国",
    genre: ["剧情", "社会"],
    runtime: 117,
    cover: "/nanxia-blog/movie-covers/dying-to-survive.webp",
    cast: ["徐峥", "王传君", "周一围"],
    tags: ["现实", "人性", "医疗"],
    note: "穷病难治，药神无冕，叩问生命与人性",
  },
  {
    title: "盗梦空间",
    originalTitle: "Inception",
    director: "克里斯托弗·诺兰",
    year: 2010,
    country: "美国/英国",
    genre: ["科幻", "动作", "悬疑"],
    runtime: 148,
    cover: "/nanxia-blog/movie-covers/inception.webp",
    cast: ["莱昂纳多·迪卡普里奥", "约瑟夫·高登-莱维特", "艾伦·佩吉"],
    tags: ["梦境", "烧脑", "诺兰"],
    note: "梦中梦，局中局，你的图腾还在转吗",
  },
  {
    title: "当幸福来敲门",
    originalTitle: "The Pursuit of Happyness",
    director: "加布里尔·穆奇诺",
    year: 2006,
    country: "美国",
    genre: ["剧情", "传记", "励志"],
    runtime: 117,
    cover: "/nanxia-blog/movie-covers/pursuit-of-happyness.webp",
    cast: ["威尔·史密斯", "贾登·史密斯"],
    tags: ["励志", "奋斗", "亲情"],
    note: "如果你有梦想，就要去捍卫它",
  },
  {
    title: "星际穿越",
    originalTitle: "Interstellar",
    director: "克里斯托弗·诺兰",
    year: 2014,
    country: "美国/英国",
    genre: ["科幻", "冒险", "太空"],
    runtime: 169,
    cover: "/nanxia-blog/movie-covers/interstellar.webp",
    cast: ["马修·麦康纳", "安妮·海瑟薇", "杰西卡·查斯坦"],
    tags: ["太空", "爱", "时间"],
    note: "爱跨越时间空间，不要温柔地走进那个良夜",
  },
  {
    title: "怦然心动",
    originalTitle: "Flipped",
    director: "罗伯·莱纳",
    year: 2010,
    country: "美国",
    genre: ["爱情", "青春", "剧情"],
    runtime: 90,
    cover: "/nanxia-blog/movie-covers/flipped.webp",
    cast: ["玛德琳·卡罗尔", "卡兰·麦克奥利菲"],
    tags: ["初恋", "青春", "成长"],
    note: "斯人若彩虹，遇上方知有",
  },
  {
    title: "寻梦环游记",
    originalTitle: "Coco",
    director: "李·昂克里奇",
    year: 2017,
    country: "美国",
    genre: ["动画", "奇幻", "亲情"],
    runtime: 105,
    cover: "/nanxia-blog/movie-covers/coco.webp",
    cast: ["安东尼·冈萨雷斯", "本杰明·布拉特"],
    tags: ["死亡", "亲情", "墨西哥"],
    note: "死亡不是终点，遗忘才是",
  },
  {
    title: "让子弹飞",
    originalTitle: "Let the Bullets Fly",
    director: "姜文",
    year: 2010,
    country: "中国",
    genre: ["剧情", "喜剧", "西部"],
    runtime: 132,
    cover: "/nanxia-blog/movie-covers/let-the-bullets-fly.webp",
    cast: ["姜文", "葛优", "周润发"],
    tags: ["幽默", "隐喻", "江湖"],
    note: "站着把钱挣了，子弹飞一会儿",
  },
  {
    title: "邪不压正",
    originalTitle: "Hidden Man",
    director: "姜文",
    year: 2018,
    country: "中国",
    genre: ["剧情", "动作", "喜剧"],
    runtime: 137,
    cover: "/nanxia-blog/movie-covers/hidden-man.webp",
    cast: ["彭于晏", "廖凡", "姜文", "周韵", "许晴"],
    tags: ["民国", "武侠", "隐喻"],
    note: "北平城下的恩怨情仇，姜文的浪漫狂想",
  },
]
