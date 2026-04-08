<template>
  <div class="card">
    <div class="first-content">
      <div class="info">
        <div class="title">{{ props.title }}</div>
        <div class="author">作者：{{ props.author }}</div>
      </div>
    </div>
    <div class="second-content">
      <div class="cover-bg" :style="{'--bg-cover': `url(${props.cover})`}"></div>
    </div>
  </div>
</template>
<script setup>
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
});
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
  }

  .cover-bg {
    width: 100%;
    height: 100%;
    background-image: var(--bg-cover);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .card:hover .second-content {
    opacity: 1;
    height: 100%;
    transform: rotate(0deg);
  }
</style>
