<template>
  <article
    ref="cardEl"
    class="recipe-card"
    role="button"
    tabindex="0"
    :aria-label="props.title"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')">
    <div v-if="!isLoaded" class="recipe-card__placeholder" :style="placeholderStyle"></div>
    <img
      v-if="shouldLoad"
      class="recipe-card__cover"
      :class="{ loaded: isLoaded }"
      :src="coverSrc"
      :alt="props.title"
      @load="isLoaded = true"
      @error="onImgError" />
    <div class="recipe-card__shade"></div>

    <div class="recipe-card__content">
      <div class="recipe-card__categories">
        <span
          v-for="item in tags"
          :key="item"
          :style="tagStyle(item)">{{ item }}</span>
      </div>
      <div class="recipe-card__summary">
        <h2>{{ props.title }}</h2>
        <div class="recipe-card__meta">
          <span>难度：{{ props.difficulty }}</span>
          <span>用时：{{ props.cookTime }}</span>
        </div>
        <p class="recipe-card__description">{{ props.description }}</p>
        <p class="recipe-card__note">{{ props.note }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { RecipeCategory } from "../../data/recipeData";
import { TAG_HUE } from "../../data/recipeData";

interface RecipeCardProps {
  title: string;
  cover: string;
  thumb?: string;
  difficulty: string;
  cookTime: string;
  category: RecipeCategory;
  description: string;
  note: string;
}

const FALLBACK_IMG = "/img/error_heitai.jpg";

const props = defineProps<RecipeCardProps>();
defineEmits<{
  (e: "click"): void;
}>();

const cardEl = ref<HTMLElement | null>(null);
const shouldLoad = ref(false);
const isLoaded = ref(false);
const imgError = ref(false);
let observer: IntersectionObserver | null = null;

// 按 地域→场景→工艺→口味 顺序取非空标签，最多 4 个
const tags = computed(() => {
  const c = props.category;
  return [c.region, c.scene, c.technique, c.flavor].filter(
    (v): v is string => !!v,
  );
});

// 标签配色：有映射用色相，未配置用中性灰兜底
const tagStyle = (tag: string) => {
  const hue = TAG_HUE[tag];
  if (hue === undefined || hue === null) {
    return {
      "--tag-bg": "rgba(120, 120, 120, 0.45)",
      "--tag-border": "rgba(120, 120, 120, 0.8)",
    };
  }
  return {
    "--tag-bg": `hsla(${hue}, 55%, 50%, 0.45)`,
    "--tag-border": `hsla(${hue}, 55%, 50%, 0.8)`,
  };
};

const coverSrc = computed(() =>
  props.cover && !imgError.value ? props.cover : FALLBACK_IMG,
);

const placeholderStyle = computed(() => ({
  backgroundImage: props.thumb
    ? `url(${props.thumb})`
    : `url(${FALLBACK_IMG})`,
}));

const onImgError = () => {
  if (imgError.value) return;
  imgError.value = true;
};

onMounted(() => {
  if (!("IntersectionObserver" in window)) {
    shouldLoad.value = true;
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        shouldLoad.value = true;
        observer?.disconnect();
      }
    },
    { rootMargin: "200px" },
  );

  if (cardEl.value) observer.observe(cardEl.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.recipe-card {
  position: relative;
  width: 100%;
  max-width: 360px;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 8px 24px rgba(67, 35, 12, 0.12);
  color: #fff;
  isolation: isolate;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
  border-color: rgba(245, 158, 11, 0.8);
  box-shadow: 0 14px 30px rgba(180, 83, 9, 0.22);
}

.recipe-card__placeholder,
.recipe-card__cover,
.recipe-card__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.recipe-card__placeholder {
  z-index: -3;
  background-position: center;
  background-size: cover;
  filter: blur(10px);
  transform: scale(1.05);
}

.recipe-card__cover {
  z-index: -2;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.35s ease, transform 0.5s ease;
}

.recipe-card__cover.loaded {
  opacity: 1;
}

.recipe-card:hover .recipe-card__cover {
  transform: scale(1.07);
}

.recipe-card__shade {
  z-index: -1;
  background: linear-gradient(180deg, rgba(32, 18, 8, 0.06) 20%, rgba(32, 18, 8, 0.88) 100%);
  transition: background 0.3s ease;
}

.recipe-card:hover .recipe-card__shade {
  background: linear-gradient(180deg, rgba(32, 18, 8, 0.38), rgba(32, 18, 8, 0.95));
}

.recipe-card__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.recipe-card__categories {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
}

.recipe-card__categories span {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--tag-border, rgba(255, 255, 255, 0.5));
  border-radius: 999px;
  background: var(--tag-bg, rgba(120, 120, 120, 0.45));
  backdrop-filter: blur(6px);
  font-size: 0.72rem;
  line-height: 1.4;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.recipe-card__summary {
  transform: translateY(4.4rem);
  transition: transform 0.35s ease;
}

.recipe-card:hover .recipe-card__summary,
.recipe-card:focus-within .recipe-card__summary {
  transform: translateY(0);
}

.recipe-card h2 {
  margin: 0;
  color: #fff;
  font-family: "Noto Serif SC", serif;
  font-size: 1.35rem;
  line-height: 1.4;
}

.recipe-card__meta {
  display: flex;
  gap: 0.9rem;
  margin-top: 0.35rem;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.78rem;
}

.recipe-card__description,
.recipe-card__note {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.recipe-card__description {
  height: 2.55rem;
  margin: 0.65rem 0 0;
  font-size: 0.82rem;
  line-height: 1.55;
  -webkit-line-clamp: 2;
}

.recipe-card__note {
  height: 1.1rem;
  margin: 0.35rem 0 0;
  color: #fed7aa;
  font-size: 0.75rem;
  line-height: 1.45;
  -webkit-line-clamp: 1;
}

.recipe-card:hover .recipe-card__description,
.recipe-card:hover .recipe-card__note,
.recipe-card:focus-within .recipe-card__description,
.recipe-card:focus-within .recipe-card__note {
  opacity: 1;
}

@media (hover: none) {
  .recipe-card__summary {
    transform: translateY(0);
  }

  .recipe-card__description {
    opacity: 1;
  }

  .recipe-card__note {
    display: none;
  }
}
</style>
