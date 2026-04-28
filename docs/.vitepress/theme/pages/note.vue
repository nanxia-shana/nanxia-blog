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
        class="note-item"
      >
        <span class="title">{{ note.title }}</span>
        <span class="date">{{ note.date }}</span>
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
// 根据屏幕宽度获取每页显示数量
const getPageSize = () => {
  if (window.innerWidth > 1440) return 20; // 2K+ 大屏
  if (window.innerWidth > 768) return 12; // 普通桌面
  return 8; // 移动端
};
const pageSize = ref(getPageSize()); // 响应式首屏数量
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
  font-weight: bold;
  font-size: 2.5rem;
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
  gap: 0.4rem;
  padding: 1.2rem;
  border-radius: 8px;
  background: rgba(128, 128, 128, 0.05);
  border: 1px solid rgba(255, 127, 80, 0.2);
}

/* 笔记项 */
.note-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.7rem 0.8rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  border-radius: 4px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
  animation: slideIn 0.3s ease backwards;
}

.note-item:nth-child(1) { animation-delay: 0.05s; }
.note-item:nth-child(2) { animation-delay: 0.1s; }
.note-item:nth-child(3) { animation-delay: 0.15s; }
.note-item:nth-child(4) { animation-delay: 0.2s; }
.note-item:nth-child(5) { animation-delay: 0.25s; }
.note-item:nth-child(6) { animation-delay: 0.3s; }
.note-item:nth-child(7) { animation-delay: 0.35s; }
.note-item:nth-child(8) { animation-delay: 0.4s; }
.note-item:nth-child(9) { animation-delay: 0.45s; }
.note-item:nth-child(10) { animation-delay: 0.5s; }
.note-item:nth-child(11) { animation-delay: 0.55s; }
.note-item:nth-child(12) { animation-delay: 0.6s; }
.note-item:nth-child(13) { animation-delay: 0.65s; }
.note-item:nth-child(14) { animation-delay: 0.7s; }
.note-item:nth-child(15) { animation-delay: 0.75s; }
.note-item:nth-child(16) { animation-delay: 0.8s; }
.note-item:nth-child(17) { animation-delay: 0.85s; }
.note-item:nth-child(18) { animation-delay: 0.9s; }
.note-item:nth-child(19) { animation-delay: 0.95s; }
.note-item:nth-child(20) { animation-delay: 1s; }

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

/* 最后一项不需要分割线 */
.note-item:last-child {
  border-bottom: none;
}

.note-item .title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.note-item .date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-left: 1rem;
}

.note-item:hover {
  background: radial-gradient(ellipse at center, rgba(255, 127, 80, 0.25) 0%, rgba(255, 127, 80, 0.05) 60%, transparent 100%);
}

.note-item:hover .title {
  color: #cc5500;
}

html.dark .note-item:hover {
  background: radial-gradient(ellipse at center, rgba(255, 127, 80, 0.35) 0%, rgba(255, 127, 80, 0.1) 60%, transparent 100%);
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
@media (max-width: 500px) {
  .notes-collection {
    padding: 1rem;
  }
  .note-item {
    flex-direction: column;
    gap: 0.2rem;
    align-items: flex-start;
  }
  .date {
    padding-left: 0.2rem;
  }
}
</style>
