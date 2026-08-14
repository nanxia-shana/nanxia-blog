<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()

// 源图 1600x2900，通过 COS imageMogr2 在 CDN 侧裁剪顶部居中方块并缩放，避免浏览器端激进缩放导致发糊
const imgArgs = 'imageMogr2/crop/1600x1600/gravity/north/thumbnail/320x320/quality/85'
const lightSrc = `https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/shana_black.jpg?${imgArgs}`
const darkSrc = `https://nanxia-1309728409.cos.ap-chongqing.myqcloud.com/Shana/image/shana_red.jpg?${imgArgs}`
</script>

<template>
  <div class="avatar">
    <div class="avatar__ring">
      <div class="avatar__stack">
        <img :src="lightSrc" alt="南夏" class="avatar__img" :class="{ 'is-active': !isDark }" />
        <img :src="darkSrc" alt="南夏" class="avatar__img" :class="{ 'is-active': isDark }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-self: flex-start;
  margin: 0 0 20px;
}

.avatar__ring {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #3eaf7c, #42b883 50%, #3586ff);
  box-shadow: 0 8px 24px rgba(62, 175, 124, 0.25);
  overflow: hidden;
}

.avatar__stack {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
}

.avatar__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  /* 原图不是 1:1，取上方中心的正方形区域（CDN 已裁好，这里作为保险） */
  object-position: center top;
  display: block;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 0.35s ease, transform 0.6s ease;
  will-change: opacity;
}

.avatar__img.is-active {
  opacity: 1;
  transform: scale(1);
}
</style>
