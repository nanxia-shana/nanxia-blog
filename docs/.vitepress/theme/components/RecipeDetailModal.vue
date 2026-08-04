<template>
  <Teleport to="body">
    <div
      v-if="recipe && visible"
      class="recipe-modal-overlay"
      @click.self="close">
      <div class="recipe-modal" role="dialog" aria-modal="true" :aria-label="recipe.title">
        <!-- 模糊大图背景 -->
        <div
          v-if="coverSrc"
          class="recipe-modal__bg"
          :style="{ backgroundImage: `url(${coverSrc})` }"></div>
        <div class="recipe-modal__shade"></div>

        <button class="recipe-modal__close" @click="close" aria-label="关闭">
          <svg viewBox="0 0 1024 1024" width="22" height="22">
            <path d="M557.312 513.248l265.28-263.904a32 32 0 1 0-45.312-45.248L512 468.096 246.72 204.096a32 32 0 0 0-45.312 45.248l265.28 263.904-265.28 263.904a32 32 0 1 0 45.312 45.248L512 558.4l265.28 263.904a32 32 0 1 0 45.312-45.248l-265.28-263.904z" fill="currentColor"/>
          </svg>
        </button>

        <div class="recipe-modal__body">
          <header class="recipe-modal__header">
            <h2>{{ recipe.title }}</h2>
            <div class="recipe-modal__tags">
              <span
                v-for="tag in tags"
                :key="tag"
                :style="tagStyle(tag)">{{ tag }}</span>
            </div>
            <div class="recipe-modal__meta">
              <span>难度：{{ recipe.difficulty }}</span>
              <span>用时：{{ recipe.cookTime }}</span>
            </div>
            <p class="recipe-modal__desc">{{ recipe.description }}</p>
          </header>

          <section class="recipe-modal__section">
            <h3><span class="icon">🥬</span> 食材准备</h3>
            <ul class="recipe-modal__ingredients">
              <li v-for="item in recipe.ingredients" :key="item.name">
                <span class="ingredient-name">{{ item.name }}</span>
                <span class="ingredient-amount">{{ item.amount }}</span>
              </li>
            </ul>
          </section>

          <section class="recipe-modal__section">
            <h3><span class="icon">👨‍🍳</span> 制作步骤</h3>
            <ol class="recipe-modal__steps">
              <li v-for="(step, i) in recipe.steps" :key="i">
                <span class="step-num">{{ i + 1 }}</span>
                <span class="step-text">{{ step }}</span>
              </li>
            </ol>
          </section>

          <section v-if="recipe.note" class="recipe-modal__section recipe-modal__tip">
            <h3><span class="icon">💡</span> 小贴士</h3>
            <p>{{ recipe.note }}</p>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from "vue";
import type { RecipeItem } from "../../data/recipeData";
import { TAG_HUE } from "../../data/recipeData";

const props = defineProps<{
  recipe: RecipeItem | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const FALLBACK_IMG = "/img/error_heitai.jpg";

const coverSrc = computed(() => {
  if (!props.recipe) return "";
  return props.recipe.cover || FALLBACK_IMG;
});

const tags = computed(() => {
  if (!props.recipe) return [];
  const c = props.recipe.category;
  return [c.region, c.scene, c.technique, c.flavor].filter(
    (v): v is string => !!v,
  );
});

const tagStyle = (tag: string) => {
  const hue = TAG_HUE[tag];
  if (hue === undefined || hue === null) {
    return {
      "--tag-bg": "rgba(180, 180, 180, 0.35)",
      "--tag-border": "rgba(180, 180, 180, 0.7)",
    };
  }
  return {
    "--tag-bg": `hsla(${hue}, 55%, 55%, 0.4)`,
    "--tag-border": `hsla(${hue}, 55%, 65%, 0.85)`,
  };
};

const close = () => emit("close");

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.visible) close();
};

const lockScroll = (lock: boolean) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = lock ? "hidden" : "";
};

watch(
  () => props.visible,
  (v) => lockScroll(v),
);

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  if (props.visible) lockScroll(true);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  lockScroll(false);
});
</script>

<style scoped>
.recipe-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: overlayIn 0.25s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.recipe-modal {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 86vh;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 模糊背景大图 */
.recipe-modal__bg {
  position: absolute;
  inset: -20px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(4px) brightness(0.95);
  transform: scale(1.15);
  z-index: 0;
}

.recipe-modal__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(28, 16, 8, 0.55) 0%,
    rgba(28, 16, 8, 0.82) 100%
  );
  z-index: 1;
}

.recipe-modal__close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.recipe-modal__close:hover {
  background: rgba(0, 0, 0, 0.65);
}

.recipe-modal__body {
  position: relative;
  z-index: 2;
  padding: 28px 28px 24px;
  overflow-y: auto;
  color: #fff;
}

.recipe-modal__header h2 {
  margin: 0;
  font-family: "Noto Serif SC", serif;
  font-size: 1.7rem;
  font-weight: 700;
  padding-right: 40px;
}

.recipe-modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.8rem;
}

.recipe-modal__tags span {
  padding: 0.2rem 0.7rem;
  border: 1px solid var(--tag-border);
  border-radius: 999px;
  background: var(--tag-bg);
  backdrop-filter: blur(6px);
  font-size: 0.75rem;
  color: #fff;
}

.recipe-modal__meta {
  display: flex;
  gap: 1.4rem;
  margin-top: 0.9rem;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.88);
}

.recipe-modal__desc {
  margin: 0.8rem 0 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
}

.recipe-modal__section {
  margin-top: 1.6rem;
}

.recipe-modal__section h3 {
  margin: 0 0 0.9rem;
  font-size: 1.05rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #fed7aa;
}

.recipe-modal__section .icon {
  font-size: 1.1rem;
}

/* 食材两列对齐 */
.recipe-modal__ingredients {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem 1.2rem;
}

.recipe-modal__ingredients li {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 0.88rem;
}

.ingredient-name {
  color: rgba(255, 255, 255, 0.92);
}

.ingredient-amount {
  color: #fdba74;
  white-space: nowrap;
}

/* 步骤 */
.recipe-modal__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recipe-modal__steps li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.step-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.85);
  color: #1c1008;
  font-weight: 700;
  font-size: 0.82rem;
}

.step-text {
  font-size: 0.9rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  padding-top: 2px;
}

/* 小贴士 */
.recipe-modal__tip p {
  margin: 0;
  padding: 0.8rem 1rem;
  background: rgba(245, 158, 11, 0.14);
  border-left: 3px solid rgba(245, 158, 11, 0.8);
  border-radius: 6px;
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(255, 237, 213, 0.95);
}

@media (max-width: 500px) {
  .recipe-modal {
    max-height: 90vh;
    border-radius: 12px;
  }
  .recipe-modal__body {
    padding: 22px 18px 18px;
  }
  .recipe-modal__header h2 {
    font-size: 1.4rem;
  }
  .recipe-modal__ingredients {
    grid-template-columns: 1fr;
  }
}
</style>
