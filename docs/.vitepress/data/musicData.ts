/**
 * 音乐分类：先按「流媒体/唱片店」常见维度建体系（流派 + 编曲形态 + 语言/地区），曲目再挂载其中。
 * 与 theme/pages/music.vue 一致，仅使用下列 value。
 */
export const MUSIC_CATEGORY_FILTERS = [
  { label: "全部", value: "all" },
  { label: "流行", value: "pop" },
  { label: "摇滚", value: "rock" },
  { label: "独立/另类", value: "indie" },
  { label: "电子", value: "electronic" },
  { label: "嘻哈/R&B", value: "hiphop" },
  { label: "民谣", value: "folk" },
  { label: "乡村", value: "country" },
  { label: "爵士", value: "jazz" },
  { label: "蓝调", value: "blues" },
  { label: "古典", value: "classical" },
  { label: "金属", value: "metal" },
  { label: "国风/民族流行", value: "chinese_style" },
  { label: "影视原声", value: "soundtrack" },
  { label: "动漫/游戏歌曲", value: "anisong" },
  { label: "轻音乐/氛围", value: "light" },
  { label: "钢琴", value: "piano" },
  { label: "纯器乐", value: "instrumental" },
  { label: "国语", value: "cn" },
  { label: "粤语", value: "yue" },
  { label: "英语", value: "en" },
  { label: "日语", value: "jp" },
  { label: "韩语", value: "kr" },
  { label: "其他语言", value: "other_lang" },
] as const;

export type MusicCategoryFilterValue = (typeof MUSIC_CATEGORY_FILTERS)[number]["value"];
export type MusicCategoryTag = Exclude<MusicCategoryFilterValue, "all">;

// 音乐数据类型
export interface MusicItem {
  id: number; // 唯一标识符
  title: string; // 歌曲标题
  author: string; // 艺术家/作者
  cover: string; // 封面图片路径或 URL
  thumb?: string; // 低质量缩略图占位（可选）
  url: string; // 音乐文件 URL
  album: string; // 所属专辑
  release_date: string; // 发布日期
  category: MusicCategoryTag[]; // 流派/场景 + 语言等（须为 MUSIC_CATEGORY_FILTERS 中非 all 的 value）
  duration?: string; // 歌曲时长（显示用，可选）
  lrc?: string; // 歌词文件路径（可选）
  lrcUrl?: string; // 歌词文件 URL（可选）
  bilingual?: boolean; // 是否为双语歌词
}

