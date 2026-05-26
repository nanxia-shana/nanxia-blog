<template>
  <div v-if="show" class="lyrics-modal-overlay" @click.self="emit('close')">
    <div class="lyrics-modal">
      <div
        v-if="currentMusic?.cover"
        class="lyrics-cover-bg"
        :style="{ backgroundImage: `url(${currentMusic.cover})` }"
      ></div>
      <div class="lyrics-modal-mask"></div>
      <div class="lyrics-header">
        <div class="lyrics-song">
          <div class="lyrics-title">{{ currentMusic?.title || '歌词' }}</div>
          <div v-if="currentMusic?.author" class="lyrics-author">{{ currentMusic.author }}</div>
        </div>
        <button class="lyrics-close" @click="emit('close')">
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M557.312 513.248l265.28-263.904a32 32 0 1 0-45.312-45.248L512 468.096 246.72 204.096a32 32 0 0 0-45.312 45.248l265.28 263.904-265.28 263.904a32 32 0 1 0 45.312 45.248L512 558.4l265.28 263.904a32 32 0 1 0 45.312-45.248l-265.28-263.904z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="lyrics-player-controls">
        <button class="lyrics-control-btn" @click="emit('prev')" title="上一首">
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M98.31 483.06L654.05 162.2c22.43-12.95 50.47 3.24 50.47 29.14v641.71c0 25.9-28.04 42.09-50.47 29.14L98.31 541.34c-22.43-12.95-22.43-45.33 0-58.28z" fill="currentColor"></path>
            <path d="M653.42 505.91L929.92 156c5.97-7.56 18.12-3.33 18.12 6.3v699.82c0 9.63-12.15 13.85-18.12 6.3L653.42 518.5a10.17 10.17 0 0 1 0-12.59z" fill="currentColor"></path>
          </svg>
        </button>
        <button class="lyrics-control-btn lyrics-play-btn" @click="emit('toggle-play')" title="播放/暂停">
          <svg v-if="!isPlaying" viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor"></path>
            <path d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z" fill="var(--vp-c-bg-alt)"></path>
          </svg>
          <svg v-else viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor"></path>
            <path d="M441.73 704.57H404.8c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.06 24.72-24.72 24.72zM619.12 704.57h-36.93c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.07 24.72-24.72 24.72z" fill="var(--vp-c-bg-alt)"></path>
          </svg>
        </button>
        <button class="lyrics-control-btn" @click="emit('next')" title="下一首">
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M925.61 483.06L369.88 162.21c-22.43-12.95-50.47 3.24-50.47 29.14v641.71c0 25.9 28.04 42.09 50.47 29.14l555.74-320.86c22.43-12.95 22.43-45.33-0.01-58.28z" fill="currentColor"></path>
            <path d="M370.5 505.91L94 156c-5.97-7.56-18.12-3.33-18.12 6.3v699.82c0 9.63 12.15 13.85 18.12 6.3L370.5 518.5c2.92-3.69 2.92-8.9 0-12.59z" fill="currentColor"></path>
          </svg>
        </button>
        <button class="lyrics-control-btn lyrics-autoplay-btn" :class="{ active: autoPlayEnabled }" @click="emit('toggle-autoplay')" title="自动播放">
          <svg viewBox="0 0 1163 1024" width="20" height="20">
            <path d="M134.86 410.152c-27.902-9.3-41.853-41.853-32.552-69.755 93.007-265.07 381.33-404.581 641.75-311.574 144.16 51.154 255.77 167.413 306.923 311.574h111.609L1004.478 503.16 846.366 340.397h88.356C851.016 154.383 641.75 61.375 451.085 131.131A404.581 404.581 0 0 0 204.615 377.6c-9.3 27.902-41.852 41.853-69.755 32.552z m878.919 199.966c27.902 9.3 41.853 41.853 32.552 69.755-46.504 130.21-134.86 232.518-255.77 292.973-65.105 32.553-139.51 51.154-213.916 51.154-55.805 0-111.609-9.3-167.413-27.902-144.161-51.154-255.77-162.763-306.924-306.924v-4.65H0L158.112 521.76l158.112 162.763h-97.657C302.273 870.538 516.19 963.545 711.505 893.79c111.609-41.853 199.966-130.21 237.168-246.47 9.301-32.552 37.203-46.503 65.106-37.202zM520.84 293.893c9.301 0 18.602 4.65 23.252 9.301l209.266 181.364c13.951 13.951 18.602 37.203 4.65 55.805l-4.65 4.65-209.266 181.364c-13.95 13.951-41.853 13.951-55.804-4.65-4.65-4.65-9.3-13.951-9.3-23.252V331.096c4.65-18.601 18.6-37.203 41.852-37.203z" fill="currentColor"></path>
          </svg>
        </button>
      </div>
      <div class="lyrics-progress">
        <div class="lyrics-time">{{ formatter(currentTime) }}</div>
        <div class="lyrics-progress-bar" @click="seekByProgress" @mousedown="startProgressDrag">
          <div class="lyrics-progress-track">
            <div class="lyrics-progress-filled" :style="{ width: progressWidth }">
              <div class="lyrics-progress-dot"></div>
            </div>
          </div>
        </div>
        <div class="lyrics-time">{{ formatter(duration || 0) }}</div>
      </div>
      <div
        class="lyrics-content"
        ref="lyricsContainer"
        @wheel.prevent="handleLyricScroll"
        @touchstart.passive="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div v-if="isLoadingLyrics" class="lyrics-loading">
          <div class="loading-spinner"></div>
          <span>加载中...</span>
        </div>
        <div v-else-if="parsedLyrics.length === 0" class="lyrics-empty">
          暂无歌词
        </div>
        <div
          v-else
          class="lyrics-list-wrapper"
          :style="{ transform: `translateY(${lyricsOffset + userScrollDelta}px)`, transition: isUserScrolling || isDragging ? 'none' : 'transform 0.3s ease-out' }"
        >
          <div class="lyrics-list">
            <div
              v-for="(line, index) in parsedLyrics"
              :key="index"
              :class="[
                'lyrics-line',
                {
                  active: !line.isMeta && currentLyricIndex === index,
                  'lyrics-meta': line.isMeta,
                  'line-near': !line.isMeta && Math.abs(currentLyricIndex - index) <= 2,
                  'line-hover': hoveredLineIndex === index
                }
              ]"
              :data-index="index"
              @mouseenter="handleLineMouseEnter(index)"
              @mouseleave="handleLineMouseLeave"
              @click="handleLineClick(index)"
            >
              <div class="lyrics-line-text">{{ line.text }}</div>
              <div v-if="line.translation" class="lyrics-line-trans">{{ line.translation }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { MusicItem } from "../../data/musicData";
import { parseLyrics, type LyricLine } from "../utils/lyrics";

interface PrecomputedLine {
  index: number;
  offsetTop: number;
  offsetHeight: number;
}

const props = defineProps<{
  show: boolean;
  currentMusic: MusicItem | null | undefined;
  currentTime: number;
  duration: number;
  isDragging: boolean;
  isPlaying: boolean;
  autoPlayEnabled: boolean;
}>();

const emit = defineEmits<{
  close: [];
  seek: [time: number];
  prev: [];
  next: [];
  'toggle-play': [];
  'toggle-autoplay': [];
}>();

const parsedLyrics = ref<LyricLine[]>([]);
const currentLyricIndex = ref(0);
const lyricsContainer = ref<HTMLElement | null>(null);
const lyricsOffset = ref(0);
const userScrollDelta = ref(0);
const rawLyrics = ref('');
const isUserScrolling = ref(false);
let scrollDebounceTimer: number | null = null;
const isLoadingLyrics = ref(false);
const precomputedLines = ref<PrecomputedLine[]>([]);
const hoveredLineIndex = ref<number | null>(null);
const containerHeight = ref(0);
let precomputeRetryCount = 0;
let touchStartY = 0;
let resizeTimer: number | null = null;
let progressDragging = false;

const progressWidth = computed(() => {
  return props.duration ? `${(props.currentTime / props.duration) * 100}%` : "0%";
});

const formatter = (value: number) => {
  return `${Math.floor(value / 60)}:${Math.floor(value % 60) < 10 ? "0" + Math.floor(value % 60) : Math.floor(value % 60)}`;
};

const seekByProgress = (event: MouseEvent) => {
  if (!props.duration) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  emit('seek', percent * props.duration);
};

const startProgressDrag = (event: MouseEvent) => {
  if (!props.duration) return;
  progressDragging = true;
  seekByProgress(event);

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (progressDragging) {
      seekByProgress(moveEvent);
    }
  };

  const onMouseUp = () => {
    progressDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const loadLyrics = async () => {
  const lrcPath = props.currentMusic?.lrcUrl || props.currentMusic?.lrc;
  if (!lrcPath) {
    parsedLyrics.value = [];
    return;
  }

  try {
    isLoadingLyrics.value = true;
    const response = await fetch(lrcPath);
    const text = await response.text();
    rawLyrics.value = text;
    parsedLyrics.value = parseLyrics(text, props.currentMusic?.bilingual || false);
    await nextTick();
    await precomputeLayout();
  } catch (error) {
    console.error('加载歌词失败:', error);
    parsedLyrics.value = [];
  } finally {
    isLoadingLyrics.value = false;
  }
};

const precomputeLayout = async () => {
  await nextTick();
  await nextTick();

  if (!lyricsContainer.value) {
    if (precomputeRetryCount < 5) {
      precomputeRetryCount++;
      setTimeout(() => precomputeLayout(), 100);
    }
    return;
  }

  const container = lyricsContainer.value;
  containerHeight.value = container.clientHeight;

  if (containerHeight.value === 0) {
    if (precomputeRetryCount < 5) {
      precomputeRetryCount++;
      setTimeout(() => precomputeLayout(), 100);
    }
    return;
  }

  const lyricElements = container.querySelectorAll('.lyrics-line') as NodeListOf<HTMLElement>;

  if (lyricElements.length === 0) {
    if (precomputeRetryCount < 5) {
      precomputeRetryCount++;
      setTimeout(() => precomputeLayout(), 100);
    }
    return;
  }

  precomputeRetryCount = 0;

  precomputedLines.value = Array.from(lyricElements).map((el, index) => ({
    index,
    offsetTop: el.offsetTop,
    offsetHeight: el.offsetHeight,
  }));

  updateLyricsOffset();
};

const updateLyricsOffset = () => {
  if (precomputedLines.value.length > 0) {
    const line = precomputedLines.value[currentLyricIndex.value];
    if (line) {
      lyricsOffset.value = containerHeight.value / 2 - line.offsetTop - line.offsetHeight / 2;
      return;
    }
  }

  if (!lyricsContainer.value) return;
  const container = lyricsContainer.value;
  const height = container.clientHeight;
  const lyricElements = container.querySelectorAll('.lyrics-line');
  const currentElement = lyricElements[currentLyricIndex.value] as HTMLElement;

  if (currentElement) {
    const elementTop = currentElement.offsetTop;
    const elementHeight = currentElement.offsetHeight;
    lyricsOffset.value = height / 2 - elementTop - elementHeight / 2;
  }
};

const handleLineMouseEnter = (index: number) => {
  hoveredLineIndex.value = index;
};

const handleLineMouseLeave = () => {
  hoveredLineIndex.value = null;
};

const handleLineClick = (index: number) => {
  const line = parsedLyrics.value[index];
  if (line && !line.isMeta && props.duration) {
    emit('seek', Math.max(0, line.time - 0.5));
  }
};

const handleLyricScroll = (e: WheelEvent) => {
  isUserScrolling.value = true;
  userScrollDelta.value -= e.deltaY;
  resetScrollTimer();
};

const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY;
};

const handleTouchMove = (e: TouchEvent) => {
  const currentY = e.touches[0].clientY;
  const deltaY = touchStartY - currentY;
  touchStartY = currentY;

  isUserScrolling.value = true;
  userScrollDelta.value -= deltaY;
  resetScrollTimer();
};

const handleTouchEnd = () => {
  touchStartY = 0;
};

const resetScrollTimer = () => {
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer);
  }
  scrollDebounceTimer = window.setTimeout(() => {
    isUserScrolling.value = false;
    userScrollDelta.value = 0;
    nextTick(() => {
      updateLyricsOffset();
    });
  }, 800);
};

