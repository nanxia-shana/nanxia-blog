// 第一维度：菜系地域（下拉按组分隔）
export const RECIPE_REGION_GROUPS = [
  {
    label: "中餐",
    options: [
      "川菜", "粤菜", "鲁菜", "苏菜", "浙菜", "闽菜", "湘菜", "徽菜",
      "东北菜", "西北菜", "云南菜", "贵州菜", "北京菜", "上海菜", "家常菜", "客家菜",
    ],
  },
  {
    label: "西餐",
    options: ["美式", "法式", "意式", "西班牙菜", "德式", "英式", "地中海", "墨西哥菜"],
  },
  {
    label: "日韩",
    options: ["日式", "韩式"],
  },
  {
    label: "东南亚",
    options: ["泰式", "越式", "马来式", "印尼菜", "新加坡菜", "印度菜"],
  },
  {
    label: "其他",
    options: ["融合创意菜", "其他"],
  },
] as const;

// 第二维度：餐食场景
export const RECIPE_SCENES = [
  "早餐", "午餐", "晚餐", "夜宵", "下午茶", "健身代餐", "宝宝辅食", "宴客大菜",
] as const;

// 第三维度：烹饪工艺
export const RECIPE_TECHNIQUES = [
  "煎", "炒", "炸", "蒸", "煮", "烤", "凉拌", "焖炖", "烘焙",
] as const;

// 第四维度：口味（含复合味型）
export const RECIPE_FLAVORS = [
  "酸", "甜", "苦", "辣", "咸", "鲜", "麻", "清淡",
  "酸甜", "酸辣", "麻辣", "鱼香", "五香", "咖喱", "蒜香", "酱香", "奶香", "咸甜",
] as const;

export type RecipeRegion = (typeof RECIPE_REGION_GROUPS)[number]["options"][number];
export type RecipeScene = (typeof RECIPE_SCENES)[number];
export type RecipeTechnique = (typeof RECIPE_TECHNIQUES)[number];
export type RecipeFlavor = (typeof RECIPE_FLAVORS)[number];

/**
 * 标签色相映射（HSL 的 H 值，0-360）。
 * 所有标签共用同一饱和度 55% / 明度 50%，只改色相，保证视觉重量一致。
 * 缺省标签使用中性灰（见 Recipe-card.vue 兜底）。
 */
export const TAG_HUE: Record<string, number> = {
  // —— 菜系地域 ——
  川菜: 0,       // 辣椒红
  粤菜: 150,     // 翡翠青绿
  鲁菜: 30,      // 酱棕
  苏菜: 165,     // 水润青绿
  浙菜: 180,     // 西湖青
  闽菜: 160,     // 海味青绿
  湘菜: 12,      // 鲜辣红橙
  徽菜: 25,      // 墨褐
  东北菜: 35,    // 暖棕
  西北菜: 28,    // 沙土黄棕
  云南菜: 140,   // 菌子青
  贵州菜: 8,     // 酸辣红
  北京菜: 0,     // 京酱红
  上海菜: 345,   // 本帮酱红
  家常菜: 25,    // 暖橙
  客家菜: 40,    // 土黄
  美式: 210,     // 牛仔蓝
  法式: 255,     // 紫罗兰
  意式: 5,       // 番茄红
  西班牙菜: 45,  // 藏红花黄
  德式: 30,      // 麦啤棕
  英式: 130,     // 茶绿
  地中海: 195,   // 爱琴海蓝
  墨西哥菜: 20,  // 辣椒黄
  日式: 340,     // 樱粉
  韩式: 355,     // 辣酱红
  泰式: 90,      // 柠檬草青
  越式: 150,     // 薄荷青
  马来式: 35,    // 沙茶棕黄
  印尼菜: 20,    // 椰浆橙
  新加坡菜: 10,  // 辣椒蟹红
  印度菜: 40,    // 咖喱姜黄
  融合创意菜: 280, // 创意紫
  其他: 0,       // 中性灰由组件兜底，这里给 0 不生效
  // —— 餐食场景 ——
  早餐: 30,      // 晨曦橙
  午餐: 95,      // 正午嫩绿
  晚餐: 245,     // 暮色蓝紫
  夜宵: 255,     // 深夜蓝
  下午茶: 25,    // 奶茶粉橙
  健身代餐: 140, // 健康绿
  宝宝辅食: 50,  // 蛋黄嫩黄
  宴客大菜: 350, // 绛红
  // —— 烹饪工艺 ——
  煎: 35,        // 金黄棕
  炒: 15,        // 镬气橙红
  炸: 45,        // 炸物金黄
  蒸: 190,       // 水雾青
  煮: 210,       // 水蓝
  烤: 18,        // 炭火橙
  凉拌: 130,     // 翠绿
  焖炖: 15,      // 陶炖赭红
  烘焙: 40,      // 麦金
  // —— 口味 ——
  酸: 110,       // 青梅绿
  甜: 330,       // 桃粉
  苦: 80,        // 苦橄褐绿
  辣: 0,         // 辣椒红
  咸: 210,       // 盐蓝灰
  鲜: 15,        // 鲜味橙红
  麻: 290,       // 花椒紫
  清淡: 160,     // 淡青
  酸甜: 345,     // 酸甜玫红
  酸辣: 5,       // 酸辣红
  麻辣: 350,     // 麻辣酱红
  鱼香: 10,      // 鱼香酱红
  五香: 30,      // 五香棕
  咖喱: 45,      // 姜黄
  蒜香: 55,      // 蒜白黄
  酱香: 25,      // 酱棕
  奶香: 42,      // 奶油金
  咸甜: 20,      // 叉烧琥珀
};

