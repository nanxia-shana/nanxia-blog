<template>
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
        <button class="cp-control-btn" @click="emit('prev')" title="上一首">
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M98.31 483.06L654.05 162.2c22.43-12.95 50.47 3.24 50.47 29.14v641.71c0 25.9-28.04 42.09-50.47 29.14L98.31 541.34c-22.43-12.95-22.43-45.33 0-58.28z" fill="currentColor" p-id="4485"></path>
            <path d="M653.42 505.91L929.92 156c5.97-7.56 18.12-3.33 18.12 6.3v699.82c0 9.63-12.15 13.85-18.12 6.3L653.42 518.5a10.17 10.17 0 0 1 0-12.59z" fill="currentColor" p-id="4486"></path>
          </svg>
        </button>
        <button class="cp-control-btn cp-play-main" @click="emit('toggle-play')" title="播放/暂停">
          <svg v-if="!playbackState.isPlaying" viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor" p-id="1548"></path>
            <path d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z" fill="var(--vp-c-bg-alt)" p-id="1549"></path>
          </svg>
          <svg v-else viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" fill="currentColor" p-id="1717"></path>
            <path d="M441.73 704.57H404.8c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.06 24.72-24.72 24.72zM619.12 704.57h-36.93c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.07 24.72-24.72 24.72z" fill="var(--vp-c-bg-alt)" p-id="1718"></path>
          </svg>
        </button>
        <button class="cp-control-btn" @click="emit('next')" title="下一首">
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M925.61 483.06L369.88 162.21c-22.43-12.95-50.47 3.24-50.47 29.14v641.71c0 25.9 28.04 42.09 50.47 29.14l555.74-320.86c22.43-12.95 22.43-45.33-0.01-58.28z" fill="currentColor" p-id="1383"></path>
            <path d="M370.5 505.91L94 156c-5.97-7.56-18.12-3.33-18.12 6.3v699.82c0 9.63 12.15 13.85 18.12 6.3L370.5 518.5c2.92-3.69 2.92-8.9 0-12.59z" fill="currentColor" p-id="1384"></path>
          </svg>
        </button>
        <button class="cp-control-btn cp-control-btn-autoplay" :class="{ active: autoPlayEnabled }" @click="emit('toggle-autoplay')" title="自动播放">
          <svg viewBox="0 0 1163 1024" width="20" height="20">
            <path d="M134.86 410.152c-27.902-9.3-41.853-41.853-32.552-69.755 93.007-265.07 381.33-404.581 641.75-311.574 144.16 51.154 255.77 167.413 306.923 311.574h111.609L1004.478 503.16 846.366 340.397h88.356C851.016 154.383 641.75 61.375 451.085 131.131A404.581 404.581 0 0 0 204.615 377.6c-9.3 27.902-41.852 41.853-69.755 32.552z m878.919 199.966c27.902 9.3 41.853 41.853 32.552 69.755-46.504 130.21-134.86 232.518-255.77 292.973-65.105 32.553-139.51 51.154-213.916 51.154-55.805 0-111.609-9.3-167.413-27.902-144.161-51.154-255.77-162.763-306.924-306.924v-4.65H0L158.112 521.76l158.112 162.763h-97.657C302.273 870.538 516.19 963.545 711.505 893.79c111.609-41.853 199.966-130.21 237.168-246.47 9.301-32.552 37.203-46.503 65.106-37.202zM520.84 293.893c9.301 0 18.602 4.65 23.252 9.301l209.266 181.364c13.951 13.951 18.602 37.203 4.65 55.805l-4.65 4.65-209.266 181.364c-13.95 13.951-41.853 13.951-55.804-4.65-4.65-4.65-9.3-13.951-9.3-23.252V331.096c4.65-18.601 18.6-37.203 41.852-37.203z" p-id="3349" fill="currentColor"></path>
          </svg>
        </button>
        <button class="cp-control-btn" @click="emit('open-lyrics')" title="歌词">
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
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { PlaybackState } from "../../store";

const props = defineProps<{
  playbackState: PlaybackState | undefined;
  autoPlayEnabled: boolean;
}>();

const emit = defineEmits<{
  prev: [];
  next: [];
  'toggle-play': [];
  'toggle-autoplay': [];
  'open-lyrics': [];
  seek: [time: number];
  'drag-change': [isDragging: boolean];
}>();

const isDragging = ref(false);

const slider = computed(() => ({
  width: props.playbackState?.duration ? `${(props.playbackState.currentTime / props.playbackState.duration) * 100}%` : "0%",
}));

const formatter = (value: number) => {
  return `${Math.floor(value / 60)}:${Math.floor(value % 60) < 10 ? "0" + Math.floor(value % 60) : Math.floor(value % 60)}`;
};

const seekTo = (event: MouseEvent) => {
  if (!props.playbackState || !props.playbackState.duration) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  emit('seek', percent * props.playbackState.duration);
};

const startDrag = (event: MouseEvent) => {
  if (!props.playbackState || !props.playbackState.duration) return;
  isDragging.value = true;
  emit('drag-change', true);
  seekTo(event);

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging.value) {
      seekTo(moveEvent);
    }
  };

  const onMouseUp = () => {
    isDragging.value = false;
    emit('drag-change', false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>

<style scoped>
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

:global(html.dark) .current-player-placeholder {
  background: rgba(220, 20, 60, 0.2);
  border: 1px solid rgba(220, 20, 60, 0.4);
}

:global(html.dark) .cp-title {
  color: #f0f0f0;
}

:global(html.dark) .cp-album {
  color: #aaaaaa;
}

:global(html.dark) .cp-control-btn {
  color: #dc143c;
}

:global(html.dark) .cp-control-btn:hover {
  opacity: 0.6;
}

:global(html.dark) .cp-controls .cp-control-btn-autoplay {
  color: #888;
}

:global(html.dark) .cp-controls .cp-control-btn-autoplay.active {
  color: #dc143c;
}

:global(html.dark) .cp-progress .time-left,
:global(html.dark) .cp-progress .time-right {
  color: #aaaaaa;
}

:global(html.dark) .cp-progress .progress-bar .bar-background {
  background: rgba(220, 20, 60, 0.25);
}

:global(html.dark) .cp-progress .progress-bar .bar-filled {
  background: rgba(220, 20, 60, 0.8);
}

.cp-author {
  font-size: 0.85rem;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(html.dark) .cp-author {
  color: #aaaaaa;
}

@media (max-width: 768px) {
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
  .cp-cover {
    width: 56px;
    height: 56px;
  }
}
</style>
