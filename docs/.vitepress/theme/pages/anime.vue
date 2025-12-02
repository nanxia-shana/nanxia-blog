<template>
  <div class="movie-collection">
    <h1>🌌 绘梦织霞</h1>
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
        <Card :title="movie.title" :cover="movie.cover" :note="movie.note" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Card from "../components/Card.vue";
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
    title: "魔女之旅", // 电影中文名（必填）
    originalTitle: "Wandering Witch: The Journey of Elaina", // 原始片名（非必填）
    director: "渡边政治", // 导演（《魔女之旅》动画第1季导演）
    year: 2020, // 上映年份（第一季首播时间）
    country: ["日本"], // 制片国家（数组支持多国）
    genre: ["动画", "奇幻", "冒险"], // 类型标签（数组）
    runtime: 300, // 时长（分钟）（按第一季总时长示例，含多集累计）
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/Elaina.jpeg", // 封面图片路径
    cast: ["安济知佳", "高桥李依", "木曾宽子"], // 主演阵容（数组）（主要声优）
    tags: ["旅行", "治愈", "异世界", "成长"], // 自定义标签
    note: "跟随魔女伊蕾娜游历众多国度，聆听各地的故事，感受世界的美好与哀愁，温柔而富有哲思的旅程",
  },
  {
    title: "葬送的芙莉莲", // 电影中文名（必填）
    originalTitle: "Sousou no Frieren: Beyond Journey's End", // 原始片名（非必填）
    director: "斋藤圭一郎", // 导演（动画版导演）
    year: 2023, // 上映年份（第一季首播时间）
    country: ["日本"], // 制片国家（数组支持多国）
    genre: ["动画", "奇幻", "冒险", "剧情"], // 类型标签（数组）
    runtime: 600, // 时长（分钟）（按第一季总时长示例，含多集累计）
    cover: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/Frieren.jpeg", // 封面图片路径
    cast: ["种崎敦美", "小林千晃", "艾拉"], // 主演阵容（数组）（主要声优）
    tags: ["长寿种族", "时间与生命", "友情", "史诗"], // 自定义标签
    note: "勇者击败魔王后，精灵法师芙莉莲踏上百年旅程重新理解人类与生命的温度，故事悠远感人，画面细腻隽永",
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
  font-family: "Cinzel", "庞门正道标题体", serif;
  font-weight: 600;
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
  border-radius: 20px;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.movie-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
}
@media (max-width: 500px) {
  .movies-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
