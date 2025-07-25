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
      <div class="music-header">
        <div class="music-header-index">#</div>
        <div class="music-header-cover">封面</div>
        <div class="music-header-info">信息</div>
        <div class="music-header-album">专辑</div>
        <div class="music-header-date">日期</div>
        <div class="music-header-duration">
          <SvgIcon name="duration" className="duration-icon"/>
        </div>
      </div>
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
import SvgIcon from '../components/Svg-icon.vue';
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
}
.music-header {
  padding: 10px 0;
  display: flex;
  font-weight: bold;
  background: rgba(255, 137, 255, 0.4);
  box-shadow: 0 0 2px 1px rgba(255, 137, 255, 0.4);
}
.music-header-index{
  width: 40px;
  text-align: center;
}
.music-header-cover{
  width: 50px;
  min-width: 50px;
}
.music-header-info{
  width: 160px;
  padding-left: 10px;
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
  text-align: end;
}
.duration-icon{
  width: 16px;
  height: 16px;
}
.music-card {
  position: relative;
  width: 100%;
  height: 60px;
  background: rgba(255, 137, 255, 0.4);
  box-shadow: 0 0 2px 1px rgba(255, 137, 255, 0.4);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-top: 3px;
  cursor: pointer;
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
  .music-date, .music-header-date{
    display: none;
  }
}

</style>