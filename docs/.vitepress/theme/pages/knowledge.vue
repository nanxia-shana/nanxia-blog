<script setup>

</script>

<template>
  <div class="knowledge-collection">
    <div v-for="category in linksData" :key="category.title" class="category">
      <h2>{{ category.icon }} {{ category.title }}</h2>
      <div class="links">
        <div v-for="link in category.links" :key="link.url" :class="['link-item', `link-${link.type}`]">
          <a :href="link.url" target="_blank" class="link-name">{{ link.name }}</a>
          <span class="link-url">{{ link.url }}</span>
          <span v-if="link.type === 'hot'" class="link-tag hot-tag">热门</span>
          <span v-else-if="link.type === 'personal'" class="link-tag personal-tag">常用</span>
        </div>
      </div>
    </div>

    <footer>
      <p>© 2026 前端网址导航 | 持续更新中 💻🎯</p>
    </footer>
  </div>
</template>

<script setup>
import { linksData } from '../../data/linksData.ts';
</script>

<style scoped>
.knowledge-collection {
  margin: 0 auto;
  padding: 2rem;
  max-width: 1200px;
}

.category {
  background: var(--vp-sidebar-bg-color);
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.category:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.category h2 {
  background: var(--vp-sidebar-bg-color);
  padding: 0.75rem 1rem;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 0;
  font-weight: 600;
}

.links {
  padding: 0.75rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.5rem;
}

.link-item {
  position: relative;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  transition: all 0.25s ease;
  cursor: pointer;
}

.link-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

/* 普通链接 - 默认样式 */
.link-normal {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
}

.link-normal:hover {
  border-color: var(--vp-c-divider-dark);
}

/* 自用链接 - 蓝色 */
.link-personal {
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid #3b82f6;
}

.link-personal:hover {
  background: rgba(59, 130, 246, 0.18);
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.25);
}

/* 热门链接 - 红色 */
.link-hot {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
}

.link-hot:hover {
  background: rgba(239, 68, 68, 0.18);
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.25);
}

.link-name {
  display: block;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
  transition: color 0.2s;
}

.link-item:hover .link-name {
  color: var(--vp-c-brand-1);
}

.link-url {
  display: block;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  word-break: break-all;
  line-height: 1.3;
}

.link-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  font-size: 0.6rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-weight: 500;
}

.personal-tag {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.hot-tag {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

footer {
  text-align: center;
  padding: 2rem 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

footer p {
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .knowledge-collection {
    padding: 1rem;
  }

  .links {
    grid-template-columns: 1fr;
  }

  .category h2 {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  .link-item {
    padding: 0.75rem;
  }

  .link-tag {
    display: none;
  }
}
</style>