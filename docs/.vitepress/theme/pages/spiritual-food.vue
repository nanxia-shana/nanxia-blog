<template>
  <div class="spiritual-food-collection">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>✨ 精神食粮</h1>
      <p class="subtitle">书山有径，学海无涯，在此探索多元文化的精神世界</p>
    </div>

    <!-- 书籍 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">📚</span>
          <h2>书山拾叶</h2>
        </div>
        <div @click="router.go('/spiritual-food/book/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="cards-grid">
        <div v-for="book in previewBooks" :key="book.title" class="book-card">
          <book-card :title="book.title" :author="book.author" :cover="book.cover" :thumb="book.thumb" :note="book.note" />
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider"></div>

    <!-- 音乐 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">🎧</span>
          <h2>听海观澜</h2>
        </div>
        <div @click="router.go('/spiritual-food/music/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="music-preview-list">
        <div v-for="music in previewMusic" :key="music.title" class="music-preview-item" :class="{ 'playing': playbackState?.currentMusic?.id === music.id && playbackState?.isPlaying }" @click="togglePlayItem(music)">
          <img :src="music.cover" :alt="music.title" class="music-cover" :class="{ 'rotating': playbackState?.currentMusic?.id === music.id && playbackState?.isPlaying }" />
          <div class="play-overlay">
            <svg viewBox="0 0 1024 1024" width="24" height="24">
              <path d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z" fill="white"/>
            </svg>
          </div>
          <div class="music-info">
            <div class="music-title">{{ music.title }}</div>
            <div class="music-author">{{ music.author }}</div>
            <div class="music-album">{{ music.album }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider"></div>

    <!-- 电影 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">🎥</span>
          <h2>浮光掠影</h2>
        </div>
        <div @click="router.go('/spiritual-food/movie/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="cards-grid">
        <div v-for="movie in previewMovies" :key="movie.title" class="movie-card">
          <movie-card :title="movie.title" :country="movie.country" :cover="movie.cover" :year="movie.year" :runtime="movie.runtime" :note="movie.note" />
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider"></div>

    <!-- 动漫 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">🌌</span>
          <h2>绘梦织霞</h2>
        </div>
        <div @click="router.go('/spiritual-food/anime/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="cards-grid">
        <div v-for="anime in previewAnime" :key="anime.title" class="anime-card">
          <anime-card :title="anime.title" :cover="anime.cover" :thumb="anime.thumb" :note="anime.note" />
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider"></div>

    <!-- 小说 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">✒️</span>
          <h2>墨池云篆</h2>
        </div>
        <div @click="router.go('/spiritual-food/novel/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="cards-grid">
        <div v-for="novel in previewNovels" :key="novel.title" class="novel-card">
          <novel-card :title="novel.title" :author="novel.author" :cover="novel.cover" :thumb="novel.thumb" />
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider"></div>

    <!-- 游戏 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">🎮</span>
          <h2>游心太玄</h2>
        </div>
        <div @click="router.go('/spiritual-food/game/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="cards-grid-wide">
        <div v-for="game in previewGames" :key="game.title" class="game-card-wrapper">
          <game-card :title="game.title" :author="game.developer" :platform="game.platform" :cover="game.cover" :thumb="game.thumb" />
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="section-divider"></div>

    <!-- 随笔 -->
    <section class="section-block">
      <div class="section-header">
        <div class="section-title">
          <span class="section-icon">✍️</span>
          <h2>闲窗细语</h2>
        </div>
        <div @click="router.go('/spiritual-food/note/')" class="more-btn">
          查看更多 <span class="arrow">→</span>
        </div>
      </div>
      <div class="notes-preview-list">
        <div v-for="note in previewNotes" :key="note.title" @click="router.go(note.link)" class="note-preview-item">
          <div class="note-preview-icon">📝</div>
          <div class="note-preview-content">
            <div class="note-preview-title">{{ note.title }}</div>
            <div class="note-preview-date">{{ note.date }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="page-footer">
      <p>💫 探索更多精彩，丰富你的精神世界</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import BookCard from '../components/Book-card.vue';
import MovieCard from '../components/Movie-card.vue';
import AnimeCard from '../components/Anime-card.vue';
import NovelCard from '../components/Novel-card.vue';
import GameCard from '../components/Game-card.vue';

import { bookList } from '../../data/bookData.ts';
import { musicList } from '../../data/musicData.ts';
import type { MusicItem } from '../../data/musicData.ts';
import { moiveList } from '../../data/movieData.ts';
import { animeList } from '../../data/animeData.ts';
import { novelList } from '../../data/novelData.ts';
import { gameList } from '../../data/gameData.ts';
import { noteList } from '../../data/notesData.ts';

import { useRouter } from 'vitepress'

const router = useRouter()

// 播放状态接口
interface PlaybackState {
  currentMusic: MusicItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

// 音乐播放状态
const playbackState = inject<PlaybackState>("playback-state");

// 各分类预览数量
const PREVIEW_COUNT = 4;

// 预览数据 - 取前几条
const previewBooks = computed(() => bookList.slice(0, PREVIEW_COUNT));
const previewMusic = computed(() => musicList.slice(0, PREVIEW_COUNT));
const previewMovies = computed(() => moiveList.slice(0, PREVIEW_COUNT));
const previewAnime = computed(() => animeList.slice(0, PREVIEW_COUNT));
const previewNovels = computed(() => novelList.slice(0, PREVIEW_COUNT));
const previewGames = computed(() => gameList.slice(0, PREVIEW_COUNT));
const previewNotes = computed(() => noteList.slice(0, PREVIEW_COUNT));

// 点击列表项播放
const togglePlayItem = (music: MusicItem) => {
  if (!playbackState) return;
  playbackState.currentMusic = music;
  const audio = document.querySelector('audio') as HTMLAudioElement;
  playbackState.isPlaying = true;
  audio.load();
  audio.addEventListener("canplay", () => {
    audio.play();
  });
};
</script>

<style scoped>
.spiritual-food-collection {
  margin: 0 auto;
  padding: 2rem;
  max-width: 1200px;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--vp-c-divider-light);
}

.page-header h1 {
  font-size: 2.5rem;
  line-height: normal;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #764ba2
}

.subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.05rem;
  margin: 0;
}

/* 每个区块 */
.section-block {
  margin-bottom: 2.5rem;
}

/* 区块分隔线 */
.section-divider {
  height: 2px;
  margin-bottom: 2.5rem;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--vp-c-divider) 15%,
    var(--vp-c-divider) 85%,
    transparent 100%
  );
  opacity: 0.8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider-light);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.5rem;
}

