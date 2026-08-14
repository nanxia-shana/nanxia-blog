<template>
  <div
    id="landlord"
    ref="landlordRef"
    @mouseenter="showHideButton = true"
    @mouseleave="showHideButton = false"
  >
    <div class="message" ref="messageRef"></div>
    <canvas ref="canvasRef" class="live2d-canvas"></canvas>
    <div
      class="hide-button"
      :class="{ visible: showHideButton }"
      @click="toggleLive2D"
    >
      隐藏
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useMessageBubble } from '../composables/useMessageBubble'

// ============ 配置项：换模型时只改这里 ============
// 模型配置：Cubism 2 用 .model.json，Cubism 4 用 .model3.json
const MODEL_PATH = '/live2d/model/tia/model.json'
const CANVAS_SIZE = 280
// 命中区域名（Cubism2 看 model.json 的 hit_areas[].name；Cubism4 看 .model3.json 的 HitAreas[].Name）
// 注：老式 Cubism2 模型（如 Tia）用 hit_areas_custom 坐标矩形，区域名固定为 head/body
const HIT_HEAD = 'head'
const HIT_BODY = 'body'
// 动作组名（Cubism2 看 model.json 的 motions 的 key；Cubism4 看 .model3.json 的 FileReferences.Motions 的 key）
const MOTION_IDLE = 'idle'
const MOTION_TAP_HEAD = 'flick_head'
const MOTION_TAP_BODY = 'tap_body'
// 触摸台词
const HEAD_TOUCH_LINES = [
  '不要动手动脚的！快把手拿开~~',
  '真…真的是不知羞耻！',
  'Hentai！',
  '再摸的话我可要报警了！⌇●﹏●⌇',
  '110吗，这里有个变态一直在摸我(ó﹏ò｡)'
]
const BODY_TOUCH_LINES = ['你在干什么呀…', '别乱碰啦！', '真是的…手往哪放呢。']
// ================================================

const landlordRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const messageRef = ref<HTMLElement | null>(null)
const isVisible = ref(true)
const showHideButton = ref(false)

// PIXI 对象用 shallowRef，避免 Vue 深度代理 WebGL 大对象
const app = shallowRef<any>(null)
const model = shallowRef<any>(null)
let scriptsLoaded = false

const { init: initBubble, destroy: destroyBubble, showMessage } = useMessageBubble(messageRef)

// 全部本地加载（企业网络环境下外部 CDN 会被 ORB 拦截）
// 顺序：pixi → Cubism2 核心 → Cubism4 核心 → pixi-live2d-display(合集包，自动识别两种模型)
const SCRIPTS = [
  '/live2d/lib/pixi.min.js',
  '/live2d/lib/live2d.min.js', // Cubism 2 核心（从旧版 live2d.js 恢复）
  '/live2d/lib/live2dcubismcore.min.js', // Cubism 4 核心（Live2D 许可禁止通过 npm 分发）
  '/live2d/lib/pixi-live2d-display.min.js'
]

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('empty src'))
      return
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const el = document.createElement('script')
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(el)
  })
}

async function loadDependencies() {
  if (scriptsLoaded) return
  for (const src of SCRIPTS) {
    await loadScript(src)
  }
  scriptsLoaded = true
}

