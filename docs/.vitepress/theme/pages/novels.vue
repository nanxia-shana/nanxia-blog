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
      <div v-for="novel in filteredNovels" :key="novel.title" class="novel-card" :data-category="novel.category">
        <Novel-card :title="novel.title" :author="novel.author" :cover="novel.cover"></Novel-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import NovelCard from '../components/Novel-card.vue';
import { novelList } from '../../data/novelsData.ts';
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
</script>

<style scoped>
.novel-collection {
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
  content: "「一字藏锋，一文见魂」";
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
