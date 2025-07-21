<template>
  <div class="book-collection">
    <h1>📚 书山拾叶</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="books-grid">
      <div v-for="book in filteredBooks" :key="book.title" class="book-card" :data-category="book.category">
        <ProgressBar :progress="book.read" />
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title" />
        </div>
        <div class="book-info">
          <h2>{{ book.title }}</h2>
          <p class="author">{{ book.author }}</p>
          <p class="tags">{{ book.tags.join(" | ") }}</p>
          <p v-if="book.note" class="note">{{ book.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ProgressBar from '../components/ProgressBar.vue';
// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "文学", value: "literature" },
  { label: "人文社科", value: "social-science" },
  { label: "科技", value: "technology" },
];

// 当前选中的分类
const currentCategory = ref("all");

// 模拟书籍数据
const books = ref([
  {
    title: "明朝那些事儿",
    author: "当年明月",
    cover: "/nanxia-blog/book-covers/mingchao.jpeg",
    tags: ["人文社科", "历史"],
    note: "以幽默诙谐的笔法讲述明朝历史，让严肃的历史变得生动有趣。",
    read: 90,
    category: "social-science",
  },
  {
    title: "三体",
    author: "刘慈欣",
    cover: "/nanxia-blog/book-covers/santi.jpeg",
    tags: ["文学", "科幻"],
    note: "中国科幻的里程碑",
    read: 20,
    category: "literature",
  },
  {
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    cover: "https://img9.doubanio.com/view/subject/s/public/s6384944.jpg",
    tags: ["文学", "魔幻现实主义"],
    note: "魔幻与现实的完美交织",
    read: 0,
    category: "literature",
  },
  {
    title: "沉默的大多数",
    author: "王小波",
    cover: "https://img3.doubanio.com/view/subject/s/public/s1070965.jpg",
    tags: ["杂文", "思想"],
    note: "犀利而深刻的思考",
    read: 0,
    category: "social-science",
  },
  {
    title: "算法导论",
    author: "Thomas H. Cormen",
    cover: "https://img9.doubanio.com/view/subject/s/public/s1054814.jpg",
    tags: ["计算机", "算法"],
    note: "计算机科学的经典教材",
    read: 0,
    category: "technology",
  },
  {
    title: "月亮与六便士",
    author: "毛姆",
    cover: "https://img9.doubanio.com/view/subject/s/public/s6384945.jpg",
    tags: ["文学", "小说"],
    note: "理想与现实的永恒命题",
    read: 0,
    category: "literature",
  },
]);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的书籍列表
const filteredBooks = computed(() => {
  if (currentCategory.value === "all") {
    return books.value;
  } else {
    return books.value.filter((book) => book.category === currentCategory.value);
  }
});
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Noto Serif SC", serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  padding: 20px;
}

.book-collection {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Noto Serif SC", serif;
}

/* 标题样式 */
h1 {
  font-family: "Ma Shan Zheng", cursive;
  font-size: 2.5rem;
  font-weight: bolder;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  position: relative;
}

h1::after {
  content: "「书中自有黄金屋」";
  display: block;
  font-size: 0.9rem;
  color: #888;
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
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  background: rgba(255, 137, 255, 0.4);
  color: #3c3c43;
  border-color: rgba(255, 137, 255, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
}

/* 书籍卡片网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

/* 书籍卡片 */
.book-card {
  position: relative;
  display: flex;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  transition: transform 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-5px);
}

/* 书籍封面 */
.book-cover {
  position: relative;
  width: 150px;
  height: 225px;
  margin-right: 1rem;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
}

/* 书籍信息 */
.book-info {
  flex: 1;
}

.book-info h2 {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.author {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.tags {
  color: #666;
  font-size: 0.9rem;
  margin: 0.3rem 0 1rem 0;
}

.note {
  font-style: italic;
  color: #888;
  font-size: 0.8rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
  }
}
</style>
