<template>
  <div class="game-collection">
    <h1>🎮 游心太玄​​</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="games-grid">
      <div
        v-for="game in filteredGames.slice(0, displayCount)"
        :key="game.id"
        class="game-card"
        :data-category="game.category.join(',')">
        <game-card :title="game.title" :author="game.developer" :platform="game.platform" :cover="game.cover" :thumb="game.thumb" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import GameCard from "../components/Game-card.vue";
import { gameList, GAME_CATEGORY_FILTERS, type GameItem } from "../../data/gameData.ts";

const categories = GAME_CATEGORY_FILTERS;
const currentCategory = ref<(typeof GAME_CATEGORY_FILTERS)[number]["value"]>("all");
const games = ref(gameList);

const setCategory = (category: (typeof GAME_CATEGORY_FILTERS)[number]["value"]) => {
  currentCategory.value = category;
};

const filteredGames = computed(() => {
  const sorted = [...games.value].sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  if (currentCategory.value === "all") return sorted;
  return sorted.filter((game: GameItem) => {
  if (currentCategory.value === "all") {
    return true;
  }
  return game.category.includes(currentCategory.value);
});
});

// ========== 渐进式渲染 ==========
const displayCount = ref(8); // 首屏显示数量
const batchSize = 4; // 每帧增加数量

const renderProgressively = () => {
  if (displayCount.value >= filteredGames.value.length) return;

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
.game-collection {
  margin: 0 auto;
  padding: 2rem;
}

/* 标题样式 */
h1 {
  font-family: "Ma Shan Zheng", cursive;
  font-weight: bold;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "「一关探奇，一局悟真」";
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
  background: rgba(52, 211, 153, 0.4);
  border-color: rgba(52, 211, 153, 0.8);
  box-shadow: 0 3px 15px 2px rgba(52, 211, 153, 0.4);
}

/* 游戏卡片网格 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* 游戏卡片容器 */
.game-card {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 0.3s ease backwards;
}

.game-card:nth-child(1) { animation-delay: 0.05s; }
.game-card:nth-child(2) { animation-delay: 0.1s; }
.game-card:nth-child(3) { animation-delay: 0.15s; }
.game-card:nth-child(4) { animation-delay: 0.2s; }
.game-card:nth-child(5) { animation-delay: 0.25s; }
.game-card:nth-child(6) { animation-delay: 0.3s; }
.game-card:nth-child(7) { animation-delay: 0.35s; }
.game-card:nth-child(8) { animation-delay: 0.4s; }
.game-card:nth-child(9) { animation-delay: 0.45s; }
.game-card:nth-child(10) { animation-delay: 0.5s; }
.game-card:nth-child(11) { animation-delay: 0.55s; }
.game-card:nth-child(12) { animation-delay: 0.6s; }
.game-card:nth-child(13) { animation-delay: 0.65s; }
.game-card:nth-child(14) { animation-delay: 0.7s; }
.game-card:nth-child(15) { animation-delay: 0.75s; }
.game-card:nth-child(16) { animation-delay: 0.8s; }
.game-card:nth-child(17) { animation-delay: 0.85s; }
.game-card:nth-child(18) { animation-delay: 0.9s; }
.game-card:nth-child(19) { animation-delay: 0.95s; }
.game-card:nth-child(20) { animation-delay: 1s; }

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

  .games-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .game-card {
    width: 90%;
    max-width: 360px;
  }
}

@media (max-width: 500px) {
  .game-card {
    width: 100%;
  }
}
</style>