async function initLive2D() {
  if (!canvasRef.value) return
  try {
    await loadDependencies()
  } catch (err) {
    console.error('[Live2D] 依赖加载失败:', err)
    return
  }

  const PIXI = (window as any).PIXI
  if (!PIXI?.live2d?.Live2DModel) {
    console.error('[Live2D] PIXI.live2d 未就绪，检查 Cubism Core 与 pixi-live2d-display 是否加载成功')
    return
  }

  const pixiApp = new PIXI.Application({
    view: canvasRef.value,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1
  })
  app.value = pixiApp

  try {
    // autoInteract 关闭：它在 PixiJS 7 下与交互管理器不兼容，改用 canvas 事件手动触发 focus/tap
    const live2dModel = await PIXI.live2d.Live2DModel.from(MODEL_PATH, {
      autoInteract: false,
      autoUpdate: true
    })
    model.value = live2dModel

    const scale = (Math.min(CANVAS_SIZE / live2dModel.width, CANVAS_SIZE / live2dModel.height) || 1) * 0.9
    live2dModel.scale.set(scale)
    live2dModel.anchor.set(0.5, 0.5)
    live2dModel.x = CANVAS_SIZE / 2
    live2dModel.y = CANVAS_SIZE / 2
    pixiApp.stage.addChild(live2dModel)

    // 打印调试信息，方便按实际模型调整上方的命中区域/动作组常量
    const hitAreas = live2dModel.internalModel?.hitAreas
    const hitNames = Array.isArray(hitAreas)
      ? hitAreas.map((h: any) => h.Name ?? h.name ?? h.Id ?? h.id)
      : hitAreas
    const motionDefs = live2dModel.internalModel?.motionManager?.definitions
    console.log(
      '[Live2D] 模型加载成功。HitAreas:',
      hitNames,
      'Motion groups:',
      motionDefs ? Object.keys(motionDefs) : []
    )

    live2dModel.on('hit', onHit)
    await loadCustomHitAreas()
    bindInteraction(live2dModel)
    if (MOTION_IDLE) live2dModel.motion(MOTION_IDLE)
  } catch (err) {
    console.error('[Live2D] 模型加载失败（请确认模型路径与文件格式）:', err)
  }
}

// 手动绑定交互：在整个页面移动鼠标时眼睛跟随，仅在 canvas 上点击才触发命中测试
function bindInteraction(live2dModel: any) {
  const canvas = canvasRef.value
  if (!canvas) return
  const getPos = (e: PointerEvent | MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onMove = (e: PointerEvent) => {
    const { x, y } = getPos(e)
    live2dModel.focus?.(x, y)
  }
  // 鼠标离开窗口时让视线回到正中
  const onLeave = () => {
    live2dModel.focus?.(CANVAS_SIZE / 2, CANVAS_SIZE / 2)
  }
  const onDown = (e: PointerEvent) => {
    const { x, y } = getPos(e)
    live2dModel.tap?.(x, y)
    // 老式 hit_areas_custom 模型没有命名命中区，库的 tap 不会触发 hit 事件，这里补上
    const customHits = customHitTest(x, y)
    if (customHits.length) onHit(customHits)
  }
  window.addEventListener('pointermove', onMove)
  document.documentElement.addEventListener('mouseleave', onLeave)
  canvas.addEventListener('pointerdown', onDown)
  interactionCleanup = () => {
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    canvas.removeEventListener('pointerdown', onDown)
  }
}
let interactionCleanup: (() => void) | null = null

// 老式 Cubism2 模型用 hit_areas_custom（坐标矩形）定义命中区，新式模型用 hit_areas（图元名）。
// 这里保存解析后的矩形：name -> 两个对角点
let customHitAreas: Record<string, { p0: [number, number]; p1: [number, number] }> | null = null

async function loadCustomHitAreas(): Promise<void> {
  customHitAreas = null
  // Cubism 2 模型配置文件名可能是 xxx.model.json 或 model.json，Cubism 4 是 xxx.model3.json
  const isC2Model = MODEL_PATH.endsWith('.model.json') || MODEL_PATH.endsWith('/model.json')
  if (!isC2Model) return
  try {
    const res = await fetch(MODEL_PATH)
    const json = await res.json()
    const custom = json.hit_areas_custom
    if (!custom || typeof custom !== 'object') return
    const result: Record<string, { p0: [number, number]; p1: [number, number] }> = {}
    for (const key of Object.keys(custom)) {
      if (!key.endsWith('_x')) continue
      const name = key.slice(0, -2)
      const xArr = custom[key]
      const yArr = custom[`${name}_y`]
      if (Array.isArray(xArr) && Array.isArray(yArr) && xArr.length === 2 && yArr.length === 2) {
        // 旧框架里 <name>_x、<name>_y 实际是矩形两个对角点的坐标
        result[name] = { p0: [xArr[0], xArr[1]], p1: [yArr[0], yArr[1]] }
      }
    }
    customHitAreas = result
    console.log('[Live2D] 自定义命中区(hit_areas_custom):', Object.keys(result))
  } catch (e) {
    console.warn('[Live2D] 解析 hit_areas_custom 失败:', e)
  }
}

// 把 canvas 点击坐标换算成模型归一化坐标后，与 hit_areas_custom 矩形做命中测试
function customHitTest(px: number, py: number): string[] {
  if (!customHitAreas || !model.value) return []
  const internalModel = model.value.internalModel
  if (!internalModel?.originalWidth || !internalModel?.originalHeight) return []
  // 模型已自带命名命中区时，交给 pixi-live2d-display 的 hitTest，不走自定义
  if (Object.keys(internalModel.hitAreas || {}).length > 0) return []

  const PIXI = (window as any).PIXI
  const pt = model.value.toModelPosition(new PIXI.Point(px, py))
  // 模型像素坐标（左上原点、y 向下）→ 归一化坐标 [-1,1]，并翻转 y 为向上为正
  const nx = (pt.x / internalModel.originalWidth) * 2 - 1
  const ny = 1 - (pt.y / internalModel.originalHeight) * 2

  const hits: string[] = []
  for (const [name, { p0, p1 }] of Object.entries(customHitAreas)) {
    const xMin = Math.min(p0[0], p1[0])
    const xMax = Math.max(p0[0], p1[0])
    const yMin = Math.min(p0[1], p1[1])
    const yMax = Math.max(p0[1], p1[1])
    if (nx >= xMin && nx <= xMax && ny >= yMin && ny <= yMax) hits.push(name)
  }
  return hits
}

function onHit(hitAreas: string[]) {
  if (!model.value) return
  if (hitAreas.includes(HIT_HEAD)) {
    model.value.motion(MOTION_TAP_HEAD)
    showMessage(HEAD_TOUCH_LINES, 5000)
  } else if (hitAreas.includes(HIT_BODY)) {
    model.value.motion(MOTION_TAP_BODY)
    showMessage(BODY_TOUCH_LINES, 4000)
  }
}

function toggleLive2D() {
  isVisible.value = !isVisible.value
  if (landlordRef.value) {
    landlordRef.value.style.display = isVisible.value ? 'block' : 'none'
  }
  if (app.value?.ticker) {
    if (isVisible.value) app.value.ticker.start()
    else app.value.ticker.stop()
  }
}

onMounted(() => {
  initBubble('/live2d/')
  nextTick(initLive2D)
})

onBeforeUnmount(() => {
  destroyBubble()
  interactionCleanup?.()
  interactionCleanup = null
  customHitAreas = null
  if (model.value) {
    try {
      model.value.destroy({ children: true, texture: true, baseTexture: true })
    } catch {
      // ignore
    }
    model.value = null
  }
  if (app.value) {
    try {
      app.value.destroy(true, { children: true, texture: true, baseTexture: true })
    } catch {
      // ignore
    }
    app.value = null
  }
  // 注意：不卸载 CDN script 标签——PIXI 全局仍在，重复加载会冲突
})
</script>

<style scoped>
#landlord {
  user-select: none;
  position: fixed;
  left: 10px;
  bottom: 0;
  width: 280px;
  height: 280px;
  z-index: 10000;
  font-size: 0;
  transition: all 0.3s ease-in-out;
}

