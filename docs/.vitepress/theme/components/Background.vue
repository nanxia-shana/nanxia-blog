<template>
  <div class="background"></div>
</template>

<script setup>

</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/nanxia-blog/bg/bg1.jpeg'); /* 替换为你的背景图片路径 */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  z-index: -1; /* 确保背景在最底层 */
}
</style>