<template>
  <div class="movie-collection">
    <h1>🎥 浮光掠影​​</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="movies-grid">
      <div v-for="movie in filteredmovies" :key="movie.title" class="movie-card" :data-category="movie.category">
        <detail-card :title="movie.title" :country="movie.country" :cover="movie.cover" :year="movie.year" :runtime="movie.runtime" ></detail-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import detailCard from '../components/Detail-card.vue';
import { moiveList } from '../../data/movieData.ts';
// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "文学", value: "literature" },
  { label: "人文社科", value: "social-science" },
  { label: "科普/科技", value: "technology" },
];

// 当前选中的分类
const currentCategory = ref("all");

// 模拟书籍数据
const movies = ref(moiveList);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的书籍列表
const filteredmovies = computed(() => {
  if (currentCategory.value === "all") {
    return movies.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return movies.value
      .filter((movie) => movie.category === currentCategory.value)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
});
</script>

<style scoped>
.movie-collection {
  margin: 0 auto;
  padding: 2rem;
}

/* 标题样式 */
h1 {
  font-family: "Oswald", "站酷高端黑", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 2.5rem;
  font-weight: bolder;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "「一帧藏韵，一幕寄情」";
  display: block;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  font-family: "Noto Serif SC", serif;
}

/* 筛选栏 */
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
}

.filter-btn:hover,
.filter-btn.active {
  background: rgba(255, 137, 255, 0.4);
  border-color: rgba(255, 137, 255, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
}

/* 书籍卡片网格 */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 书籍卡片 */
.movie-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  
}
</style>
