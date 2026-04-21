<template>
  <div class="flip-card" ref="cardEl">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <div class="book-info">
              <h3 class="book-title">{{ props.title }}</h3>
              <p class="book-author">{{ props.author }}</p>
              <div class="divider"></div>
              <p class="book-note">{{ props.note }}</p>
            </div>
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
  note: {
    type: String,
    default: '',
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
  padding: 1.2rem;
  box-sizing: border-box;
}

.book-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 0.5rem 0;
  box-sizing: border-box;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #d2691e;
  margin: 0;
  line-height: 1.4;
  font-family: "Noto Serif SC", serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8rem;
  flex-shrink: 0;
}

.book-author {
  font-size: 0.85rem;
  color: #a0522d;
  margin: 0.4rem 0;
  font-family: "Noto Serif SC", serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cd853f, transparent);
  margin: 0.4rem auto;
  flex-shrink: 0;
}

.book-note {
  font-size: 0.78rem;
  color: #8b4513;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: "Noto Serif SC", serif;
  opacity: 0.9;
  flex: 1;
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
