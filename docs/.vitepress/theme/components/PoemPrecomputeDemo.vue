<template>
  <div class="poem-demo">
    <div class="poem-demo-header">
      <div>
        <div class="poem-demo-title">《春江花月夜》文字避让示例</div>
        <div class="poem-demo-desc">拖动小球，文字会基于分段测宽结果重新排版</div>
      </div>
    </div>

    <div ref="stageRef" class="poem-demo-stage">
      <span ref="measureRef" class="poem-demo-measure">春</span>
      <div class="poem-demo-poem-meta">
        <div class="poem-demo-poem-title">春江花月夜</div>
        <div class="poem-demo-poem-author">唐 · 张若虚</div>
      </div>
      <div
        class="poem-demo-ball"
        :style="{
          width: `${ballRadius * 2}px`,
          height: `${ballRadius * 2}px`,
          transform: `translate(${ball.x - ballRadius}px, ${ball.y - ballRadius}px)`
        }"
        @pointerdown="startDrag"
      >
        拖动
      </div>
      <span
        v-for="segment in segmentLayouts"
        :key="segment.index"
        class="poem-demo-segment"
        :style="{
          transform: `translate(${segment.x}px, ${segment.y}px)`,
          width: `${segment.width}px`,
          height: `${lineHeight}px`,
          lineHeight: `${lineHeight}px`
        }"
      >
        {{ segment.text }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';

interface TextSegment {
  index: number;
  text: string;
  width: number;
  sourceLine: number;
}

interface SegmentLayout extends TextSegment {
  x: number;
  y: number;
  line: number;
}

const poemLines = [
  '春江潮水连海平，海上明月共潮生。',
  '滟滟随波千万里，何处春江无月明！',
  '江流宛转绕芳甸，月照花林皆似霰；',
  '空里流霜不觉飞，汀上白沙看不见。',
  '江天一色无纤尘，皎皎空中孤月轮。',
  '江畔何人初见月？江月何年初照人？',
  '人生代代无穷已，江月年年望相似。',
  '不知江月待何人，但见长江送流水。',
  '白云一片去悠悠，青枫浦上不胜愁。',
  '谁家今夜扁舟子？何处相思明月楼？',
  '可怜楼上月徘徊，应照离人妆镜台。',
  '玉户帘中卷不去，捣衣砧上拂还来。',
  '此时相望不相闻，愿逐月华流照君。',
  '鸿雁长飞光不度，鱼龙潜跃水成文。',
  '昨夜闲潭梦落花，可怜春半不还家。',
  '江水流春去欲尽，江潭落月复西斜。',
  '斜月沉沉藏海雾，碣石潇湘无限路。',
  '不知乘月几人归，落月摇情满江树。'
];
const stagePadding = 22;
const contentTop = 92;
const ballRadius = 34;

const stageRef = ref<HTMLElement | null>(null);
const measureRef = ref<HTMLElement | null>(null);
const stageWidth = ref(620);
const stageHeight = ref(620);
const lineHeight = ref(34);
const textSegments = ref<TextSegment[]>([]);
const ball = reactive({ x: 190, y: 132 });
let hasPositionedBall = false;
let canvasContext: CanvasRenderingContext2D | null = null;
let isDragging = false;
let resizeTimer: number | null = null;
let inertiaFrame: number | null = null;
let lastPointerX = 0;
let lastPointerY = 0;
let lastPointerTime = 0;
let velocityX = 0;
let velocityY = 0;

const getCanvasContext = () => {
  if (canvasContext) return canvasContext;
  const canvas = document.createElement('canvas');
  canvasContext = canvas.getContext('2d');
  return canvasContext;
};

const segmentLine = (line: string) => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(line), item => item.segment);
  }
  return Array.from(line);
};

const getTextFont = () => {
  if (!measureRef.value) return '18px serif';
  const style = window.getComputedStyle(measureRef.value);
  return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
};

const measureSegments = () => {
  const context = getCanvasContext();
  if (!context) return;
  context.font = getTextFont();

  let index = 0;
  textSegments.value = poemLines.flatMap((line, sourceLine) => {
    return segmentLine(line).map(text => ({
      index: index++,
      text,
      width: Math.max(8, Math.ceil(context.measureText(text).width)),
      sourceLine
    }));
  });
};

const intersectsBall = (x: number, y: number, width: number) => {
  const rectLeft = x;
  const rectTop = y + 4;
  const rectRight = x + width;
  const rectBottom = y + lineHeight.value - 4;
  const closestX = Math.max(rectLeft, Math.min(ball.x, rectRight));
  const closestY = Math.max(rectTop, Math.min(ball.y, rectBottom));
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return dx * dx + dy * dy < (ballRadius + 8) * (ballRadius + 8);
};

const segmentLayouts = computed<SegmentLayout[]>(() => {
  const maxX = Math.max(120, stageWidth.value - stagePadding * 2);
  const layouts: SegmentLayout[] = [];

  poemLines.forEach((_, sourceLine) => {
    const lineSegments = textSegments.value.filter(segment => segment.sourceLine === sourceLine);
    const lineWidth = lineSegments.reduce((total, segment) => total + segment.width, 0);
    let x = Math.max(stagePadding, (stageWidth.value - lineWidth) / 2);
    let visualLine = sourceLine;

    lineSegments.forEach(segment => {
      let attempts = 0;

      while (attempts < 200) {
        attempts++;

        if (x + segment.width > stagePadding + maxX) {
          visualLine++;
          x = stagePadding;
          continue;
        }

        const segmentX = x;
        const segmentY = contentTop + visualLine * lineHeight.value;

        if (!intersectsBall(segmentX, segmentY, segment.width)) {
          layouts.push({ ...segment, x: segmentX, y: segmentY, line: visualLine });
          x += segment.width;
          return;
        }

        x += Math.max(8, Math.min(segment.width, 18));
      }

      layouts.push({ ...segment, x: stagePadding, y: contentTop + visualLine * lineHeight.value, line: visualLine });
      x = stagePadding + segment.width;
    });
  });

  return layouts;
});


