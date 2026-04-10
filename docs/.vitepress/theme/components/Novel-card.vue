<template>
  <div class="card" ref="cardEl">
    <div class="first-content">
      <div class="info">
        <div class="title">{{ props.title }}</div>
        <div class="author">作者：{{ props.author }}</div>
      </div>
    </div>
    <div class="second-content">
      <!-- 低质量占位图 -->
      <div v-if="props.thumb && !isLoaded" class="thumb-placeholder" :style="{'--thumb': `url(${props.thumb})`}"></div>
      <!-- 原图 -->
      <div v-if="isLoaded" class="cover-bg" :style="{'--bg-cover': `url(${props.cover})`}"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
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
  .card {
    width: 100%;
    aspect-ratio: 190 / 254;
    background: linear-gradient(135deg, #8a2be2 0%, #d4af37 100%);
    transition: all 0.4s;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 5px rgba(138, 43, 226, 0.4);
  }

  @media (min-width: 769px) {
    .card {
      max-width: 190px;
    }
  }

  .thumb-placeholder {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(--thumb);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    filter: blur(8px);
    opacity: 0.7;
    z-index: -2;
    transition: opacity 300ms;
  }

  .cover-bg {
    width: 100%;
    height: 100%;
    background-image: var(--bg-cover);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .card:hover {
    border-radius: 15px;
    cursor: pointer;
    transform: scale(1.08);
    box-shadow: 0px 0px 15px 8px rgba(138, 43, 226, 0.6);
  }

  .first-content {
    height: 100%;
    width: 100%;
    transition: all 0.4s;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    border-radius: 15px;
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.95), rgba(212, 175, 55, 0.95));
  }

  .first-content .info {
    text-align: center;
    padding: 1rem;
  }

  .first-content .title {
    font-size: 1.4rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .first-content .author {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .card:hover .first-content {
    height: 0px;
    opacity: 0;
  }

  .second-content {
    height: 0%;
    width: 100%;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    transition: all 0.4s;
    transform: rotate(90deg) scale(-1);
    overflow: hidden;
    position: relative;
  }

  .card:hover .second-content {
    opacity: 1;
    height: 100%;
    transform: rotate(0deg);
  }
</style>
