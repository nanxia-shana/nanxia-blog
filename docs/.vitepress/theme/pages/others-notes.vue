<template>
  <div class="notes-collection">
    <h1>✍️ 闲窗细语​​</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="notes-list">
      <a
        v-for="note in displayedNotes"
        :key="note.title"
        :href="note.link"
        class="note-card"
      >
        <div class="note-info">
          <div class="note-header">
            <h2>{{ note.title }}</h2>
            <span class="date">{{ note.date }}</span>
          </div>
          <p class="excerpt">{{ note.excerpt }}</p>
          <div class="tags">
            <span v-for="tag in note.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div v-if="note.cover" class="note-cover">
          <img :src="note.cover" :alt="note.title" />
        </div>
      </a>
      <div v-if="hasMore" ref="loadMoreTrigger" class="loading-trigger"></div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="!hasMore && displayedNotes.length > 0" class="end-text">已经到底啦 📝</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { noteList } from '../../data/notesData.ts';

// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "随笔", value: "随笔" },
  { label: "文章", value: "文章" },
  { label: "生活", value: "生活" },
];

// 当前选中的分类
const currentCategory = ref("all");

// 笔记数据
const notes = ref(noteList);

// 分页
const pageSize = ref(5);
const currentPage = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const loadMoreTrigger = ref(null);

// 过滤后的笔记列表
const filteredNotes = computed(() => {
  if (currentCategory.value === "all") {
    // 按日期倒序排列
    return notes.value.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else {
    return notes.value
      .filter((note) => note.category === currentCategory.value)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
});

// 当前显示的笔记
const displayedNotes = computed(() => {
  return filteredNotes.value.slice(0, currentPage.value * pageSize.value);
});

// 检查是否还有更多
watch(displayedNotes, () => {
  hasMore.value = displayedNotes.value.length < filteredNotes.value.length;
});

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  setTimeout(() => {
    currentPage.value++;
    loading.value = false;
  }, 300);
};

// 设置分类
const setCategory = (category) => {
  currentCategory.value = category;
  currentPage.value = 1;
};

// 无限滚动
let observer = null;

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        loadMore();
      }
    }, {
      rootMargin: '200px'
    });
    if (loadMoreTrigger.value) {
      observer.observe(loadMoreTrigger.value);
    }
  }
});
</script>

<style scoped>
.notes-collection {
  margin: 0 auto;
  padding: 2rem;
  max-width: 900px;
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
  content: "「闲窗听雨摊书卷，独看烟霞静识人」";
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
  background: rgba(255, 127, 80, 0.4);
  border-color: rgba(255, 127, 80, 0.8);
  box-shadow: 0 3px 15px 2px rgba(255, 127, 80, 0.4);
}

/* 笔记列表 */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 笔记卡片 */
.note-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-image: linear-gradient(135deg, #ffaa80, #ff7f50) 1;
  box-shadow: 0 2px 15px rgba(255, 127, 80, 0.15);
  transition: all 0.3s;
  background: linear-gradient(120deg, rgba(255, 127, 80, 0.08) 0%, transparent 100%);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  position: relative;
}

/* 渐变圆角边框 */
.note-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(135deg, #ffaa80, #ff7f50);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}

html.dark .note-card {
  background: linear-gradient(120deg, rgba(255, 127, 80, 0.15) 0%, transparent 100%);
}

.note-card:hover {
  background: rgba(255, 127, 80, 0.15);
  box-shadow: 0 8px 25px 5px rgba(255, 127, 80, 0.25);
  transform: translateY(-3px);
}

html.dark .note-card:hover {
  background: rgba(255, 127, 80, 0.25);
}

.note-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.8rem;
}

.note-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: bold;
  color: #cc5500;
}

.date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.excerpt {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

html.dark .excerpt {
  color: var(--vp-c-text-1);
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(255, 127, 80, 0.2);
  color: #cc5500;
}

.note-cover {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
}

.note-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 加载状态 */
.loading-trigger {
  height: 20px;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.end-text {
  text-align: center;
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .note-card {
    flex-direction: column;
  }

  .note-cover {
    width: 100%;
    height: 160px;
  }

  .note-header {
    flex-direction: column;
    gap: 0.3rem;
  }
}

@media (max-width: 500px) {
  .notes-collection {
    padding: 1rem;
  }
}
</style>
