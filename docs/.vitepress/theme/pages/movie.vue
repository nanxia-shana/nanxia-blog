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
      <div v-for="movie in filteredmovies.slice(0, displayCount)" :key="movie.title" class="movie-card">
        <movie-card :title="movie.title" :country="movie.country" :cover="movie.cover" :year="movie.year" :runtime="movie.runtime" :note="movie.note" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import MovieCard from '../components/Movie-card.vue';
import { moiveList } from '../../data/movieData.ts';

// 从所有电影中提取唯一标签，并排序
const getAllTags = () => {
  const tagSet = new Set<string>();
  moiveList.forEach(movie => {
    movie.tags.forEach(tag => tagSet.add(tag));
  });
  // 转换为分类格式，并按字母排序
  const tagCategories = Array.from(tagSet)
    .sort()
    .map(tag => ({ label: tag, value: tag }));
  return [
    { label: "全部", value: "all" },
    ...tagCategories
  ];
};

// 分类数据（从标签动态提取）
const categories = getAllTags();

// 当前选中的分类
const currentCategory = ref("all");

// 电影数据
const movies = ref(moiveList);

// 设置当前分类
const setCategory = (category: string) => {
  currentCategory.value = category;
};

// 过滤后的电影列表：按标签筛选
const filteredmovies = computed(() => {
  if (currentCategory.value === "all") {
    return movies.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return movies.value
      .filter((movie) => movie.tags.includes(currentCategory.value))
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
});

// ========== 渐进式渲染 ==========
const displayCount = ref(8); // 首屏显示数量
const batchSize = 4; // 每帧增加数量

const renderProgressively = () => {
  if (displayCount.value >= filteredmovies.value.length) return;

  requestAnimationFrame(() => {
    displayCount.value += batchSize;
    renderProgressively();
  });
};

watch(currentCategory, () => {
  displayCount.value = window.innerWidth > 768 ? 8 : 4;
  nextTick(() => {
    requestAnimationFrame(renderProgressively);
  });
});

onMounted(() => {
  displayCount.value = window.innerWidth > 768 ? 8 : 4;
  nextTick(() => {
    requestAnimationFrame(renderProgressively);
  });
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
  font-weight: bold;
  font-size: 2.5rem;
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
  color: #666666;
}

/* 筛选栏 */
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
}

.filter-btn:hover,
.filter-btn.active {
  background: rgba(212, 175, 55, 0.4);
  border-color: rgba(212, 175, 55, 0.8);
  box-shadow: 0 3px 15px 2px rgba(212, 175, 55, 0.4);
}

/* 书籍卡片网格 */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 电影卡片 */
.movie-card {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 0.3s ease backwards;
}

.movie-card:nth-child(1) { animation-delay: 0.05s; }
.movie-card:nth-child(2) { animation-delay: 0.1s; }
.movie-card:nth-child(3) { animation-delay: 0.15s; }
.movie-card:nth-child(4) { animation-delay: 0.2s; }
.movie-card:nth-child(5) { animation-delay: 0.25s; }
.movie-card:nth-child(6) { animation-delay: 0.3s; }
.movie-card:nth-child(7) { animation-delay: 0.35s; }
.movie-card:nth-child(8) { animation-delay: 0.4s; }
.movie-card:nth-child(9) { animation-delay: 0.45s; }
.movie-card:nth-child(10) { animation-delay: 0.5s; }

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

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
  }
  .movies-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .movie-card {
    width: 90%;
    max-width: 360px;
  }
}

@media (max-width: 500px) {
  .movie-card {
    width: 100%;
  }
}
</style>
