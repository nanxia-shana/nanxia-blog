import type { Ref } from 'vue'

interface TipConfig {
  selector: string
  text: string | string[]
}

interface MessageConfig {
  mouseover: TipConfig[]
  click: TipConfig[]
}

interface BoundListener {
  el: EventTarget
  type: string
  fn: EventListener
}

/**
 * 看板娘消息气泡：从旧版 message.js（jQuery）迁移为原生 JS。
 * 功能：message.json 选择器提示、时段问候、referrer 欢迎、一言、复制提醒、控制台彩蛋。
 */
export function useMessageBubble(messageRef: Ref<HTMLElement | null>) {
  let hideTimer: ReturnType<typeof setTimeout> | null = null
  let hitokotoTimer: ReturnType<typeof setInterval> | null = null
  let easterEggBound = false
  const bound: BoundListener[] = []

  // ---- 模板变量替换：{text} -> context.text；\{...\} 转义 ----
  function renderTip(template: string, context: Record<string, unknown>): string {
    return template.replace(/(\\)?\{([^{}\\]+)(\\)?\}/g, (word, slash1, token, slash2) => {
      if (slash1 || slash2) return word.replace('\\', '')
      const parts = token.replace(/\s/g, '').split('.')
      let cur: unknown = context
      for (const p of parts) {
        cur = (cur as Record<string, unknown>)?.[p]
        if (cur === undefined || cur === null) return ''
      }
      return String(cur)
    })
  }

  // ---- fadeTo 等价：Web Animations API ----
  function fadeTo(target: number, duration: number): Promise<void> {
    const el = messageRef.value
    if (!el) return Promise.resolve()
    return new Promise((resolve) => {
      const current = Number(getComputedStyle(el).opacity) || 0
      const anim = el.animate([{ opacity: current }, { opacity: target }], {
        duration,
        fill: 'forwards',
        easing: 'ease-out'
      })
      anim.onfinish = () => resolve()
      anim.oncancel = () => resolve()
    })
  }

  function pickText(text: string | string[]): string {
    if (Array.isArray(text)) {
      return text[Math.floor(Math.random() * text.length)]
    }
    return text
  }

  function showMessage(text: string | string[], timeout = 5000) {
    const el = messageRef.value
    if (!el) return
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    el.innerHTML = pickText(text)
    fadeTo(1, 200).then(() => hideMessage(timeout))
  }

  function hideMessage(timeout = 5000) {
    const el = messageRef.value
    if (!el) return
    hideTimer = setTimeout(() => fadeTo(0, 200), timeout)
  }

  // ---- message.json 选择器提示 ----
  async function initTips(messagePath: string) {
    try {
      const res = await fetch(`${messagePath}message.json`)
      const config = (await res.json()) as MessageConfig
      config.mouseover?.forEach((tip) => {
        document.querySelectorAll(tip.selector).forEach((el) => {
          const fn = () => {
            const text = renderTip(pickText(tip.text), {
              text: el.textContent ?? ''
            })
            showMessage(text, 3000)
          }
          el.addEventListener('mouseenter', fn)
          bound.push({ el, type: 'mouseenter', fn })
        })
      })
      config.click?.forEach((tip) => {
        document.querySelectorAll(tip.selector).forEach((el) => {
          const fn = () => showMessage(pickText(tip.text), 3000)
          el.addEventListener('click', fn)
          bound.push({ el, type: 'click', fn })
        })
      })
    } catch (err) {
      console.warn('[MessageBubble] message.json 加载失败:', err)
    }
  }

  // ---- 进入页面时的问候语 ----
  function showGreeting() {
    let text: string
    if (document.referrer !== '') {
      const referrer = document.createElement('a')
      referrer.href = document.referrer
      const domain = referrer.hostname.split('.')[1]
      text = `嗨！来自 <span style="color:#0099cc;">${referrer.hostname}</span> 的朋友！`
      if (domain === 'baidu') {
        text = `嗨！来自 百度搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ${document.title.split(' - ')[0]} 」</span>`
      } else if (domain === 'so') {
        text = `嗨！来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ${document.title.split(' - ')[0]} 」</span>`
      } else if (domain === 'google') {
        text = `嗨！来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ${document.title.split(' - ')[0]} 」</span>`
      }
    } else if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
      const now = new Date().getHours()
      if (now > 23 || now <= 5) {
        text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？'
      } else if (now > 5 && now <= 7) {
        text = '早上好！一日之计在于晨，美好的一天就要开始了！'
      } else if (now > 7 && now <= 11) {
        text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
      } else if (now > 11 && now <= 14) {
        text = '中午了，工作了一个上午，现在是午餐时间！'
      } else if (now > 14 && now <= 17) {
        text = '午后很容易犯困呢，今天的运动目标完成了吗？'
      } else if (now > 17 && now <= 19) {
        text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~'
      } else if (now > 19 && now <= 21) {
        text = '晚上好，今天过得怎么样？'
      } else if (now > 21 && now <= 23) {
        text = '已经这么晚了呀，早点休息吧，晚安~~'
      } else {
        text = '嗨~ 快来逗我玩吧！'
      }
    } else {
      text = `欢迎阅读<span style="color:#0099cc;">「 ${document.title.split(' - ')[0]} 」</span>`
    }
    showMessage(text, 12000)
  }

  // ---- 一言 ----
  async function showHitokoto() {
    try {
      const res = await fetch('https://v1.hitokoto.cn/')
      const data = await res.json()
      showMessage(data.hitokoto, 5000)
    } catch {
      // 静默失败，不阻塞
    }
  }

  // ---- 复制提醒 ----
  function initCopyAlert() {
    const fn = () => showMessage('你都复制了些什么呀，转载要记得加上出处哦~~', 5000)
    document.addEventListener('copy', fn)
    bound.push({ el: document, type: 'copy', fn })
  }

  // ---- 控制台彩蛋：重写正则 toString，在控制台被求值时触发 ----
  function initConsoleEasterEgg() {
    if (easterEggBound) return
    easterEggBound = true
    const re = /x/
    re.toString = () => {
      showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000)
      return ''
    }
    // 在控制台首次打开时，浏览器会对该对象求值从而触发 toString
    // eslint-disable-next-line no-console
    console.log(re)
  }

  function init(messagePath: string) {
    initTips(messagePath)
    showGreeting()
    initCopyAlert()
    initConsoleEasterEgg()
    hitokotoTimer = setInterval(showHitokoto, 30000)
  }

  function destroy() {
    if (hitokotoTimer) {
      clearInterval(hitokotoTimer)
      hitokotoTimer = null
    }
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    bound.forEach(({ el, type, fn }) => el.removeEventListener(type, fn))
    bound.length = 0
    easterEggBound = false
  }

  return { init, destroy, showMessage }
}
