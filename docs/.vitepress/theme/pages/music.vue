<template>
  <div class="music-collection">
    <h1>🎧 
      听海观澜</h1>
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
        <div class="music-header-duration">
          <svg t="1753336238420" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9335" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24"><path d="M909.8 304.6c-5.4-10.5-16.3-17.8-28.9-17.8-17.8 0-32.2 14.4-32.2 32.1 0 6 1.7 11.7 4.6 16.5l-0.1 0.1c26.9 52.4 42.1 111.8 42.1 174.7 0 211.6-171.6 383.2-383.2 383.2S128.8 721.8 128.8 510.2 300.4 127.1 512 127.1c62.5 0 121.5 15 173.6 41.5l0.2-0.4c4.6 2.6 10 4.1 15.7 4.1 17.8 0 32.2-14.4 32.2-32.1 0-13.1-7.9-24.4-19.3-29.4C653.6 79.9 584.9 62.5 512 62.5 264.7 62.5 64.3 263 64.3 510.2S264.7 957.9 512 957.9s447.7-200.4 447.7-447.7c0-74.1-18-144-49.9-205.6z" p-id="9336"></path><path d="M489.7 535l137.1 137.2c12.4 12.4 32.8 12.4 45.2 0s12.4-32.7 0-45.2L544.2 499.1V287.9c0-17.5-14.3-31.9-31.9-31.9-17.5 0-31.9 14.3-31.9 31.9v224.4c0 8.2 3.1 16.5 9.3 22.7z" p-id="9337"></path><path d="M771.7 218.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" p-id="9338"></path></svg>
        </div>
      </div>
      <div v-for="(music, index) in filteredMusic" :key="music.title" :class="`music-card ${playbackState.currentMusic.id === music.id && playbackState.isPlaying ? 'music-card-playing' : ''}`" :data-category="music.category">
        <div class="music-index">{{ index + 1 }}</div>
        <div :class="`music-cover ${playbackState.currentMusic.id === music.id && playbackState.isPlaying ? 'music-cover-playing' : ''}`">
          <img :src="music.cover" :alt="music.title" />
        </div>
        <div class="music-info">
          <span>{{ music.title }}</span>
          <span>{{ music.author }}</span>
        </div>
        <div class="music-album">{{ music.album }}</div>
        <div class="music-date">{{ music.release_date }}</div>
        <div class="music-duration">{{ music.duration }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
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
const musicList = inject("music-list");
// 音乐播放状态
const playbackState = inject("playback-state");
// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};
// 计算过滤后的音乐列表
const filteredMusic = computed(() => {
  if (currentCategory.value === "all") {
    return musicList;
  }
  return musicList.filter(m => m.category === currentCategory.value);
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
  font-weight: 700;
  text-transform: uppercase;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  color: #1a1a1a;
}

h1::after {
  content: "「一浪知海，一澜见心」";
  display: block;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-family: "Noto Serif SC", serif;
  font-weight: normal;
  text-transform: none;
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
  justify-content: center;
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
  .music-card:hover .music-cover {
    animation: rotate 10s infinite linear;
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

.music-card-playing .music-cover {
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
}

.music-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.music-info {
  width: 180px;
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
  width: 110px;
  padding-left: 16px;
  font-size: 0.85rem;
  color: #999999;
}

.music-duration {
  width: 70px;
  text-align: right;
  padding-left: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
}

.music-header-duration svg {
  fill: #666666;
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

  .music-duration {
    width: 50px;
    padding-left: 8px;
  }
}

@media (max-width: 480px) {
  .music-info {
    width: 100px;
  }

  .music-duration {
    display: none;
  }
}
</style>