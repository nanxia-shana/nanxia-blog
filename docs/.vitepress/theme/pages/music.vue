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
  padding: 2rem;
}
/* 标题样式 */
h1 {
  font-family: "Oswald", "站酷高端黑", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
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
}
@keyframes rotate {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
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
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}
.filter-btn:hover, .filter-btn.active {
  background: rgba(255, 137, 255, 0.4);
  border-color: rgba(255, 137, 255, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
}
.music-list {
  display: flex;
  flex-direction: column;
  align-items: end;
}
.music-header {
  width: 100%;
  padding: 10px 0;
  margin-bottom: 16px;
  display: flex;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}
.music-header-index{
  width: 40px;
  text-align: center;
}
.music-header-info{
  width: 210px;
}
.music-header-album{
  flex: 1;
  padding-left: 10px;
}
.music-header-date{
  width: 120px;
  padding-left: 10px;
}
.music-header-duration{
  width: 80px;
  padding-right: 10px;
  display: flex;
  justify-content: end;
}
.duration-icon{
  width: 16px;
  height: 16px;
}
.music-card {
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-top: 4px;
  cursor: pointer;
}
@media (hover: hover) and (pointer: fine) {
  .music-card:hover{
    background: rgba(255, 137, 255, 0.4);
    box-shadow: 1px 2px 6px 2px rgba(255, 137, 255, 0.2);
  }
  .music-card:hover .music-cover{
    animation: rotate 10s infinite linear;
  }
}
.music-card-playing{
  background: rgba(255, 137, 255, 0.4);
  box-shadow: 1px 2px 6px 2px rgba(255, 137, 255, 0.2);
  width: calc(100% - 30px);
  transition: 0.3s all;
}
.music-cover-playing{
  animation: rotate 10s infinite linear;
}
.music-index{
  width: 40px;
  text-align: center;
}
.music-cover {
  width: 50px;
  height: 50px;
  min-width: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.music-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.music-info {
  width: 160px;
  height: 50px;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.music-info span{
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.music-info span:first-child{
  font-size: 1.1rem;
  font-weight: bold;
}
.music-info span:last-child{
  font-size: 0.9rem;
}
.music-album{
  flex: 1;
  padding-left: 10px;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.music-date{
  width: 120px;
  padding-left: 10px;
}
.music-duration{
  width: 80px;
  text-align: end;
  padding-right: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-header-info{
    width: 140px;
  }
  .music-info {
    width: 90px;
  }
  .music-header-date, .music-date{
    display: none;
  }
}

</style>