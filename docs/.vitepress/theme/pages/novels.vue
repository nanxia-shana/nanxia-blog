<template>
  <div class="movie-collection">
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
    <div class="movies-grid">
      <div v-for="movie in filteredmovies" :key="movie.title" class="movie-card" :data-category="movie.category">
        <div class="movie-cover">
          <img :src="movie.cover" :alt="movie.title" />
        </div>
        <div class="movie-info">
          <h2>{{ movie.title }}</h2>
          <p class="author">{{ movie.author }}</p>
          <p class="tags">{{ movie.tags.join(" | ") }}</p>
          <p v-if="movie.note" class="note">{{ movie.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "文学", value: "literature" },
  { label: "人文社科", value: "social-science" },
  { label: "科普/科技", value: "technology" },
];

// 当前选中的分类
const currentCategory = ref("all");

// 模拟书籍数据
const movies = ref([
  {
    title: "肖申克的救赎", // 电影中文名（必填）
    originalTitle: "The Shawshank Redemption", // 原始片名（非必填）
    director: "弗兰克·德拉邦特", // 导演
    year: 1994, // 上映年份
    country: ["美国"], // 制片国家（数组支持多国）
    genre: ["剧情", "犯罪"], // 类型标签（数组）
    runtime: 142, // 时长（分钟）
    cover: "/nanxia-blog/movie-covers/shawshank-redemption.jpeg", // 封面图片路径
    cast: ["蒂姆·罗宾斯", "摩根·弗里曼"], // 主演阵容（数组）
    tags: ["希望", "体制化", "经典"], // 自定义标签
    note: "自由意志与人性救赎的永恒命题，结尾震撼人心", // 观看笔记
  },
]);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的书籍列表
const filteredmovies = computed(() => {
  if (currentCategory.value === "all") {
    return movies.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return movies.value
      .filter((movie) => movie.category === currentCategory.value)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
});
</script>

<style scoped>
.movie-collection {
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
  background: rgba(255, 137, 255, 0.4);
  border-color: rgba(255, 137, 255, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
}

/* 书籍卡片网格 */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* 书籍卡片 */
.movie-card {
  position: relative;
  padding-right: 1rem;
  display: flex;
  border-radius: 8px;
  border: 1px solid #aaa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  transition: transform 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.movie-card:hover {
  background: rgba(255, 137, 255, 0.2);
  border-color: rgba(255, 137, 255, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
}

.movie-card:hover {
  transform: translateY(-5px);
}

/* 书籍封面 */
.movie-cover {
  position: relative;
  width: 150px;
  height: 225px;
  margin-right: 1rem;
}

.movie-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
}

/* 书籍信息 */
.movie-info {
  flex: 1;
}

.movie-info h2 {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.author {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.tags {
  font-size: 0.9rem;
  margin: 0.3rem 0 1rem 0;
}

.note {
  font-style: italic;
  font-size: 0.8rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
  }

  /* 书籍卡片网格 */
  .movies-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
