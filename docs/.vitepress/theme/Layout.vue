<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { nextTick, provide, reactive } from 'vue'

import Live2d from "./components/Live2d.vue";
import MusicPlayer from "./components/MusicPlayer.vue";
import musicData from '../store/index';
import PostFooter from "./components/PostFooter.vue";
import Giscus from "./components/Giscus.vue";
import Avatar from "./components/Avatar.vue";

const { Layout } = DefaultTheme

const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})

const musicList = reactive(musicData.musicList)
const playbackState = reactive(musicData.playbackState)

provide('music-list', musicList)
provide('playback-state', playbackState)
</script>

<template>
  <Layout>
    <template #nav-bar-content-before>
      <MusicPlayer></MusicPlayer>
    </template>
    <template #home-hero-info-before>
      <Avatar />
    </template>
    <template #doc-footer-before>
      <PostFooter></PostFooter>
      <Giscus></Giscus>
    </template>
    <!-- <template #home-hero-info-after>
      <div class="slot-demo slot-hero-info-after">插槽：home-hero-info-after（标题/tagline 之后）</div>
    </template>
    <template #home-hero-actions-after>
      <div class="slot-demo slot-hero-actions-after">插槽：home-hero-actions-after（操作按钮之后）</div>
    </template>
    <template #home-hero-image>
      <div class="slot-demo slot-hero-image">插槽：home-hero-image（覆盖 Hero 图片）</div>
    </template>
    <template #home-hero-after>
      <div class="slot-demo slot-hero-after">插槽：home-hero-after（Hero 区之后）</div>
    </template>
    <template #home-features-before>
      <div class="slot-demo slot-features-before">插槽：home-features-before（Features 之前）</div>
    </template>
    <template #home-features-after>
      <div class="slot-demo slot-features-after">插槽：home-features-after（Features 之后）</div>
    </template> -->
  </Layout>
  <!-- Live2d 放在 Layout 外面，确保在所有页面渲染 -->
  <Live2d></Live2d>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

/* 首页没有 footer，去掉 VitePress 默认预留的 128px 底部外边距，避免无意义的竖向滚动条 */
.VPContent.is-home .VPHome {
  margin-bottom: 0;
}

/* ===== Home 插槽示例样式（确认位置后可删除） ===== */
.slot-demo {
  margin: 12px auto;
  padding: 12px 16px;
  max-width: 1152px;
  border: 1px dashed #3eaf7c;
  border-radius: 8px;
  background: rgba(62, 175, 124, 0.08);
  color: #3eaf7c;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.slot-hero-before   { border-color: #ecc64d; color: #b88900; background: rgba(236,198,77,.1); }
.slot-hero-info-before,
.slot-hero-info-after { border-color: #42b883; color: #2f9d6a; background: rgba(66,184,131,.08); }
.slot-hero-actions-after { border-color: #3586ff; color: #1f6fe0; background: rgba(53,134,255,.08); }
.slot-hero-image    { border-color: #ff7a45; color: #d95c2b; background: rgba(255,122,69,.08); }
.slot-hero-after    { border-color: #9254de; color: #7038c2; background: rgba(146,84,222,.08); }
.slot-features-before { border-color: #eb4d4b; color: #c13634; background: rgba(235,77,75,.08); }
.slot-features-after  { border-color: #130f40; color: #353b48; background: rgba(19,15,64,.05); }
.dark .slot-features-after { color: #cfd3dc; background: rgba(255,255,255,.05); }
</style>