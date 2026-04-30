<template>
  <div class="background" :style="backgroundStyle"></div>
</template>

<script lang="ts" setup>
import { watch, ref, computed, onMounted } from "vue";
import { useData } from "vitepress";

const { isDark } = useData();

// 背景图片 URLs
const bgUrls = {
  dark: {
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/yexi1.jpeg?imageView2/2/w/80/format/webp/q/30",
    full: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/yexi1.jpeg?imageView2/2/w/1920/format/webp/q/80",
  },
  light: {
    thumb: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/mingrixiang1.jpeg?imageView2/2/w/80/format/webp/q/30",
    full: "https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/mingrixiang1.jpeg?imageView2/2/w/1920/format/webp/q/80",
  },
};

// 当前背景 URL
const currentBgUrl = ref("");

// 计算样式
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${currentBgUrl.value})`,
}));

// 渐进式加载图片：先加载缩略图，再加载全尺寸图
function loadBackgroundProgressive(isDarkMode: boolean) {
  const { thumb, full } = isDarkMode ? bgUrls.dark : bgUrls.light;
  // 1. 先显示缩略图（极小文件，瞬间加载）
  currentBgUrl.value = thumb;
  // 2. 异步加载全尺寸图
  const img = new Image();
  img.onload = () => {
    // 3. 加载完成后切换到全尺寸图
    currentBgUrl.value = full;
  };
  img.src = full;
}

// 监听主题变化
watch(isDark, (newVal) => {
  loadBackgroundProgressive(newVal);
});

onMounted(() => {
  // 组件挂载时渐进式加载
  loadBackgroundProgressive(isDark.value);
});
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/yexi3.jpeg"); /* 替换为你的背景图片路径 */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  z-index: -1; /* 确保背景在最底层 */
  overflow-x: hidden;
}
</style>
<style>
.icon{
  fill: var(--vp-button-alt-text);
}
</style>