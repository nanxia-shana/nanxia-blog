<template>
  <div class="front-collection">
    <div class="card">
      <div class="card__content">
        <p class="card__title">Card Title</p>
        <p class="card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__content">
        <p class="card__title">Card Title</p>
        <p class="card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__content">
        <p class="card__title">Card Title</p>
        <p class="card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__content">
        <p class="card__title">Card Title</p>
        <p class="card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__content">
        <p class="card__title">Card Title</p>
        <p class="card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>
    
  </div>
</template>

<script setup>
</script>

<style scoped>
.front-collection {
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  max-width: calc(300px * 3 + 20px * 2 + 4rem);
}
.card {
  position: relative;
  width: 300px;
  height: 200px;
  background-color: var(--vp-c-default-3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 0 0 5px var(--vp-c-default-3);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card svg {
  width: 48px;
  fill: #333;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
}

.card__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--vp-c-gutter);
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  font-size: 24px;
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.card:hover svg {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

/* 响应式布局 */
@media (max-width: 1000px) {
  .front-collection {
    max-width: calc(300px * 2 + 20px + 4rem);
  }
}

@media (max-width: 768px) {
  .front-collection {
    padding: 1rem;
    gap: 15px;
    max-width: 100%;
  }

  .card {
    width: 100%;
    max-width: none;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .front-collection {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .card {
    height: 160px;
  }

  .card__content {
    padding: 15px;
  }

  .card__title {
    font-size: 20px;
  }

  .card__description {
    font-size: 13px;
  }
}

</style>
