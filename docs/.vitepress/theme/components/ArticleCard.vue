<template>
  <div @click="router.go(article.link)" class="article-card" :data-theme="theme">
    <span class="category-badge" :data-category="article.category">{{ article.category }}</span>
    <h3 class="article-title">{{ article.title }}</h3>
    <p class="article-desc">{{ article.description }}</p>
    <div class="arrow-icon">→</div>
  </div>
</template>

<script setup lang="ts">
import { ArticleItem } from '../../data/knowledgeData';
import { useRouter } from 'vitepress'

const router = useRouter()

defineProps<{
  article: ArticleItem;
  theme: 'frontend' | 'backend' | 'misc';
}>();
</script>

<style scoped>
.article-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1.5px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 160px;
}

.article-card:hover {
  transform: translateY(-4px);
}

/* 前端主题 - 蓝色系 */
.article-card[data-theme="frontend"]:hover {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.08);
  box-shadow:
    0 8px 32px rgba(59, 130, 246, 0.15),
    0 0 0 1px rgba(59, 130, 246, 0.1) inset;
}

/* 后端主题 - 绿色系 */
.article-card[data-theme="backend"]:hover {
  border-color: rgba(16, 185, 129, 0.6);
  background: rgba(16, 185, 129, 0.08);
  box-shadow:
    0 8px 32px rgba(16, 185, 129, 0.15),
    0 0 0 1px rgba(16, 185, 129, 0.1) inset;
}

/* 更多主题 - 紫色系 */
.article-card[data-theme="misc"]:hover {
  border-color: rgba(139, 92, 246, 0.6);
  background: rgba(139, 92, 246, 0.08);
  box-shadow:
    0 8px 32px rgba(139, 92, 246, 0.15),
    0 0 0 1px rgba(139, 92, 246, 0.1) inset;
}

/* 分类徽章统一配色 - 基础 */
.category-badge[data-category="基础"] {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* 分类徽章统一配色 - 调试 */
.category-badge[data-category="调试"] {
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

/* 分类徽章统一配色 - 架构 */
.category-badge[data-category="架构"] {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

/* 分类徽章统一配色 - 工程 */
.category-badge[data-category="工程"] {
  background: rgba(20, 184, 166, 0.15);
  color: #14b8a6;
  border: 1px solid rgba(20, 184, 166, 0.3);
}

/* 分类徽章统一配色 - 面试 */
.category-badge[data-category="面试"] {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* 分类徽章统一配色 - 性能 */
.category-badge[data-category="性能"] {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

/* 分类徽章统一配色 - 数据库 */
.category-badge[data-category="数据库"] {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

/* 分类徽章统一配色 - DevOps */
.category-badge[data-category="DevOps"] {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* 分类徽章统一配色 - 工具 */
.category-badge[data-category="工具"] {
  background: rgba(107, 114, 128, 0.15);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

/* 分类徽章统一配色 - 系统 */
.category-badge[data-category="系统"] {
  background: rgba(161, 98, 7, 0.15);
  color: #a16207;
  border: 1px solid rgba(161, 98, 7, 0.3);
}

.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.article-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  padding-right: 4rem;
}

.article-desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  flex: 1;
}

.arrow-icon {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  font-size: 1.2rem;
  color: var(--vp-c-text-3);
  transition: all 0.3s ease;
}

.article-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* 前端主题悬停时箭头颜色 */
.article-card[data-theme="frontend"]:hover .arrow-icon {
  color: #3b82f6;
}

/* 后端主题悬停时箭头颜色 */
.article-card[data-theme="backend"]:hover .arrow-icon {
  color: #10b981;
}

/* 其他主题悬停时箭头颜色 */
.article-card[data-theme="misc"]:hover .arrow-icon {
  color: #8b5cf6;
}
</style>
