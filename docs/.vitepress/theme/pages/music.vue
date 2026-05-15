<template>
  <div class="music-collection">
    <h1>🎧 听海观澜</h1>
      <!-- 当前播放占位播放器样式 -->
      <div class="current-player-placeholder" v-if="playbackState?.currentMusic">
        <div class="cp-left">
          <div class="cp-cover">
            <div class="cp-cover-inner">
              <img :src="playbackState.currentMusic.cover" />
            </div>
          </div>
          <div class="cp-info">
            <div class="cp-title">{{ playbackState.currentMusic.title }}</div>
            <div class="cp-author">{{ playbackState.currentMusic.author }}</div>
          </div>
        </div>
        <div class="cp-right">
          <div class="cp-controls">
              <button class="cp-control-btn" @click="prevTrack" title="上一首">
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path d="M98.31 483.06L654.05 162.2c22.43-12.95 50.47 3.24 50.47 29.14v641.71c0 25.9-28.04 42.09-50.47 29.14L98.31 541.34c-22.43-12.95-22.43-45.33 0-58.28z" fill="currentColor" p-id="4485"></path>
                  <path d="M653.42 505.91L929.92 156c5.97-7.56 18.12-3.33 18.12 6.3v699.82c0 9.63-12.15 13.85-18.12 6.3L653.42 518.5a10.17 10.17 0 0 1 0-12.59z" fill="currentColor" p-id="4486"></path>
                </svg>
              </button>
              <button class="cp-control-btn cp-play-main" @click="togglePlay" title="播放/暂停">
                <svg v-if="!playbackState.isPlaying" viewBox="0 0 1024 1024" width="20" height="20">
                  <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor" p-id="1548"></path>
                  <path d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z" fill="var(--vp-c-bg-alt)" p-id="1549"></path>
                </svg>
                <svg v-else viewBox="0 0 1024 1024" width="20" height="20">
                  <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor" p-id="1717"></path>
                   <path d="M441.73 704.57H404.8c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.06 24.72-24.72 24.72zM619.12 704.57h-36.93c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.07 24.72-24.72 24.72z" fill="var(--vp-c-bg-alt)" p-id="1718"></path>
                </svg>
              </button>
              <button class="cp-control-btn" @click="nextTrack" title="下一首">
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path d="M925.61 483.06L369.88 162.21c-22.43-12.95-50.47 3.24-50.47 29.14v641.71c0 25.9 28.04 42.09 50.47 29.14l555.74-320.86c22.43-12.95 22.43-45.33-0.01-58.28z" fill="currentColor" p-id="1383"></path>
                  <path d="M370.5 505.91L94 156c-5.97-7.56-18.12-3.33-18.12 6.3v699.82c0 9.63 12.15 13.85 18.12 6.3L370.5 518.5c2.92-3.69 2.92-8.9 0-12.59z" fill="currentColor" p-id="1384"></path>
                </svg>
              </button>
              <button class="cp-control-btn cp-control-btn-autoplay" :class="{ active: autoPlayEnabled }" @click="toggleAutoPlay" title="自动播放">
                <svg viewBox="0 0 1163 1024" width="20" height="20">
                  <path d="M134.86 410.152c-27.902-9.3-41.853-41.853-32.552-69.755 93.007-265.07 381.33-404.581 641.75-311.574 144.16 51.154 255.77 167.413 306.923 311.574h111.609L1004.478 503.16 846.366 340.397h88.356C851.016 154.383 641.75 61.375 451.085 131.131A404.581 404.581 0 0 0 204.615 377.6c-9.3 27.902-41.852 41.853-69.755 32.552z m878.919 199.966c27.902 9.3 41.853 41.853 32.552 69.755-46.504 130.21-134.86 232.518-255.77 292.973-65.105 32.553-139.51 51.154-213.916 51.154-55.805 0-111.609-9.3-167.413-27.902-144.161-51.154-255.77-162.763-306.924-306.924v-4.65H0L158.112 521.76l158.112 162.763h-97.657C302.273 870.538 516.19 963.545 711.505 893.79c111.609-41.853 199.966-130.21 237.168-246.47 9.301-32.552 37.203-46.503 65.106-37.202zM520.84 293.893c9.301 0 18.602 4.65 23.252 9.301l209.266 181.364c13.951 13.951 18.602 37.203 4.65 55.805l-4.65 4.65-209.266 181.364c-13.95 13.951-41.853 13.951-55.804-4.65-4.65-4.65-9.3-13.951-9.3-23.252V331.096c4.65-18.601 18.6-37.203 41.852-37.203z" p-id="3349" fill="currentColor"></path>
                </svg>
              </button>
              <button class="cp-control-btn" @click="openLyrics" title="歌词">
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path d="M619.5 509.2h-91.8c-5.3 0-7.9 2.6-7.9 7.9v102.2h0.1c1.7 3.5 4.4 6.1 7.9 7.9h91.7c5.3 0 7.9-2.6 7.9-7.9V517.1c0-5.3-2.6-7.9-7.9-7.9z" fill="#dc143c" p-id="12822"></path><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zM249.7 223.5h84.5c12.4 1.7 30.1 13.1 31.1 34-1 22.8-19.7 35-31.1 36.7h-80.8c-10.3-1.7-33.1-14-34.1-36.7 0.9-20.9 20-32.2 30.4-34z m145.4 575.1h-73.9c-2.8 1.5-5.5 2.1-8.3 1.6-16.9-4.2-24.4-11.6-28.7-25.9-1.7-3.7-2.8-7.8-2.9-12.4 0-0.8 0.1-1.7 0.2-2.4V448.9c0-5.3-2.6-7.9-7.9-7.9h-26.2c-19.2-1.7-29.7-14.8-31.5-39.3 1.8-22.7 12.2-34.9 31.5-36.7h62.9c31.5-1.7 46.3 16.6 44.6 55.1v307.8h40.4c11.9 1.7 31.3 13.1 32.2 34-1.2 22.7-21.5 35-32.4 36.7z m106.5-103.3c-36.7 0-55.1-17.5-55.1-52.4v-152c0-34.9 15.7-52.4 47.2-52.4h154.6c36.7 0 54.2 14.9 52.4 44.6V643c0 34.9-15.7 52.4-47.2 52.4H501.6z m-63-330.2c1.7-21 11.3-32.3 28.8-34h214.9c21 1.7 32.3 13.1 34 34-1.7 22.7-12.2 34.9-31.5 36.7H467.4c-17.5-1.8-27-14-28.8-36.7z m369.6 401.8l-0.5-0.3c-1.7 20.9-9.2 32.2-22.4 33.8H636.6c-12.5-1.7-26.4-14-27.7-36.7 1.3-21 17.6-34 27.7-34h98.9l-0.7-0.4V304.8c0-5.3-2.6-7.9-7.9-7.9H441.2c-19.2-1.7-29.7-14-31.5-36.7 1.8-22.7 12.2-34.9 31.5-36.7h309.3c36.7 1.7 55.9 16.6 57.6 44.6v498.8z" fill="#dc143c" p-id="12823"></path>
                </svg>
              </button>
            </div>
          <div class="cp-progress">
            <div class="time-left">{{ formatter(playbackState.currentTime) }}</div>
            <div class="progress-bar" @click="seekTo" @mousedown="startDrag">
              <div class="bar-background">
                <div class="bar-filled" :style="{width: slider.width}">
                  <div class="dot"></div>
                </div>
              </div>
            </div>
            <div class="time-right">{{ formatter(playbackState.duration || 0) }}</div>
          </div>
        </div>
      </div>

      <!-- 歌词弹窗 -->
      <div v-if="showLyricsModal" class="lyrics-modal-overlay" @click.self="closeLyrics">
        <div class="lyrics-modal">
          <div class="lyrics-header">
            <div class="lyrics-title">{{ playbackState?.currentMusic?.title || '歌词' }}</div>
            <button class="lyrics-close" @click="closeLyrics">
              <svg viewBox="0 0 1024 1024" width="24" height="24">
                <path d="M557.312 513.248l265.28-263.904a32 32 0 1 0-45.312-45.248L512 468.096 246.72 204.096a32 32 0 0 0-45.312 45.248l265.28 263.904-265.28 263.904a32 32 0 1 0 45.312 45.248L512 558.4l265.28 263.904a32 32 0 1 0 45.312-45.248l-265.28-263.904z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div class="lyrics-content" ref="lyricsContainer" @scroll="handleLyricScroll">
            <div v-if="isLoadingLyrics" class="lyrics-loading">
              <div class="loading-spinner"></div>
              <span>加载中...</span>
            </div>
            <div v-else-if="parsedLyrics.length === 0" class="lyrics-empty">
              暂无歌词
            </div>
            <div v-else class="lyrics-list">
              <div
                v-for="(line, index) in parsedLyrics"
                :key="index"
                :class="['lyrics-line', { active: !line.isMeta && currentLyricIndex === index, 'lyrics-meta': line.isMeta }]"
              >
                <div class="lyrics-line-text">{{ line.text }}</div>
                <div v-if="line.translation" class="lyrics-line-trans">{{ line.translation }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>


    <div class="music-list">
      <div class="music-header">
        <div class="music-header-index">#</div>
        <div class="music-header-info">信息</div>
        <div class="music-header-album">专辑</div>
        <div class="music-header-date">日期</div>
      </div>
      <div v-for="(music, index) in filteredMusic" :key="music.title" :class="`music-card ${playbackState && playbackState.currentMusic?.id === music.id && playbackState.isPlaying ? 'music-card-playing' : ''}`" :data-category="music.category" @click="togglePlayItem(music)">
        <div class="music-index">{{ index + 1 }}</div>
        <div :class="`music-cover ${playbackState && playbackState.currentMusic?.id === music.id && playbackState.isPlaying ? 'music-cover-playing' : ''}`">
          <img :src="music.cover" :alt="music.title"                                                                                                                                                                                                                                                                              />
          <div class="play-overlay">
            <svg viewBox="0 0 1024 1024" width="36" height="36">
              <path d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z" fill="white"/>
            </svg>
          </div>
        </div>
        <div class="music-info">
          <span>{{ music.title }}</span>
          <span>{{ music.author }}</span>
        </div>
        <div class="music-album">{{ music.album }}</div>
        <div class="music-date">{{ music.release_date }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, watch, nextTick } from "vue";
import type { MusicItem } from "../../data/musicData";
import { MUSIC_CATEGORY_FILTERS, MusicCategoryTag } from "../../data/musicData";

// 播放状态接口
interface PlaybackState {
  currentMusic: MusicItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

// 歌词行接口
interface LyricLine {
  time: number;
  text: string;
  translation?: string;
  isMeta?: boolean;
}

// 与 data/musicData.ts 中 MUSIC_CATEGORY_FILTERS 同源，避免漏标（如 piano）与页面不同步
const categories = MUSIC_CATEGORY_FILTERS;
// 当前选中的分类
const currentCategory = ref("all");
// 音乐列表
const musicList = inject<MusicItem[]>("music-list");
// 音乐播放状态
const playbackState = inject<PlaybackState>("playback-state");

// 自动播放开关
const autoPlayEnabled = ref(false);
// 歌词弹窗显示
const showLyricsModal = ref(false);
// 解析后的歌词
const parsedLyrics = ref<LyricLine[]>([]);
// 当前播放的歌词索引
const currentLyricIndex = ref(0);
// 歌词容器引用
const lyricsContainer = ref<HTMLElement | null>(null);
// 原始歌词内容
const rawLyrics = ref('');
// 用户是否正在滚动歌词
const isUserScrolling = ref(false);
// 滚动防抖定时器
let scrollDebounceTimer: number | null = null;
// 歌词加载状态
const isLoadingLyrics = ref(false);

const slider = computed(() => ({
  width: playbackState?.duration ? `${(playbackState.currentTime / playbackState.duration) * 100}%` : "0%",
}));

// 格式化时间
const formatter = (value: number) => {
  return `${Math.floor(value / 60)}:${Math.floor(value % 60) < 10 ? "0" + Math.floor(value % 60) : Math.floor(value % 60)}`;
};


// 解析 LRC 歌词
const parseLyrics = (lrcContent: string, isBilingual: boolean) => {
  const lines = lrcContent.split('\n');
  // 支持两位或三位毫秒的时间格式
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
  // 只保留有用的元信息，过滤掉 offset 等
  const metaRegex = /\[(ti|ar|al|by|au):(.+)\]/i;

  const result: LyricLine[] = [];

  // 第一步：先解析所有歌词行（保持文件原始顺序）
  // 关键：过滤掉时间戳后为空的行！
  const validLyricLines: { time: number; text: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // 检测元信息标签
    const metaMatch = line.match(metaRegex);
    if (metaMatch) {
      const metaKey = metaMatch[1].toLowerCase();
      const metaValue = metaMatch[2].trim();
      let metaLabel = '';
      switch (metaKey) {
        case 'ti': metaLabel = '歌曲'; break;
        case 'ar': metaLabel = '艺术家'; break;
        case 'al': metaLabel = '专辑'; break;
        case 'by': metaLabel = '歌词'; break;
        case 'au': metaLabel = '作曲'; break;
      }
      if (metaLabel && metaValue && !metaValue.includes('好听音乐网')) {
        // 元信息使用很小的负数时间，确保排在歌词前面但不会互相乱序
        result.push({ time: -999999 + result.length, text: `${metaLabel}: ${metaValue}`, isMeta: true });
      }
      continue;
    }

    const matches = [...line.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = line.replace(timeRegex, '');
      // 过滤掉：空行、其他标签行、广告、制作信息
      if (text && !text.startsWith('[') && !text.includes('好听音乐网')) {
        for (const match of matches) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const ms = parseInt(match[3].padEnd(3, '0'));
          const time = minutes * 60 + seconds + ms / 1000;
          validLyricLines.push({ time, text });
        }
      }
    }
  }

  // 第二步：处理歌词
  if (isBilingual && validLyricLines.length > 0) {
    // 双语 LRC 核心格式：
    // 过滤空行后，严格按文件原始顺序交替出现！
    // 第0行 = 原文1，第1行 = 原文1的译文
    // 第2行 = 原文2，第3行 = 原文2的译文
    // ...以此类推
    // 完全不关心时间戳是否相同！

    let i = 0;
    while (i < validLyricLines.length) {
      const originalLine = validLyricLines[i];

      // 如果还有下一行，配对（原文 + 译文）
      if (i + 1 < validLyricLines.length) {
        const translationLine = validLyricLines[i + 1];
        // 使用原文行的时间戳作为显示时间
        result.push({
          time: originalLine.time,
          text: originalLine.text,
          translation: translationLine.text,
          isMeta: false
        });
        i += 2;
      } else {
        // 最后一行，单独添加
        result.push({ time: originalLine.time, text: originalLine.text, isMeta: false });
        i += 1;
      }
    }
  } else {
    // 非双语，直接按时间戳排序添加
    for (const line of validLyricLines) {
      result.push({ time: line.time, text: line.text, isMeta: false });
    }
    // 排序确保顺序正确
    result.sort((a, b) => a.time - b.time);
  }

  return result;
};

// 加载歌词
const loadLyrics = async () => {
  const lrcPath = playbackState?.currentMusic?.lrcUrl || playbackState?.currentMusic?.lrc;
  if (!lrcPath) {
    parsedLyrics.value = [];
    return;
  }

  try {
    isLoadingLyrics.value = true;
    const response = await fetch(lrcPath);
    const text = await response.text();
    rawLyrics.value = text;
    parsedLyrics.value = parseLyrics(text, playbackState.currentMusic.bilingual || false);
  } catch (error) {
    console.error('加载歌词失败:', error);
    parsedLyrics.value = [];
  } finally {
    isLoadingLyrics.value = false;
  }
};

// 切换自动播放
const toggleAutoPlay = () => {
  autoPlayEnabled.value = !autoPlayEnabled.value;
};

// 打开歌词弹窗
const openLyrics = async () => {
  showLyricsModal.value = true;
  await loadLyrics();
  await nextTick();
  scrollToCurrentLyric();
};

// 关闭歌词弹窗
const closeLyrics = () => {
  showLyricsModal.value = false;
};

// 滚动到当前歌词
const scrollToCurrentLyric = () => {
  if (!lyricsContainer.value || isUserScrolling.value) return;
  const activeElement = lyricsContainer.value.querySelector('.lyrics-line.active');
  if (activeElement) {
    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// 处理用户滚动
const handleLyricScroll = () => {
  isUserScrolling.value = true;

  // 清除之前的定时器
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer);
  }

  // 滚动停止1秒后恢复自动滚动
  scrollDebounceTimer = window.setTimeout(() => {
    isUserScrolling.value = false;
    scrollToCurrentLyric();
  }, 1000);
};

// 监听播放时间，更新当前歌词
watch(() => playbackState?.currentTime, (newTime) => {
  if (newTime === undefined || newTime === null || parsedLyrics.value.length === 0) return;

  let index = parsedLyrics.value.findIndex(line => line.time > newTime);
  if (index === -1) {
    currentLyricIndex.value = parsedLyrics.value.length - 1;
  } else if (index > 0) {
    currentLyricIndex.value = index - 1;
  }

  if (showLyricsModal.value) {
    scrollToCurrentLyric();
  }
});

// 监听当前歌曲变化，重新加载歌词
watch(() => playbackState?.currentMusic?.id, () => {
  currentLyricIndex.value = 0;
  parsedLyrics.value = [];
  if (showLyricsModal.value) {
    loadLyrics();
  }
});

// 切换播放/暂停
const togglePlay = () => {
  const audio = document.querySelector('audio') as HTMLAudioElement;
  if (!audio || !playbackState) return;
  if (audio.paused) {
    audio.play();
    playbackState.isPlaying = true;
  } else {
    audio.pause();
    playbackState.isPlaying = false;
  }
  setupAudioEndListener();
};

// 上一首
const prevTrack = () => {
  if (!playbackState || !musicList) return;
  const filtered = filteredMusic.value;
  const currentIndex = filtered.findIndex(m => m.id === playbackState.currentMusic.id);
  if (currentIndex < 0) return;
  const prevIndex = currentIndex === 0 ? filtered.length - 1 : currentIndex - 1;
  const prevMusic = filtered[prevIndex];
  togglePlayItem(prevMusic);
};

// 下一首
const nextTrack = () => {
  if (!playbackState || !musicList) return;
  const filtered = filteredMusic.value;
  const currentIndex = filtered.findIndex(m => m.id === playbackState.currentMusic.id);
  if (currentIndex < 0) return;
  const nextIndex = currentIndex === filtered.length - 1 ? 0 : currentIndex + 1;
  const nextMusic = filtered[nextIndex];
  togglePlayItem(nextMusic);
};

// 点击列表项播放
const togglePlayItem = (music: MusicItem) => {
  if (!playbackState) return;
  playbackState.currentMusic = music;
  const audio = document.querySelector('audio') as HTMLAudioElement;
  playbackState.isPlaying = true;
  audio.load();

  // 只添加一次 canplay 监听器
  const onCanPlay = () => {
    audio.play();
    audio.removeEventListener('canplay', onCanPlay);
  };
  audio.addEventListener("canplay", onCanPlay);

  setupAudioEndListener();
};

// 歌曲结束自动播放下一首
let audioEndHandler: ((this: HTMLAudioElement, ev: Event) => any) | null = null;
let currentAudioRef: HTMLAudioElement | null = null;

const setupAudioEndListener = () => {
  const audio = document.querySelector('audio') as HTMLAudioElement;
  if (!audio) return;

  // 移除旧监听器（如果有）
  if (audioEndHandler && currentAudioRef) {
    currentAudioRef.removeEventListener('ended', audioEndHandler);
    audioEndHandler = null;
  }

  // 总是添加新监听器（确保引用最新的 autoPlayEnabled）
  audioEndHandler = () => {
    if (autoPlayEnabled.value) {
      nextTrack();
    }
  };
  audio.addEventListener('ended', audioEndHandler);
  currentAudioRef = audio;
};

// 计算百分比并跳转
const seekTo = (event: MouseEvent) => {
  if (!playbackState || !playbackState.duration) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const audio = document.querySelector('audio') as HTMLAudioElement;
  const newTime = percent * (playbackState.duration || 0);
  audio.currentTime = newTime;
  playbackState.currentTime = newTime;
};

// 拖拽进度
const isDragging = ref(false);

const startDrag = (event: MouseEvent) => {
  if (!playbackState || !playbackState.duration) return;
  isDragging.value = true;
  seekTo(event);

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging.value) {
      seekTo(moveEvent);
    }
  };

  const onMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// 设置当前分类
