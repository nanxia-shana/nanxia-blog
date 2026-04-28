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
      <div v-for="anime in filteredanimations.slice(0, displayCount)" :key="anime.title" class="anime-card">
        <anime-card :title="anime.title" :cover="anime.cover" :thumb="anime.thumb" :note="anime.note" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import AnimeCard from "../components/Anime-card.vue";
import { animeList } from '../../data/animeData.ts';

// 从所有动画中提取唯一标签，并排序
const getAllTags = () => {
  const tagSet = new Set<string>();
  animeList.forEach(anime => {
    anime.tags.forEach(tag => tagSet.add(tag));
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

// 动画数据
const animations = ref(animeList);

// ========== 渐进式渲染 ==========
const displayCount = ref(8); // 首屏显示数量
const batchSize = 4; // 每帧增加数量

// 渐进式渲染函数
const renderProgressively = () => {
  if (displayCount.value >= filteredanimations.value.length) return;

  requestAnimationFrame(() => {
    displayCount.value += batchSize;
    renderProgressively();
  });
};

// 根据屏幕宽度获取首屏显示数量
const getInitialDisplayCount = () => {
  if (window.innerWidth > 1440) return 20; // 2K+ 大屏
  if (window.innerWidth > 768) return 12; // 普通桌面
  return 6; // 移动端
};

// 监听分类变化，重置并重新开始渐进渲染
watch(currentCategory, () => {
  displayCount.value = getInitialDisplayCount();
  nextTick(() => {
    requestAnimationFrame(renderProgressively);
  });
});

// 页面挂载后启动渐进渲染
onMounted(() => {
  displayCount.value = getInitialDisplayCount();
  nextTick(() => {
    requestAnimationFrame(renderProgressively);
  });
});

// 设置当前分类
const setCategory = (category: string) => {
  currentCategory.value = category;
};

// 过滤后的动画列表：按标签筛选
const filteredanimations = computed(() => {
  if (currentCategory.value === "all") {
    return animations.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return animations.value
      .filter((anime) => anime.tags.includes(currentCategory.value))
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
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
