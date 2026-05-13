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
      <div
        v-for="book in filteredBooks.slice(0, displayCount)"
        :key="book.id"
        class="book-card"
        :data-category="book.category.join(',')">
        <book-card :title="book.title" :author="book.author" :cover="book.cover" :thumb="book.thumb" :note="book.note" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import BookCard from "../components/Book-card.vue";
import { bookList, BOOK_CATEGORY_FILTERS, type BookItem } from "../../data/bookData.ts";

const categories = BOOK_CATEGORY_FILTERS;
const currentCategory = ref<(typeof BOOK_CATEGORY_FILTERS)[number]["value"]>("all");
const books = ref(bookList);

const setCategory = (category: (typeof BOOK_CATEGORY_FILTERS)[number]["value"]) => {
  currentCategory.value = category;
};

const filteredBooks = computed(() => {
  const sorted = [...books.value].sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  if (currentCategory.value === "all") return sorted;
  return sorted.filter((book: BookItem) => {
  if (currentCategory.value === "all") {
    return true;
  }
  return book.category.includes(currentCategory.value);
});
});

const displayCount = ref(8);
const batchSize = 4;

const renderProgressively = () => {
  if (displayCount.value >= filteredBooks.value.length) return;
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
  animation: slideIn 0.3s ease backwards;
}

.book-card:nth-child(1) { animation-delay: 0.05s; }
.book-card:nth-child(2) { animation-delay: 0.1s; }
.book-card:nth-child(3) { animation-delay: 0.15s; }
.book-card:nth-child(4) { animation-delay: 0.2s; }
.book-card:nth-child(5) { animation-delay: 0.25s; }
.book-card:nth-child(6) { animation-delay: 0.3s; }
.book-card:nth-child(7) { animation-delay: 0.35s; }
.book-card:nth-child(8) { animation-delay: 0.4s; }
.book-card:nth-child(9) { animation-delay: 0.45s; }
.book-card:nth-child(10) { animation-delay: 0.5s; }
.book-card:nth-child(11) { animation-delay: 0.55s; }
.book-card:nth-child(12) { animation-delay: 0.6s; }
.book-card:nth-child(13) { animation-delay: 0.65s; }
.book-card:nth-child(14) { animation-delay: 0.7s; }
.book-card:nth-child(15) { animation-delay: 0.75s; }
.book-card:nth-child(16) { animation-delay: 0.8s; }
.book-card:nth-child(17) { animation-delay: 0.85s; }
.book-card:nth-child(18) { animation-delay: 0.9s; }
.book-card:nth-child(19) { animation-delay: 0.95s; }
.book-card:nth-child(20) { animation-delay: 1s; }

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
