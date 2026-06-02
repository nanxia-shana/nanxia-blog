<template>
  <div class="poem-container" :class="{ 'poem-container--inline': variant === 'inline' }">
    <div class="poem-inner">
      <h2 class="poem-title">{{ title }}</h2>
      <div class="poem-author">{{ dynasty }} · {{ author }}</div>
      <div class="poem-lines">
        <div
          v-for="(line, index) in lines"
          :key="index"
          class="poem-line"
        >{{ line }}</div>
      </div>
      <div v-if="notes" class="poem-notes">
        <button class="poem-notes-toggle" @click="showNotes = !showNotes">
          {{ showNotes ? '收起赏析' : '展开赏析' }}
        </button>
        <Transition name="notes-expand">
          <div v-if="showNotes" class="poem-notes-content-wrapper">
            <div class="poem-notes-content">{{ notes }}</div>
          </div>
        </Transition>
      </div>
      <div class="poem-seal"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
  notes?: string;
  variant?: 'card' | 'inline';
}

defineProps<Props>();

const showNotes = ref(false);
</script>

<style scoped>
.poem-container {
  margin: 48px 0;
}

.poem-container--inline {
  margin: 24px 0;
}

.poem-inner {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 32px 64px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: linear-gradient(135deg, #fcfbf9 0%, #f8f5f0 100%);
}

.poem-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
  font-weight: 600;
  text-align: center;
  color: #2c2c2c;
  letter-spacing: 0.12em;
}

.poem-author {
  margin-bottom: 32px;
  font-size: 14px;
  font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
  text-align: center;
  color: #666;
  letter-spacing: 0.08em;
}

.poem-lines {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poem-line {
  font-size: 18px;
  font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
  line-height: 1.8;
  text-align: center;
  color: #2c2c2c;
  letter-spacing: 0.06em;
}

.poem-notes {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.poem-notes-toggle {
  display: block;
  margin: 0 auto;
  padding: 6px 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 999px;
  font-size: 13px;
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  color: #666;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.poem-notes-toggle:hover {
  border-color: rgba(180, 60, 60, 0.4);
  color: #b43c3c;
}

.poem-notes-content-wrapper {
  overflow: hidden;
}

.poem-notes-content {
  margin-top: 16px;
  font-size: 14px;
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  line-height: 1.9;
  color: #555;
  text-align: justify;
}

.notes-expand-enter-active,
.notes-expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.notes-expand-enter-from,
.notes-expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.notes-expand-enter-to,
.notes-expand-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

.poem-seal {
  position: absolute;
  right: 32px;
  bottom: 16px;
  width: 42px;
  height: 42px;
  border: 2px solid rgba(180, 60, 60, 0.45);
  border-radius: 3px;
  opacity: 0.55;
}

.poem-seal::after {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1px solid rgba(180, 60, 60, 0.3);
  border-radius: 2px;
}

html.dark .poem-inner {
  border-color: rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, #2a2928 0%, #242322 100%);
}

html.dark .poem-title {
  color: #e8e6e3;
}

html.dark .poem-author {
  color: #999;
}

html.dark .poem-line {
  color: #d8d6d3;
}

html.dark .poem-notes {
  border-top-color: rgba(255, 255, 255, 0.06);
}

html.dark .poem-notes-toggle {
  border-color: rgba(255, 255, 255, 0.15);
  color: #999;
}

html.dark .poem-notes-toggle:hover {
  border-color: rgba(180, 60, 60, 0.5);
  color: #c45555;
}

html.dark .poem-notes-content {
  color: #a09e99;
}

html.dark .poem-seal {
  border-color: rgba(180, 60, 60, 0.35);
}

@media (max-width: 640px) {
  .poem-inner {
    padding: 36px 20px 56px;
  }

  .poem-title {
    font-size: 20px;
  }

  .poem-line {
    font-size: 16px;
  }

  .poem-seal {
    right: 20px;
    bottom: 12px;
    width: 36px;
    height: 36px;
  }
}
</style>