const setCategory = (category: string) => {
  currentCategory.value = category;
};
// 计算过滤后的音乐列表
const filteredMusic = computed(() => {
  if (!musicList) return [];
  if (currentCategory.value === "all") {
    return musicList;
  }
  return musicList.filter((m: MusicItem) => {
    return m.category.includes(currentCategory.value as MusicCategoryTag);
  });
});

// 组件挂载后设置结束监听
setupAudioEndListener();
</script>

<style scoped>
.music-collection {
  margin: 0 auto;
  padding: 2rem 1.5rem;
  max-width: 900px;
}

/* 标题样式 */
h1 {
  font-family: "Oswald", "站酷高端黑", sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "「一浪知海，一澜见心」";
  display: block;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  font-family: "Noto Serif SC", serif;
  color: #666666;
}

/* 当前播放占位栏 */
.current-player-placeholder {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin-bottom: 20px;
  background: rgba(220, 20, 60, 0.08);
  border: 1px solid rgba(220, 20, 60, 0.25);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(220, 20, 60, 0.1);
}

.cp-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cp-cover {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.cp-cover-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cp-cover-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cp-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cp-top {
  display: flex;
  justify-content: center;
}

.cp-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.cp-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cp-album {
  font-size: 0.85rem;
  color: #666666;
}

.cp-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.cp-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #dc143c;
  cursor: pointer;
  border-radius: 50%;
  padding: 4px;
  transition: all 0.2s ease;
}

