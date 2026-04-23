<template>
  <div class="knowledge-collection">
    <div class="page-header">
      <h1>🌐 后端知识</h1>
      <p class="subtitle">深入后端技术栈，构建高性能、可扩展的服务端应用</p>
    </div>

    <div class="articles-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.title"
        :article="article"
        theme="backend"
      />
    </div>
  </div>
</template>

<script setup>
import ArticleCard from '../components/ArticleCard.vue';
import { backendArticles } from '../../data/knowledgeData';

const articles = backendArticles;
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

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .knowledge-collection {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
