<template>
  <div class="flip-card">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <p class="title">{{ props.title }}</p>
            <p>{{ props.author }}</p>
        </div>
        <div class="flip-card-back" :style="{'--bg-cover': `url(${props.cover})`}">
            <!-- <p class="title">{{ props.title }}</p>
            <p>{{ props.author }}</p> -->
        </div>
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
/* From Uiverse.io by joe-watson-sbf */ 
.flip-card {
  background-color: transparent;
  width: 190px;
  height: 254px;
  perspective: 1000px;
  font-family: sans-serif;
  cursor: pointer;
}

.title {
  font-size: 1.3em;
  font-weight: 900;
  text-align: center;
  margin: 0 0 0.5rem 0;
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
  color: coral;
  opacity: 0.9
}

.flip-card-back {
  /* background: linear-gradient(120deg, rgb(255, 174, 145) 30%, coral 88%,
     bisque 40%, rgb(255, 185, 160) 78%); */
  background-image: var(--bg-cover);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  color: white;
  transform: rotateY(180deg);
}
</style>