const updateCurrentLyricByTime = (time: number) => {
  if (parsedLyrics.value.length === 0) return;

  const compareTime = time + 1;
  let index = parsedLyrics.value.findIndex(line => line.time > compareTime);
  let newIndex = 0;
  if (index === -1) {
    newIndex = parsedLyrics.value.length - 1;
  } else if (index > 0) {
    newIndex = index - 1;
  }

  if (newIndex !== currentLyricIndex.value) {
    currentLyricIndex.value = newIndex;
    if (props.show) {
      updateLyricsOffset();
    }
  }
};

const openLyrics = async () => {
  userScrollDelta.value = 0;
  precomputeRetryCount = 0;
  await nextTick();
  await loadLyrics();
  setTimeout(() => {
    updateLyricsOffset();
  }, 100);
};

const handleResize = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = window.setTimeout(() => {
    if (props.show && parsedLyrics.value.length > 0) {
      precomputedLines.value = [];
      precomputeRetryCount = 0;
      precomputeLayout();
    }
  }, 100);
};

watch(() => props.currentTime, (newTime) => {
  if (newTime === undefined || newTime === null) return;
  updateCurrentLyricByTime(newTime);
});

watch(() => props.currentMusic?.id, () => {
  currentLyricIndex.value = 0;
  parsedLyrics.value = [];
  userScrollDelta.value = 0;
  if (props.show) {
    loadLyrics();
  }
});

