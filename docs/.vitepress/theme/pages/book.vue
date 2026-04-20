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
        <flip-card :title="book.title" :author="book.author" :cover="book.cover" :thumb="book.thumb" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import flipCard from '../components/Flip-card.vue';
import { bookList } from '../../data/bookData.ts';
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
const books = ref(bookList);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的书籍列表
const filteredBooks = computed(() => {
  if (currentCategory.value === "all") {
    return books.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return books.value.filter((book) => book.category === currentCategory.value).sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
});
</script>

<style scoped>
.book-collection {
  margin: 0 auto;
  padding: 2rem;
}

/* 标题样式 */
h1 {
  font-family: "Playfair Display", "思源宋体", Georgia, "Times New Roman", serif;
  font-weight: bold;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "「一叶知秋，一书知心」";
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
  background: rgba(255, 174, 145, 0.4);
  border-color: rgba(255, 127, 80, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 211, 195, 0.4);
}

/* 书籍卡片网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 书籍卡片 */
.book-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .books-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .book-card {
    width: 90%;
    max-width: 360px;
  }
}

@media (max-width: 500px) {
  .book-card {
    width: 100%;
  }
}
</style>
