<template>
  <div class="music-collection">
    <h1>🎧 听海观澜</h1>
    <CurrentPlayerPlaceholder
      :playback-state="playbackState"
      :auto-play-enabled="autoPlayEnabled"
      @prev="prevTrack"
      @next="nextTrack"
      @toggle-play="togglePlay"
      @toggle-autoplay="toggleAutoPlay"
      @open-lyrics="openLyrics"
      @seek="seekToTime"
      @drag-change="isDragging = $event"
    />
    <LyricsModal
      :show="showLyricsModal"
      :current-music="playbackState?.currentMusic"
      :current-time="playbackState?.currentTime || 0"
      :duration="playbackState?.duration || 0"
      :is-dragging="isDragging"
      :is-playing="playbackState?.isPlaying || false"
      :auto-play-enabled="autoPlayEnabled"
      @close="closeLyrics"
      @seek="seekToTime"
      @prev="prevTrack"
      @next="nextTrack"
      @toggle-play="togglePlay"
      @toggle-autoplay="toggleAutoPlay"
    />
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
          <img :src="music.cover" :alt="music.title" />
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
import { ref, computed, inject, onMounted, onUnmounted } from "vue";
import type { MusicItem } from "../../data/musicData";
import { MUSIC_CATEGORY_FILTERS, MusicCategoryTag } from "../../data/musicData";
import type { PlaybackState } from "../../store";
import CurrentPlayerPlaceholder from "../components/CurrentPlayerPlaceholder.vue";
import LyricsModal from "../components/LyricsModal.vue";

const categories = MUSIC_CATEGORY_FILTERS;
const currentCategory = ref("all");
const musicList = inject<MusicItem[]>("music-list");
const playbackState = inject<PlaybackState>("playback-state");

const autoPlayEnabled = ref(true);
const showLyricsModal = ref(false);
const isDragging = ref(false);

const toggleAutoPlay = () => {
  autoPlayEnabled.value = !autoPlayEnabled.value;
};

const openLyrics = () => {
  showLyricsModal.value = true;
};

const closeLyrics = () => {
  showLyricsModal.value = false;
};

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

const prevTrack = () => {
  if (!playbackState || !musicList) return;
  const filtered = filteredMusic.value;
  const currentIndex = filtered.findIndex(m => m.id === playbackState.currentMusic?.id);
  if (currentIndex < 0) return;
  const prevIndex = currentIndex === 0 ? filtered.length - 1 : currentIndex - 1;
  const prevMusic = filtered[prevIndex];
  togglePlayItem(prevMusic);
};

const nextTrack = () => {
  if (!playbackState || !musicList) return;
  const filtered = filteredMusic.value;
  const currentIndex = filtered.findIndex(m => m.id === playbackState.currentMusic?.id);
  if (currentIndex < 0) return;
  const nextIndex = currentIndex === filtered.length - 1 ? 0 : currentIndex + 1;
  const nextMusic = filtered[nextIndex];
  togglePlayItem(nextMusic);
};

let canPlayListener: (() => void) | null = null;
let loadedMetaListener: (() => void) | null = null;

const togglePlayItem = (music: MusicItem) => {
  if (!playbackState) return;
  const audio = document.querySelector('audio') as HTMLAudioElement;
  if (!audio) return;

  if (canPlayListener) {
    audio.removeEventListener('canplaythrough', canPlayListener);
    canPlayListener = null;
  }
  if (loadedMetaListener) {
    audio.removeEventListener('loadedmetadata', loadedMetaListener);
    loadedMetaListener = null;
  }

  playbackState.currentMusic = music;
  playbackState.isPlaying = true;
  playbackState.currentTime = 0;

  audio.load();

  canPlayListener = () => {
    audio.play().catch(err => {
      console.log('自动播放被阻止，等待用户交互:', err);
    });
    audio.removeEventListener('canplaythrough', canPlayListener!);
    canPlayListener = null;
  };
  audio.addEventListener("canplaythrough", canPlayListener);

  loadedMetaListener = () => {
    if (playbackState.isPlaying && audio.readyState >= 2) {
      audio.play().catch(() => {});
    }
    audio.removeEventListener('loadedmetadata', loadedMetaListener!);
    loadedMetaListener = null;
  };
  audio.addEventListener("loadedmetadata", loadedMetaListener);

  setupAudioEndListener();
};

let audioEndHandler: ((this: HTMLAudioElement, ev: Event) => any) | null = null;
let currentAudioRef: HTMLAudioElement | null = null;

const setupAudioEndListener = () => {
  const audio = document.querySelector('audio') as HTMLAudioElement;
  if (!audio) return;

  if (audioEndHandler && currentAudioRef) {
    currentAudioRef.removeEventListener('ended', audioEndHandler);
    audioEndHandler = null;
  }

  audioEndHandler = () => {
    if (autoPlayEnabled.value) {
      nextTrack();
    }
  };
  audio.addEventListener('ended', audioEndHandler);
  currentAudioRef = audio;
};

const seekToTime = (time: number) => {
  if (!playbackState) return;
  const audio = document.querySelector('audio') as HTMLAudioElement;
  if (!audio) return;
  audio.currentTime = time;
  playbackState.currentTime = time;
};

const setCategory = (category: string) => {
  currentCategory.value = category;
};

const filteredMusic = computed(() => {
  if (!musicList) return [];
  if (currentCategory.value === "all") {
    return musicList;
  }
  return musicList.filter((m: MusicItem) => {
    return m.category.includes(currentCategory.value as MusicCategoryTag);
  });
});

onMounted(() => {
  setupAudioEndListener();
});

onUnmounted(() => {
  if (audioEndHandler && currentAudioRef) {
    currentAudioRef.removeEventListener('ended', audioEndHandler);
  }
});
</script>

<style scoped>
.music-collection {
  margin: 0 auto;
  padding: 2rem 1.5rem;
  max-width: 900px;
}

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
}

@media (max-width: 480px) {
  .music-info {
    width: 100px;
  }
}
</style>
