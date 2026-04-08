<template>
  <div class="card" :style="{'--bg-cover': `url(${props.cover})`}">
    <div class="border"></div>
    <div class="content">
      <div class="logo">
        <div class="text">
          {{ props.title }}
        </div>
        <span class="trail"></span>
      </div>
      <span class="logo-bottom-text">开发商： {{ props.author }}</span>
    </div>
    <span class="bottom-text">{{ props.platform.join(" / ") }}</span>
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
  platform: {
    type: Array,
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
  width: 320px;
  height: 180px;
  position: relative;
  display: grid;
  place-content: center;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
  background-image: var(--bg-cover);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
/* 16:9 = 320 / 180 = 1.778 */

#logo-main, #logo-second {
  height: 100%;
}

#logo-main {
  fill: rgba(52, 211, 153, 1);
}

#logo-second {
  padding-bottom: 10px;
  fill: none;
  stroke: rgba(52, 211, 153, 1);
  stroke-width: 1px;
}

.border {
  position: absolute;
  inset: 0px;
  border: 2px solid rgba(52, 211, 153, 1);
  opacity: 0;
  transform: rotate(10deg);
  transition: all 0.5s ease-in-out;

}

.bottom-text {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  font-size: 6px;
  text-transform: uppercase;
  padding: 0px 5px 0px 8px;
  color: rgba(52, 211, 153, 1);
  /* background: rgba(36, 49, 55, 0.4); */
  opacity: 0;
  letter-spacing: 3px;
  transition: all 0.5s ease-in-out;
}

.content {
  transform: translateY(-30%);
  transition: all 0.5s ease-in-out;
}

.content .logo {
  height: 35px;
  position: relative;
  width: 0;
  overflow: hidden;
  transition: all 1s ease-in-out;
}

.content .logo .text {
  height: 35px;
  color: rgba(52, 211, 153, 1);
  line-height: 35px;
  white-space: nowrap;
  text-align: center;
}

.content .logo .trail {
  position: absolute;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
}

.content .logo-bottom-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: 30px;
  color: rgba(52, 211, 153, 1);
  white-space: nowrap;
  padding-left: 8px;
  font-size: 11px;
  opacity: 0;
  letter-spacing: none;
  transition: all 0.5s ease-in-out 0.5s;
}

.card:hover {
  border-radius: 0;
  transform: scale(1.1);
}

.card:hover .logo {
  width: 100%;
  animation: opacity 1s ease-in-out;
}

.card:hover .border {
  background-color: rgba(36, 49, 55, 0.8);
  inset: 15px;
  opacity: 1;
  transform: rotate(0);
}

.card:hover .bottom-text {
  letter-spacing: 3px;
  opacity: 1;
  transform: translateX(-50%);
}

.card:hover .content .logo-bottom-text {
  opacity: 1;
  letter-spacing: 3px;
}

.card:hover .trail {
  animation: trail 1s ease-in-out;
}

@keyframes opacity {
  0% {
    border-right: 1px solid transparent;
  }

  10% {
    border-right: 1px solid rgba(52, 211, 153, 1);
  }

  80% {
    border-right: 1px solid rgba(52, 211, 153, 1);
  }

  100% {
    border-right: 1px solid transparent;
  }
}

@keyframes trail {
  0% {
    background: linear-gradient(90deg, rgba(110, 231, 183, 0) 90%, rgb(110, 231, 183) 100%);
    opacity: 0;
  }

  30% {
    background: linear-gradient(90deg, rgba(110, 231, 183, 0) 70%, rgb(110, 231, 183) 100%);
    opacity: 1;
  }

  70% {
    background: linear-gradient(90deg, rgba(110, 231, 183, 0) 70%, rgb(110, 231, 183) 100%);
    opacity: 1;
  }

  95% {
    background: linear-gradient(90deg, rgba(110, 231, 183, 0) 90%, rgb(110, 231, 183) 100%);
    opacity: 0;
  }
}
</style>