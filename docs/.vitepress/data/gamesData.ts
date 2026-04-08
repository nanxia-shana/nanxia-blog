// 游戏数据类型
export interface GameItem {
  title: string; // 游戏中文名（必填）
  originalTitle?: string; // 原始名称（可选）
  developer: string; // 开发商
  publisher: string; // 发行商
  releaseYear: number; // 发行年份
  cover: string; // 封面图片路径
  genre: string[]; // 类型标签
  platform: string[]; // 平台
  tags: string[]; // 自定义标签
  note: string; // 个人评测
}

// 导出数据列表
export const gameList: GameItem[] = [
  {
    title: "塞尔达传说：旷野之息",
    originalTitle: "The Legend of Zelda: Breath of the Wild",
    developer: "任天堂",
    publisher: "任天堂",
    releaseYear: 2017,
    cover: "/nanxia-blog/game-covers/zelda-botw.webp",
    genre: ["开放世界", "冒险", "动作"],
    platform: ["Switch", "Wii U"],
    tags: ["探索", "解密", "神作"],
    note: "重新定义了开放世界，每一寸草地都值得探索，这就是游戏的魅力",
  },
  {
    title: "艾尔登法环",
    originalTitle: "Elden Ring",
    developer: "FromSoftware",
    publisher: "万代南梦宫",
    releaseYear: 2022,
    cover: "/nanxia-blog/game-covers/elden-ring.webp",
    genre: ["开放世界", "魂系", "RPG"],
    platform: ["PC", "PS5", "Xbox"],
    tags: ["苦难", "探索", "宫崎英高"],
    note: "褪色者啊，去交界地成为艾尔登之王吧，开放世界魂系的完美结合",
  },
  {
    title: "原神",
    originalTitle: "Genshin Impact",
    developer: "米哈游",
    publisher: "米哈游",
    releaseYear: 2020,
    cover: "/nanxia-blog/game-covers/genshin.webp",
    genre: ["开放世界", "ARPG", "二次元"],
    platform: ["PC", "iOS", "Android", "PS5"],
    tags: ["抽卡", "肝", "风景"],
    note: "在提瓦特大陆，邂逅七种元素的奇幻冒险，每一帧都是壁纸",
  },
  {
    title: "黑神话：悟空",
    originalTitle: "Black Myth: Wukong",
    developer: "游戏科学",
    publisher: "游戏科学",
    releaseYear: 2024,
    cover: "/nanxia-blog/game-covers/black-myth.webp",
    genre: ["动作", "RPG", "神话"],
    platform: ["PC", "PS5", "Xbox"],
    tags: ["国产", "西游记", "3A"],
    note: "一点灵台，阴阳难晦，千重变化，万劫归一，国产3A的里程碑",
  },
  {
    title: "我的世界",
    originalTitle: "Minecraft",
    developer: "Mojang",
    publisher: "Mojang",
    releaseYear: 2009,
    cover: "/nanxia-blog/game-covers/minecraft.webp",
    genre: ["沙盒", "生存", "创造"],
    platform: ["全平台"],
    tags: ["方块", "自由", "创造"],
    note: "没有什么是你不能创造的，这个世界由你定义",
  },
  {
    title: "只狼：影逝二度",
    originalTitle: "Sekiro: Shadows Die Twice",
    developer: "FromSoftware",
    publisher: "动视",
    releaseYear: 2019,
    cover: "/nanxia-blog/game-covers/sekiro.webp",
    genre: ["动作", "魂系", "武士"],
    platform: ["PC", "PS4", "Xbox One"],
    tags: ["打铁", "死， Respect", "狼"],
    note: "龙胤归乡，只狼影逝二度，真正的武士就是要拼刀",
  },
];
