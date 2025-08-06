<template>
  <div class="background" :style="backgroundStyle"></div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useData } from "vitepress";

const { isDark } = useData();

// 1. 定义响应式的 style 对象
const backgroundStyle = ref({
  backgroundImage: "url(/nanxia-blog/bg/light-theme.jpeg)", // 默认浅色主题
});

// 2. 监听 isDark 变化
watch(isDark, (newVal) => {
  if (newVal) {
    backgroundStyle.value = {
      backgroundImage: "url(/nanxia-blog/bg/dark-theme.jpeg)",
    };
  } else {
    backgroundStyle.value = {
      backgroundImage: "url(/nanxia-blog/bg/light-theme.jpeg)",
    };
  }
});

onMounted(() => {
  // 组件挂载时根据当前主题设置背景
  if(isDark.value) {
    backgroundStyle.value = {
      backgroundImage: "url(/nanxia-blog/bg/dark-theme.jpeg)",
    };
  } else {
    backgroundStyle.value = {
      backgroundImage: "url(/nanxia-blog/bg/light-theme.jpeg)",
    };
  }
});
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/nanxia-blog/bg/yexi3.jpeg"); /* 替换为你的背景图片路径 */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  z-index: -1; /* 确保背景在最底层 */
}
</style>
<style>
.icon{
  fill: var(--vp-button-alt-text);
}
</style>