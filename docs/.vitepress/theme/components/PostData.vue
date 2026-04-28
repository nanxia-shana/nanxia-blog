<!-- .vitepress/theme/components/PostDate.vue -->
<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

// 获取当前页面的 frontmatter 数据
const { frontmatter } = useData()

// 从 frontmatter 中获取日期，支持多种字段名（使用计算属性确保响应式）
const publishDate = computed(() =>
  frontmatter.value?.date
  || frontmatter.value?.publishDate
  || frontmatter.value?.created
  || null
)

const footertext = computed(() => frontmatter.value?.footertext || null)

// 格式化日期
const formattedDate = computed(() =>
  publishDate.value
    ? new Date(publishDate.value).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null
)
</script>

<template>
  <div v-if="formattedDate" class="post-date">
    📅 发布于：{{ formattedDate }}
  </div>
  <div v-if="footertext" class="post-footer">
    {{ footertext }}
  </div>
</template>

<style scoped>
.post-date {
  margin-top: 2rem;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
.post-footer {
  margin-top: 1rem;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>