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
      <div v-for="movie in filteredmovies.slice(0, displayCount)" :key="movie.id" class="movie-card">
        <movie-card :title="movie.title" :country="movie.country" :cover="movie.cover" :year="movie.year" :runtime="movie.runtime" :note="movie.note" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import MovieCard from '../components/Movie-card.vue';
import { moiveList, MOVIE_CATEGORY_FILTERS, type MovieItem } from '../../data/movieData.ts';

const categories = MOVIE_CATEGORY_FILTERS;
const currentCategory = ref<(typeof MOVIE_CATEGORY_FILTERS)[number]["value"]>("all");
const movies = ref(moiveList);

const setCategory = (category: (typeof MOVIE_CATEGORY_FILTERS)[number]["value"]) => {
  currentCategory.value = category;
};

const filteredmovies = computed(() => {
  const sorted = [...movies.value].sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  if (currentCategory.value === "all") return sorted;
  return sorted.filter((movie: MovieItem) => {
  if (currentCategory.value === "all") {
    return true;
  }
  return movie.category.includes(currentCategory.value);
});
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

// 根据屏幕宽度获取首屏显示数量
const getInitialDisplayCount = () => {
  if (typeof window === "undefined") return 8;
  if (window.innerWidth > 1440) return 20;
  if (window.innerWidth > 768) return 12;
  return 6;
};

watch(currentCategory, () => {
  displayCount.value = getInitialDisplayCount();
  nextTick(() => {
    requestAnimationFrame(renderProgressively);
  });
});

onMounted(() => {
  displayCount.value = getInitialDisplayCount();
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
.movie-card:nth-child(11) { animation-delay: 0.55s; }
.movie-card:nth-child(12) { animation-delay: 0.6s; }
.movie-card:nth-child(13) { animation-delay: 0.65s; }
.movie-card:nth-child(14) { animation-delay: 0.7s; }
.movie-card:nth-child(15) { animation-delay: 0.75s; }
.movie-card:nth-child(16) { animation-delay: 0.8s; }
.movie-card:nth-child(17) { animation-delay: 0.85s; }
.movie-card:nth-child(18) { animation-delay: 0.9s; }
.movie-card:nth-child(19) { animation-delay: 0.95s; }
.movie-card:nth-child(20) { animation-delay: 1s; }

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
