<template>
  <div class="music-collection">
    <h1>🎧
      听海观澜</h1>
      <!-- 当前播放占位播放器样式 -->
      <div class="current-player-placeholder" v-if="playbackState?.currentMusic">
        <div class="cp-left">
          <div class="cp-cover">
            <div class="cp-cover-inner">
              <img :src="playbackState.currentMusic.cover" />
            </div>
          </div>
        </div>
        <div class="cp-right">
          <div class="cp-top">
            <div class="cp-info">
              <div class="cp-title">{{ playbackState.currentMusic.title }} - {{ playbackState.currentMusic.author }}</div>
              <div class="cp-album">{{ playbackState.currentMusic.album }}</div>
            </div>
            <div class="cp-controls">
              <button class="cp-control-btn" @click="prevTrack">
                <svg viewBox="0 0 1024 1024" width="24" height="24">
                  <path d="M98.31 483.06L654.05 162.2c22.43-12.95 50.47 3.24 50.47 29.14v641.71c0 25.9-28.04 42.09-50.47 29.14L98.31 541.34c-22.43-12.95-22.43-45.33 0-58.28z" fill="currentColor" p-id="4485"></path>
                  <path d="M653.42 505.91L929.92 156c5.97-7.56 18.12-3.33 18.12 6.3v699.82c0 9.63-12.15 13.85-18.12 6.3L653.42 518.5a10.17 10.17 0 0 1 0-12.59z" fill="currentColor" p-id="4486"></path>
                </svg>
              </button>
              <button class="cp-control-btn cp-play-main" @click="togglePlay">
                <svg v-if="!playbackState.isPlaying" viewBox="0 0 1024 1024" width="28" height="28">
                  <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor" p-id="1548"></path>
                  <path d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z" fill="var(--vp-c-bg-alt)" p-id="1549"></path>
                </svg>
                <svg v-else viewBox="0 0 1024 1024" width="28" height="28">
                  <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor" p-id="1717"></path>
                   <path d="M441.73 704.57H404.8c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.06 24.72-24.72 24.72zM619.12 704.57h-36.93c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.07 24.72-24.72 24.72z" fill="var(--vp-c-bg-alt)" p-id="1718"></path>
                </svg>
              </button>
              <button class="cp-control-btn" @click="nextTrack">
                <svg viewBox="0 0 1024 1024" width="24" height="24">
                  <path d="M925.61 483.06L369.88 162.21c-22.43-12.95-50.47 3.24-50.47 29.14v641.71c0 25.9 28.04 42.09 50.47 29.14l555.74-320.86c22.43-12.95 22.43-45.33-0.01-58.28z" fill="currentColor" p-id="1383"></path>
                  <path d="M370.5 505.91L94 156c-5.97-7.56-18.12-3.33-18.12 6.3v699.82c0 9.63 12.15 13.85 18.12 6.3L370.5 518.5c2.92-3.69 2.92-8.9 0-12.59z" fill="currentColor" p-id="1384"></path>
                </svg>
              </button>
            </div>
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
import { ref, computed, inject } from "vue";
import type { MusicItem } from "../../data/musicData";

// 播放状态接口
interface PlaybackState {
  currentMusic: MusicItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "流行", value: "pop" },
  { label: "摇滚", value: "rock" },
  { label: "电子", value: "electronic" },
  { label: "日语", value: "jp" },
];
// 当前选中的分类
const currentCategory = ref("all");
// 音乐列表
const musicList = inject<MusicItem[]>("music-list");
// 音乐播放状态
const playbackState = inject<PlaybackState>("playback-state");

const slider = computed(() => ({
  width: playbackState?.duration ? `${(playbackState.currentTime / playbackState.duration) * 100}%` : "0%",
}));

// 格式化时间
const formatter = (value: number) => {
  return `${Math.floor(value / 60)}:${Math.floor(value % 60) < 10 ? "0" + Math.floor(value % 60) : Math.floor(value % 60)}`;
};

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
  audio.addEventListener("canplay", () => {
    audio.play();
  });
};

// 计算百分比并跳转
const seekTo = (event: MouseEvent) => {
  if (!playbackState || !playbackState.duration) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const audio = document.querySelector('audio') as HTMLAudioElement;
  const newTime = percent * playbackState.duration;
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
  return musicList.filter((m: MusicItem) => m.category === currentCategory.value);
});
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
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 20px;
  background: rgba(220, 20, 60, 0.08);
  border: 1px solid rgba(220, 20, 60, 0.25);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(220, 20, 60, 0.1);
}

.cp-left {
  flex-shrink: 0;
}

.cp-cover {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.cp-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cp-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cp-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.cp-album {
  font-size: 0.8rem;
  color: #666666;
}

.cp-controls {
  display: flex;
  align-items: center;
  gap: 4px;
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
  padding: 6px;
  transition: all 0.2s ease;
}

.cp-control-btn:hover {
  opacity: 0.6;
}

.cp-control-btn.cp-play-main {
  width: 36px;
  height: 36px;
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
    align-self: center;
  }

  .cp-cover {
    width: 56px;
    height: 56px;
  }

  .cp-right {
    width: 100%;
  }

  .cp-top {
    gap: 8px;
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

  .cp-progress .time-left,
  .cp-progress .time-right {
    display: none;
  }
}
</style>
