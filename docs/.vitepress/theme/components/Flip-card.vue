<template>
  <div class="flip-card" ref="cardEl">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <p class="title">{{ props.title }}</p>
            <p>{{ props.author }}</p>
        </div>
        <div class="flip-card-back">
            <!-- 低质量占位图 -->
            <div v-if="props.thumb && !isLoaded" class="thumb-placeholder" :style="{'--thumb': `url(${props.thumb})`}"></div>
            <!-- 原图 -->
            <div v-if="isLoaded" class="cover-image" :style="{'--bg-cover': `url(${props.cover})`}"></div>
        </div>
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
/* From Uiverse.io by joe-watson-sbf */
.flip-card {
  background-color: transparent;
  width: 100%;
  aspect-ratio: 190 / 254;
  max-width: 190px;
  perspective: 1000px;
  font-family: sans-serif;
  cursor: pointer;
}

@media (max-width: 768px) {
  .flip-card {
    max-width: none;
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
  border-radius: 1rem;
  filter: blur(8px);
  opacity: 0.7;
  z-index: -2;
  transition: opacity 300ms;
}

.cover-image {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--bg-cover);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  border-radius: 1rem;
  filter: blur(0px);
  opacity: 100%;
  z-index: -2;
  transition: all 300ms;
}

.title {
  font-size: 1.3em;
  font-weight: 900;
  text-align: center;
  margin: 0 0 0.5rem 0;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border: 1px solid coral;
  border-radius: 1rem;
}

.flip-card-front {
  background: linear-gradient(120deg, bisque 60%, rgb(255, 231, 222) 88%,
     rgb(255, 211, 195) 40%, rgba(255, 127, 80, 0.603) 48%);
  color: coral;
  opacity: 0.9
}

.flip-card-back {
  /* background: linear-gradient(120deg, rgb(255, 174, 145) 30%, coral 88%,
     bisque 40%, rgb(255, 185, 160) 78%); */
  background-color: transparent;
  color: white;
  transform: rotateY(180deg);
  overflow: hidden;
}
</style>
