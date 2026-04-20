<template>
  <a :href="coverLink" target="_blank" class="card-link">
    <div class="card" ref="cardEl">
      <!-- 缩略图占位 -->
      <div v-if="props.thumb && !isLoaded" class="thumb" :style="{backgroundImage: `url(${props.thumb})`}"></div>
      <!-- 封面图 -->
      <div v-if="isLoaded" class="cover" :style="{backgroundImage: `url(${props.cover})`}"></div>
      <!-- 底部信息遮罩 -->
      <div class="info-overlay">
        <div class="title">{{ props.title }}</div>
        <div class="author">{{ props.author }}</div>
      </div>
    </div>
  </a>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  thumb: {
    type: String,
    default: null,
  },
});

const cardEl = ref(null)
const isLoaded = ref(false)
const coverLink = computed(() => {
  // 可以这里配置点击跳转链接，现在直接打开封面图片
  return props.cover
})

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    // 兼容老浏览器：直接加载
    isLoaded.value = true
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 开始加载原图
        const img = new Image()
        img.onload = () => {
          isLoaded.value = true
        }
        img.src = props.cover
        observer.unobserve(cardEl.value)
      }
    })
  }, {
    // 提前 200px 开始加载
    rootMargin: '200px'
  })

  observer.observe(cardEl.value)
})
</script>
<style scoped>
  .card-link {
    text-decoration: none;
    display: block;
    width: 100%;
  }

  .card {
    position: relative;
    width: 100%;
    aspect-ratio: 190 / 254;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    background: #f5f5f5;
    margin: 0 auto;
  }

  @media (min-width: 769px) {
    .card {
      max-width: 190px;
    }
  }

  .thumb, .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .thumb {
    filter: blur(6px);
    opacity: 0.8;
  }

  .info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.2rem 0.8rem 0.8rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%);
    color: #fff;
    text-align: center;
    transform: translateY(4px);
    transition: all 0.3s ease;
  }

  .info-overlay .title {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 0.3rem;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    letter-spacing: 0.5px;
  }

  .info-overlay .author {
    font-size: 0.85rem;
    opacity: 0.85;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    font-weight: normal;
  }

  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 10px 24px rgba(138, 43, 226, 0.35);
  }

  .card:hover .info-overlay {
    transform: translateY(0);
  }

  html.dark .card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
</style>
