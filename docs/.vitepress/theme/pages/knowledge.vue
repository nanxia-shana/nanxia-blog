<template>
  <div class="knowledge-collection">
    <div class="page-header">
      <h1>📚 知识体系</h1>
      <p class="subtitle">全方位技术知识库，记录学习与成长的点滴</p>
    </div>

    <div class="category-grid">
      <div @click="router.go('/nanxia-blog/knowledge/frontend/')" class="category-card frontend">
        <div class="category-icon">💻</div>
        <h2>前端知识</h2>
        <p>深入探索前端技术栈，从基础到进阶的完整学习路径</p>
        <div class="article-count">{{ frontendCount }} 篇文章</div>
        <div class="arrow">→</div>
      </div>

      <div @click="router.go('/nanxia-blog/knowledge/backend/')" class="category-card backend">
        <div class="category-icon">🌐</div>
        <h2>后端知识</h2>
        <p>构建高性能、可扩展的服务端应用，掌握后端核心技术</p>
        <div class="article-count">{{ backendCount }} 篇文章</div>
        <div class="arrow">→</div>
      </div>

      <div @click="router.go('/nanxia-blog/knowledge/misc/')" class="category-card misc">
        <div class="category-icon">🧩</div>
        <h2>技术杂谈</h2>
        <p>开发工具、DevOps、系统运维等全方位技术知识分享</p>
        <div class="article-count">{{ miscCount }} 篇文章</div>
        <div class="arrow">→</div>
      </div>
    </div>
    
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
import { frontendArticles, backendArticles, miscArticles } from '../../data/knowledgeData';
import { useRouter } from 'vitepress'

const router = useRouter()

const frontendCount = frontendArticles.length;
const backendCount = backendArticles.length;
const miscCount = miscArticles.length;
</script>

<style scoped>
.knowledge-collection {
  margin: 0 auto;
  padding: 2rem;
  max-width: 1200px;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--vp-c-divider-light);
}

.page-header h1 {
  font-size: 2.2rem;
  line-height: normal;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  margin: 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 240px;
}

.category-card:hover {
  transform: translateY(-6px);
}

/* 前端主题 - 蓝色 */
.category-card.frontend:hover {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.08);
  box-shadow:
    0 12px 40px rgba(59, 130, 246, 0.2),
    0 0 0 1px rgba(59, 130, 246, 0.1) inset;
}

.category-card.frontend .category-icon {
  background: rgba(59, 130, 246, 0.15);
}

.category-card.frontend h2 {
  color: #3b82f6;
}

.category-card.frontend .article-count {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

/* 后端主题 - 绿色 */
.category-card.backend:hover {
  border-color: rgba(16, 185, 129, 0.6);
  background: rgba(16, 185, 129, 0.08);
  box-shadow:
    0 12px 40px rgba(16, 185, 129, 0.2),
    0 0 0 1px rgba(16, 185, 129, 0.1) inset;
}

.category-card.backend .category-icon {
  background: rgba(16, 185, 129, 0.15);
}

.category-card.backend h2 {
  color: #10b981;
}

.category-card.backend .article-count {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

/* 其他主题 - 紫色 */
.category-card.misc:hover {
  border-color: rgba(139, 92, 246, 0.6);
  background: rgba(139, 92, 246, 0.08);
  box-shadow:
    0 12px 40px rgba(139, 92, 246, 0.2),
    0 0 0 1px rgba(139, 92, 246, 0.1) inset;
}

.category-card.misc .category-icon {
  background: rgba(139, 92, 246, 0.15);
}

.category-card.misc h2 {
  color: #8b5cf6;
}

.category-card.misc .article-count {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-card h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.category-card p {
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  flex: 1;
}

.article-count {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 1.5rem;
  color: var(--vp-c-text-3);
  transition: all 0.3s ease;
}

.category-card:hover .arrow {
  transform: translateX(6px);
}

/* 响应式 */
@media (max-width: 768px) {
  .knowledge-collection {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    min-height: 200px;
    padding: 1.5rem;
  }
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