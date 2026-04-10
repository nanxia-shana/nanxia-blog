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
      <div v-for="game in filteredGames" :key="game.title" class="game-card" :data-category="game.genre">
        <SmitPrajapati :title="game.title" :author="game.developer" :platform="game.platform" :cover="game.cover" :thumb="game.thumb"></SmitPrajapati>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SmitPrajapati from '../components/Smit-Prajapati.vue';
import { gameList } from '../../data/gamesData.ts';

// 从游戏数据中提取并整理分类
const getCategories = () => {
  // 预定义主要分类（合并相似分类，避免过多筛选按钮）
  return [
    { label: "全部", value: "all" },
    { label: "开放世界", value: "开放世界" },
    { label: "动作", value: "动作" },
    { label: "生存", value: "生存" },
    { label: "角色扮演", value: "RPG" },
    { label: "射击", value: "射击" },
    { label: "冒险", value: "冒险" },
    { label: "竞技", value: "竞技" },
    { label: "恐怖", value: "恐怖" },
    { label: "网络游戏", value: "MMORPG" },
    { label: "沙盒", value: "沙盒" },
    { label: "大逃杀", value: "大逃杀" },
    { label: "解谜", value: "解谜" },
    { label: "合作", value: "合作" },
    { label: "建造", value: "建造" },
    { label: "策略", value: "策略" },
    { label: "二次元", value: "二次元" },
    { label: "国产", value: "国产" },
  ];
};

// 分类数据
const categories = getCategories();

// 当前选中的分类
const currentCategory = ref("all");

// 游戏数据
const games = ref(gameList);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的游戏列表
const filteredGames = computed(() => {
  if (currentCategory.value === "all") {
    return games.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    // 根据 genre 过滤
    return games.value
      .filter(game => game.genre.some(genre => {
        // 处理分类映射
        const categoryMap = {
          'RPG': ['RPG', 'ARPG', 'CRPG'],
          '射击': ['射击', 'FPS'],
          '策略': ['策略', 'RTS', '回合制', '4X'],
        };
        const mappedCategories = categoryMap[currentCategory.value] || [currentCategory.value];
        return mappedCategories.some(c => genre.includes(c));
      }))
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
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
  font-size: 2.5rem;
  font-weight: bolder;
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
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
  }

  .games-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