.live2d-canvas {
  position: relative;
  width: 280px;
  height: 280px;
}

.message {
  color: var(--vp-c-text-1);
  opacity: 0;
  width: 280px;
  height: auto;
  margin: auto;
  padding: 7px;
  top: -70px;
  left: 0;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background-color: rgba(255, 137, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
  font-size: 13px;
  font-weight: 400;
  text-overflow: ellipsis;
  text-transform: uppercase;
  overflow: hidden;
  position: absolute;
  animation-delay: 5s;
  animation-duration: 50s;
  animation-iteration-count: infinite;
  animation-name: shake;
  animation-timing-function: ease-in-out;
}

.hide-button {
  color: var(--vp-c-text-1);
  position: absolute;
  top: 10px;
  right: 0;
  display: block;
  overflow: hidden;
  width: 46px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background: rgba(255, 137, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.hide-button.visible {
  opacity: 1;
  pointer-events: auto;
}

.hide-button:hover {
  border: 1px solid #f4a7b9;
}

@media (max-width: 860px) {
  #landlord {
    display: none;
  }
}

@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }

  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }

  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }

  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }

  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }

  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }

  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }

  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }

  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }

  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }

  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }

  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }

  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }

  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }

  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }

  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }

  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }

  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }

  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }

  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }

  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }

  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }

  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }

  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }

  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }

  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
}
</style>
