<template>
  <div class="progress-container">
    <div class="progress-bar" :style="progressStyle"></div>
    <span class="progress-text">{{ props.progress }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  }
});

// 计算渐变色
const progressStyle = computed(() => {
  // 定义颜色节点
  const colorStops = [
    { value: 0, color: '#ff0080' },    // 0% 时为 #ff0080
    { value: 50, color: '#ff8c00' },   // 50% 时为 #ff8c00
    { value: 100, color: '#40e0d0' }   // 100% 时为 #40e0d0
  ];

  // 计算当前进度对应的颜色
  let startColor, endColor, ratio;
  
  if (props.progress <= colorStops[0].value) {
    // 0% 时直接使用第一个颜色
    return { 
      width: `${props.progress}%`,
      backgroundColor: colorStops[0].color
    };
  } else if (props.progress >= colorStops[2].value) {
    // 100% 时直接使用最后一个颜色
    return { 
      width: `${props.progress}%`,
      backgroundColor: colorStops[2].color
    };
  } else {
    // 在两个颜色节点之间进行插值
    if (props.progress <= colorStops[1].value) {
      // 0% - 50% 之间：#ff0080 → #ff8c00
      startColor = colorStops[0].color;
      endColor = colorStops[1].color;
      ratio = (props.progress - colorStops[0].value) / (colorStops[1].value - colorStops[0].value);
    } else {
      // 50% - 100% 之间：#ff8c00 → #40e0d0
      startColor = colorStops[1].color;
      endColor = colorStops[2].color;
      ratio = (props.progress - colorStops[1].value) / (colorStops[2].value - colorStops[1].value);
    }

    // 颜色插值计算
    const r = Math.round(
      parseInt(startColor.substring(1, 3), 16) * (1 - ratio) + 
      parseInt(endColor.substring(1, 3), 16) * ratio
    );
    const g = Math.round(
      parseInt(startColor.substring(3, 5), 16) * (1 - ratio) + 
      parseInt(endColor.substring(3, 5), 16) * ratio
    );
    const b = Math.round(
      parseInt(startColor.substring(5, 7), 16) * (1 - ratio) + 
      parseInt(endColor.substring(5, 7), 16) * ratio
    );

    const interpolatedColor = `rgb(${r}, ${g}, ${b})`;
    
    return { 
      width: `${props.progress}%`,
      backgroundColor: interpolatedColor
    };
  }
});
</script>

<style scoped>
.progress-container {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 50px;
  height: 20px;
  border: 1px solid rgba(255, 137, 255, 0.8);
  box-shadow: 0 1px 10px 1px rgba(255, 137, 255, 0.4);
  border-radius: 10px;
  background: #fff;
  line-height: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  overflow: hidden;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}

.progress-text {
  position: relative;
  z-index: 1;
  color: #3c3c43;
  font-size: 12px;
}
</style>
