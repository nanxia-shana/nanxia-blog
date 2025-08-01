interface MusicItem {
  id: number; // 唯一标识符
  title: string; // 歌曲标题
  author: string; // 艺术家/作者
  cover: string; // 封面图片路径或 URL
  url: string; // 音乐文件 URL
  album: string; // 所属专辑
  release_date: string; // 发布日期
  duration: string; // 时长
  category: string; // 分类（如 "jp" 表示日语）
}

interface PlaybackState {
  // 当前播放的音乐项（可能为 null 表示未播放）
  currentMusic: MusicItem | null;
  // 播放控制状态
  isPlaying: boolean; // 是否正在播放
  currentTime: number; // 当前播放进度（秒）
  duration: number; // 总时长（秒，需从 MusicItem.duration 转换）
  // 音量控制
  volume: number; // 范围 0-100
  // 播放进度相关
  isMuted: boolean; // 是否静音
  playbackRate: number; // 播放速度（如 1.0 正常速度）
  // 循环和随机模式
  loopMode: "none" | "one" | "all"; // none:不循环, one:单曲循环, all:列表循环
  shuffleMode: boolean; // 是否随机播放
  // 播放历史/队列（可选扩展）
  playlist: MusicItem[]; // 当前播放列表
  currentIndex: number; // 当前音乐在列表中的索引
}

const musicList: MusicItem[] = [
  {
    id: 1,
    title: "光芒",
    author: "川田まみ",
    cover: "/nanxia-blog/music-covers/guangmang.png",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B7%9D%E7%94%B0%E3%81%BE%E3%81%BF%20-%20%E5%85%89%E8%8A%92.mp3",
    album: "灼眼のシャナF SUPERIORITY SHANAIII vol.3 (TV动画《灼眼的夏娜3》原声集3)",
    release_date: "2025/03/25",
    duration: "4:30",
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
    duration: "4:30",
    category: "jp",
  },
];

const playbackState: PlaybackState = {
  currentMusic: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 50, // 默认音量 50%
  isMuted: false,
  playbackRate: 1.0,
  loopMode: "none", // 'none' | 'one' | 'all'
  shuffleMode: false,
  playlist: [],
  currentIndex: -1, // -1 表示无当前音乐
};

export default {
  playbackState,
  musicList,
};