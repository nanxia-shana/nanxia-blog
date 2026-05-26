---
layout: doc

lastUpdated: false
title: Pretext 技术解析
description: 最近在音乐播放器等场景受到关注的 Pretext 排版技术，核心原理、优缺点分析与适用场景总结
category: 前端
date: 2026-05-18
---

## 1. 从歌词滚动中的排版问题说起

在实现博客音乐播放器的歌词展示时，我遇到过一个很典型的体验问题：歌词行本身可以按时间戳高亮，但高亮切换、滚动定位和双语内容换行并不总是同步。最初的实现比较直接：解析每行歌词的时间戳，播放到对应时间后给当前行添加 `active` class，再通过 `scrollIntoView` 将其滚动到视口中间。

这种方案实现成本低，但在实际使用中会暴露出几个问题：滚动触发时机依赖浏览器调度，高亮和位移之间容易出现轻微错位；频繁拖动进度条或切换歌曲时，需要反复读取 DOM 布局信息；当一句歌词较长并发生换行时，当前行高度也会影响居中位置的计算。后来改用 `transform` 控制歌词容器的位移后，滚动表现明显稳定了许多。

这也引出了一个值得讨论的问题：如果我们能在展示之前就知道每一行文本的真实高度、位置和换行结果，那么运行时是否可以只做数字计算，而不是不断查询 DOM？Pretext 所代表的布局预计算思路，正是围绕这个问题展开的。

