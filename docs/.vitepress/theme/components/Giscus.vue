<script setup lang="ts">
import { useData } from 'vitepress'
import { nextTick, onMounted, ref, watch } from 'vue'

const { isDark, page } = useData()

const containerRef = ref<HTMLDivElement | null>(null)

function mountGiscus() {
  if (!containerRef.value) return
  containerRef.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'nanxia-shana/nanxia-blog')
  script.setAttribute('data-repo-id', 'R_kgDOPJfwQg')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOPJfwQs4DDQUN')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', isDark.value ? 'noborder_dark' : 'noborder_light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')

  containerRef.value.appendChild(script)
}

onMounted(async () => {
  await nextTick()
  mountGiscus()
})

// 路由切换时重新加载评论(SPA 下 script 不会自动重跑)
watch(
  () => page.value.relativePath,
  async () => {
    await nextTick()
    mountGiscus()
  }
)

// 暗色模式切换时只通知 iframe 改主题,不重新挂载
watch(isDark, (dark) => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? 'noborder_dark' : 'noborder_light' } } },
    'https://giscus.app'
  )
})
</script>

<template>
  <div class="giscus-wrapper">
    <div ref="containerRef"></div>
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 2rem;
  padding-top: 1rem;
}
</style>