.section-title h2 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
}

.more-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.more-btn:hover {
  transform: translateX(2px);
}

.more-btn .arrow {
  transition: transform 0.2s ease;
}

.more-btn:hover .arrow {
  transform: translateX(3px);
}

/* 卡片网格 - 通用 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 游戏卡片 - 宽屏网格（适配16:9卡片） */
.cards-grid-wide {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.game-card-wrapper {
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: center;
}

/* 音乐预览列表 - 特殊样式 */
.music-preview-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.music-preview-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
  cursor: pointer;
}

.music-preview-item:hover,
.music-preview-item.playing {
  background: rgba(220, 20, 60, 0.2);
  border: 1px solid rgba(220, 20, 60, 0.8);
  transform: translateY(-2px);
}

.music-preview-item.playing {
  box-shadow: 0 4px 16px rgba(220, 20, 60, 0.25);
}

.music-preview-item {
  position: relative;
}

.music-cover {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  object-fit: cover;
  flex-shrink: 0;
}

.music-cover.rotating {
  animation: rotate 10s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

.play-overlay {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .music-preview-item:hover .play-overlay {
    opacity: 1;
  }
}

.music-info {
  flex: 1;
  min-width: 0;
}

.music-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-author {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2px;
}

.music-album {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 笔记预览列表 - 网格布局 */
.notes-preview-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.note-preview-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.note-preview-item:hover {
  background: rgba(255, 127, 80, 0.2);
  border: 1px solid rgba(255, 127, 80, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 127, 80, 0.18);
}

.note-preview-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.note-preview-content {
  flex: 1;
  min-width: 0;
}

.note-preview-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-preview-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* 页脚 */
.page-footer {
  text-align: center;
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid var(--vp-c-divider-light);
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.page-footer p {
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .spiritual-food-collection {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .section-title h2 {
    font-size: 1.2rem;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .cards-grid-wide {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 320px;
    margin: 0 auto;
  }

  .game-card-wrapper {
    max-width: 100%;
  }

  .music-preview-list,
  .notes-preview-list {
    grid-template-columns: 1fr;
  }

  .note-preview-item {
    padding: 1rem;
  }

  .note-preview-date {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
    max-width: 280px;
    margin: 0 auto;
  }

  .cards-grid-wide {
    max-width: 100%;
  }
}
</style>
