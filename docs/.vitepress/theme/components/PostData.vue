<!-- .vitepress/theme/components/PostDate.vue -->
<script setup>
import { useData } from 'vitepress'

// 获取当前页面的 frontmatter 数据
const { frontmatter } = useData()

// 从 frontmatter 中获取日期，支持多种字段名
const publishDate = frontmatter.value?.date 
  || frontmatter.value?.publishDate 
  || frontmatter.value?.created
  || null

// 格式化日期
const formattedDate = publishDate 
  ? new Date(publishDate).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  : null
</script>

<template>
  <div v-if="formattedDate" class="post-date">
    📅 发布于：{{ formattedDate }}
  </div>
</template>

<style scoped>
.post-date {
  margin-top: 2rem;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>