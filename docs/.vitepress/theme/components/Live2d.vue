<template>
  <div id="landlord" ref="landlordRef">
    <div class="message" :style="{ opacity: messageOpacity }"></div>
    <canvas 
      id="live2d" 
      width="200" 
      height="200" 
      class="live2d"
      ref="live2dCanvas"
    ></canvas>
    <div class="hide-button" @click="toggleLive2D">
      隐藏
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 响应式状态
const messageOpacity = ref(0)
const live2dCanvas = ref(null)
const landlordRef = ref(null)
const isVisible = ref(true)

// 配置路径（根据实际路径修改）
const messagePath = "/nanxia-blog/live2d/"
const homePath = "https://haremu.com/"
const modelPath = "/nanxia-blog/live2d/model/tia/model.json"

// 动态加载JS脚本
const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

// 初始化Live2D
const initLive2D = async () => {
  try {
    // 设置全局变量（原代码中的var声明）
    window.message_Path = messagePath
    window.home_Path = homePath
    
    // 加载依赖脚本
    await loadScript("/nanxia-blog/live2d/js/live2d.js")
    await loadScript("/nanxia-blog/live2d/js/message.js")
    
    // 调用Live2D初始化
    if (typeof window.loadlive2d === 'function') {
      window.loadlive2d("live2d", modelPath)
    }
  } catch (error) {
    console.error('Live2D初始化失败:', error)
  }
}

// 切换显示/隐藏
const toggleLive2D = () => {
  isVisible.value = !isVisible.value
  if (landlordRef.value) {
    landlordRef.value.style.display = isVisible.value ? 'block' : 'none'
  }
}

onMounted(() => {
  // 检查是否已加载jQuery
  if (!window.jQuery) {
    const jqueryScript = document.createElement('script')
    jqueryScript.src = 'https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js'
    document.head.appendChild(jqueryScript)
    
    jqueryScript.onload = initLive2D
  } else {
    initLive2D()
  }
})

onBeforeUnmount(() => {
  // 清理动态添加的脚本
  const scripts = [
    'https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js',
    '/live2d/js/live2d.js',
    '/live2d/js/message.js'
  ]
  
  scripts.forEach(src => {
    const script = document.querySelector(`script[src="${src}"]`)
    if (script) document.head.removeChild(script)
  })
})
</script>

<style scoped>
#landlord {
  user-select: none;
  position: fixed;
  left: 10px;
  bottom: 0;
  width: 200px;
  height: 200px;
  z-index: 10000;
  font-size: 0;
  transition: all 0.3s ease-in-out;
}

#live2d {
  position: relative;
}

.message {
  color: #fff;
  opacity: 0;
  width: 200px;
  height: auto;
  margin: auto;
  padding: 7px;
  top: -70px;
  left: 0px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background-color: rgba(255, 137, 255, 0.2);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
  font-size: 13px;
  font-weight: 400;
  text-overflow: ellipsis;
  text-transform: uppercase;
  overflow: hidden;
  position: absolute;
  animation-delay: 5s;
  animation-duration: 50s;
  animation-iteration-count: infinite;
  animation-name: shake;
  animation-timing-function: ease-in-out;
}

.hide-button {
  color: #fff;
  position: absolute;
  top: 10px;
  right: 0;
  /* bottom: 30px; */
  display: none;
  overflow: hidden;
  /* padding: 4px; */
  width: 46px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background: rgba(255, 137, 255, 0.2);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  cursor: pointer;
}

.hide-button:hover {
  border: 1px solid #f4a7b9;
  /* background: #f4f6f8; */
}

@media (max-width: 860px) {
  #landlord {
    display: none;
  }
}

@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }

  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }

  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }

  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }

  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }

  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }

  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }

  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }

  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }

  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }

  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }

  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }

  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }

  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }

  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }

  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }

  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }

  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }

  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }

  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }

  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }

  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }

  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }

  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }

  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }

  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
}

</style>