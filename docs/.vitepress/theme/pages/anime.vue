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
      <div v-for="anime in filteredanimations" :key="anime.title" class="anime-card">
        <anime-card :title="anime.title" :cover="anime.cover" :thumb="anime.thumb" :note="anime.note" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
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
