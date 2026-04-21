<template>
  <div class="card" ref="cardEl">
    <div class="content">
      <div class="back">
        <div class="back-content" :style="{'--bg-cover': `url(${props.cover})`}">
          <!-- <strong>Hover Me</strong> -->
        </div>
      </div>
      <div class="front">
        <div class="img">
          <div class="circle" :style="{ backgroundColor: color1 }"></div>
          <div class="circle" id="right" :style="{ backgroundColor: color2 }"></div>
          <div class="circle" id="bottom" :style="{ backgroundColor: color3 }"></div>
        </div>
        <div class="front-content">
          <small class="badge">{{ props.country }}</small>
          <div class="movie-note">{{ props.note }}</div>
          <div class="description">
            <div class="title">
              <p class="title">
                <strong>{{ props.title }}</strong>
              </p>
              <svg fill-rule="nonzero" height="15px" width="15px" viewBox="0,0,256,256" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g style="mix-blend-mode: normal" text-anchor="none" font-size="none" font-weight="none" font-family="none" stroke-dashoffset="0" stroke-dasharray="" stroke-miterlimit="10" stroke-linejoin="miter" stroke-linecap="butt" stroke-width="1" stroke="none" fill-rule="nonzero" fill="#20c997"><g transform="scale(8,8)"><path d="M25,27l-9,-6.75l-9,6.75v-23h18z"></path></g></g></svg>
            </div>
            <p class="card-footer">
              {{ props.runtime }} Mins &nbsp; | &nbsp; {{ props.year }}
            </p>
          </div>
        </div>
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
  country: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
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

// 预定义几组和谐的配色方案
const colorSchemes = [
  ['#ffbb66', '#ff8866', '#ff2233'], // 原配色（橙红）
  ['#66bbff', '#4488ff', '#2233ff'], // 蓝系
  ['#66ffbb', '#44ddaa', '#22bb88'], // 绿系
  ['#ff66bb', '#dd4488', '#bb2266'], // 粉紫系
  ['#aabbff', '#8866dd', '#5533bb'], // 紫蓝系
  ['#ffdd66', '#ffaa33', '#ff7700'], // 金黄系
  ['#88ddff', '#66aadd', '#4488bb'], // 青蓝
  ['#ff9966', '#dd6644', '#bb3322'], // 橙红
]

// 随机选择一组配色
const randomIndex = Math.floor(Math.random() * colorSchemes.length)
const [color1, color2, color3] = colorSchemes[randomIndex]
</script>

<style scoped>
/* From Uiverse.io by ElSombrero2 */
.card {
  overflow: visible;
  width: 100%;
  aspect-ratio: 190 / 254;
  max-width: 190px;
}

@media (max-width: 768px) {
  .card {
    max-width: none;
  }
}

.content {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 300ms;
  box-shadow: 0px 0px 10px 1px #000000ee;
  border-radius: 5px;
}

.front, .back {
  background-color: #151515;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 5px;
  overflow: hidden;
}

.back {
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.back::before {
  position: absolute;
  content: ' ';
  display: block;
  width: 160px;
  height: 160%;
  background: linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent);
  animation: rotation_481 5000ms infinite linear;
}

.back-content {
  position: absolute;
  width: 99%;
  height: 99%;
  /* background-color: #151515; */
  background-color: transparent;
  background-image: var(--bg-cover);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.content {
  transform: rotateY(180deg);
}

.card:hover .content {
  transform: rotateY(0deg);
}

@keyframes rotation_481 {
  0% {
    transform: rotateZ(0deg);
  }

  0% {
    transform: rotateZ(360deg);
  }
}

.front {
  transform: rotateY(180deg);
  color: white;
}

.front .front-content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.front-content .badge {
  font-size: 0.7rem;
  background-color: #00000055;
  padding: 2px 10px;
  border-radius: 10px;
  backdrop-filter: blur(2px);
  width: fit-content;
}

.movie-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8px 10px;
  border-radius: 6px;
  margin: 8px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  backdrop-filter: blur(2px);
  /* border-left: 2px solid rgba(255, 153, 102, 0.6); */
  flex-grow: 1;
}

.description {
  box-shadow: 0px 0px 10px 5px #00000088;
  width: 100%;
  padding: 10px;
  background-color: #00000099;
  backdrop-filter: blur(5px);
  border-radius: 5px;
}

.title {
  font-size: 1rem;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
}

.title p {
  width: 90%;
}

.card-footer {
  color: #ffffff88;
  margin-top: 5px;
  font-size: 12px;
}

.front .img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  position: relative;
  filter: blur(15px);
  animation: floating 2600ms infinite linear;
}

#bottom {
  left: 50px;
  top: 0px;
  width: 150px;
  height: 150px;
  animation-delay: -800ms;
}

#right {
  left: 160px;
  top: -80px;
  width: 30px;
  height: 30px;
  animation-delay: -1800ms;
}

@keyframes floating {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