export interface RecipeCategory {
  region?: RecipeRegion;
  scene?: RecipeScene;
  technique?: RecipeTechnique;
  flavor?: RecipeFlavor;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface RecipeItem {
  id: number;
  title: string;
  cover: string;
  thumb?: string;
  difficulty: string;
  cookTime: string;
  category: RecipeCategory;
  description: string;
  note: string;
  ingredients: RecipeIngredient[];
  steps: string[];
}

export const recipeList: RecipeItem[] = [
  {
    id: 1,
    title: "番茄炒蛋",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/fan_qie_chao_dan.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/fan_qie_chao_dan.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "简单",
    cookTime: "15 分钟",
    category: { region: "家常菜", scene: "午餐", technique: "炒", flavor: "咸" },
    description: "酸甜开胃的家常经典，鸡蛋软嫩，番茄汤汁浓郁。",
    note: "番茄先炒出沙，再让鸡蛋回锅吸满汤汁。",
    ingredients: [
      { name: "番茄", amount: "2 个" },
      { name: "鸡蛋", amount: "3 个" },
      { name: "葱花", amount: "适量" },
      { name: "盐", amount: "少许" },
      { name: "白糖", amount: "少许" },
    ],
    steps: [
      "番茄顶部划十字，开水烫后去皮切块；鸡蛋打散加少许盐搅匀。",
      "热锅凉油，倒入蛋液，中火炒至刚凝固即盛出备用。",
      "锅中留底油，下番茄块中火翻炒，用锅铲压出汁水，炒至出沙。",
      "加少许糖和盐调味，倒入炒好的鸡蛋快速翻炒均匀。",
      "撒上葱花，出锅装盘。",
    ],
  },
  {
    id: 2,
    title: "家常红烧肉",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/jia_shao_hong_shao_rou.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/jia_shao_hong_shao_rou.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "中等",
    cookTime: "90 分钟",
    category: { region: "家常菜", scene: "宴客大菜", technique: "焖炖", flavor: "咸甜" },
    description: "色泽红亮、咸甜适口，慢炖后肥而不腻。",
    note: "小火慢炖，最后开盖收汁，肉香才会更醇厚。",
    ingredients: [
      { name: "五花肉", amount: "500g" },
      { name: "冰糖", amount: "20g" },
      { name: "生抽", amount: "2 勺" },
      { name: "老抽", amount: "1 勺" },
      { name: "料酒", amount: "2 勺" },
      { name: "姜片、葱段", amount: "适量" },
      { name: "八角、桂皮", amount: "少许" },
    ],
    steps: [
      "五花肉切 3cm 方块，冷水下锅加料酒焯水，撇去浮沫后捞出沥干。",
      "锅中少许油，下冰糖小火炒至焦糖色，倒入肉块翻炒上色。",
      "加姜片、葱段、八角、桂皮爆香，烹入料酒、生抽、老抽炒匀。",
      "倒入没过肉块的热水，大火烧开后转小火加盖焖炖 60 分钟。",
      "开盖转大火收汁，至汤汁浓稠裹满肉块即可出锅。",
    ],
  },
  {
    id: 3,
    title: "西兰花炒虾仁",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/xi_lan_hua_chao_xia_ren.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/xi_lan_hua_chao_xia_ren.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "简单",
    cookTime: "20 分钟",
    category: { region: "家常菜", scene: "午餐", technique: "炒", flavor: "鲜" },
    description: "虾仁脆嫩弹牙，西兰花翠绿爽口，清淡又营养。",
    note: "虾仁提前用料酒和淀粉腌制，西兰花先焯水再炒更翠绿。",
    ingredients: [
      { name: "西兰花", amount: "1 颗" },
      { name: "鲜虾仁", amount: "200g" },
      { name: "蒜末", amount: "适量" },
      { name: "料酒", amount: "1 勺" },
      { name: "盐、白胡椒", amount: "少许" },
      { name: "淀粉", amount: "1 小勺" },
    ],
    steps: [
      "虾仁去虾线，加料酒、盐、白胡椒和淀粉抓匀腌制 10 分钟。",
      "西兰花切小朵，盐水浸泡后洗净；开水加少许盐和油焯 1 分钟捞出。",
      "热锅凉油，下蒜末爆香，倒入虾仁大火翻炒至变色。",
      "加入西兰花快速翻炒，加盐和白胡椒调味。",
      "淋少许水淀粉勾薄芡，翻炒均匀出锅。",
    ],
  },
  {
    id: 4,
    title: "豆干炒肉",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/dou_gan_chao_rou.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/dou_gan_chao_rou.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "简单",
    cookTime: "20 分钟",
    category: { region: "家常菜", scene: "午餐", technique: "炒", flavor: "酱香" },
    description: "豆干吸满肉香，咸鲜下饭，是快手家常小炒。",
    note: "豆干先干煸至微黄，再下肉片和豆瓣酱翻炒更入味。",
    ingredients: [
      { name: "豆干", amount: "4 块" },
      { name: "五花肉", amount: "150g" },
      { name: "青椒", amount: "2 个" },
      { name: "豆瓣酱", amount: "1 勺" },
      { name: "生抽", amount: "1 勺" },
      { name: "蒜末", amount: "适量" },
    ],
    steps: [
      "豆干切薄片，五花肉切薄片，青椒切块备用。",
      "热锅少油，下豆干小火煸至两面微黄后盛出。",
      "锅中下五花肉煸出油脂，加豆瓣酱和蒜末炒出红油。",
      "倒入豆干和青椒大火翻炒，加生抽调味。",
      "炒至青椒断生即可出锅。",
    ],
  },
  {
    id: 5,
    title: "回锅肉",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/hui_guo_rou.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/hui_guo_rou.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "中等",
    cookTime: "40 分钟",
    category: { region: "川菜", scene: "宴客大菜", technique: "炒", flavor: "辣" },
    description: "肥而不腻、辣中带甜，豆瓣酱的香气是灵魂。",
    note: "五花肉先煮至八分熟再切片，煸出油脂后下豆瓣酱炒出红油。",
    ingredients: [
      { name: "带皮五花肉", amount: "400g" },
      { name: "青蒜苗", amount: "2 根" },
      { name: "郫县豆瓣酱", amount: "1.5 勺" },
      { name: "甜面酱", amount: "1 勺" },
      { name: "豆豉", amount: "1 小勺" },
      { name: "姜片、料酒", amount: "适量" },
    ],
    steps: [
      "五花肉整块冷水下锅，加姜片、料酒煮至八分熟，捞出放凉切薄片。",
      "青蒜苗斜切段，蒜白和蒜叶分开放。",
      "热锅少油，下五花肉片中小火煸至卷曲出油、边缘微焦。",
      "加入郫县豆瓣酱、甜面酱、豆豉炒出红油和香气。",
      "先下蒜白翻炒，再下蒜叶，断生即可出锅。",
    ],
  },
  {
    id: 6,
    title: "鸡蛋炒豆腐",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/ji_dan_chao_dou_fu.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/ji_dan_chao_dou_fu.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "简单",
    cookTime: "15 分钟",
    category: { region: "家常菜", scene: "午餐", technique: "煎", flavor: "咸" },
    description: "豆腐嫩滑、鸡蛋金黄，简单下饭的家常豆腐菜。",
    note: "豆腐先煎至两面微黄，再倒入蛋液，翻面时保持豆腐完整。",
    ingredients: [
      { name: "嫩豆腐", amount: "1 块" },
      { name: "鸡蛋", amount: "3 个" },
      { name: "葱花", amount: "适量" },
      { name: "生抽", amount: "1 勺" },
      { name: "盐", amount: "少许" },
    ],
    steps: [
      "豆腐切 2cm 方块，开水加少许盐焯 1 分钟去豆腥，捞出沥干。",
      "鸡蛋打散加少许盐搅匀。",
      "热锅凉油，下豆腐中火煎至两面微黄。",
      "均匀淋入蛋液，待底部凝固后轻轻翻炒。",
      "淋入生抽，撒葱花翻匀出锅。",
    ],
  },
  {
    id: 7,
    title: "土豆红烧肉",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/tu_dou_hong_shao_rou.jpeg",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/recipes/tu_dou_hong_shao_rou.jpeg?imageView2/2/w/80/format/webp/q/50",
    difficulty: "中等",
    cookTime: "60 分钟",
    category: { region: "家常菜", scene: "宴客大菜", technique: "焖炖", flavor: "咸甜" },
    description: "五花肉软糯入味，土豆吸满浓郁酱汁，咸甜适口。",
    note: "五花肉先煸出油脂，土豆后放以免炖烂，最后大火收汁。",
    ingredients: [
      { name: "五花肉", amount: "400g" },
      { name: "土豆", amount: "2 个" },
      { name: "冰糖", amount: "15g" },
      { name: "生抽、老抽", amount: "适量" },
      { name: "料酒", amount: "2 勺" },
      { name: "姜片、八角", amount: "适量" },
    ],
    steps: [
      "五花肉切块冷水下锅焯水，捞出沥干；土豆切滚刀块。",
      "锅中少油下冰糖炒糖色，放入五花肉翻炒上色。",
      "加姜片、八角爆香，烹入料酒、生抽、老抽炒匀。",
      "倒入热水没过肉块，大火烧开转小火炖 30 分钟。",
      "加入土豆继续炖 15 分钟，最后大火收汁即可。",
    ],
  },
];