const clampBall = () => {
  const maxX = stageWidth.value - ballRadius;
  const maxY = stageHeight.value - ballRadius;
  ball.x = Math.min(Math.max(ball.x, ballRadius), maxX);
  ball.y = Math.min(Math.max(ball.y, ballRadius), maxY);
};

const updateMetrics = async () => {
  await nextTick();
  if (stageRef.value) {
    stageWidth.value = stageRef.value.clientWidth;
    stageHeight.value = stageRef.value.clientHeight;
  }
  if (measureRef.value) {
    const rect = measureRef.value.getBoundingClientRect();
    lineHeight.value = Math.max(32, Math.ceil(rect.height * 1.9));
  }
  measureSegments();
  if (!hasPositionedBall) {
    ball.x = ballRadius + 18;
    ball.y = ballRadius + 18;
    hasPositionedBall = true;
  }
  clampBall();
};

const stopInertia = () => {
  if (inertiaFrame !== null) {
    cancelAnimationFrame(inertiaFrame);
    inertiaFrame = null;
  }
};


const applyBallPosition = (x: number, y: number) => {
  ball.x = x;
  ball.y = y;
  clampBall();
};

const moveBall = (event: PointerEvent) => {
  if (!isDragging || !stageRef.value) return;
  const rect = stageRef.value.getBoundingClientRect();
  const now = performance.now();
  const dt = Math.max(now - lastPointerTime, 16);
  const nextX = event.clientX - rect.left;
  const nextY = event.clientY - rect.top;

  velocityX = (event.clientX - lastPointerX) / dt;
  velocityY = (event.clientY - lastPointerY) / dt;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  lastPointerTime = now;
  applyBallPosition(nextX, nextY);
};

const startInertia = () => {
  stopInertia();
  const friction = 0.94;
  const bounce = 0.58;

  const tick = () => {
    const minX = ballRadius;
    const minY = ballRadius;
    const maxX = stageWidth.value - ballRadius;
    const maxY = stageHeight.value - ballRadius;

    ball.x += velocityX * 16;
    ball.y += velocityY * 16;

    if (ball.x <= minX || ball.x >= maxX) {
      ball.x = Math.min(Math.max(ball.x, minX), maxX);
      velocityX *= -bounce;
    }
    if (ball.y <= minY || ball.y >= maxY) {
      ball.y = Math.min(Math.max(ball.y, minY), maxY);
      velocityY *= -bounce;
    }

    velocityX *= friction;
    velocityY *= friction;

    if (Math.abs(velocityX) < 0.01 && Math.abs(velocityY) < 0.01) {
      inertiaFrame = null;
      return;
    }

    inertiaFrame = requestAnimationFrame(tick);
  };

  inertiaFrame = requestAnimationFrame(tick);
};

const stopDrag = () => {
  isDragging = false;
  window.removeEventListener('pointermove', moveBall);
  window.removeEventListener('pointerup', stopDrag);
  startInertia();
};

const startDrag = (event: PointerEvent) => {
  stopInertia();
  isDragging = true;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  lastPointerTime = performance.now();
  velocityX = 0;
  velocityY = 0;
  moveBall(event);
  window.addEventListener('pointermove', moveBall);
  window.addEventListener('pointerup', stopDrag);
};

const handleResize = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = window.setTimeout(() => {
    updateMetrics();
  }, 120);
};

onMounted(() => {
  updateMetrics();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  stopInertia();
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('pointermove', moveBall);
    window.removeEventListener('pointerup', stopDrag);
  }
});
</script>

<style scoped>
.poem-demo {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.poem-demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.poem-demo-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.poem-demo-desc {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.poem-demo-stage {
  position: relative;
  height: 620px;
  overflow: hidden;
  border-radius: 14px;
  background:
    radial-gradient(circle at 20% 10%, rgba(220, 20, 60, 0.08), transparent 32%),
    var(--vp-c-bg);
  touch-action: none;
}

.poem-demo-poem-meta {
  position: absolute;
  top: 22px;
  left: 22px;
  right: 22px;
  z-index: 1;
  text-align: center;
  pointer-events: none;
}

.poem-demo-poem-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-1);
}

.poem-demo-poem-author {
  margin-top: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.poem-demo-measure {
  position: absolute;
  visibility: hidden;
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 18px;
  line-height: 1;
  pointer-events: none;
}

.poem-demo-ball {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  background: radial-gradient(circle at 34% 28%, #ff8aa1, #dc143c 58%, #9f102d);
  box-shadow: 0 14px 34px rgba(220, 20, 60, 0.34);
  cursor: grab;
  user-select: none;
}

.poem-demo-ball:active {
  cursor: grabbing;
}

.poem-demo-segment {
  position: absolute;
  z-index: 1;
  display: inline-block;
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 18px;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  transition: transform 0.18s ease;
  will-change: transform;
}

@media (max-width: 640px) {
  .poem-demo-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .poem-demo-stage {
    height: 760px;
  }
}
</style>
