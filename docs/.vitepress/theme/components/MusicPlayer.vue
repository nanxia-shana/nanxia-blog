<template>
  <div class="music-player">
    <audio ref="audioPlayerRef" autoplay @play="onPlay" @pause="onPause" @ended="onEnded" @timeupdate="onTimeUpdate">
      <source :src="playbackState.currentMusic.url" type="audio/mpeg" />
      <embed height="0" width="0" :src="playbackState.currentMusic.url" />
    </audio>
    <div :class="`music-cover ${playbackState.isPlaying ? 'rotate' : ''}`">
      <img :src="playbackState.currentMusic.cover" alt="cover" />
    </div>
    <div class="music-control">
      <div class="music-top">
        <div class="music-info">
          <div class="music-title">
            <div class="music-text">
              {{ playbackState.currentMusic.title }} -
              {{ playbackState.currentMusic.author }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                playbackState.currentMusic.title
              }}
              - {{ playbackState.currentMusic.author }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          <div class="music-duration">{{ formatter(playbackState.currentTime) }}</div>
        </div>
        <div class="music-progress">
          <div class="music-rate" :style="slider">
            <div class="combo-breathing"></div>
          </div>
        </div>
      </div>
      <div class="music-bottom">
        <div @click="checkSong(false)" class="music-icon">
          <svg
            t="1754298959404"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4484"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200">
            <path
              d="M98.31 483.06L654.05 162.2c22.43-12.95 50.47 3.24 50.47 29.14v641.71c0 25.9-28.04 42.09-50.47 29.14L98.31 541.34c-22.43-12.95-22.43-45.33 0-58.28z"
              p-id="4485"></path>
            <path
              d="M653.42 505.91L929.92 156c5.97-7.56 18.12-3.33 18.12 6.3v699.82c0 9.63-12.15 13.85-18.12 6.3L653.42 518.5a10.17 10.17 0 0 1 0-12.59z"
              p-id="4486"></path>
          </svg>
        </div>
        <div @click="musicPlaying" v-show="!playbackState.isPlaying" class="music-icon">
          <svg
            t="1754299012628"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1547"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200">
            <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" p-id="1548"></path>
            <path
              d="M710.14 496.72L426.28 332.83c-11.92-6.88-26.82 1.72-26.82 15.49v327.77c0 13.77 14.9 22.37 26.82 15.49l283.86-163.89c11.92-6.88 11.92-24.09 0-30.97z"
              p-id="1549"
              fill="var(--vp-c-bg-alt)"></path>
          </svg>
        </div>
        <div @click="musicPlaying" v-show="playbackState.isPlaying" class="music-icon">
          <svg
            t="1754299043117"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1716"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200">
            <path d="M511.96 512.2m-433.5 0a433.5 433.5 0 1 0 867 0 433.5 433.5 0 1 0-867 0Z" p-id="1717"></path>
            <path
              d="M441.73 704.57H404.8c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.06 24.72-24.72 24.72zM619.12 704.57h-36.93c-13.65 0-24.72-11.07-24.72-24.72V344.56c0-13.65 11.07-24.72 24.72-24.72h36.93c13.65 0 24.72 11.07 24.72 24.72v335.29c0 13.65-11.07 24.72-24.72 24.72z"
              fill="var(--vp-c-bg-alt)"
              p-id="1718"></path>
          </svg>
        </div>
        <div @click="checkSong(true)" class="music-icon">
          <svg
            t="1754298997535"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1382"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200">
            <path
              d="M925.61 483.06L369.88 162.21c-22.43-12.95-50.47 3.24-50.47 29.14v641.71c0 25.9 28.04 42.09 50.47 29.14l555.74-320.86c22.43-12.95 22.43-45.33-0.01-58.28z"
              p-id="1383"></path>
            <path
              d="M370.5 505.91L94 156c-5.97-7.56-18.12-3.33-18.12 6.3v699.82c0 9.63 12.15 13.85 18.12 6.3L370.5 518.5c2.92-3.69 2.92-8.9 0-12.59z"
              p-id="1384"></path>
          </svg>
        </div>
        <div class="music-icon">
          <svg
            t="1754378929675"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2086"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200">
            <path
              d="M749.5 239.9C681 199.5 629.9 140 629.9 140c-161.4-161.5-269.1-15.4-269.1-15.4L354 678.1c-10.2-2.6-80.2-121.1-91-120.4-62.8 4.2-117.4 84-117.4 197.3 0 113.2 72.3 205 161.5 205 89.1 0 161.4-91.8 161.4-205 0-12.3-1-24.2-2.6-35.9h0.1l-28.8-535.9c183.8 358.4 441.3 149 441.3 115.7 0-14.8-74.9-27.1-129-59z"
              p-id="2087"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted } from "vue";
const audioPlayerRef = ref();
const playbackState = inject("playback-state");
const slider = ref({
  width: "0%",
});

onMounted(() => {
  audioPlayerRef.value.load();
  audioPlayerRef.value.addEventListener("durationchange", function () {
    playbackState.duration = audioPlayerRef.value.duration;
  });
});

