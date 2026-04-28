<template>
  <div class="novel-collection">
    <h1>✒️ 墨池云篆​​</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="novels-grid">
      <div v-for="novel in filteredNovels.slice(0, displayCount)" :key="novel.title" class="novel-card" :data-category="novel.category">
        <Novel-card :title="novel.title" :author="novel.author" :cover="novel.cover" :thumb="novel.thumb"></Novel-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import NovelCard from '../components/Novel-card.vue';
import { novelList } from '../../data/novelData.ts';
// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "文学", value: "literature" },
  { label: "人文社科", value: "social-science" },
  { label: "科普/科技", value: "technology" },
];

// 当前选中的分类
const currentCategory = ref("all");

// 小说数据
const novels = ref(novelList);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的小说列表
const filteredNovels = computed(() => {
  if (currentCategory.value === "all") {
    return novels.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return novels.value
      .filter((novel) => novel.category === currentCategory.value)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
});

// ========== 渐进式渲染 ==========
const displayCount = ref(8); // 首屏显示数量
const batchSize = 4; // 每帧增加数量

const renderProgressively = () => {
  if (displayCount.value >= filteredNovels.value.length) return;

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
.novel-collection {
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
  content: "「一字藏锋，一文见魂」";
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
  background: rgba(138, 43, 226, 0.4);
  border-color: rgba(138, 43, 226, 0.8);
  box-shadow: 0 3px 15px 2px rgba(138, 43, 226, 0.4);
}

/* 小说卡片网格 */
.novels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 小说卡片容器 */
.novel-card {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 0.3s ease backwards;
}

.novel-card:nth-child(1) { animation-delay: 0.05s; }
.novel-card:nth-child(2) { animation-delay: 0.1s; }
.novel-card:nth-child(3) { animation-delay: 0.15s; }
.novel-card:nth-child(4) { animation-delay: 0.2s; }
.novel-card:nth-child(5) { animation-delay: 0.25s; }
.novel-card:nth-child(6) { animation-delay: 0.3s; }
.novel-card:nth-child(7) { animation-delay: 0.35s; }
.novel-card:nth-child(8) { animation-delay: 0.4s; }
.novel-card:nth-child(9) { animation-delay: 0.45s; }
.novel-card:nth-child(10) { animation-delay: 0.5s; }
.novel-card:nth-child(11) { animation-delay: 0.55s; }
.novel-card:nth-child(12) { animation-delay: 0.6s; }
.novel-card:nth-child(13) { animation-delay: 0.65s; }
.novel-card:nth-child(14) { animation-delay: 0.7s; }
.novel-card:nth-child(15) { animation-delay: 0.75s; }
.novel-card:nth-child(16) { animation-delay: 0.8s; }
.novel-card:nth-child(17) { animation-delay: 0.85s; }
.novel-card:nth-child(18) { animation-delay: 0.9s; }
.novel-card:nth-child(19) { animation-delay: 0.95s; }
.novel-card:nth-child(20) { animation-delay: 1s; }

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

  .novels-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .novel-card {
    width: 90%;
    max-width: 360px;
  }
}

@media (max-width: 500px) {
  .novel-card {
    width: 100%;
  }
}
</style>
