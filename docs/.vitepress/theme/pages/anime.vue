<template>
  <div class="anime-collection">
    <h1>🌌 绘梦织霞​​</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="animations-grid">
      <div v-for="anime in filteredanimations.slice(0, displayCount)" :key="anime.id" class="anime-card">
        <anime-card :title="anime.title" :cover="anime.cover" :thumb="anime.thumb" :note="anime.note" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import AnimeCard from "../components/Anime-card.vue";
import { animeList, ANIME_CATEGORY_FILTERS, type AnimeItem } from "../../data/animeData.ts";

const categories = ANIME_CATEGORY_FILTERS;
const currentCategory = ref<(typeof ANIME_CATEGORY_FILTERS)[number]["value"]>("all");
const animations = ref(animeList);

const displayCount = ref(8);
const batchSize = 4;

const renderProgressively = () => {
  if (displayCount.value >= filteredanimations.value.length) return;
  requestAnimationFrame(() => {
    displayCount.value += batchSize;
    renderProgressively();
  });
};

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

const setCategory = (category: (typeof ANIME_CATEGORY_FILTERS)[number]["value"]) => {
  currentCategory.value = category;
};

const filteredanimations = computed(() => {
  const sorted = [...animations.value].sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  if (currentCategory.value === "all") return sorted;
  return sorted.filter((anime: AnimeItem) => {
  if (currentCategory.value === "all") {
    return true;
  }
  return anime.category.includes(currentCategory.value);
});
});
</script>

<style scoped>
.anime-collection {
  margin: 0 auto;
  padding: 2rem;
}

/* 标题样式 */
h1 {
  font-family: "Cinzel", "庞门正道标题体", serif;
  font-weight: bold;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "「一线生趣，一色入魂」";
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
  background: rgba(255, 137, 255, 0.4);
  border-color: rgba(255, 137, 255, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
}

/* 书籍卡片网格 */
.animations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.anime-card {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 0.3s ease backwards;
}

.anime-card:nth-child(1) { animation-delay: 0.05s; }
.anime-card:nth-child(2) { animation-delay: 0.1s; }
.anime-card:nth-child(3) { animation-delay: 0.15s; }
.anime-card:nth-child(4) { animation-delay: 0.2s; }
.anime-card:nth-child(5) { animation-delay: 0.25s; }
.anime-card:nth-child(6) { animation-delay: 0.3s; }
.anime-card:nth-child(7) { animation-delay: 0.35s; }
.anime-card:nth-child(8) { animation-delay: 0.4s; }
.anime-card:nth-child(9) { animation-delay: 0.45s; }
.anime-card:nth-child(10) { animation-delay: 0.5s; }
.anime-card:nth-child(11) { animation-delay: 0.55s; }
.anime-card:nth-child(12) { animation-delay: 0.6s; }
.anime-card:nth-child(13) { animation-delay: 0.65s; }
.anime-card:nth-child(14) { animation-delay: 0.7s; }
.anime-card:nth-child(15) { animation-delay: 0.75s; }
.anime-card:nth-child(16) { animation-delay: 0.8s; }
.anime-card:nth-child(17) { animation-delay: 0.85s; }
.anime-card:nth-child(18) { animation-delay: 0.9s; }
.anime-card:nth-child(19) { animation-delay: 0.95s; }
.anime-card:nth-child(20) { animation-delay: 1s; }

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
  .animations-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .anime-card {
    width: 90%;
    max-width: 360px;
  }
}

@media (max-width: 500px) {
  .anime-card {
    width: 100%;
  }
}
</style>