.cp-controls .cp-control-btn-autoplay {
  color: #999;
}

.cp-controls .cp-control-btn-autoplay.active {
  color: #dc143c;
}

.cp-control-btn:hover {
  opacity: 0.6;
}

.cp-control-btn.cp-play-main {
  padding: 6px;
}

.cp-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cp-progress .time-left,
.cp-progress .time-right {
  font-size: 0.8rem;
  color: #666666;
  min-width: 36px;
  text-align: center;
}

.cp-progress .progress-bar {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cp-progress .progress-bar:hover {
  height: 4px;
}

.cp-progress .progress-bar .bar-background {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: rgba(220, 20, 60, 0.2);
}

.cp-progress .progress-bar .bar-filled {
  position: relative;
  height: 100%;
  border-radius: 2px;
  background: rgba(220, 20, 60, 0.8);
  transition: width 0.1s linear;
}

.cp-progress .progress-bar .bar-filled .dot {
  position: absolute;
  right: -3px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(220, 20, 60, 0.9);
  opacity: 1;
  transition: transform 0.2s ease;
}

.cp-progress .progress-bar:hover .bar-filled .dot {
  transform: translateY(-50%) scale(1.3);
}

@keyframes rotate {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 3px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666666;
  background: transparent;
}

.filter-btn:hover, .filter-btn.active {
  background: rgba(220, 20, 60, 0.2);
  border-color: rgba(220, 20, 60, 0.8);
  box-shadow: 0 3px 15px 2px rgba(220, 20, 60, 0.2);
}

.music-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.music-header {
  display: none;
}

.music-card {
  position: relative;
  display: flex;
  align-items: center;
  height: 72px;
  padding: 10px 16px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.3s ease backwards;
}

.music-card:nth-child(1) { animation-delay: 0.05s; }
.music-card:nth-child(2) { animation-delay: 0.1s; }
.music-card:nth-child(3) { animation-delay: 0.15s; }
.music-card:nth-child(4) { animation-delay: 0.2s; }
.music-card:nth-child(5) { animation-delay: 0.25s; }
.music-card:nth-child(6) { animation-delay: 0.3s; }

@media (hover: hover) and (pointer: fine) {
  .music-card:hover {
    background: #f5f5f5;
    border-color: rgba(220, 20, 60, 0.3);
    box-shadow: 0 4px 12px rgba(220, 20, 60, 0.15);
    transform: translateY(-2px);
  }
}

.music-card-playing {
  background: rgba(220, 20, 60, 0.15);
  border: 1px solid rgba(220, 20, 60, 0.35);
  box-shadow: 0 8px 32px rgba(220, 20, 60, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform: scale(1.02);
}

.music-card-playing .music-cover img {
  animation: rotate 10s infinite linear;
}

.music-card-playing::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(220, 20, 60, 0.8);
  animation: pulse 2s ease-in-out infinite;
}

.music-index {
  width: 36px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #999999;
}

.music-card-playing .music-index {
  color: #dc143c;
  font-weight: bold;
}

.music-cover {
  width: 52px;
  height: 52px;
  min-width: 52px;
  overflow: hidden;
  border-radius: 26px;
  background: #f0f0f0;
  position: relative;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .music-card:hover .play-overlay {
    opacity: 1;
  }
}

.music-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.music-info {
  width: 140px;
  padding-left: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.music-info span {
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-info span:first-child {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.music-info span:last-child {
  font-size: 0.85rem;
  color: #666666;
}

.music-album {
  flex: 1;
  padding-left: 16px;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  color: #666666;
}

.music-date {
  width: 80px;
  margin-left: 16px;
  font-size: 0.85rem;
  color: #999999;
}

/* 暗色主题适配 */
html.dark h1 {
  color: #f0f0f0;
}

html.dark h1::after {
  color: #aaaaaa;
}

html.dark .filter-btn {
  color: #aaaaaa;
}

html.dark .filter-btn:hover {
  color: #f0f0f0;
  background: #2a2a2a;
}

html.dark .music-card {
  background: #242424;
  border-color: #3a3a3a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

@media (hover: hover) and (pointer: fine) {
  html.dark .music-card:hover {
    background: #2a2a2a;
    box-shadow: 0 4px 12px rgba(220, 20, 60, 0.25);
  }
}

html.dark .music-card-playing {
  background: rgba(220, 20, 60, 0.25);
  border: 1px solid rgba(220, 20, 60, 0.45);
  box-shadow: 0 8px 32px rgba(220, 20, 60, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

html.dark .music-index {
  color: #777777;
}

html.dark .music-cover {
  background: #333333;
}

html.dark .music-info span:first-child {
  color: #f0f0f0;
}

html.dark .music-info span:last-child {
  color: #aaaaaa;
}

html.dark .music-album {
  color: #aaaaaa;
}

html.dark .music-date {
  color: #777777;
}

html.dark .music-duration {
  color: #f0f0f0;
}

html.dark .music-header-duration svg {
  fill: #aaaaaa;
}

html.dark .current-player-placeholder {
  background: rgba(220, 20, 60, 0.2);
  border: 1px solid rgba(220, 20, 60, 0.4);
}

html.dark .cp-title {
  color: #f0f0f0;
}

html.dark .cp-album {
  color: #aaaaaa;
}

html.dark .cp-control-btn {
  color: #dc143c;
}

html.dark .cp-control-btn:hover {
  opacity: 0.6;
}

html.dark .cp-controls .cp-control-btn-autoplay {
  color: #888;
}

html.dark .cp-controls .cp-control-btn-autoplay.active {
  color: #dc143c;
}

html.dark .cp-progress .time-left,
html.dark .cp-progress .time-right {
  color: #aaaaaa;
}

html.dark .cp-progress .progress-bar .bar-background {
  background: rgba(220, 20, 60, 0.25);
}
html.dark .cp-progress .progress-bar .bar-filled {
  background: rgba(220, 20, 60, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-collection {
    padding: 1rem 0.75rem;
  }

  h1 {
    font-size: 2rem;
  }

  .filter-bar {
    gap: 4px;
  }

  .filter-btn {
    padding: 5px 14px;
    font-size: 0.85rem;
  }

  .music-card {
    height: 64px;
    padding: 8px 12px;
  }

  .music-info {
    width: 120px;
  }

  .music-album {
    display: none;
  }

  .music-date {
    display: none;
  }

  .current-player-placeholder {
    flex-direction: column;
    padding: 12px;
    margin-bottom: 16px;
  }

  .cp-left {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .cp-cover {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }

  .cp-info-mobile {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  .cp-info-desktop {
    display: none;
  }

  .cp-title {
    font-size: 0.9rem;
  }

  .cp-author {
    font-size: 0.75rem;
  }

  .cp-right {
    width: 100%;
  }

  .cp-controls {
    justify-content: center;
  }

  .cp-control-btn {
    padding: 3px;
  }

  .cp-control-btn:hover {
    opacity: 1;
  }

  .cp-control-btn.cp-play-main {
    padding: 5px;
  }
}

@media (max-width: 480px) {
  .music-info {
    width: 100px;
  }

  .cp-cover {
    width: 56px;
    height: 56px;
  }
}

.cp-author {
  font-size: 0.85rem;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


html.dark .cp-author {
  color: #aaaaaa;
}

/* 歌词弹窗 */
.lyrics-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.lyrics-modal {
  background: var(--vp-c-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dark .lyrics-modal {
  background: var(--vp-c-bg-soft);
}

.lyrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.lyrics-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.lyrics-close {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.lyrics-close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.lyrics-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.lyrics-empty {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 40px 0;
}

.lyrics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: #dc143c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lyrics-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lyrics-line {
  text-align: center;
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
}

.lyrics-line.active {
  color: #dc143c;
  transform: scale(1.05);
  font-weight: 500;
}

.lyrics-line.lyrics-meta {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  opacity: 0.8;
  transform: none;
  font-weight: normal;
  padding: 4px 0;
}

.lyrics-line-text {
  font-size: 1rem;
  line-height: 1.6;
}

.lyrics-line-trans {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
  line-height: 1.5;
}

.lyrics-line.active .lyrics-line-trans {
  color: rgba(220, 20, 60, 0.7);
}

/* 歌词滚动条样式 */
.lyrics-content::-webkit-scrollbar {
  width: 6px;
}

.lyrics-content::-webkit-scrollbar-track {
  background: transparent;
}

.lyrics-content::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.lyrics-content::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-divider-dark);
}
</style>
