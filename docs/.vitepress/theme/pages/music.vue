<template>
  <div class="music-collection">
    <h1>🎵 音乐之旅</h1>
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
      <div v-for="(music, index) in filteredMusic" :key="music.title" class="music-card" :data-category="music.category">
        <div class="music-index">{{ index + 1 }}</div>
        <div class="music-cover">
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
import { ref, computed } from "vue";
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
// 模拟音乐数据
const music = ref([
  {
    title: "光芒",
    author: "川田まみ",
    cover: "/nanxia-blog/music-covers/guangmang.png",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E5%B7%9D%E7%94%B0%E3%81%BE%E3%81%BF%20-%20%E5%85%89%E8%8A%92.mp3",
    album: "111111111111111",
    release_date: "2025/03/25",
    duration: "4:30",
    category: "jp",
  },
  {
    title: "コツキミヤ",
    author: "mirage",
    cover: "/nanxia-blog/music-covers/コツキミヤ.jpg",
    url: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/audio/%E3%82%B3%E3%83%84%E3%82%AD%E3%83%9F%E3%83%A4%20-%20mirage.flac",
    album: "111111111111111",
    release_date: "2025/03/14",
    duration: "4:30",
    category: "jp",
  }
]);
// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};
// 计算过滤后的音乐列表
const filteredMusic = computed(() => {
  if (currentCategory.value === "all") {
    return music.value;
  }
  return music.value.filter(m => m.category === currentCategory.value);
});

</script>

<style scoped>

.music-collection {
  padding: 20px;
}
.music-collection h1 {
  text-align: center;

  margin-bottom: 20px;
}
.filter-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.filter-btn {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #eee;
  cursor: pointer;
}
.filter-btn.active {
  background-color: #40e0d0;
  color: white;
}
.music-list {
  display: flex;
  flex-direction: column;
  
}
.music-card {
  position: relative;
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  cursor: pointer;
}
.music-index{
  width: 40px;
  text-align: center;
}
.music-cover {
  width: 50px;
  height: 50px;
  overflow: hidden;
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
  width: 200px;
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
  .music-date{
    display: none;
  }
}
</style>