Pretext 是由前 React 核心成员 Cheng Lou（成楼）提出并独立开发的文本布局方案，在开发过程中也借助了 Claude Code、OpenAI Codex 等 AI 编程工具进行迭代优化。目前代码托管在 GitHub：[chenglou/pretext](https://github.com/chenglou/pretext)

> 简单来说，Pretext 关注的是在运行时交互之前，提前获得文本在特定容器和样式条件下的布局信息。后续滚动、高亮和对齐逻辑可以基于这些预计算结果完成，从而减少交互过程中的布局查询和重排成本。

## 2. 核心思路

浏览器默认的文本渲染流程通常是边布局边展示。文本进入页面后，浏览器根据字体、容器宽度、行高、语言规则等因素计算换行和高度；当滚动、高亮、字号变化或容器尺寸变化发生时，页面可能需要重新计算相关布局。

Pretext 的思路可以概括为三个阶段：

1. **布局准备**：在正式交互前，对目标文本进行一次完整的布局测量。
2. **数据记录**：保存每一行文本的高度、偏移量、行号等关键信息。
3. **运行时使用**：滚动、高亮和对齐时直接使用已记录的数据，尽量避免重复读取 DOM 布局。

它并不是改变浏览器文本渲染规则，而是把一部分布局成本提前到初始化阶段完成。这样做的收益在于运行时更稳定，代价则是初始化阶段需要额外计算。

如果从更完整的 Pretext 实现来看，它关注的不只是“提前读取 DOM 高度”。更底层的思路通常还包括：先将文本拆成更细的片段，测量每个片段在当前字体下的宽度，再根据容器宽度和换行规则推导文本应该如何分行。复杂实现中还可能借助 Canvas 的 `measureText`、`Intl.Segmenter` 等能力处理字符分段、单词边界、不同语言的换行规则和逐字级别的位置计算。

这些能力适合更精细的文本排版场景，例如逐字歌词进度、卡拉 OK 式高亮、复杂字幕排版或自定义文本渲染。但我的博客音乐页面目前没有实现到这个层级：它没有使用 Canvas 去逐字测量，也没有做逐字播放进度，而是采用了其中最实用的一部分——在歌词 DOM 渲染完成后，预先记录每一行的真实高度和位置。对于当前的歌词居中、高亮、滚动和双语展示需求，这个粒度已经足够。

## 2.1 与传统方案的区别

以歌词滚动为例，传统实现大致如下：

```text
播放到 01:23 → 找到对应歌词行 → 添加 active 状态 → 调用 scrollIntoView 或读取 offsetTop 后滚动
```

这类方案的问题在于：每次定位当前行时，都可能需要读取最新 DOM 状态。不同字体、屏幕宽度、语言内容和换行结果都会影响最终偏移量。

采用布局预计算后，流程会变成：

```text
歌词加载 → 计算所有歌词行的位置和高度 → 记录布局数据
播放到 01:23 → 查找预计算位置 → 使用 transform 更新位移并切换高亮
```

两者的关键差别不是是否使用 `transform`，而是运行时是否还依赖实时 DOM 查询。`transform` 解决的是动画执行方式，预计算解决的是动画目标位置如何获得。

::: tip 核心区别
传统方案倾向于在交互发生时计算位置；Pretext 的思路是先计算布局，再在交互阶段复用这些结果。它本质上是在初始化成本和运行时稳定性之间做取舍。
:::

## 3. 主要优势

## 3.1 降低交互过程中的布局开销

歌词滚动、字幕切换和复杂文本排版的性能瓶颈，往往不只在动画本身，也在于计算动画目标位置的过程。如果每次高亮切换都要读取 `offsetTop`、`offsetHeight` 等属性，浏览器就可能为了返回准确值而刷新布局。

```typescript
// 传统方式：每次切换时读取 DOM 布局
const activeElement = container.querySelector('.active');
const offset = activeElement.offsetTop;
container.scrollTo({ top: offset, behavior: 'smooth' });

// 预计算方式：运行时直接使用缓存数据
const offset = precomputedLines[currentIndex].offsetTop;
wrapper.style.transform = `translateY(${offset}px)`;
```

`transform` 通常可以由合成线程处理，不会像频繁修改 `top`、`scrollTop` 那样直接触发布局计算。配合预计算数据后，运行时需要做的事情会更少，交互表现也更容易保持一致。

在我的博客音乐页面中，歌词滚动已经从早期的 `scrollIntoView` 调整为基于 `transform` 的位移控制。后续进一步优化时，又把“当前歌词应该移动到哪里”这一步从实时 DOM 查询改成了优先使用预计算数据。

需要说明的是，这里并不是完整复刻 Pretext 的所有能力。当前项目没有实现 Canvas 文本测量、逐字位置计算或逐字歌词进度，也没有必要为现阶段的歌词弹窗增加这些复杂度。博客中的实现更接近“借鉴 Pretext 的预计算思想”：先让浏览器完成真实 DOM 布局，再把每一行的位置缓存下来，播放时直接复用。

### 本博客音乐页面中的实际改动

改动前，歌词滚动虽然可以用 `transform` 来执行动画，但目标位置仍然是在每次歌词切换时临时计算的。核心逻辑接近下面这样：

```typescript
const updateLyricsOffset = () => {
  const container = lyricsContainer.value;
  const lyricElements = container.querySelectorAll('.lyrics-line');
  const currentElement = lyricElements[currentLyricIndex.value] as HTMLElement;

  if (currentElement) {
    const elementTop = currentElement.offsetTop;
    const elementHeight = currentElement.offsetHeight;
    lyricsOffset.value = containerHeight.value / 2 - elementTop - elementHeight / 2;
  }
};
```

这段逻辑的问题不在于公式本身，而在于 `offsetTop` 和 `offsetHeight` 的读取时机。每当当前歌词变化时，代码都要重新查询 `.lyrics-line`，再读取当前行的布局信息。对于短歌词来说影响不大，但如果用户频繁拖动进度条、快速切歌，或者歌词中存在大量双语换行，这些实时布局读取就会增加不稳定因素。

现在的实现中，歌词加载完成后会先执行一次布局预计算。真实代码位于 `LyricsModal.vue` 中，核心逻辑如下：

```typescript
const precomputeLayout = async () => {
  await nextTick();
  await nextTick();

  if (!lyricsContainer.value) {
    if (precomputeRetryCount < 5) {
      precomputeRetryCount++;
      setTimeout(() => precomputeLayout(), 100);
    }
    return;
  }

  const lyricElements = lyricsContainer.value.querySelectorAll('.lyrics-line') as NodeListOf<HTMLElement>;

  precomputedLines.value = Array.from(lyricElements).map((el, index) => ({
    index,
    offsetTop: el.offsetTop,
    offsetHeight: el.offsetHeight
  }));

  updateLyricsOffset();
};
```

这里的两次 `nextTick` 是为了等待歌词数据更新和 DOM 渲染完成，确保测量到的是最终展示状态下的行高与位置。随后每一行歌词的 `offsetTop` 和 `offsetHeight` 会被保存到 `precomputedLines` 中。也就是说，DOM 布局读取被集中到了歌词加载完成后的预计算阶段。

对应的滚动定位逻辑也随之改变：

```typescript
const updateLyricsOffset = () => {
  if (precomputedLines.value.length > 0) {
    const line = precomputedLines.value[currentLyricIndex.value];
    if (line) {
      lyricsOffset.value = containerHeight.value / 2 - line.offsetTop - line.offsetHeight / 2;
      return;
    }
  }

  const container = lyricsContainer.value;
  if (!container) return;

  const height = containerHeight.value || container.clientHeight;
  const lyricElements = container.querySelectorAll('.lyrics-line');
  const currentElement = lyricElements[currentLyricIndex.value] as HTMLElement;

  if (currentElement) {
    const elementTop = currentElement.offsetTop;
    const elementHeight = currentElement.offsetHeight;
    lyricsOffset.value = height / 2 - elementTop - elementHeight / 2;
  }
};
```

这段代码保留了一个实时查询的兜底分支，但正常情况下会优先走 `precomputedLines`。这样做的好处是：歌词播放过程中，当前行切换只需要读取数组里的缓存数据；只有预计算尚未完成、容器还没准备好，或发生异常状态时，才回退到 DOM 查询。

实际收益可以概括为：

| 场景 | 改动前 | 改动后 | 优化效果 |
| :--- | :--- | :--- | :--- |
| 歌词正常播放 | 每次切换都查询当前行 DOM | 读取 `precomputedLines[currentIndex]` | 减少运行时布局读取 |
| 拖动进度条 | 高频触发当前行定位 | 高频读取缓存坐标 | 响应更稳定 |
| 双语和长句换行 | 每次依赖当前 DOM 高度 | 加载后统一记录真实高度 | 居中和对齐更可控 |
| 容器未准备好 | 可能拿不到正确尺寸 | 有重试和兜底查询 | 降低初始化时序问题 |
| 窗口尺寸变化 | 旧位置可能失效 | resize 后清空并重新预计算 | 保持换行后的定位准确 |

::: tip 关键点
这次优化并不是简单地把滚动动画换成 `transform`，而是把“计算滚动目标位置”的时机前移。`transform` 负责让动画执行得更平滑，`precomputedLines` 则负责让每次滚动的目标位置更稳定。
:::

## 3.2 更容易处理换行和双语对齐

双语歌词、字幕和注释文本中，经常会出现原文与译文长度不同的情况。例如日文或英文原文可能只有一行，中文翻译可能折成两行；同一句歌词在桌面端和移动端也可能因为容器宽度不同而产生不同换行。

如果布局信息是在真实样式和真实容器宽度下提前测量得到的，那么每组文本的高度就可以被准确记录。后续做居中、渐隐、分组滚动或点击跳转时，可以直接依据这些高度进行计算，避免凭经验估算行距。

## 3.3 时间轴展示更稳定

歌词和字幕都属于时间驱动的文本展示。它们不仅要显示正确的内容，还要在正确的时间出现在正确的位置。

传统滚动方案中，`scrollIntoView`、`scrollTo` 或动态调整 `scrollTop` 的执行时机受浏览器调度影响；如果同时存在过渡动画、滚动容器嵌套或用户手动滚动，最终效果可能出现轻微延迟或跳动。

预计算方案把位置计算简化为纯数字运算。当前时间对应哪一行、这一行应该移动到哪个位置，都可以由已有数据直接得出，因此更容易保持时间轴和视觉反馈的一致性。

## 3.4 复杂视觉效果更易维护

当所有文本行的布局信息都可用时，很多视觉效果会更容易实现：

- 当前歌词居中放大，前后歌词降低透明度；
- 双语歌词按组对齐，或者采用不同层级的视觉样式；
- 鼠标悬停时展示额外信息；
- 拖动进度条时让歌词平滑跟随；
- 根据当前行高度动态调整滚动距离。

这些效果并非不能用传统方式完成，但如果每个效果都依赖实时 DOM 查询，逻辑会逐渐变得分散。基于预计算数据实现时，代码通常更接近“根据状态映射位置和样式”，可维护性也会更好。

## 4. 局限性与成本

Pretext 的价值来自提前计算，但它的成本也来自这里。是否采用这类方案，需要根据内容规模、交互频率和设备性能综合判断。

## 4.1 初始化成本更高

为了获得准确布局，页面需要在交互之前完成一次测量。文本越多、样式越复杂、字体加载越慢，初始化阶段的成本就越明显。

可能产生的开销包括：

- 浏览器需要计算所有文本节点的布局；
- 字体、字形和换行规则会影响测量耗时；
- 隐藏容器虽然不展示给用户，但布局计算仍然真实发生；
- 如果字体尚未加载完成，测量结果还可能需要重新计算。

因此，预计算不适合无差别地应用到所有文本展示场景。对于普通文章、简单列表或交互频率很低的内容，初始化成本可能高于它带来的收益。

## 4.2 容器尺寸变化后需要重新计算

文本换行依赖容器宽度。浏览器窗口缩放、移动端横竖屏切换、系统字号变化、页面布局调整，都可能改变换行结果。一旦换行结果变化，之前记录的 `offsetTop` 和 `offsetHeight` 就不再可靠。

这意味着实现中需要监听尺寸变化，并在合适的时机重新计算布局。通常还需要配合防抖，避免在窗口连续变化时频繁触发测量。

## 4.3 动态内容场景收益有限

如果内容不断追加、删除或重排，预计算方案的优势会明显下降。比如聊天消息、实时日志、分页加载列表等场景，内容本身就是持续变化的。如果每次变化都重新计算全部布局，成本可能反而更高。

因此，Pretext 更适合内容相对固定、但展示过程对流畅度和对齐精度要求较高的场景。

## 4.4 实现复杂度会提升

与直接调用 `scrollIntoView` 相比，预计算方案需要额外处理：

- 隐藏测量容器的创建和样式同步；
- 字体加载、组件挂载和 DOM 更新后的测量时机；
- 预计算数据结构设计；
- 当前行变化、用户滚动和自动滚动之间的关系；
- resize 后的重新计算；
- 空内容、单行内容、异常歌词格式等边界情况。

这些复杂度并不会因为方案本身优雅而消失。它更适合用于确实需要精细排版和高频交互的模块，而不是作为默认文本渲染方式。

::: tip 本质权衡
Pretext 代表的是一种用初始化计算换取运行时稳定性的方案。它的收益和成本都比较明确，关键在于判断当前场景是否足够依赖稳定的文本布局信息。
:::

## 5. 适用场景

## 5.1 音乐歌词展示

歌词展示是比较适合使用预计算思路的场景：

- 歌词内容通常在加载后保持不变；
- 播放过程中会频繁根据时间更新当前行；
- 当前行居中、高亮、放大等效果对位置精度要求较高；
- 双语歌词需要处理原文和译文的高度差异；
- 用户会持续关注歌词区域，细微跳动也容易被感知。

如果歌词数量不多，传统实现也可以满足需求；但当页面希望获得更稳定的滚动和更自然的高亮过渡时，预计算会更有价值。

## 5.2 视频字幕

字幕和歌词类似，也属于时间驱动的文本展示。尤其是双语字幕、多行字幕或需要跟随视频帧精确切换的场景，提前掌握每一条字幕的布局信息，有助于减少展示过程中的位置抖动。

## 5.3 诗歌、古文与注释排版

诗歌、古文、译注和批注类内容通常对行距、对齐和节奏有较高要求。原文、注释、译文之间可能存在复杂的对应关系。预计算可以帮助开发者更精确地控制每一组文本的位置，降低动态渲染造成的错位概率。

## 5.4 代码展示和编辑器类应用

代码编辑器也依赖类似的布局思想。行号、语法高亮、折叠区域、光标位置和选区绘制都需要稳定的位置信息。像 VS Code、Monaco Editor 这类编辑器，底层都会围绕文本布局、可视区域和滚动性能做大量优化。

## 5.5 不适合的场景

以下场景通常不需要引入 Pretext 这类方案：

- **普通文章内容**：浏览器原生排版已经足够可靠；
- **文章列表或卡片列表**：交互频率低，内容结构简单；
- **聊天消息**：内容持续追加，重新计算成本较高；
- **分页加载内容**：数据并非一次性完整可用；
- **简单静态页面**：复杂度增加通常不值得。

判断标准可以简化为一句话：如果内容相对固定，并且运行时需要频繁、精确地根据文本位置做交互，预计算才值得考虑。

## 6. 《春江花月夜》的避让排版示例

下面用《春江花月夜》来说明一个更接近 Pretext 思路的示例：文字区域中存在一个可自由移动的小球，文字需要根据小球的位置重新排版，并避开它占据的空间。

这个例子不是浏览器默认文本流能直接完成的效果。普通文本流只知道容器宽度，并不知道中间有一个会移动的圆形障碍物。如果要让文字绕开小球，就需要在布局阶段先完成分段、测量、换行和碰撞检测，再把计算结果应用到页面上。

<!-- markdownlint-disable-next-line MD033 -->
<PoemPrecomputeDemo />

## 6.1 文本分段

第一步是把原始文本拆成可排版的片段。这里使用 `Intl.Segmenter` 按中文 grapheme 分段，如果浏览器不支持，则退回到 `Array.from`：

```typescript
const segmentText = () => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(poemText), item => item.segment);
  }
  return Array.from(poemText);
};
```

对于中文诗词来说，grapheme 级别已经足够表达“一个可放置的文字单元”。如果是英文段落，则可以改成 `word` 粒度，避免单词被随意拆开。

## 6.2 使用 Canvas 测量片段宽度

分段之后，还需要知道每个片段在当前字体下的实际宽度。这里不再使用固定字符宽度，而是用 Canvas `measureText` 测量：

```typescript
const measureSegments = () => {
  const context = getCanvasContext();
  if (!context) return;
  context.font = getTextFont();

  textSegments.value = segmentText().map((text, index) => ({
    index,
    text,
    width: Math.max(8, Math.ceil(context.measureText(text).width)),
    isPunctuation: punctuationRegex.test(text)
  }));
};
```

这样计算出的宽度会更接近真实渲染结果。相比“所有字都按同一个宽度处理”，Canvas 测量可以更好地处理标点、英文、数字、不同字体等情况。

## 6.3 换行与避让规则

小球可以看成一个圆形障碍物，每个文本片段可以看成一个矩形。当片段矩形与小球相交时，当前位置就不能放置文字：

```typescript
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
```

排版时从左到右尝试放置片段：如果放不下就换行；如果当前片段是标点且位于行首，也换到下一行；如果当前位置会撞到小球，就向后寻找下一个可用位置。

```typescript
const segmentLayouts = computed<SegmentLayout[]>(() => {
  const layouts: SegmentLayout[] = [];
  let x = 0;
  let line = 0;

  textSegments.value.forEach(segment => {
    while (true) {
      const needsLineBreak = x + segment.width > maxX || (x === 0 && segment.isPunctuation);
      if (needsLineBreak) {
        line++;
        x = 0;
        continue;
      }

      const segmentX = stagePadding + x;
      const segmentY = contentTop + line * lineHeight.value;

      if (!intersectsBall(segmentX, segmentY, segment.width)) {
        layouts.push({ ...segment, x: segmentX, y: segmentY, line });
        x += segment.width;
        return;
      }

      x += Math.max(8, Math.min(segment.width, 18));
    }
  });

  return layouts;
});
```

这里已经包含了一个很简化的中文排版规则：标点尽量不出现在行首。它还不是完整的中文禁则排版，但足以说明分段、测宽、换行和避让之间的关系。

## 6.4 将计算结果应用到页面

模板中不再依赖普通文本流，而是根据每个片段的坐标用 `transform` 放置：

```vue
<span
  v-for="segment in segmentLayouts"
  :key="segment.index"
  class="poem-demo-segment"
  :style="{ transform: `translate(${segment.x}px, ${segment.y}px)` }"
>
  {{ segment.text }}
</span>
```

这个示例比歌词滚动更接近“自定义排版”：歌词场景主要是预计算已有 DOM 的位置，而这里是先用 `Intl.Segmenter` 和 Canvas 得到文本片段及其宽度，再根据障碍物位置主动计算每个片段的位置。它们的共同点是，都把运行时需要使用的布局信息先转成数据，再由这些数据驱动视觉表现。

## 7. 总结

我认为 Pretext 值得关注的地方是它体现出的工程思路，当运行时频繁计算会影响交互稳定性时，可以考虑把一部分工作提前到初始化阶段完成，并将结果转化为可复用的数据。

对于歌词、字幕、诗歌排版、代码编辑器等场景，这种思路能够减少运行时布局查询，使滚动、高亮和对齐更可控。但它也会带来更高的初始化成本和实现复杂度。只有当文本内容相对固定、位置精度要求较高、交互频率较高时，这种成本才更容易被收益抵消。

如果只是普通内容展示，浏览器原生排版通常已经足够。Pretext 更适合作为特定高要求文本交互场景下的优化方案，而不是通用替代方案。