// 导出数据列表
export const musicList: MusicItem[] = [
  {
    id: 1,
    title: "昼下がりの憂鬱",
    author: "Foxtail-Grass Studio",
    cover:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/%E6%98%BC%E4%B8%8B%E3%81%8C%E3%82%8A%E3%81%AE%E6%86%82%E9%AC%B1.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/%E6%98%BC%E4%B8%8B%E3%81%8C%E3%82%8A%E3%81%AE%E6%86%82%E9%AC%B1.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/Foxtail-Grass%20Studio%20-%20%E6%98%BC%E4%B8%8B%E3%81%8C%E3%82%8A%E3%81%AE%E6%86%82%E9%AC%B1.mp3",
    album: "pastoral landscape",
    release_date: "2013/12/20",
    category: ["light", "instrumental", "jp"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E6%98%BC%E4%B8%8B%E3%81%8C%E3%82%8A%E3%81%AE%E6%86%82%E9%AC%B1%20-%20Foxtail-Grass%20Studio.lrc",
    bilingual: false,
  },
  {
    id: 2,
    title: "Serene Piano Adagio",
    author: "Piano Ensemble",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/piano-serenity.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/piano-serenity.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/Adagio%20Piano%20Pieces%20%28Satie%20Style%29-1.m4a",
    album: "Quiet Piano Collection (Satie Style)",
    release_date: "2026/04/30",
    category: ["piano", "classical", "light", "instrumental", "en"],
    lrcUrl: "",
    bilingual: false,
  },
  {
    id: 3,
    title: "光芒",
    author: "川田まみ",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/guangmang.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/guangmang.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B7%9D%E7%94%B0%E3%81%BE%E3%81%BF%20-%20%E5%85%89%E8%8A%92.mp3",
    album: "灼眼のシャナF SUPERIORITY SHANAIII vol.3 (TV动画《灼眼的夏娜3》原声集3)",
    release_date: "2012/07/25",
    category: ["jp", "soundtrack", "anisong"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%85%89%E8%8A%92%20-%20%E5%B7%9D%E7%94%B0%E3%81%BE%E3%81%BF.lrc",
    bilingual: true,
  },
  {
    id: 4,
    title: "ひらひら ひらら",
    author: "ClariS",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/claris_hirahira.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/claris_hirahira.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/ClariS%20-%20%E3%81%B2%E3%82%89%E3%81%B2%E3%82%89%20%E3%81%B2%E3%82%89%E3%82%89.mp3",
    album: "ひらひら ひらら",
    release_date: "2016/04/20",
    category: ["jp", "pop"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E3%81%B2%E3%82%89%E3%81%B2%E3%82%89%20%E3%81%B2%E3%82%89%E3%82%89%20-%20ClariS.lrc",
    bilingual: true,
  },
  {
    id: 5,
    title: "I Really Want to Stay at Your House",
    author: "Rosa Walton",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/stay_at_your_house.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/stay_at_your_house.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/Cyberpunk%20-%20I%20Really%20Want%20to%20Stay%20at%20Your%20House.mp3",
    album: "Cyberpunk 2077: Radio, Vol. 2",
    release_date: "2020/12/18",
    category: ["pop", "en", "electronic"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/I%20Really%20Want%20to%20Stay%20at%20Your%20House%20-%20Cyberpunk.lrc",
    bilingual: true,
  },
  {
    id: 6,
    title: "Remake",
    author: "ONE OK ROCK",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/one_ok_rock_remake.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/one_ok_rock_remake.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/ONE%20OK%20ROCK%20-%20Remake.mp3",
    album: "Zankyo Reference",
    release_date: "2011/10/05",
    category: ["rock", "jp"],
    lrcUrl: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/Re_make%20-%20ONE%20OK%20ROCK.lrc",
    bilingual: true,
  },
  {
    id: 7,
    title: "again",
    author: "YUI",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/yui_again.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/yui_again.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/YUI%20-%20again.mp3",
    album: "HOLIDAYS IN THE SUN",
    release_date: "2009/06/03",
    category: ["jp", "pop", "rock", "anisong"],
    lrcUrl: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/again%20-%20YUI.lrc",
    bilingual: true,
  },
  {
    id: 8,
    title: "ラブ・ストーリーは突然に",
    author: "小田和正",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/oda_love_story.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/oda_love_story.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B0%8F%E7%94%B0%E5%92%8C%E6%AD%A3%20-%20%E3%83%A9%E3%83%96%E3%83%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AA%E3%83%BC%E3%81%AF%E7%AA%81%E7%84%B6%E3%81%AB.mp3",
    album: "Oh! Yeah!",
    release_date: "1991/02/06",
    category: ["jp", "pop"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E3%83%A9%E3%83%96%E3%83%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AA%E3%83%BC%E3%81%AF%E7%AA%81%E7%84%B6%E3%81%AB%20-%20%E5%B0%8F%E7%94%B0%E5%92%8C%E6%AD%A3.lrc",
    bilingual: true,
  },
  {
    id: 9,
    title: "One Last Kiss",
    author: "宇多田ヒカル",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/utada_one_last_kiss.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/utada_one_last_kiss.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%AE%87%E5%A4%9A%E7%94%B0%E3%83%92%E3%82%AB%E3%83%AB%20-%20One%20Last%20Kiss.mp3",
    album: "One Last Kiss",
    release_date: "2021/03/09",
    category: ["jp", "pop", "anisong", "soundtrack"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/One%20Last%20Kiss%20-%20%E5%AE%87%E5%A4%9A%E7%94%B0%E3%83%92%E3%82%AB%E3%83%AB.lrc",
    bilingual: true,
  },
  {
    id: 10,
    title: "孤雏",
    author: "AGA",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/aga_orphan.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/aga_orphan.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/AGA%20-%20%E5%AD%A4%E9%9B%8F.mp3",
    album: "孤雏",
    release_date: "2016/07/29",
    category: ["pop", "yue"],
    lrcUrl: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%AD%A4%E9%9B%8F%20-%20AGA.lrc",
    bilingual: false,
  },
  {
    id: 11,
    title: "Take Me Hand",
    author: "DAISHI DANCE & Cécile Corbel",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/daishi_takemehand.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/daishi_takemehand.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/DAISHI%2BDANCE%26C%C3%A9cile%20Corbel%20-%20Take%20Me%20Hand.mp3",
    album: "Wonder Tourism",
    release_date: "2013/11/13",
    category: ["en", "pop", "electronic"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/Take%20Me%20Hand%20-%20DAISHI%20DANCE%26C%C3%A9cile%20Corbel.lrc",
    bilingual: true,
  },
  {
    id: 12,
    title: "我们的爱",
    author: "F.I.R.飞儿乐团",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/fir_ourlove.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/fir_ourlove.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/F.I.R.%E9%A3%9E%E5%84%BF%E4%B9%90%E5%9B%A2%20-%20%E6%88%91%E4%BB%AC%E7%9A%84%E7%88%B1.mp3",
    album: "F.I.R.飞儿乐团同名专辑",
    release_date: "2004/04/23",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E6%88%91%E4%BB%AC%E7%9A%84%E7%88%B1%20-%20F.I.R.%E9%A3%9E%E5%84%BF%E4%B9%90%E5%9B%A2.lrc",
    bilingual: false,
  },
  {
    id: 13,
    title: "僕らの手には何もないけど、",
    author: "RAM WIRE",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/ramwire_nothing.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/ramwire_nothing.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/RAM%20WIRE%20-%20%E5%83%95%E3%82%89%E3%81%AE%E6%89%8B%E3%81%AB%E3%81%AF%E4%BD%95%E3%82%82%E3%81%AA%E3%81%84%E3%81%91%E3%81%A9%E3%80%81.mp3",
    album: "僕らの手には何もないけど、",
    release_date: "2015/02/25",
    category: ["jp", "pop"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%83%95%E3%82%89%E3%81%AE%E6%89%8B%E3%81%AB%E3%81%AF%E4%BD%95%E3%82%82%E3%81%AA%E3%81%84%E3%81%91%E3%81%A9%E3%80%81%20-%20RAM%20WIRE.lrc",
    bilingual: true,
  },
  {
    id: 14,
    title: "The Way I Still Love You",
    author: "Reynard Silva",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/reynard_wayiloveyou.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/reynard_wayiloveyou.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/Reynard%2BSilva%20-%20The%20Way%20I%20Still%20Love%20You.mp3",
    album: "The Way I Still Love You",
    release_date: "2014/08/04",
    category: ["pop", "en", "hiphop"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/The%20Way%20I%20Still%20Love%20You%20-%20Reynard%20Silva.lrc",
    bilingual: true,
  },
  {
    id: 15,
    title: "知我（齐静春）",
    author: "谭渊",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/guofeng_zhiwo.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/guofeng_zhiwo.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E8%B0%AD%E6%B8%8A%20-%20%E7%9F%A5%E6%88%91%28%E9%BD%90%E9%9D%99%E6%98%A5%29.mp3",
    album: "知我",
    release_date: "2023/04/15",
    category: ["pop", "cn", "chinese_style"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E7%9F%A5%E6%88%91%20%28%E9%BD%90%E9%9D%99%E6%98%A5%29%20-%20%E8%B0%AD%E6%B8%8A.lrc",
    bilingual: false,
  },
  {
    id: 16,
    title: "我们",
    author: "乐柠组合",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/lenin_us.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/lenin_us.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E4%B9%90%E6%9F%A0%E7%BB%84%E5%90%88%20-%20%E6%88%91%E4%BB%AC.mp3",
    album: "我们",
    release_date: "2024/01/20",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E6%88%91%E4%BB%AC%28%E5%8E%9F%E5%94%B1%E7%89%88%29%20-%20%E4%B9%90%E6%9F%A0%E7%BB%84%E5%90%88.lrc",
    bilingual: false,
  },
  {
    id: 17,
    title: "只为你着迷",
    author: "李秉成",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/libingcheng_crazy.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/libingcheng_crazy.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E6%9D%8E%E7%A7%89%E6%88%90%20-%20%E5%8F%AA%E4%B8%BA%E4%BD%A0%E7%9D%80%E8%BF%B7.mp3",
    album: "只为你着迷",
    release_date: "2022/06/08",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%8F%AA%E4%B8%BA%E4%BD%A0%E7%9D%80%E8%BF%B7%20-%20%E6%9D%8E%E7%A7%89%E6%88%90.lrc",
    bilingual: false,
  },
  {
    id: 18,
    title: "紫荆花盛开",
    author: "李荣洁",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/lirongjie_ziyinghua.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/lirongjie_ziyinghua.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E6%9D%8E%E8%8D%A3%E6%B4%81%20-%20%E7%B4%AB%E8%8D%86%E8%8A%B1%E7%9B%9B%E5%BC%80.mp3",
    album: "紫荆花盛开",
    release_date: "2022/07/01",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E7%B4%AB%E8%8D%86%E8%8A%B1%E7%9B%9B%E5%BC%80%20-%20%E6%9D%8E%E8%8D%A3%E6%B4%81.lrc",
    bilingual: false,
  },
  {
    id: 19,
    title: "白鸽乌鸦相爱的戏码",
    author: "潘成（皮卡潘）",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/pancheng_dove.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/pancheng_dove.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E6%BD%98%E6%88%90%EF%BC%88%E7%9A%AE%E5%8D%A1%E6%BD%98%EF%BC%89%20-%20%E7%99%BD%E9%B8%BD%E4%B9%8C%E9%B8%A6%E7%9B%B8%E7%88%B1%E7%9A%84%E6%88%8F%E7%A0%81.mp3",
    album: "白鸽乌鸦相爱的戏码",
    release_date: "2023/11/01",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E7%99%BD%E9%B8%BD%E4%B9%8C%E9%B8%A6%E7%9B%B8%E7%88%B1%E7%9A%84%E6%88%8F%E7%A0%81%20-%20%E6%BD%98%E6%88%90%EF%BC%88%E7%9A%AE%E5%8D%A1%E6%BD%98%EF%BC%89.lrc",
    bilingual: false,
  },
  {
    id: 20,
    title: "如愿",
    author: "王菲",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/wangfei_ruyuan.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/wangfei_ruyuan.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E7%8E%8B%E8%8F%B2%20-%20%E5%A6%82%E6%84%BF.mp3",
    album: "如愿",
    release_date: "2021/09/25",
    category: ["pop", "cn", "soundtrack"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%A6%82%E6%84%BF%20-%20%E7%8E%8B%E8%8F%B2.lrc",
    bilingual: false,
  },
  {
    id: 21,
    title: "壁上观",
    author: "一棵小葱 & 张曦匀",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/yike_bishangguan.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/yike_bishangguan.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E4%B8%80%E6%A3%B5%E5%B0%8F%E8%91%B1%26%E5%BC%A0%E6%9B%A6%E5%8C%80%20-%20%E5%A3%81%E4%B8%8A%E8%A7%82.mp3",
    album: "壁上观",
    release_date: "2023/08/18",
    category: ["pop", "cn", "chinese_style"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%A3%81%E4%B8%8A%E8%A7%82%20-%20%E4%B8%80%E6%A3%B5%E5%B0%8F%E8%91%B1%26%E5%BC%A0%E6%9B%A6%E5%8C%80.lrc",
    bilingual: false,
  },
  {
    id: 22,
    title: "忘了",
    author: "周林枫",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/zhoulinfeng_forget.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/zhoulinfeng_forget.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%91%A8%E6%9E%97%E6%9E%AB%20-%20%E5%BF%98%E4%BA%86.mp3",
    album: "忘了",
    release_date: "2023/12/15",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%BF%98%E4%BA%86%20-%20%E5%91%A8%E6%9E%97%E6%9E%AB.lrc",
    bilingual: false,
  },
  {
    id: 23,
    title: "我的答案",
    author: "周深",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/zhoushen_answer.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/zhoushen_answer.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%91%A8%E6%B7%B1%20-%20%E6%88%91%E7%9A%84%E7%AD%94%E6%A1%88.mp3",
    album: "我的答案",
    release_date: "2024/02/10",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E6%88%91%E7%9A%84%E7%AD%94%E6%A1%88%20-%20%E5%91%A8%E6%B7%B1.lrc",
    bilingual: false,
  },
  {
    id: 24,
    title: "月半小夜曲",
    author: "李克勤",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/hacken_yueban.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/hacken_yueban.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E6%9D%8E%E5%85%8B%E5%8B%A4%20-%20%E6%9C%88%E5%8D%8A%E5%B0%8F%E5%A4%9C%E6%9B%B2.mp3",
    album: "命运符号",
    release_date: "1987/11/01",
    category: ["pop", "yue"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E6%9C%88%E5%8D%8A%E5%B0%8F%E5%A4%9C%E6%9B%B2%20-%20%E6%9D%8E%E5%85%8B%E5%8B%A4.lrc",
    bilingual: false,
  },
  {
    id: 25,
    title: "爸爸妈妈",
    author: "李荣浩",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/li_ronghao_parents.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/li_ronghao_parents.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E6%9D%8E%E8%8D%A3%E6%B5%A9%20-%20%E7%88%B8%E7%88%B8%E5%A6%88%E5%A6%88.mp3",
    album: "有理想",
    release_date: "2016/01/22",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E7%88%B8%E7%88%B8%E5%A6%88%E5%A6%88%20-%20%E6%9D%8E%E8%8D%A3%E6%B5%A9.lrc",
    bilingual: false,
  },
  {
    id: 26,
    title: "丁香花",
    author: "唐磊",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/tang_lei_lilac.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/tang_lei_lilac.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%94%90%E7%A3%8A%20-%20%E4%B8%81%E9%A6%99%E8%8A%B1.mp3",
    album: "丁香花",
    release_date: "2004/07/01",
    category: ["pop", "cn", "folk"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E4%B8%81%E9%A6%99%E8%8A%B1%20-%20%E5%94%90%E7%A3%8A.lrc",
    bilingual: false,
  },
  {
    id: 27,
    title: "遗失的心跳",
    author: "萧亚轩",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/elva_lost_heartbeat.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/elva_lost_heartbeat.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E8%90%A7%E4%BA%9A%E8%BD%A9%20-%20%E9%81%97%E5%A4%B1%E7%9A%84%E5%BF%83%E8%B7%B3.mp3",
    album: "我爱我",
    release_date: "2011/12/23",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E9%81%97%E5%A4%B1%E7%9A%84%E5%BF%83%E8%B7%B3%20-%20%E8%90%A7%E4%BA%9A%E8%BD%A9.lrc",
    bilingual: false,
  },
  {
    id: 28,
    title: "画心",
    author: "张靓颖",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/jane_painted_heart.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/jane_painted_heart.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%BC%A0%E9%9D%93%E9%A2%96%20-%20%E7%94%BB%E5%BF%83.mp3",
    album: "画心",
    release_date: "2008/10/20",
    category: ["pop", "cn", "soundtrack"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E7%94%BB%E5%BF%83%20-%20%E5%BC%A0%E9%9D%93%E9%A2%96.lrc",
    bilingual: false,
  },
  {
    id: 29,
    title: "偏爱",
    author: "张芸京",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/zhangyunjing_preference.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/zhangyunjing_preference.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%BC%A0%E8%8A%B8%E4%BA%AC%20-%20%E5%81%8F%E7%88%B1.mp3",
    album: "破天荒",
    release_date: "2009/06/03",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E5%81%8F%E7%88%B1%20-%20%E5%BC%A0%E8%8A%B8%E4%BA%AC.lrc",
    bilingual: false,
  },
  {
    id: 30,
    title: "黄昏",
    author: "周传雄",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/steve_dusk.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/steve_dusk.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%91%A8%E4%BC%A0%E9%9B%84%20-%20%E9%BB%84%E6%98%8F.mp3",
    album: "Transfer",
    release_date: "2000/12/25",
    category: ["pop", "cn"],
    lrcUrl:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/lyrics/%E9%BB%84%E6%98%8F%20-%20%E5%91%A8%E4%BC%A0%E9%9B%84.lrc",
    bilingual: false,
  },
];