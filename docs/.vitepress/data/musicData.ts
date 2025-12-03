// 音乐数据类型
export interface MusicItem {
  id: number; // 唯一标识符
  title: string; // 歌曲标题
  author: string; // 艺术家/作者
  cover: string; // 封面图片路径或 URL
  url: string; // 音乐文件 URL
  album: string; // 所属专辑
  release_date: string; // 发布日期
  category: string; // 分类（如 "jp" 表示日语）
}

// 导出数据列表
export const musicList: MusicItem[] = [
  {
    id: 1,
    title: "光芒",
    author: "川田まみ",
    cover: "/nanxia-blog/music-covers/guangmang.png",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B7%9D%E7%94%B0%E3%81%BE%E3%81%BF%20-%20%E5%85%89%E8%8A%92.mp3",
    album: "灼眼のシャナF SUPERIORITY SHANAIII vol.3 (TV动画《灼眼的夏娜3》原声集3)",
    release_date: "2025/03/25",
    category: "jp",
  },
  {
    id: 2,
    title: "mirage",
    author: "コツキミヤ",
    cover: "/nanxia-blog/music-covers/コツキミヤ.jpg",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E3%82%B3%E3%83%84%E3%82%AD%E3%83%9F%E3%83%A4%20-%20mirage.flac",
    album: "Fate/Grand Order Waltz in the MOONLIGHT/LOSTROOM song material",
    release_date: "2025/03/14",
    category: "jp",
  },
]