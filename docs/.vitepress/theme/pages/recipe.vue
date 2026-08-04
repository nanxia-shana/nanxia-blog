<template>
  <div class="recipe-collection">
    <h1>🍳 烟火烹茶</h1>
    <div class="filter-bar">
      <label class="filter-select">
        <span>菜系</span>
        <select v-model="filters.region">
          <option value="all">全部菜系</option>
          <optgroup v-for="group in regionGroups" :key="group.label" :label="group.label">
            <option v-for="opt in group.options" :key="opt" :value="opt">{{ opt }}</option>
          </optgroup>
        </select>
      </label>
      <label class="filter-select">
        <span>场景</span>
        <select v-model="filters.scene">
          <option value="all">全部场景</option>
          <option v-for="opt in scenes" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
      <label class="filter-select">
        <span>工艺</span>
        <select v-model="filters.technique">
          <option value="all">全部工艺</option>
          <option v-for="opt in techniques" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
      <label class="filter-select">
        <span>口味</span>
        <select v-model="filters.flavor">
          <option value="all">全部口味</option>
          <option v-for="opt in flavors" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
      <button class="reset-btn" @click="resetFilters">重置</button>
    </div>
    <div v-if="filteredRecipes.length" class="recipes-grid">
      <div
        v-for="recipe in filteredRecipes.slice(0, displayCount)"
        :key="recipe.id"
        class="recipe-item"
        :data-category="categoryKey(recipe.category)">
        <RecipeCard
          :title="recipe.title"
          :cover="recipe.cover"
          :thumb="recipe.thumb"
          :difficulty="recipe.difficulty"
          :cook-time="recipe.cookTime"
          :category="recipe.category"
          :description="recipe.description"
          :note="recipe.note"
          @click="openDetail(recipe)" />
      </div>
    </div>
    <div v-else class="empty-state">
      🍽️ 没有找到符合条件的食谱，换个筛选试试吧
    </div>

    <RecipeDetailModal
      :recipe="selectedRecipe"
      :visible="!!selectedRecipe"
      @close="selectedRecipe = null" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import RecipeCard from "../components/Recipe-card.vue";
import RecipeDetailModal from "../components/RecipeDetailModal.vue";
import {
  recipeList,
  RECIPE_REGION_GROUPS,
  RECIPE_SCENES,
  RECIPE_TECHNIQUES,
  RECIPE_FLAVORS,
  type RecipeItem,
  type RecipeCategory,
} from "../../data/recipeData.ts";

const regionGroups = RECIPE_REGION_GROUPS;
const scenes = RECIPE_SCENES;
const techniques = RECIPE_TECHNIQUES;
const flavors = RECIPE_FLAVORS;

type FilterValue = "all" | string;
const filters = reactive<{
  region: FilterValue;
  scene: FilterValue;
  technique: FilterValue;
  flavor: FilterValue;
}>({
  region: "all",
  scene: "all",
  technique: "all",
  flavor: "all",
});

const recipes = ref(recipeList);
const selectedRecipe = ref<RecipeItem | null>(null);

const openDetail = (recipe: RecipeItem) => {
  selectedRecipe.value = recipe;
};

const matchDimension = (value: string | undefined, filter: FilterValue) =>
  filter === "all" || value === filter;

const filteredRecipes = computed(() => {
  const sorted = [...recipes.value].sort((a, b) =>
    a.title.localeCompare(b.title, "zh-CN"),
  );
  return sorted.filter((recipe: RecipeItem) => {
    const c = recipe.category;
    return (
      matchDimension(c.region, filters.region) &&
      matchDimension(c.scene, filters.scene) &&
      matchDimension(c.technique, filters.technique) &&
      matchDimension(c.flavor, filters.flavor)
    );
  });
});

const resetFilters = () => {
  filters.region = "all";
  filters.scene = "all";
  filters.technique = "all";
  filters.flavor = "all";
};

const categoryKey = (category: RecipeCategory) =>
  [category.region, category.scene, category.technique, category.flavor]
    .filter(Boolean)
    .join(",");

// ========== 渐进式渲染 ==========
const displayCount = ref(8);
const batchSize = 4;

const renderProgressively = () => {
  if (displayCount.value >= filteredRecipes.value.length) return;
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

watch(filters, () => {
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
.recipe-collection {
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
  content: "「一粥一饭，当思来之不易」";
  display: block;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  font-family: "Noto Serif SC", serif;
  color: #666666;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 2rem;
  align-items: flex-end;
}

.filter-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.filter-select select {
  padding: 6px 12px;
  min-width: 120px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select select:hover,
.filter-select select:focus {
  border-color: rgba(245, 158, 11, 0.8);
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
  outline: none;
}

.reset-btn {
  padding: 7px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  height: fit-content;
}

.reset-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.8);
  color: rgba(245, 158, 11, 1);
}

/* 食谱卡片网格 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* 食谱卡片容器 */
.recipe-item {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 0.3s ease backwards;
}

.recipe-item:nth-child(1) { animation-delay: 0.05s; }
.recipe-item:nth-child(2) { animation-delay: 0.1s; }
.recipe-item:nth-child(3) { animation-delay: 0.15s; }
.recipe-item:nth-child(4) { animation-delay: 0.2s; }
.recipe-item:nth-child(5) { animation-delay: 0.25s; }
.recipe-item:nth-child(6) { animation-delay: 0.3s; }
.recipe-item:nth-child(7) { animation-delay: 0.35s; }
.recipe-item:nth-child(8) { animation-delay: 0.4s; }
.recipe-item:nth-child(9) { animation-delay: 0.45s; }
.recipe-item:nth-child(10) { animation-delay: 0.5s; }
.recipe-item:nth-child(11) { animation-delay: 0.55s; }
.recipe-item:nth-child(12) { animation-delay: 0.6s; }
.recipe-item:nth-child(13) { animation-delay: 0.65s; }
.recipe-item:nth-child(14) { animation-delay: 0.7s; }
.recipe-item:nth-child(15) { animation-delay: 0.75s; }
.recipe-item:nth-child(16) { animation-delay: 0.8s; }
.recipe-item:nth-child(17) { animation-delay: 0.85s; }
.recipe-item:nth-child(18) { animation-delay: 0.9s; }
.recipe-item:nth-child(19) { animation-delay: 0.95s; }
.recipe-item:nth-child(20) { animation-delay: 1s; }

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

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--vp-c-text-3);
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    gap: 8px;
  }

  .filter-select select {
    min-width: 100px;
    padding: 6px 8px;
    font-size: 0.85rem;
  }

  .recipes-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .recipe-item {
    width: 90%;
    max-width: 360px;
  }
}

@media (max-width: 500px) {
  .recipe-item {
    width: 100%;
  }
}
</style>