// 播放时间格式化
const formatter = (value) => {
  return `${Math.floor(value / 60)}:${Math.floor(value % 60) < 10 ? "0" + Math.floor(value % 60) : Math.floor(value % 60)}`;
};
// 音乐开始播放时触发
const onPlay = () => {
  console.log(audioPlayerRef.value.duration);
  playbackState.isPlaying = true;
  playbackState.duration = audioPlayerRef.value.duration;
};
// 音乐暂停时触发
const onPause = () => {
  playbackState.isPlaying = false;
};
// 音乐播放结束时触发
const onEnded = () => {
  playbackState.isPlaying = false;
  playbackState.currentTime = 0;
  slider.value = {
    width: "0%",
  };
};
// 音乐播放过程中持续触发
const onTimeUpdate = (e) => {
  playbackState.currentTime = Math.floor(e.srcElement.currentTime);
  slider.value = {
    width: `${(playbackState.currentTime / Math.floor(playbackState.duration)) * 100}%`,
  };
};
// 音乐播放控制
const musicPlaying = () => {
  if (audioPlayerRef.value.readyState == 4) {
    if (audioPlayerRef.value.paused == true) {
      audioPlayerRef.value.play();
    } else {
      audioPlayerRef.value.pause();
    }
  } else {
    audioPlayerRef.value.load();

    audioPlayerRef.value.addEventListener("durationchange", function () {
      playbackState.duration = audioPlayerRef.value.duration;
    });
    audioPlayerRef.value.addEventListener("canplay", async () => {
      audioPlayerRef.value.play();
    });
  }
};
// 音乐切换控制
const checkSong = (flag) => {
  if (flag) playbackState.currentMusic = getNextItem(playbackState.playlist, playbackState.currentMusic);
  else playbackState.currentMusic = getPreviousItem(playbackState.playlist, playbackState.currentMusic);
  if (playbackState.currentMusic) {
    playbackState.isPlaying = false;
    audioPlayerRef.value.load();
    audioPlayerRef.value.addEventListener("canplay", async () => {
      playbackState.duration = audioPlayerRef.value.duration;
      audioPlayerRef.value.play();
      playbackState.isPlaying = true;
    });
  } else {
    alert("歌曲不存在");
  }
};
// 获取数组的下一项
function getNextItem(array, targetObj, key = 'id') {
  // 注意：这里假设通过某个唯一字段（如 id）来查找目标对象
  const index = array.findIndex(item => item[key] === targetObj[key]);
  if (index !== -1 && index < array.length) {
    return array[(index + 1) % array.length];
  }
  return null; // 没找到目标对象，或者目标对象是最后一项
}
// 获取数组的上一项
function getPreviousItem(array, targetObj, key = 'id') {
  const index = array.findIndex(item => item[key] === targetObj[key]);
  if (index !== -1 && index < array.length) {
    return array[(index - 1 + array.length ) % array.length];
  }
  return null; // 没找到目标对象，或者目标对象是第一项
}

</script>

<style scoped>
.music-player {
  width: 130px;
  height: 40px;
  margin-left: 20px;
  position: relative;
}
.music-cover {
  width: 38px;
  height: 38px;
  position: absolute;
  z-index: 2;
  top: 1px;
  left: 1px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  animation: rotate-cover 10s linear infinite;
  animation-play-state: paused;
}
.rotate {
  animation-play-state: running;
}
@keyframes rotate-cover {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
.music-cover img {
  width: 100%;
  height: 100%;
}
.music-control {
  width: 130px;
  height: 40px;
  position: relative;
  background-color: var(--vp-c-bg-alt);
  border-radius: 20px;
  border: 1px solid #999;
  display: flex;
  flex-direction: column;
  align-items: end;
  overflow: hidden;
}
.music-top {
  width: 100%;
  height: 40px;
  padding-left: 45px;
  display: flex;
  flex-direction: column;
}
.music-info {
  width: 100%;
  margin-top: 5px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.music-title {
  width: 50%;
  font-size: 12px;
  font-weight: bold;
  color: var(--vp-c-text-1);
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
}
.music-text {
  display: inline-block;
  animation: scroll-left 10s linear infinite;
}
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.music-duration {
  width: 30%;
  font-size: 10px;
  color: var(--vp-c-text-2);
  line-height: normal;
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.music-progress {
  width: 70px;
  height: 4px;
  margin-top: 5px;
  border: 1px solid var(--vp-c-text-2);
  border-radius: 2px;
}
.music-rate {
  position: relative;
  height: 2px;
  border-radius: 1px;
  background-color: var(--vp-c-text-2);
}
.combo-breathing {
  position: absolute;
  right: -3px;
  top: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-text-2);
  animation: combo-breathe 3s ease-in-out infinite;
}

@keyframes combo-breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 1px rgba(255, 137, 255, 0.8);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 2px rgba(255, 137, 255, 0.8), 0 0 3px rgba(255, 137, 255, 0.8), 0 0 4px rgba(255, 137, 255, 0.8);
  }
}
/* 桌面端 hover 效果：仅当设备支持 hover 时才生效 */
@media (hover: hover) and (pointer: fine) {
  .music-player:hover ::before {
  }
  .music-player:hover .music-control {
    height: 70px;
    background: rgba(255, 137, 255, 0.2);
    border-color: rgba(255, 137, 255, 0.8);
    border-radius: 20px 20px 10px 10px;
    transition: all 0.3s ease-out;
  }
  .music-player:hover .music-bottom {
    opacity: 1;
    display: flex;
    transition: all 0.2s ease-out 0.1s;
  }
}
.music-bottom {
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.music-icon {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
}
.icon:hover {
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .music-player {
    margin-left: 10px;
  }
}
</style>