watch(() => props.show, (show) => {
  if (show) {
    openLyrics();
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer);
  }
});
</script>

<style scoped>
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
  position: relative;
  background: var(--vp-c-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.lyrics-cover-bg {
  position: absolute;
  inset: -24px;
  z-index: 0;
  background-position: center;
  background-size: cover;
  filter: blur(12px);
  transform: scale(1.1);
}

.lyrics-modal-mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: saturate(1.1);
}

.lyrics-header,
.lyrics-player-controls,
.lyrics-progress,
.lyrics-content {
  position: relative;
  z-index: 2;
}

.dark .lyrics-modal {
  background: var(--vp-c-bg-soft);
}

.dark .lyrics-modal-mask {
  background: rgba(20, 20, 20, 0.78);
}

.lyrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.lyrics-song {
  min-width: 0;
}

.lyrics-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lyrics-author {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.lyrics-player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px 8px;
}

.lyrics-control-btn {
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

.lyrics-control-btn:hover {
  opacity: 0.65;
}

.lyrics-play-btn {
  padding: 6px;
}

.lyrics-autoplay-btn {
  color: var(--vp-c-text-3);
}

.lyrics-autoplay-btn.active {
  color: #dc143c;
}

.lyrics-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.lyrics-time {
  min-width: 36px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  text-align: center;
}

.lyrics-progress-bar {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lyrics-progress-bar:hover {
  height: 4px;
}

.lyrics-progress-track {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: rgba(220, 20, 60, 0.2);
}

.lyrics-progress-filled {
  position: relative;
  height: 100%;
  border-radius: 2px;
  background: rgba(220, 20, 60, 0.8);
  transition: width 0.1s linear;
}

.lyrics-progress-dot {
  position: absolute;
  right: -3px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(220, 20, 60, 0.9);
  transition: transform 0.2s ease;
}

.lyrics-progress-bar:hover .lyrics-progress-dot {
  transform: translateY(-50%) scale(1.3);
}

.lyrics-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
  position: relative;
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

.lyrics-list-wrapper {
  padding: 40vh 0;
  will-change: transform;
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
  cursor: pointer;
  position: relative;
  padding: 8px 0;
}

.lyrics-line.active {
  width: calc(100% / 1.15);
  margin: 0 auto;
  color: #dc143c;
  transition: all 0.3s ease;
  transform: scale(1.15);
  font-weight: 600;
  padding: 12px 0;
}

.lyrics-line.line-near:not(.active) {
  opacity: 0.85;
}

.lyrics-line:not(.line-near):not(.lyrics-meta) {
  opacity: 0.4;
}

.lyrics-line.lyrics-meta {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  opacity: 0.8;
  transform: none;
  font-weight: normal;
  padding: 4px 0;
  cursor: default;
}

.lyrics-line-text {
  max-width: 100%;
  font-size: 1rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}


.lyrics-line-trans {
  max-width: 100%;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}

.lyrics-line.active .lyrics-line-trans {
  color: rgba(220, 20, 60, 0.7);
}

.lyrics-line:not(.active):not(.line-hover) .lyrics-line-text {
  transform: translateY(2px);
}

.lyrics-line:not(.active):not(.line-hover) .lyrics-line-trans {
  transform: translateY(-2px);
  opacity: 0.7;
}

.lyrics-line.line-hover .lyrics-line-text {
  opacity: 0.4;
  transform: translateY(8px);
}

.lyrics-line.line-hover .lyrics-line-trans {
  opacity: 1;
  transform: translateY(-8px) scale(1.1);
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.lyrics-line.line-hover {
  background: linear-gradient(to bottom, transparent, rgba(220, 20, 60, 0.05), transparent);
}

.lyrics-line:active {
  transform: scale(1.05);
}
</style>
