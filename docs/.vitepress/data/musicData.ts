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
  category: string; // 分类（如 "jp" 表示日语）
  duration?: string; // 歌曲时长（显示用，可选）
}

// 导出数据列表
export const musicList: MusicItem[] = [
  {
    id: 1,
    title: "Serene Piano Adagio",
    author: "Piano Ensemble",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/piano-serenity.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/piano-serenity.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/Adagio%20Piano%20Pieces%20%28Satie%20Style%29-1.m4a",
    album: "Quiet Piano Collection (Satie Style)",
    release_date: "2026/04/30",
    category: "piano",
  },
  {
    id: 2,
    title: "光芒",
    author: "川田まみ",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/guangmang.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/guangmang.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B7%9D%E7%94%B0%E3%81%BE%E3%81%BF%20-%20%E5%85%89%E8%8A%92.mp3",
    album: "灼眼のシャナF SUPERIORITY SHANAIII vol.3 (TV动画《灼眼的夏娜3》原声集3)",
    release_date: "2012/07/25",
    category: "jp",
  },
  {
    id: 3,
    title: "ひらひら ひらら",
    author: "ClariS",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/claris_hirahira.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/claris_hirahira.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/ClariS%20-%20%E3%81%B2%E3%82%89%E3%81%B2%E3%82%89%20%E3%81%B2%E3%82%89%E3%82%89.mp3",
    album: "ひらひら ひらら",
    release_date: "2016/04/20",
    category: "jp",
  },
  {
    id: 4,
    title: "I Really Want to Stay at Your House",
    author: "Rosa Walton",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/stay_at_your_house.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/stay_at_your_house.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/Cyberpunk%20-%20I%20Really%20Want%20to%20Stay%20at%20Your%20House.mp3",
    album: "Cyberpunk 2077: Radio, Vol. 2",
    release_date: "2020/12/18",
    category: "pop",
  },
  {
    id: 5,
    title: "Remake",
    author: "ONE OK ROCK",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/one_ok_rock_remake.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/one_ok_rock_remake.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/ONE%20OK%20ROCK%20-%20Remake.mp3",
    album: "Zankyo Reference",
    release_date: "2011/10/05",
    category: "rock",
  },
  {
    id: 6,
    title: "again",
    author: "YUI",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/yui_again.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/yui_again.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/YUI%20-%20again.mp3",
    album: "HOLIDAYS IN THE SUN",
    release_date: "2009/06/03",
    category: "jp",
  },
  {
    id: 7,
    title: "ラブ・ストーリーは突然に",
    author: "小田和正",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/oda_love_story.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/oda_love_story.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B0%8F%E7%94%B0%E5%92%8C%E6%AD%A3%20-%20%E3%83%A9%E3%83%96%E3%83%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AA%E3%83%BC%E3%81%AF%E7%AA%81%E7%84%B6%E3%81%AB.mp3",
    album: "Oh! Yeah!",
    release_date: "1991/02/06",
    category: "jp",
  },
  {
    id: 8,
    title: "One Last Kiss",
    author: "宇多田ヒカル",
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/utada_one_last_kiss.webp",
    thumb:
      "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/musics/utada_one_last_kiss.webp?imageView2/2/w/80/format/webp/q/50",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%AE%87%E5%A4%9A%E7%94%B0%E3%83%92%E3%82%AB%E3%83%AB%20-%20One%20Last%20Kiss.mp3",
    album: "One Last Kiss",
    release_date: "2021/03/09",
    category: "jp",
  },
];