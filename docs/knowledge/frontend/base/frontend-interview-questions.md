---
layout: doc

lastUpdated: false
title: 前端面试题解析
description: 涵盖 JS 核心、工程化、浏览器原理、Vue/React 框架、性能优化、线上监控、跨端架构、AI 工程实践等模块，精选高频面试题及详细解答思路
category: 前端基础
date: 2026-08-12
---

# 前端面试题解析

本文按模块整理高频前端面试题，每题包含关键词、考察点、知识点详解、回答要点与回答模板，既可以用来系统复习，也可作为面试前的速查材料。

## JavaScript 核心

### 1. 谈谈你对事件循环（Event Loop）的理解，宏任务和微任务有什么区别？

#### 1-1. 关键词

> - **Event Loop（事件循环）**
> - **调用栈（Call Stack）**
> - **宏任务（Macrotask）**
> - **微任务（Microtask）**
> - **Web APIs**

#### 1-2. 考察点

::: info 考察点

- **运行时机制**：是否理解 JavaScript 单线程模型与异步执行的底层原理
- **任务分类**：能否准确区分宏任务和微任务的常见来源
- **执行顺序**：是否掌握"一次宏任务 -> 清空微任务队列 -> 渲染 -> 下一次宏任务"的顺序
- **环境差异**：是否了解浏览器与 Node.js 在事件循环实现上的区别
- **代码分析**：能否对包含 setTimeout、Promise 的代码给出正确输出顺序

:::

#### 1-3. 知识点详解

JavaScript 是单线程语言，同一时刻只能执行一段代码。为了在不阻塞主线程的情况下处理定时器、网络请求、用户交互等异步操作，浏览器引入了事件循环机制。事件循环协调三个核心组件：调用栈（Call Stack）、Web APIs 环境和任务队列。

调用栈是一个后进先出（LIFO）的数据结构，用于追踪当前正在执行的函数。当调用一个函数时，它的执行上下文被压入栈顶；函数执行完毕后弹出。JavaScript 引擎只会执行调用栈栈顶的代码。当遇到异步 API（如 `setTimeout`、`fetch`）时，浏览器会将其交给 Web APIs 处理，主线程继续执行后续同步代码，不会等待异步操作完成。

Web APIs 是浏览器提供的独立线程环境，负责处理 DOM 事件、定时器、网络请求等。当异步操作完成或到达指定时间时，对应的回调函数不会立即执行，而是被放入任务队列中等待。任务队列分为宏任务队列和微任务队列两类。

宏任务（Macrotask）的常见来源包括：`setTimeout`、`setInterval`、`setImmediate`（Node.js）、I/O 操作、UI 渲染、`requestAnimationFrame`、`MessageChannel`。每个宏任务作为一个独立的调度单元，在事件循环的一次"tick"中取一个执行。

微任务（Microtask）的常见来源包括：`Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`、`process.nextTick`（Node.js，优先级最高）。微任务拥有比宏任务更高的优先级。

事件循环的执行顺序遵循以下规则：

1. 从宏任务队列中取出最旧的一个任务执行；
2. 执行过程中如果产生微任务，依次加入微任务队列；
3. 当前宏任务执行完毕后，调用栈为空，立即清空微任务队列中的所有任务（包括在清空过程中新加入的微任务）；
4. 浏览器可能进行 UI 渲染；
5. 进入下一轮循环，取下一个宏任务。

关键点在于：微任务队列会在当前宏任务结束后、下一个宏任务开始前被全部清空，这意味着如果微任务不断产生新的微任务，可能会阻塞后续宏任务的执行。

来看一段典型代码：

```javascript
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise1');
  })
  .then(() => {
    console.log('promise2');
  });

console.log('script end');
```

输出顺序分析：

1. 同步代码依次执行，输出 `script start`，然后 `script end`；
2. `setTimeout` 的回调被放入宏任务队列；
3. 两个 `then` 回调按顺序进入微任务队列；
4. 当前宏任务（整段脚本）执行完，清空微任务队列，输出 `promise1`、`promise2`；
5. 执行下一个宏任务，输出 `setTimeout`。

最终输出：`script start` -> `script end` -> `promise1` -> `promise2` -> `setTimeout`。

再看一个微任务中嵌套微任务的例子：

```javascript
console.log('start');

setTimeout(() => {
  console.log('timeout1');
  Promise.resolve().then(() => console.log('promise in timeout'));
}, 0);

setTimeout(() => {
  console.log('timeout2');
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
  queueMicrotask(() => console.log('microtask in promise'));
});

console.log('end');
```

输出顺序为：`start` -> `end` -> `promise1` -> `microtask in promise` -> `timeout1` -> `promise in timeout` -> `timeout2`。第一个 setTimeout 执行完后，其内部产生的微任务必须在第二个 setTimeout 之前清空，这正是"每个宏任务后清空微任务队列"规则的体现。

浏览器和 Node.js 的事件循环存在差异。浏览器环境相对简单，只有宏任务和微任务两个队列。Node.js 的事件循环基于 libuv，分为多个阶段：timers（执行 setTimeout/setInterval 回调）、pending callbacks、idle/prepare、poll（检索 I/O 事件）、check（执行 setImmediate）、close callbacks。每个阶段之间会清空 `process.nextTick` 和微任务队列。在 Node.js 11 之前，`setImmediate` 和 `setTimeout(fn, 0)` 的执行顺序在某些情况下不确定；Node.js 11 之后行为与浏览器对齐，微任务会在每个宏任务之后立即清空。

理解事件循环对于写出高性能、无竞态问题的异步代码至关重要，也能帮助排查一些"为什么这段代码不按预期顺序执行"的问题。

#### 1-4. 回答要点

- JavaScript 单线程，事件循环通过调用栈、Web APIs、任务队列协调异步代码执行
- 宏任务包括 setTimeout、setInterval、I/O、UI 渲染等；微任务包括 Promise.then、queueMicrotask、MutationObserver
- 执行顺序：一次宏任务 -> 清空全部微任务 -> 可能渲染 -> 下一次宏任务
- 微任务中产生的新微任务也会在本轮清空，可能导致阻塞
- 浏览器与 Node.js 在阶段划分上有差异，但微任务优先于下一个宏任务的规则一致

#### 1-5. 回答模板

::: tip 回答模板

事件循环是 JavaScript 实现异步非阻塞执行的核心机制。由于 JS 是单线程的，它通过调用栈执行同步代码，遇到异步操作时交给 Web APIs 处理，异步完成后将回调放入任务队列。

任务队列分为宏任务和微任务。宏任务包括 setTimeout、setInterval、I/O、UI 渲染等；微任务包括 Promise.then、queueMicrotask、MutationObserver 等。

事件循环的执行顺序是：先执行一个宏任务，执行过程中产生的微任务放入微任务队列；当前宏任务结束后、调用栈清空时，立即执行并清空所有微任务（包括微任务中新产生的微任务）；之后浏览器可能进行渲染，再取下一个宏任务。因此微任务的优先级高于下一个宏任务。

举个例子，在一段同步代码中同时调用 setTimeout 和 Promise.resolve.then，同步代码先执行，然后 Promise 回调作为微任务先于 setTimeout 回调执行。

浏览器和 Node.js 的事件循环基本规则一致，区别在于 Node.js 基于 libuv 划分为 timers、poll、check 等多个阶段，但在 Node 11 之后微任务的清空时机已经与浏览器对齐。

:::

### 2. 箭头函数和普通函数有什么区别？箭头函数有哪些使用限制？

#### 2-1. 关键词

> - **箭头函数（Arrow Function）**
> - **词法 this（Lexical this）**
> - **arguments 对象**
> - **构造函数（constructor）**
> - **prototype**

#### 2-2. 考察点

::: info 考察点

- **this 绑定**：是否理解箭头函数没有自己的 this，继承外层作用域的 this
- **语法差异**：是否掌握 arguments、prototype、new、yield 等特性上的区别
- **使用场景**：能否判断什么场景该用、什么场景不该用箭头函数
- **底层原理**：是否了解箭头函数本质上是词法闭包对 this 的捕获，而非动态绑定

:::

#### 2-3. 知识点详解

箭头函数是 ES6 引入的一种函数简写形式，使用 `=>` 语法定义。它不仅仅是语法糖，在语义和行为上与普通函数有本质区别，核心差异集中在 `this` 的绑定机制上。

普通函数的 `this` 是动态绑定的，其值取决于函数的调用方式：作为对象方法调用时指向该对象，作为普通函数调用时在严格模式下为 `undefined`、非严格模式下指向全局对象，使用 `call/apply/bind` 可以显式指定，使用 `new` 调用时指向新创建的实例。而箭头函数没有自己的 `this`，它的 `this` 是词法确定的，即在定义时就从外层作用域捕获，后续无论如何调用都不会改变。

```javascript
const obj = {
  name: '南夏',
  normalMethod: function () {
    console.log(this.name);
  },
  arrowMethod: () => {
    console.log(this.name);
  }
};

obj.normalMethod(); // '南夏'，this 指向 obj
obj.arrowMethod();  // undefined，this 继承自外层（全局/模块作用域）
```

正因为箭头函数捕获外层 `this`，它在回调场景中非常有用，可以避免 `var self = this` 或 `.bind(this)` 这样的写法：

```javascript
function Timer() {
  this.seconds = 0;
  // 箭头函数捕获构造函数中的 this
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}
new Timer();
```

如果这里使用普通函数，`this` 在严格模式下会是 `undefined`，导致报错。

除了 `this`，箭头函数还有以下限制和区别。

第一，箭头函数没有自己的 `arguments` 对象。在普通函数中，`arguments` 是一个类数组对象，包含调用时传入的所有参数；箭头函数内部访问 `arguments` 会沿作用域链向上查找，得到的是外层函数的 `arguments`。如果需要在箭头函数中获取不定参数，应使用剩余参数（rest parameters）：

```javascript
function outer() {
  const arrow = () => {
    console.log(arguments[0]); // 访问的是 outer 的 arguments
  };
  arrow('b');
}
outer('a'); // 输出 'a'

const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
console.log(sum(1, 2, 3)); // 6
```

第二，箭头函数没有 `prototype` 属性，也不能作为构造函数使用。对箭头函数使用 `new` 会抛出 `TypeError`：

```javascript
const Arrow = () => {};
console.log(Arrow.prototype); // undefined
new Arrow(); // TypeError: Arrow is not a constructor
```

这是因为构造函数需要通过 `[[Construct]]` 内部方法创建新对象并绑定 `this`，而箭头函数没有这个内部方法。

第三，箭头函数不能使用 `yield` 关键字，因此不能作为生成器函数（generator function）。生成器必须使用 `function*` 语法定义。

第四，箭头函数不能通过 `call()`、`apply()`、`bind()` 改变 `this` 指向。传入的第一个参数会被忽略，但其他参数仍然正常传递：

```javascript
const arrow = function () { return (() => this.x)(); };
const obj = { x: 1 };
const fn = arrow.call(obj);
console.log(fn()); // 1，箭头函数捕获了 arrow 执行时的 this

const simple = () => this.x;
simple.call({ x: 2 }); // undefined（浏览器全局），this 无法被改变
```

基于以上特性，箭头函数不适合以下场景：

1. **对象方法**：对象字面量中的方法如果需要通过 `this` 访问对象自身属性，应使用普通函数简写，不要使用箭头函数。因为箭头函数的 `this` 指向定义对象时的外层作用域，而不是对象本身。

2. **原型方法**：同理，挂载在原型上需要通过 `this` 访问实例的方法应使用普通函数。

3. **构造函数**：箭头函数不能与 `new` 一起使用，无法用于定义类或构造器。

4. **需要 `arguments` 的函数**：如果依赖 `arguments` 对象（虽然现代写法更推荐 rest 参数），不能使用箭头函数。

5. **事件处理函数中需要 `this` 指向触发元素，或需要通过 `removeEventListener` 精确移除**：DOM 事件监听器中，普通函数的 `this` 指向绑定事件的元素，而箭头函数的 `this` 指向外层作用域。如果箭头函数作为具柄绑定后又需要移除，由于它是匿名的（除非赋值给变量），移除时必须持有同一引用，管理上也更易出错：

```javascript
// 普通函数：this 指向按钮元素
button.addEventListener('click', function () {
  this.disabled = true;
});

// 箭头函数：this 不指向按钮，无法这样使用
button.addEventListener('click', () => {
  this.disabled = true; // 错误，this 来自外层
});
```

6. **需要 `new.target` 的场景**：箭头函数没有 `new.target`。

箭头函数适合的场景包括：简短的纯函数回调（如 `map`、`filter`、`reduce`）、需要保留外层 `this` 的回调（如 Promise 链、setTimeout/setInterval 回调）、不需要复用的一次性函数等。

需要注意的是，在类（class）中，类字段形式的箭头函数属性与类方法在原型链上的行为不同。箭头函数作为类字段会在每个实例上创建一份，而普通方法定义在原型上共享，这在大量实例时会有内存开销差异。

#### 2-4. 回答要点

- 箭头函数没有自己的 this，词法继承外层作用域的 this，无法通过 call/apply/bind 改变
- 没有 arguments 对象，需要使用 rest 参数；没有 prototype，不能 new 调用，不能作为生成器
- 不适合用于对象方法、原型方法、构造函数、需要 this 指向 DOM 元素的事件处理器
- 适合用于简短回调、需要保留外层 this 的异步回调、数组方法的处理函数
- 类字段箭头函数会在每个实例上创建副本，而方法在原型上共享

#### 2-5. 回答模板

::: tip 回答模板

箭头函数是 ES6 引入的函数语法，它和普通函数最核心的区别是 this 的绑定规则：普通函数的 this 在调用时动态确定，而箭头函数没有自己的 this，它在定义时从外层作用域词法继承 this，之后无法通过 call、apply、bind 改变。

除了 this 之外，箭头函数还有几个限制：第一，没有自己的 arguments 对象，访问 arguments 会拿到外层函数的，如果需要可变参数应该使用剩余参数；第二，没有 prototype 属性，不能作为构造函数使用，new 调用会报错；第三，不能使用 yield，不能作为生成器函数；第四，没有 new.target。

因此箭头函数不适合用于对象的方法、原型方法、构造函数、以及需要通过 this 访问绑定元素的 DOM 事件监听器。它更适合用于数组方法的简短回调、Promise 链和定时器中需要保留外层 this 的场景。

使用时还要注意，在 class 中以类字段形式定义的箭头函数会在每个实例上各创建一份，而普通方法在原型上共享，大量实例时会有内存差异。

:::

### 3. 防抖和节流的区别是什么？分别适用于什么场景？如何实现？

#### 3-1. 关键词

> - **防抖（Debounce）**
> - **节流（Throttle）**
> - **立即执行（leading/immediate）**
> - **尾部执行（trailing）**
> - **高频事件优化**

#### 3-2. 考察点

::: info 考察点

- **概念区分**：能否准确说明防抖"合并多次为最后一次"和节流"固定频率执行"的本质差异
- **场景判断**：能否根据交互特征选择正确的优化策略
- **手写实现**：能否独立实现支持 immediate/leading/trailing 选项的防抖和节流
- **边界处理**：是否考虑 this 绑定、参数透传、取消方法等工程细节

:::

#### 3-3. 知识点详解

防抖和节流都是用于控制高频函数执行频率的技术，常见于搜索联想、窗口 resize、页面滚动、按钮防重复提交等场景。两者目的相似，但策略不同。

防抖（Debounce）的核心思想是：在事件连续触发时，只有当触发停止超过指定等待时间后，函数才会真正执行一次。如果在等待时间内事件再次触发，则重新计时。也就是说，防抖会把连续的多次调用合并为最后一次执行。这非常适合搜索框输入联想：用户连续输入时不需要每敲一个字符就发请求，而是等停顿后再请求。

节流（Throttle）的核心思想是：在指定时间间隔内，函数最多执行一次。即使事件持续高频触发，执行频率也会被限制在固定节奏。这适合滚动加载、拖拽、resize 等需要保持一定响应频率但不需要每次触发都执行的场景。

下面先看防抖的基础实现：

```javascript
function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  };
}
```

使用方法：

```javascript
const search = debounce(function (keyword) {
  console.log('搜索:', keyword);
}, 300);

input.addEventListener('input', e => search(e.target.value));
```

基础版本是 trailing 模式（停止触发后在 wait 结束时执行）。实际工程中常需要支持立即执行（leading）模式，即第一次触发立即执行，后续在 wait 内的触发被忽略，直到静默 wait 后才能再次立即执行。还可以同时支持 leading 和 trailing，让首次和末次都能执行。一个更完整的实现如下：

```javascript
function debounce(fn, wait, immediate = false) {
  let timer = null;

  const debounced = function (...args) {
    if (timer) clearTimeout(timer);

    if (immediate && timer === null) {
      // leading 执行
      fn.apply(this, args);
    }

    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        // trailing 执行
        fn.apply(this, args);
      }
    }, wait);
  };

  debounced.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}
```

这里有一个细节：`immediate` 为 true 时使用 `timer === null` 判断是否处于可执行窗口。首次调用时立即执行并设置定时器，在 wait 时间内再次调用只会重置定时器而不会重复执行；定时器到期后将 `timer` 置为 null，下一次调用又可以立即执行。这样既保证了首次响应，又避免了连续触发导致的重复执行。

节流的基础实现通常有两种思路：时间戳和定时器。时间戳版本首次触发会立即执行，停止触发后不会再执行（leading 模式）：

```javascript
function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      fn.apply(this, args);
      last = now;
    }
  };
}
```

定时器版本首次触发会延迟到 interval 后执行，停止触发后还会再执行一次（trailing 模式）：

```javascript
function throttle(fn, interval) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, interval);
    }
  };
}
```

更完整的节流实现支持同时配置 leading 和 trailing，保证首次立即执行、末次也能在间隔后补执行：

```javascript
function throttle(fn, interval, { leading = true, trailing = true } = {}) {
  let timer = null;
  let last = 0;

  return function (...args) {
    const now = Date.now();
    // 如果不允许首次执行，将 last 初始化为 now，使首次不满足时间差
    if (!last && leading === false) last = now;

    const remaining = interval - (now - last);

    if (remaining <= 0 || remaining > interval) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn.apply(this, args);
    } else if (!timer && trailing !== false) {
      timer = setTimeout(() => {
        last = leading === false ? 0 : Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

这个实现的关键在于 `remaining`：距离上次执行还剩多少时间。如果时间已到，立即执行；否则设置一个定时器在剩余时间后执行 trailing 调用。`leading = false` 时通过调整 `last` 让首次不立即执行；`trailing = false` 时不设置尾部定时器。

在实际选型上：

- 搜索框输入联想、自动补全：使用防抖，等用户停顿再发请求，减少无效请求数；
- 窗口 resize、拖拽：使用节流，保持一定响应频率，避免频繁重排；
- 滚动事件（scroll）、鼠标移动（mousemove）：使用节流，按固定间隔处理位置计算；
- 按钮提交防重复点击：使用防抖（immediate 模式），首次立即执行，wait 内忽略后续点击；
- 表单验证、保存草稿：使用防抖，输入停止后再校验或保存；
- 滚动到底部自动加载更多：使用节流控制检查频率，或对加载动作本身加防抖/锁。

还需要注意几个工程细节：返回的函数要正确绑定 `this` 和透传参数，否则作为 DOM 事件处理器时 `this` 和 event 对象会丢失；提供 `cancel` 方法以便在组件卸载或路由切换时取消防抖/节流，避免内存泄漏和在已销毁组件上执行回调；在 TypeScript 中应保留原函数的类型签名，可以使用泛型来约束：

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    if (immediate && timer === null) fn.apply(this, args);
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(this, args);
    }, wait);
  };
}
```

像 Lodash 这样的成熟库提供了 `_.debounce` 和 `_.throttle`，支持 `leading`、`trailing`、`maxWait` 等丰富选项，生产环境中通常直接使用，但理解手写原理对于面试和排查问题仍然很重要。

#### 3-4. 回答要点

- 防抖是连续触发后等待静默期再执行一次，合并多次为最后一次；节流是固定间隔最多执行一次
- 防抖适合搜索联想、表单校验、按钮防重复提交；节流适合滚动、resize、拖拽等高频持续事件
- 手写时要处理 this 绑定、参数透传、定时器清理，并提供 cancel 方法
- leading/trailing 选项控制首次和末次是否执行，immediate 防抖就是 leading 模式
- 生产环境可使用 Lodash，但要理解其原理和配置

#### 3-5. 回答模板

::: tip 回答模板

防抖和节流都是控制高频函数执行频率的手段，但策略不同。防抖是指在连续触发时，只有停止触发超过等待时间才执行一次，如果期间再次触发就重新计时，本质是把多次调用合并为最后一次。节流是指在固定时间间隔内函数最多执行一次，无论触发多频繁都按固定节奏执行。

应用场景上，搜索框输入联想、表单自动保存、按钮防重复点击适合用防抖，因为我们关心的是用户操作停下来之后的结果；滚动事件、窗口 resize、鼠标移动、拖拽适合用节流，因为需要在过程中保持一定响应频率。

实现防抖的关键是维护一个定时器，每次调用都清除旧定时器并设置新定时器；还可以支持 immediate 参数实现首次立即执行。实现节流可以用时间戳记录上次执行时间，当本次调用与上次的时间差达到间隔时才执行，也可以结合定时器实现 leading 和 trailing 双触发。

手写时需要注意：通过返回的闭包函数绑定 this 并透传参数；提供 cancel 方法在组件卸载时清理；在 TypeScript 中使用泛型保留原函数类型。实际项目中通常直接使用 Lodash 的 debounce 和 throttle，它们支持 leading、trailing、maxWait 等选项。

:::


## 前端工程化

### 4. 什么是 Monorepo？和 Multirepo 相比有什么优缺点？

#### 4-1. 关键词

> - **Monorepo（单体仓库）**
> - **Multirepo（多仓库）**
> - **pnpm workspace**
> - **Turborepo / Nx / Lerna**
> - **原子提交（Atomic Commit）**

#### 4-2. 考察点

::: info 考察点

- **概念理解**：是否清楚 Monorepo 和 Multirepo 的组织方式差异
- **工具生态**：是否了解 pnpm workspace、Turborepo、Nx、Lerna 等工具的作用
- **优劣势分析**：能否从依赖管理、协作、CI/CD、权限等维度进行对比
- **选型判断**：能否根据团队和项目特征给出合理的仓库策略建议

:::

#### 4-3. 知识点详解

Monorepo（单体仓库）是一种将多个项目或包放在同一个版本控制仓库中的代码组织策略。与之相对的是 Multirepo（多仓库），即每个项目或包独立拥有一个仓库。需要注意的是，Monorepo 并不意味着把所有代码塞进一个巨型应用，而是在一个仓库中以 packages 目录管理多个逻辑独立的包，它们可以有独立的版本、依赖和构建产物。

一个典型的 Monorepo 目录结构如下：

```text
my-monorepo/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── utils/
│   │   ├── package.json
│   │   └── src/
│   ├── ui/
│   │   ├── package.json
│   │   └── src/
│   └── config/
│       ├── package.json
│       └── src/
└── apps/
    ├── web/
    │   └── package.json
    └── admin/
        └── package.json
```

`pnpm-workspace.yaml` 声明了哪些目录属于工作区包：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

这样 apps/web 就可以通过包名引用 packages/utils，pnpm 会自动建立软链接，本地修改即时生效，无需发布或 `npm link`。

主流的 Monorepo 工具各有侧重。pnpm workspace 是包管理器层面的解决方案，原生支持工作区、依赖提升、硬链接节省磁盘空间，适合作为基础工具。Turborepo 和 Nx 是任务编排和构建缓存工具，它们能识别包之间的依赖关系图，并行或增量地执行构建、测试任务，并缓存结果，避免重复构建未变更的包。Lerna 是较早的 JavaScript Monorepo 工具，最初由 Babel 团队开发，擅长版本管理和发布流程，在 v5 之后默认整合 Nx 作为任务运行器。Rush 是微软推出的方案，适合超大规模仓库。Yarn workspace 和 npm workspace 也是常见选择，但 pnpm 在性能和磁盘占用上优势明显，因此在新项目中更受青睐。

Monorepo 的优点主要体现在以下几个方面。

第一，依赖共享和版本统一。仓库中所有包使用同一份依赖版本，避免了 Multirepo 下每个仓库各自安装导致的版本碎片化和重复打包问题。配合 pnpm 的硬链接机制，相同版本的依赖在磁盘上只存一份。

第二，原子提交和跨包重构。当一个改动涉及多个包时，可以在一次提交中完成，不会出现 Multirepo 下"包 A 已发布但包 B 未更新"的中间不一致状态。跨包重命名、API 变更可以通过一次搜索替换和一次 CI 验证完成。

第三，代码复用和共享配置。公共工具函数、UI 组件、ESLint/TypeScript/Babel 配置都可以抽成独立包被多个应用引用，共享包的修改能立即被所有消费者感知。

第四，统一的 CI/CD 和工程规范。只需要维护一套流水线配置、代码规范、提交流程，新包接入成本低。配合 Turborepo 等工具可以实现受影响包的增量构建和远程缓存，CI 速度在规模增大后仍可接受。

第五，更好的可发现性和协作。开发者可以在一个仓库中浏览所有相关代码，跨包跳转方便，代码审查时能看到完整上下文，新成员 onboarding 只需克隆一次。

Monorepo 也有明显的缺点和挑战。

第一，仓库体积和克隆成本。所有包的历史记录都在一个仓库中，随着时间推移 `.git` 体积可能变大，浅克隆、部分克隆（partial clone）和 Git LFS 可以缓解，但无法完全消除。

第二，权限控制粒度较粗。Git 本身对目录级别的读写权限支持有限，如果不同包需要对不同团队严格隔离，Monorepo 需要借助 CODEOWNERS、分支保护或仓库管理平台的路径权限功能，而 Multirepo 天然按仓库隔离。

第三，构建和工具复杂度增加。需要引入 workspace、任务编排、缓存等工具，理解和维护成本高于单仓库。错误的依赖提升或循环依赖可能导致难以排查的问题。

第四，CI 可能被放大。如果不做增量检测，一次小改动可能触发整个仓库所有包的构建和测试，反而比 Multirepo 慢。必须配合基于依赖图的增量 CI 和缓存才能发挥优势。

第五，版本发布策略复杂。多包独立发版时需要处理版本号、变更日志、依赖升级顺序，Lerna、Changesets 等工具可以辅助，但仍比单仓库发布复杂。对于所有应用统一部署的项目，可以不做独立版本化，统一打 tag 发布。

Multirepo 的优缺点基本与 Monorepo 互补。它的优点是仓库独立、权限清晰、克隆快、CI 影响范围小、技术栈可自由选择；缺点是跨仓库重构困难、依赖共享需要发布或包管理器链接、重复配置多、原子提交难以实现、版本碎片化容易导致"依赖地狱"。

选型建议上，如果团队维护多个相互关联的包（如组件库、SDK、工具集），或者多个应用之间有大量共享代码，并且希望统一工程规范和 CI/CD，Monorepo 是更合适的选择。如果各个项目之间耦合度极低、由完全独立的团队维护、对权限隔离要求很高，或者单个项目体积巨大且技术栈差异明显，Multirepo 更简单稳妥。也可以采用混合策略：组织级 Monorepo 管理强相关的包和应用，对完全独立、对外开源或需要独立权限的项目使用 Multirepo。

#### 4-4. 回答要点

- Monorepo 是把多个相关包放在一个仓库中管理，以 packages/apps 目录组织；Multirepo 则每个项目独立仓库
- 常见工具包括 pnpm workspace（依赖管理）、Turborepo/Nx（任务编排与缓存）、Lerna/Changesets（版本发布）
- 优点：依赖共享、原子提交、跨包重构方便、统一 CI/CD 和规范、代码复用
- 缺点：仓库体积大、权限控制粗、构建工具链复杂、CI 需配合增量和缓存、独立发版复杂
- 强耦合多包或多应用选 Monorepo；项目独立、权限隔离要求高选 Multirepo

#### 4-5. 回答模板

::: tip 回答模板

Monorepo 是一种将多个相关包或应用放在同一个 Git 仓库中管理的策略，通常通过 packages 和 apps 目录组织，配合 pnpm workspace、Turborepo、Nx、Lerna 等工具实现依赖链接、任务编排和版本发布。与之相对，Multirepo 是每个项目使用独立仓库。

Monorepo 的优势在于：依赖版本统一、共享代码方便、跨包修改可以原子提交、统一维护 CI/CD 和工程规范、代码可发现性好。缺点是仓库体积大、目录级权限控制较弱、需要引入 workspace 和构建缓存等工具增加复杂度，如果不做增量构建，CI 可能比多仓库更慢，独立包发版流程也更复杂。

Multirepo 的优点是仓库独立、权限天然隔离、克隆和 CI 影响范围小、技术栈可自由选择；缺点是跨仓库重构和原子提交困难、共享代码需要发布版本、工程配置重复、容易出现依赖版本碎片化。

选型上，如果团队维护多个关联紧密的包或多个共享代码的应用，Monorepo 更合适；如果项目之间几乎独立、对权限隔离要求高，Multirepo 更简单。也可以采用混合策略，核心相关包放 Monorepo，完全独立的项目单独建仓库。

:::

### 5. 什么是 Tree Shaking？它的工作原理是什么？

#### 5-1. 关键词

> - **Tree Shaking（摇树优化）**
> - **ES Module（静态导入导出）**
> - **死代码消除（Dead Code Elimination）**
> - **sideEffects（副作用字段）**
> - **usedExports**

#### 5-2. 考察点

::: info 考察点

- **概念定义**：是否理解 Tree Shaking 是基于静态分析的死代码消除
- **前提条件**：是否清楚它依赖 ES Module 的静态结构，CommonJS 无法被摇掉
- **打包器实现**：是否了解 Webpack、Rollup、Vite 如何标记和删除未使用代码
- **副作用处理**：是否理解 package.json 中 sideEffects 字段的作用和配置
- **压缩阶段**：是否区分标记（usedExports）与真正删除（Terser/minify）两个阶段

:::

#### 5-3. 知识点详解

Tree Shaking（摇树优化）是指在打包过程中静态分析模块的导入导出关系，移除没有被实际使用的代码，从而减小产物体积。这个术语形象地把模块依赖图比作一棵树，把未使用的代码像枯叶一样摇落。它本质上是死代码消除（Dead Code Elimination）在 JavaScript 模块层面的应用。

Tree Shaking 能够工作的前提是模块系统必须具备静态结构。ES Module（ESM）的 `import` 和 `export` 是声明式的，必须出现在模块顶层，导入导出的绑定在编译阶段就能确定，无法在运行时根据条件动态改变。这使得打包器可以在不执行代码的情况下分析出哪些导出被使用、哪些没有：

```javascript
// math.js
export function add(a, b) {
  return a + b;
}
export function sub(a, b) {
  return a - b;
}

// main.js
import { add } from './math.js';
console.log(add(1, 2));
```

打包器分析后发现 `sub` 没有被任何模块导入，就可以在产物中移除它。

CommonJS 的 `require` 是动态的，模块路径和读取的导出都可以在运行时决定，例如 `require(condition ? './a' : './b')` 或 `mod[varName]`，打包器无法在编译期确定到底用了哪些导出，因此无法可靠地进行 Tree Shaking：

```javascript
// CommonJS 无法静态分析
const mod = require('./utils');
const fn = mod[someVariable]; // 使用哪个导出取决于运行时
```

这也是为什么现代前端项目应尽量使用 ESM 语法，并且在 package.json 中声明 `"type": "module"`，以及在 Babel/TypeScript 配置中保留 ESM 模块格式（不要编译成 CommonJS），否则 Tree Shaking 会失效。TypeScript 配置中应将 `module` 设置为 `ESNext`，避免把 `import` 编译成 `require`。

以 Webpack 为例，Tree Shaking 的实现分为两个阶段。第一阶段是标记阶段：Webpack 在构建依赖图时分析每个模块的导出和导入关系，通过 `usedExports` 优化标记出哪些导出被实际使用，未被使用的导出会被标注。这一阶段只做标记，不删除代码，以保证 source map 和调试能力。在 webpack 配置中：

```javascript
module.exports = {
  mode: 'production', // production 默认开启 usedExports 和 minimize
  optimization: {
    usedExports: true,
    minimize: true
  }
};
```

第二阶段是压缩删除阶段：Terser、ESBuild、SWC 等压缩工具读取这些标记，真正把未使用的代码从产物中删除。因此，如果只开启 `usedExports` 而不开启 `minimize`，代码并不会被移除；必须在生产模式下配合压缩工具才能看到体积收益。这也是为什么 Tree Shaking 通常只在 production build 中生效。

Rollup 从设计之初就以 ESM 为一等公民，Tree Shaking 能力比早期 Webpack 更彻底，它会进行更深入的变量级分析，甚至能移除模块内未被使用的局部代码。Vite 在开发环境使用 ESBuild 进行快速依赖预构建和转译，在生产环境使用 Rollup 打包，因此生产构建天然具备较好的 Tree Shaking 能力。

Tree Shaking 中有一个关键概念是副作用（side effects）。如果一个模块在被导入时除了导出内容之外还做了其他事情（比如修改全局对象、扩展原型、注入 CSS、注册监听器），那么即使它的导出没有被使用，打包器也不能安全地移除它，因为导入本身可能就是为了触发这些副作用。打包器需要通过 `package.json` 的 `sideEffects` 字段获知哪些文件有副作用：

```json
{
  "name": "my-lib",
  "sideEffects": false
}
```

`"sideEffects": false` 告诉打包器该包的所有文件都没有副作用，可以安全地对未使用的导出进行 Tree Shaking。如果存在有副作用的文件（通常是全局样式或 polyfill），应配置为数组：

```json
{
  "sideEffects": [
    "*.css",
    "./src/polyfill.js"
  ]
}
```

配置错误会导致两类问题：如果把实际有副作用的文件声明为无副作用，导入该文件的副作用代码会被误删，引发运行时错误；如果把所有文件都声明为有副作用，Tree Shaking 会过于保守，未使用的代码无法被移除。对于库作者来说，正确声明 sideEffects 是提升被 Tree Shaking 效果的关键，同时代码层面应避免在模块顶层写副作用逻辑，尽量把副作用收敛到函数内部。

Tree Shaking 的效果还会受到代码写法影响。具名导出（named exports）比默认导出（default export）更容易被精确分析；使用 `import { specific } from 'lib'` 比 `import _ from 'lodash'` 更容易摇掉未使用部分；像 Lodash 这种 CommonJS 编写的库需要使用 `lodash-es` 这类 ESM 版本才能被 Tree Shaking，否则应通过 `lodash/xxx` 子路径或 `babel-plugin-lodash` 按需引入。

此外，类的方法通常很难被 Tree Shaking，因为原型方法通过 `this` 动态访问，静态分析难以判断是否被使用；`export default { ... }` 导出的对象如果只有部分属性被使用，属性也很难被摇掉，因为打包器无法安全判断对象是否被整体传递。因此为了获得更好的摇树效果，推荐使用具名导出细粒度函数，而不是把所有东西挂在一个默认对象上。

总结一下，Tree Shaking 的完整链路是：开发者使用 ESM 静态语法 -> package.json 正确声明 sideEffects -> 打包器构建依赖图并标记 usedExports -> 压缩工具删除未标记的代码 -> 输出更小的产物。理解这条链路有助于在配置构建工具和编写库时做出有利于 Tree Shaking 的选择。

#### 5-4. 回答要点

- Tree Shaking 是基于 ESM 静态结构在打包时移除未使用导出的死代码消除技术
- 前提是使用 ES Module 的 import/export，CommonJS 的动态 require 无法被可靠分析
- Webpack 分两阶段：usedExports 标记，再由 Terser 等压缩工具真正删除；production 模式默认开启
- sideEffects 字段告知打包器哪些模块有导入级副作用，配置错误会导致误删或优化失效
- Rollup/Vite 生产构建原生支持较好；代码风格上使用具名导出、ESM 版本依赖能提升效果

#### 5-5. 回答模板

::: tip 回答模板

Tree Shaking 是指打包器在构建时静态分析模块的导入导出关系，移除没有被实际使用的代码，以减小产物体积，它本质上是模块层面的死代码消除。

它能够工作的前提是使用 ES Module。因为 import 和 export 必须在顶层静态声明，打包器在编译阶段就能确定依赖关系；而 CommonJS 的 require 可以动态拼接路径和读取属性，无法静态分析，所以不能被 Tree Shaking。这也是为什么 TypeScript 要配置 module 为 ESNext，项目应使用 ESM 版本的依赖。

以 Webpack 为例，Tree Shaking 分两个阶段：首先 usedExports 会标记每个模块哪些导出被使用，但此时不删除代码；然后在生产模式下由 Terser 等压缩工具根据标记真正删除未使用的代码。Rollup 和 Vite 的生产构建对 ESM 的 Tree Shaking 支持更彻底。

副作用处理是关键。如果模块在导入时会修改全局对象、引入样式或执行 polyfill，打包器不能随意删除它，需要在 package.json 中通过 sideEffects 字段声明。设为 false 表示全部无副作用，设为数组可以列出有副作用的文件。配置错误会导致代码被误删或优化失效。

实际开发中，应使用具名导出、避免导出巨型默认对象、选择 ESM 版本依赖，并正确配置 sideEffects，才能获得较好的 Tree Shaking 效果。

:::

## 浏览器原理与网络通信

### 6. 从输入 URL 到页面展示，中间发生了什么？（浏览器渲染全过程）

#### 6-1. 关键词

> - **URL 解析**
> - **DNS 解析**
> - **TCP 三次握手**
> - **TLS 握手**
> - **关键渲染路径（Critical Rendering Path）**
> - **重排（Reflow）与重绘（Repaint）**

#### 6-2. 考察点

::: info 考察点

- **网络流程**：是否完整了解从 URL 解析、DNS 查询、建立连接到发送 HTTP 请求的完整链路。
- **DNS 缓存层级**：是否清楚浏览器缓存、操作系统缓存、hosts 文件、本地 DNS 服务器及递归查询的顺序。
- **连接建立**：是否理解 TCP 三次握手的原因，以及 HTTPS 场景下 TLS 握手的基本过程。
- **浏览器渲染流程**：是否掌握 HTML 解析构建 DOM、CSS 解析构建 CSSOM、合成渲染树、布局、绘制、合成的完整管线。
- **关键渲染路径优化**：是否了解 defer/async、preload/prefetch 等资源加载策略对渲染时机的影响。
- **连接释放**：是否了解 TCP 四次挥手的过程，以及 HTTP keep-alive 对连接复用的作用。

:::

#### 6-3. 知识点详解

**一、URL 解析与缓存判断**

浏览器首先对输入内容进行判断：如果是合法 URL 则解析协议、主机、端口、路径、查询参数等；如果是搜索关键词则使用默认搜索引擎发起搜索。以 `https://www.example.com/index.html` 为例，浏览器解析出协议为 `https`、主机为 `www.example.com`、路径为 `/index.html`。

解析完成后，浏览器会先检查 HSTS（HTTP Strict Transport Security）列表，若该域名被强制要求使用 HTTPS，则自动升级协议。随后浏览器查找本地是否有该资源的强缓存（Cache-Control 的 max-age 未过期，或 Expires 未过期），若命中且未失效，则直接使用本地副本，不再发起网络请求。

**二、DNS 解析：多级缓存与递归查询**

域名需要解析为 IP 地址才能建立连接，DNS 查询遵循以下缓存层级：

1. **浏览器 DNS 缓存**：浏览器维护一份域名到 IP 的映射缓存，Chrome 默认过期时间约 1 分钟。
2. **操作系统 DNS 缓存**：浏览器未命中则调用系统调用（如 Windows 的 `GetNetworkParams`、Linux 的 `getaddrinfo`）查询 OS 缓存。
3. **hosts 文件**：操作系统会先检查本地 hosts 文件（Windows 位于 `C:\Windows\System32\drivers\etc\hosts`，Linux 位于 `/etc/hosts`），若存在静态映射则直接使用。
4. **本地 DNS 服务器（LDNS）**：若 hosts 未命中，请求发往配置的本地 DNS 服务器（通常由运营商或公共 DNS 如 8.8.8.8 提供），LDNS 自身有缓存。
5. **根域名服务器与递归查询**：若 LDNS 也未命中，它会代替客户端发起迭代查询：先访问根域名服务器（`.`），根返回顶级域服务器（`.com`）地址；顶级域服务器返回权威域名服务器（`example.com`）地址；权威服务器最终返回 `www.example.com` 对应的 IP 地址。

整个过程使用 UDP 协议（端口 53），查询结果会带着 TTL 被各级缓存缓存下来。

**三、TCP 三次握手**

拿到 IP 后，浏览器与服务器通过 TCP 三次握手建立可靠连接：

1. 客户端发送 `SYN=1, seq=x`，进入 SYN_SENT 状态。
2. 服务端回复 `SYN=1, ACK=1, seq=y, ack=x+1`，进入 SYN_RCVD 状态。
3. 客户端回复 `ACK=1, seq=x+1, ack=y+1`，双方进入 ESTABLISHED 状态。

三次握手的核心目的是确认双方的发送和接收能力均正常，并同步初始序列号，避免历史失效的连接请求被错误接受。

**四、TLS 握手（HTTPS）**

若协议为 HTTPS，在 TCP 连接建立后还需进行 TLS 握手（以 TLS 1.2 为例）：

1. 客户端发送 Client Hello，携带支持的 TLS 版本、加密套件列表、随机数 Random1。
2. 服务端回复 Server Hello，选定加密套件，返回随机数 Random2 及数字证书。
3. 客户端验证证书合法性（颁发机构、有效期、域名匹配、吊销状态），生成预主密钥 Pre-Master Secret，用服务器公钥加密后发送。
4. 双方使用 Random1、Random2 和 Pre-Master Secret 通过约定算法生成会话密钥。
5. 客户端发送 Finished 消息（加密），服务端解密验证后回复 Finished，握手完成，此后数据使用对称加密传输。

TLS 1.3 将握手往返从 2-RTT 缩减为 1-RTT，并支持 0-RTT 恢复。

**五、发送 HTTP 请求与服务器响应**

浏览器构建 HTTP 请求报文，包含请求行、请求头（Host、User-Agent、Accept、Cookie 等）、请求体（POST 等方法）。请求经过传输层分段、网络层路由、数据链路层到达服务器。

服务器处理请求后返回 HTTP 响应报文：状态行（如 `HTTP/1.1 200 OK`）、响应头（Content-Type、Content-Length、Cache-Control、Set-Cookie 等）、响应体（HTML 内容）。

若状态码为 301/302，浏览器跟随 Location 头进行跳转；若为 304，使用协商缓存的本地副本。

**六、TCP 四次挥手**

响应完成后，若 Connection 头为 close（非 keep-alive），需要断开 TCP 连接：

1. 主动关闭方发送 `FIN=1, seq=u`，进入 FIN_WAIT_1。
2. 被动关闭方回复 `ACK=1, ack=u+1`，进入 CLOSE_WAIT，主动方进入 FIN_WAIT_2。
3. 被动关闭方处理完剩余数据后发送 `FIN=1, seq=w`，进入 LAST_ACK。
4. 主动关闭方回复 `ACK=1, ack=w+1`，进入 TIME_WAIT，等待 2MSL 后关闭；被动方收到 ACK 后直接关闭。

TIME_WAIT 状态确保最后的 ACK 能到达对端，并让网络中延迟的报文失效。现代浏览器普遍使用 HTTP keep-alive 或 HTTP/2 多路复用，在一次连接上处理多个请求，减少握手开销。

**七、浏览器解析与渲染：关键渲染路径**

浏览器拿到 HTML 后开始关键渲染路径：

1. **解析 HTML 构建 DOM 树**：词法分析将字节流转为字符，再识别标签生成 Token，最终构建为 DOM 节点树。遇到 `<script>` 标签时，若没有 defer/async 属性会阻塞 HTML 解析（因为 JS 可能修改 DOM）。
2. **解析 CSS 构建 CSSOM 树**：CSS 不会阻塞 HTML 解析，但会阻塞页面渲染（浏览器需要 CSSOM 才能计算样式）。CSSOM 构建是递归的，样式可以层叠和继承。
3. **合成渲染树（Render Tree）**：将 DOM 和 CSSOM 结合，只包含可见节点。`display: none` 的元素不在渲染树中，但 `visibility: hidden` 仍在（它占据空间）。
4. **布局（Layout / Reflow）**：根据渲染树计算每个节点在视口中的确切位置和几何尺寸（盒模型）。这一步也叫自动重排，输出的是"盒模型"。
5. **绘制（Paint）**：将渲染树的每个节点转换为屏幕上的实际像素，包括绘制文字、颜色、边框、阴影、图像等。绘制在多个层上完成。
6. **合成（Composite）**：将多个绘制层按正确顺序合并显示到屏幕上。GPU 加速的 `transform`、`opacity` 属性只触发合成，不触发布局和绘制，是性能最优的动画方式。

**八、脚本加载策略**

- 普通 `<script>`：立即加载并执行，阻塞 HTML 解析。
- `<script async>`：并行加载，加载完成后立即执行，执行时仍会阻塞解析；执行顺序不确定，适用于独立脚本（如统计代码）。
- `<script defer>`：并行加载，HTML 解析完成后、DOMContentLoaded 事件前按顺序执行，适用于有依赖关系的脚本。
- `<link rel="preload">`：提前加载当前页面确实需要的关键资源（字体、首屏图片、关键 CSS/JS），不阻塞渲染。
- `<link rel="prefetch">`：利用空闲时间预加载未来导航可能用到的资源，优先级低。

#### 6-4. 回答要点

- 整体分为两大阶段：网络阶段（URL 解析 -> DNS -> TCP/TLS -> HTTP 请求响应 -> 断开连接）和渲染阶段（DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite）。
- DNS 解析存在多级缓存：浏览器 -> OS -> hosts -> LDNS -> 根/顶级域/权威服务器递归查询。
- 三次握手确认双方收发能力，四次挥手因 TCP 全双工特性需双向各关闭一次，TIME_WAIT 等待 2MSL。
- HTTPS 在 TCP 之上增加 TLS 握手，通过非对称加密协商对称密钥，之后使用对称加密传输。
- 渲染流水线中，CSS 阻塞渲染、JS 阻塞解析，合理使用 defer/async/preload/prefetch 可优化首屏性能。

#### 6-5. 回答模板

::: tip 回答模板

输入 URL 后整体过程可以分为网络通信和页面渲染两大阶段。

第一阶段是网络通信。首先浏览器解析 URL，判断协议和主机，并检查本地强缓存。如果没有缓存，需要进行 DNS 解析，将域名转为 IP 地址。DNS 查询有多层缓存：先查浏览器自身缓存，再查操作系统缓存和 hosts 文件，都没有命中就请求本地 DNS 服务器，本地 DNS 服务器若也没有则进行从根域到顶级域再到权威服务器的递归查询。拿到 IP 后，浏览器与服务器进行 TCP 三次握手建立可靠连接；如果是 HTTPS，还要在 TCP 之上进行 TLS 握手，通过证书验证和非对称加密协商出对称会话密钥。连接建立后浏览器发送 HTTP 请求报文，服务器处理后返回响应。如果响应是 301/302 则跟随跳转，是 304 则使用协商缓存。数据传输完成后通过 TCP 四次挥手断开连接，现代浏览器通常使用 keep-alive 或 HTTP/2 复用连接。

第二阶段是浏览器渲染。浏览器先将 HTML 字节流解析为 DOM 树，同时把 CSS 解析为 CSSOM 树，两者结合生成只包含可见节点的渲染树。接着进行布局（Layout），计算每个元素的位置和尺寸；然后进行绘制（Paint），将节点填充为像素；最后通过合成（Composite）把多个层合并显示到屏幕上。默认情况下 CSS 会阻塞渲染、同步 JS 会阻塞 HTML 解析，所以可以用 defer 让脚本在解析完成后顺序执行，用 async 让独立脚本异步加载执行，用 preload 预加载关键资源，用 prefetch 预取未来页面所需资源，从而优化关键渲染路径和首屏性能。

:::

### 7. 什么是重排（Reflow/Layout）和重绘（Repaint）？如何优化？

#### 7-1. 关键词

> - **重排（Reflow / Layout）**
> - **重绘（Repaint）**
> - **布局抖动（Layout Thrashing）**
> - **GPU 合成**
> - **will-change**
> - **requestAnimationFrame**

#### 7-2. 考察点

::: info 考察点

- **概念辨析**：是否准确理解重排是几何属性变化引发的重新计算布局，重绘是外观变化不影响几何。
- **触发条件**：能否区分哪些 CSS 属性和 DOM 操作触发重排，哪些只触发重绘，哪些只触发合成。
- **因果关系**：是否理解重排一定会触发重绘，而重绘不一定触发重排。
- **性能影响**：是否清楚频繁重排（尤其是布局抖动）对性能的危害，以及浏览器的批量优化机制。
- **优化手段**：是否掌握批量读写 DOM、使用 transform/opacity 动画、DocumentFragment、虚拟滚动、防抖等实战优化方案。
- **工具使用**：是否了解通过 Chrome DevTools 的 Performance 和 Layers 面板分析渲染性能。

:::

#### 7-3. 知识点详解

**一、定义与本质**

浏览器渲染流水线依次为：JavaScript -> Style（样式计算）-> Layout（布局）-> Paint（绘制）-> Composite（合成）。重排和重绘是这个流水线中可能被重新触发的两个环节。

- **重排（Reflow，也称 Layout）**：当 DOM 的变化影响了元素的几何属性（宽度、高度、位置、内外边距、显示隐藏等），浏览器需要重新计算元素在视口中的尺寸和位置，并可能影响周边元素，这个过程就是重排。重排涉及渲染树的重新构建和布局信息的更新，开销较大。
- **重绘（Repaint）**：当元素的外观发生变化但不影响几何布局时（例如 color、background-color、visibility、box-shadow），浏览器不需要重新计算位置，只需在绘制阶段重新绘制该元素，这就是重绘。重绘的开销通常小于重排。

二者的关系是：**重排一定会触发后续的重绘，但重绘不一定触发重排**。例如修改 `color` 只重绘不重排，而修改 `width` 则先重排再重绘。

**二、触发重排的常见操作**

1. 页面首次渲染（初始化布局，不可避免）。
2. 浏览器窗口尺寸变化（resize）。
3. 元素尺寸或位置变化：width、height、padding、margin、border、top、left 等。
4. 元素内容变化：文字数量、字体大小、图片尺寸。
5. DOM 元素的增删移动，或 display 状态切换。
6. 读写 offset 族、client 族、scroll 族属性以及 `getComputedStyle()`。浏览器为了返回准确值，会强制刷新渲染队列，触发"强制同步布局"。
7. 激活 CSS 伪类（如 :hover）。

常见只触发重绘的属性：color、background-color、visibility、outline、box-shadow、border-radius（不影响几何时）。而 `transform` 和 `opacity` 在满足提升为合成层的条件时只触发合成，连重绘都可以跳过。

**三、布局抖动（Layout Thrashing）**

浏览器本身会维护一个渲染队列，将多次 DOM 写操作批量合并以减少重排次数。但如果在写操作之后立刻读取布局属性（如 offsetWidth、getBoundingClientRect），浏览器为了给出最新值不得不立即执行队列中所有挂起的布局计算，导致在一帧内反复重排，这就是布局抖动。

```javascript
// 反面示例：读写交替，触发多次强制同步布局
const items = document.querySelectorAll('.item')
for (let i = 0; i < items.length; i++) {
  const width = items[i].offsetWidth // 读，强制刷新队列
  items[i].style.width = width + 10 + 'px' // 写
}
```

**四、优化策略**

1. **批量 DOM 读写，避免读写交替**

先统一读取所有布局信息，再统一写入，让浏览器合并重排：

```javascript
const items = document.querySelectorAll('.item')
const widths = Array.from(items).map(item => item.offsetWidth) // 先批量读
items.forEach((item, i) => {
  item.style.width = widths[i] + 10 + 'px' // 再批量写
})
```

2. **使用 requestAnimationFrame 集中 DOM 操作**

`requestAnimationFrame`（rAF）会在浏览器下一帧绘制前执行回调，将视觉变更集中到同一帧，避免一帧内多次布局：

```javascript
function updateAnimation() {
  element.style.transform = `translateX(${x}px)`
  requestAnimationFrame(updateAnimation)
}
requestAnimationFrame(updateAnimation)
```

3. **使用 ResizeObserver 替代 window.resize 监听**

ResizeObserver 可以只观察目标元素尺寸变化，且在浏览器空闲时批量触发，比 window resize 事件更高效、更精确。

4. **动画使用 transform 和 opacity，触发 GPU 合成**

`transform`（translate、scale、rotate）和 `opacity` 的变化不会触发布局和绘制，只在合成线程中由 GPU 处理，动画最流畅。配合 `will-change` 提示浏览器提前将元素提升为独立合成层：

```css
.box {
  will-change: transform;
}
.box.animate {
  transform: translateX(100px);
  transition: transform 0.3s ease;
}
```

注意 `will-change` 不能滥用，每一个合成层都消耗内存，过多的层反而会降低性能。

5. **离线操作 DOM**

- 使用 `DocumentFragment` 在内存中批量构建节点，最后一次性插入 DOM，只触发一次重排。
- 对需要大量修改的元素先设置 `display: none`，操作完成后再恢复显示，这样只有隐藏和显示时各触发一次重排。

```javascript
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = i
  fragment.appendChild(li)
}
list.appendChild(fragment)
```

6. **避免 table 布局**

table 中任一元素变化都可能导致整个表格重新计算布局，开销较大。尽量使用 div + flex/grid 布局。

7. **防抖与节流**

对 scroll、resize、input 等高频事件进行防抖或节流，降低事件处理函数中 DOM 操作的频率。

8. **虚拟滚动**

长列表只渲染可视区域内的元素，滚动时动态替换内容，将 DOM 节点数量控制在固定范围内，从根本上减少重排范围。

9. **减少对布局属性的频繁读取**

将 offsetWidth 等属性缓存到变量，避免在循环中反复读取触发强制同步布局。

**五、性能分析工具**

Chrome DevTools 的 Performance 面板录制页面操作后，可以看到紫色的 Layout 事件和绿色的 Paint 事件，若出现密集的紫色小块即为布局抖动。Layers 面板可以查看合成层情况，Rendering 面板中的 "Layout Shift Regions" 和 "Frame Rendering Stats" 也能辅助定位问题。

#### 7-4. 回答要点

- 重排是几何属性变化导致的布局重新计算，开销大；重绘是外观变化不影响布局，开销较小。
- 重排必然引发重绘，重绘不一定引发重排；transform/opacity 只触发合成，性能最好。
- 读写 offset、scroll、getComputedStyle 等属性会强制刷新渲染队列，读写交替会造成布局抖动。
- 核心优化思路：批量读写、集中修改、离线操作、用合成层属性做动画、减少 DOM 规模与事件频率。

#### 7-5. 回答模板

::: tip 回答模板

重排和重绘是浏览器渲染流水线中两个不同阶段的重新执行。重排也叫 Reflow 或 Layout，指的是元素的几何属性（比如宽高、边距、位置、显示隐藏）发生变化时，浏览器重新计算元素尺寸和位置的过程，开销较大。重绘指的是元素外观变化但不影响布局（比如颜色、背景色、visibility），浏览器只需要重新绘制像素，开销相对较小。它们的关系是重排一定会触发重绘，但重绘不一定触发重排。

频繁重排会造成明显的性能问题，尤其是读写 DOM 交替时会产生"布局抖动"，因为浏览器为了返回准确的 offsetWidth、getBoundingClientRect 等值会强制立即执行布局。优化手段主要有：第一，批量读取布局信息再统一写入，避免读写交替；第二，把 DOM 写操作放在 requestAnimationFrame 中集中到一帧执行；第三，动画尽量使用 transform 和 opacity，它们只触发 GPU 合成，不经过布局和绘制，可以配合 will-change 提前提升合成层；第四，用 DocumentFragment 或 display:none 离线批量操作 DOM；第五，对 scroll、resize 等高频事件防抖节流，长列表使用虚拟滚动；第六，避免 table 布局，减少 getComputedStyle 等的频繁调用。实际开发中可以用 Chrome DevTools 的 Performance 面板定位重排和布局抖动。

:::

### 8. WebSocket 断线重连如何保证消息不丢失、不重复？

#### 8-1. 关键词

> - **心跳检测（Heartbeat / Ping-Pong）**
> - **指数退避重连（Exponential Backoff）**
> - **消息 ID 与 ACK 确认**
> - **离线消息缓冲**
> - **消息去重**
> - **消息队列重发**

#### 8-2. 考察点

::: info 考察点

- **断线检测**：是否理解 TCP 连接可能"假死"，需要通过应用层心跳主动检测连接可用性。
- **重连策略**：是否掌握指数退避重连，避免服务端被频繁重连压垮。
- **消息可靠性**：是否理解仅靠 WebSocket 本身无法保证消息必达，需要应用层的消息 ID、ACK、重发机制。
- **消息幂等**：是否了解通过客户端记录最后已接收消息 ID 实现去重，保证消息不重复。
- **离线补偿**：是否理解服务端需要为离线客户端缓冲消息，重连后通过消息 ID 增量拉取。
- **状态管理**：是否能在代码层面组织连接状态、消息队列、心跳定时器等逻辑。

:::

#### 8-3. 知识点详解

**一、WebSocket 的可靠性问题**

WebSocket 是基于 TCP 的全双工协议，但 TCP 只能保证传输层的可靠有序，无法解决以下业务层问题：

1. **连接假死**：网络断开时，若没有数据传输，操作系统可能长时间不感知（TCP keep-alive 默认 2 小时才探测），客户端误以为连接仍然可用。
2. **消息丢失**：发送方写入数据后网络突然断开，数据可能未到达对端，而 WebSocket 的 `send` 方法只表示写入到浏览器缓冲区成功，并不代表服务端收到。
3. **消息重复**：重连后对未确认消息进行重发，可能导致服务端重复处理。

因此生产环境必须在应用层设计心跳、ACK、消息 ID 和重发机制。

**二、心跳检测（Ping / Pong）**

客户端定时（如每 25 秒）向服务端发送一个心跳包，服务端回复响应。若连续若干次（如 3 次）未收到响应，则判定连接已断开，主动关闭并触发重连。

心跳间隔需要权衡：间隔过短增加流量和服务端压力，过长则断线检测不及时。实际值通常略小于运营商 NAT 超时时间（常见 5 分钟左右），一般设为 25~30 秒。

WebSocket 协议本身定义了 Ping（0x9）和 Pong（0xA）控制帧，但浏览器 API 无法直接发送 Ping 帧，因此实际项目一般使用应用层 JSON 心跳：

```json
{ "type": "ping", "ts": 1718000000000 }
```

服务端返回：

```json
{ "type": "pong", "ts": 1718000000000 }
```

**三、指数退避重连**

检测到断线后，不应立即疯狂重连，而应采用指数退避算法：第 1 次重连等待 1 秒，第 2 次等待 2 秒，第 3 次 4 秒，以此类推，并设置最大延迟（如 30 秒）。在网络恢复或页面从后台切回前台时，可以立即尝试一次重连，提升恢复速度。

**四、消息 ID 与 ACK 确认**

每条消息都分配一个全局唯一且递增的消息 ID（可用 UUID 或"服务端时间戳 + 序列号"）。接收方收到消息后向发送方返回 ACK 确认：

```json
{ "type": "ack", "msgId": "msg_10086" }
```

- 发送方维护一个"待确认队列"，每条发出的消息先入队，收到对应 ACK 后从队列移除。
- 若超过一定时间（如 5 秒）未收到 ACK，则重发该消息。
- 重发时保留原 msgId，便于接收方去重。

**五、消息去重**

客户端持久化记录"最后一条已处理并确认的消息 ID"（`lastRecvMsgId`）。收到消息时：

1. 若消息 ID 小于等于 `lastRecvMsgId`，说明是重复消息，直接丢弃但仍回复 ACK（因为对端可能没收到上次的 ACK 才重发）。
2. 若消息 ID 正好是 `lastRecvMsgId + 1`，正常处理并更新 `lastRecvMsgId`。
3. 若消息 ID 出现跳跃（大于 `lastRecvMsgId + 1`），说明中间有消息丢失，需要向服务端请求补发这段区间的离线消息。

服务端同样需要为每个客户端维护一定时长（如 7 天）或一定数量的消息缓冲，支持按消息 ID 范围查询补发。

**六、连接状态管理**

通常维护一个状态机：

- `connecting`：连接中。
- `open`：已连接，可以发送数据。
- `closing`：主动关闭中。
- `closed`：已关闭，按策略决定是否重连。

主动关闭（如用户退出登录）应设置标志位，不再触发重连；异常断开才重连。

**七、完整代码示例**

```javascript
class ReliableWebSocket {
  constructor(url) {
    this.url = url
    this.ws = null
    this.status = 'closed'

    // 心跳配置
    this.heartbeatInterval = 25000
    this.heartbeatTimer = null
    this.pongTimeoutTimer = null
    this.missedPongs = 0
    this.maxMissedPongs = 3

    // 重连配置：指数退避
    this.reconnectAttempts = 0
    this.maxReconnectDelay = 30000
    this.manualClose = false

    // 消息可靠投递
    this.msgQueue = new Map() // msgId -> { msg, timer }
    this.ackTimeout = 5000
    this.lastRecvMsgId = Number(localStorage.getItem('lastRecvMsgId') || 0)

    this.onMessage = null // 业务消息回调
  }

  connect() {
    this.manualClose = false
    this.status = 'connecting'
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.status = 'open'
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.resendUnacked()       // 重发未确认消息
      this.syncOfflineMessages() // 拉取断线期间的离线消息
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'pong') {
        this.missedPongs = 0
        clearTimeout(this.pongTimeoutTimer)
        return
      }

      if (data.type === 'ack') {
        this.removeFromQueue(data.msgId)
        return
      }

      // 业务消息：去重处理
      if (data.msgId !== undefined) {
        if (data.msgId <= this.lastRecvMsgId) {
          this.sendAck(data.msgId) // 重复消息，仍回复 ACK
          return
        }
        this.lastRecvMsgId = data.msgId
        localStorage.setItem('lastRecvMsgId', data.msgId)
      }

      this.sendAck(data.msgId)
      this.onMessage && this.onMessage(data)
    }

    this.ws.onclose = () => {
      this.status = 'closed'
      this.stopHeartbeat()
      if (!this.manualClose) this.reconnect()
    }

    this.ws.onerror = () => {
      this.ws.close()
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.status !== 'open') return
      this.sendRaw({ type: 'ping', ts: Date.now() })
      this.missedPongs++
      this.pongTimeoutTimer = setTimeout(() => {
        if (this.missedPongs >= this.maxMissedPongs) {
          this.ws.close() // 连续未收到 pong，判定断线
        }
      }, 5000)
    }, this.heartbeatInterval)
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatTimer)
    clearTimeout(this.pongTimeoutTimer)
  }

  reconnect() {
    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempts,
      this.maxReconnectDelay
    )
    this.reconnectAttempts++
    setTimeout(() => this.connect(), delay)
  }

  send(msg) {
    const msgId = msg.msgId || this.generateMsgId()
    const payload = { ...msg, msgId }
    this.msgQueue.set(msgId, {
      msg: payload,
      timer: setTimeout(() => this.resend(msgId), this.ackTimeout)
    })
    this.sendRaw(payload)
  }

  sendRaw(payload) {
    if (this.status === 'open') {
      this.ws.send(JSON.stringify(payload))
    }
  }

  resend(msgId) {
    const item = this.msgQueue.get(msgId)
    if (item) this.sendRaw(item.msg) // 仍在队列中说明未收到 ACK，重发
  }

  resendUnacked() {
    for (const { msg } of this.msgQueue.values()) {
      this.sendRaw(msg)
    }
  }

  sendAck(msgId) {
    this.sendRaw({ type: 'ack', msgId })
  }

  removeFromQueue(msgId) {
    const item = this.msgQueue.get(msgId)
    if (item) {
      clearTimeout(item.timer)
      this.msgQueue.delete(msgId)
    }
  }

  syncOfflineMessages() {
    this.sendRaw({
      type: 'sync',
      lastMsgId: this.lastRecvMsgId
    })
  }

  generateMsgId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }

  close() {
    this.manualClose = true
    this.ws.close()
  }
}
```

关键设计点：

- 发送消息先入待确认队列，收到 ACK 才移除，超时自动重发，保证"不丢失"。
- 接收方通过 `lastRecvMsgId` 去重，并在重连后发送 sync 消息拉取离线消息，保证"不重复"且"不遗漏"。
- 心跳连续失败才关闭连接，配合指数退避重连，避免无效连接和重连风暴。
- 主动关闭通过 `manualClose` 标志位阻止自动重连。

#### 8-4. 回答要点

- WebSocket 本身无法感知连接假死和保证消息必达，需要应用层心跳、ACK、消息 ID 机制。
- 心跳通过定时 ping/pong 实现，连续超时未响应则判定断线，使用指数退避重连。
- 消息不丢失：发送方维护待确认队列，超时重发；服务端缓冲离线消息，重连后按最后消息 ID 补发。
- 消息不重复：接收方记录最后已处理消息 ID，对小于等于该 ID 的消息丢弃，但仍回复 ACK。
- 区分主动关闭和异常断开，主动关闭不应重连。

#### 8-5. 回答模板

::: tip 回答模板

WebSocket 基于 TCP，但它只能保证传输层可靠，无法解决连接假死、业务层消息丢失和重复问题，因此需要在应用层实现一套可靠性机制，整体包括心跳、重连、ACK 和去重四个部分。

第一是心跳检测。客户端每隔 25 秒左右向服务端发送一个 ping 消息，服务端回复 pong。如果连续 3 次没有收到 pong，就认为连接已经断开，主动关闭连接。这样可以避免 TCP 连接"假死"却长时间无法感知的问题。

第二是断线重连。检测到断线后采用指数退避策略重连，第一次等 1 秒，第二次 2 秒，第三次 4 秒，上限一般设为 30 秒，避免重连风暴压垮服务端。页面从后台切回前台或网络恢复时可以立即尝试一次。注意要区分主动关闭和异常断开，用户主动退出时不重连。

第三是保证消息不丢失。每条消息都带一个唯一且递增的 msgId。发送方把消息放进待确认队列，收到服务端返回的 ACK 后才从队列删除；如果超过一定时间没收到 ACK 就自动重发。服务端会为每个客户端缓冲一段时间的消息，客户端重连后把自己最后收到的 msgId 发给服务端，服务端补发之后的所有消息。

第四是保证消息不重复。客户端持久化记录最后一条已处理的 msgId，收到消息时如果它小于等于这个 ID 就说明是重复消息，直接丢弃但仍然回复 ACK，因为重发往往意味着对端没收到上一次的 ACK。如果收到的 ID 出现跳跃，说明有消息丢失，会主动请求补发。

通过这套"心跳检测 + 指数退避重连 + 消息 ID/ACK + 待确认重发 + 离线补发 + 接收端去重"的组合机制，就能在弱网和断线场景下保证 WebSocket 消息的不丢失和不重复。

:::

### 9. SSE 和 WebSocket 有什么区别？各自适用于什么场景？

#### 9-1. 关键词

> - **SSE（Server-Sent Events）**
> - **WebSocket**
> - **单向推送与全双工**
> - **HTTP 协议**
> - **自动重连**
> - **并发连接数限制**

#### 9-2. 考察点

::: info 考察点

- **协议基础**：是否清楚 SSE 基于 HTTP，WebSocket 是独立的基于 TCP 的应用层协议（ws/wss）。
- **通信方向**：是否理解 SSE 是服务端到客户端的单向推送，WebSocket 是真正的全双工双向通信。
- **数据格式**：是否了解 SSE 只支持 UTF-8 文本，WebSocket 同时支持文本和二进制。
- **内置能力**：是否知道 SSE 原生支持自动重连和事件 ID，WebSocket 需自行实现。
- **连接限制**：是否清楚浏览器对同一域名下 SSE 并发连接数有限制（HTTP/1.1 下约 6 个）。
- **场景选型**：能否根据业务的双向需求、数据类型、网络环境选择合适方案。

:::

#### 9-3. 知识点详解

**一、SSE 的基本原理**

SSE（Server-Sent Events）是 HTML5 规范的一部分，它允许服务端通过一个持久的 HTTP 连接向客户端单向持续推送数据。客户端使用标准的 `EventSource` API 接收：

```javascript
const es = new EventSource('/api/stream')

es.onmessage = (event) => {
  console.log('收到消息:', event.data)
}

es.addEventListener('custom', (event) => {
  console.log('自定义事件:', event.data)
})

es.onerror = () => {
  // 浏览器会自动重连
}
```

服务端响应需要设置如下头部：

```http
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

消息格式是纯文本，以空行分隔：

```
data: 这是一条普通消息\n\n

id: 10086\n
event: custom\n
data: {"price": 102.5}\n\n
```

字段含义：

- `data`：消息数据，可多行，客户端会拼接。
- `id`：事件 ID，浏览器自动记录到 `Last-Event-ID` 请求头，断线重连时发送给服务端，用于续传。
- `event`：自定义事件类型，对应 `addEventListener`。
- `retry`：指定浏览器重连等待毫秒数。

**二、WebSocket 的基本原理**

WebSocket 是独立的全双工通信协议，通过 HTTP Upgrade 握手从 HTTP 升级为 WebSocket 协议，之后使用 ws（明文）或 wss（TLS 加密）进行双向通信：

```javascript
const ws = new WebSocket('wss://api.example.com/chat')

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'join', room: 'frontend' }))
}

ws.onmessage = (event) => {
  console.log('收到:', event.data)
}

ws.send(new Uint8Array([1, 2, 3])) // 支持二进制
```

握手请求头示例：

```http
GET /chat HTTP/1.1
Host: api.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

服务端返回 101 状态码表示升级成功，之后的通信不再走 HTTP，而是使用 WebSocket 帧格式。

**三、核心区别对比**

| 对比维度 | SSE | WebSocket |
|---|---|---|
| 协议层 | 基于 HTTP/HTTPS | 独立协议，ws/wss，通过 HTTP Upgrade 握手 |
| 通信方向 | 服务端 -> 客户端，单向 | 全双工，客户端与服务端可随时互发 |
| 数据格式 | 仅 UTF-8 文本 | 文本和二进制（Blob、ArrayBuffer） |
| 自动重连 | 浏览器原生支持，自动重连并携带 Last-Event-ID | 需自行实现心跳、重连、消息补偿 |
| 断线续传 | 原生支持（通过 id 字段和 Last-Event-ID） | 需自行实现消息 ID 和 ACK |
| 调试与代理 | 标准 HTTP，可通过 curl、普通代理调试，穿透防火墙容易 | 需要支持 Upgrade 的代理，某些企业代理可能拦截 |
| 连接数限制 | HTTP/1.1 下同域名并发约 6 个；HTTP/2 下大幅改善 | 同样受浏览器连接数限制，但通常占用少 |
| 服务端复杂度 | 简单，只需返回 text/event-stream 流 | 相对复杂，需维护长连接、心跳、连接状态 |
| 协议开销 | 每次消息有 HTTP 文本开销，但无频繁头部 | 握手后帧头部小（2~10 字节），高频通信效率高 |

**四、SSE 的并发连接数问题**

在 HTTP/1.1 下，浏览器对同一域名的并发连接数限制约为 6 个。每个 SSE 连接长时间占用一个连接，打开 6 个标签页后第 7 个 SSE 连接会被阻塞。解决方案包括：

- 启用 HTTP/2，HTTP/2 在一个 TCP 连接上多路复用，连接数限制大幅放宽。
- 一个标签页内只建立一个 SSE 连接，通过事件类型分发不同业务数据。
- 合理使用 `BroadcastChannel` 在多个标签页间共享一条 SSE 连接。

**五、自动重连与 Last-Event-ID**

SSE 的一个显著优势是浏览器原生处理重连。服务端在消息中带上 `id` 字段后，浏览器会记住最后收到的 ID。断线重连时，浏览器自动在请求头中加入：

```http
Last-Event-ID: 10086
```

服务端据此判断客户端断点位置，补发缺失消息。这相当于把 WebSocket 需要手写的 ACK 和离线补偿机制内置到了协议层。

**六、适用场景**

**SSE 适合服务端单向推送、文本数据、希望快速实现的场景：**

- 新闻资讯、股票行情、实时监控数据看板。
- AI 大模型的流式输出（Token by Token），如 ChatGPT 打字机效果，天然契合"服务端持续推文本、客户端一般不需要中途发消息"的模式。
- 通知中心、邮件提醒、日志实时输出。
- 对实时性要求中等、数据量不大、需要穿透企业代理的场景。

**WebSocket 适合双向、高频、二进制或低延迟场景：**

- 即时通讯（IM）、群聊、在线客服，双方都需要随时发送消息。
- 多人在线游戏、白板协作、协同编辑（如飞书文档、Figma），需要毫秒级双向同步。
- 实时交易、行情+下单，客户端需要高频上报数据。
- 语音视频信令、直播弹幕、IoT 设备通信。
- 需要传输二进制数据（如 Protobuf、图片、音频）的场景。

**七、选型建议**

- 如果业务只需要"服务端推给客户端"，优先选择 SSE，开发和维护成本低，且原生支持自动重连和断线续传。
- 如果需要双向交互或二进制数据，选择 WebSocket，但要自行设计心跳、重连、ACK、消息去重等可靠性机制。
- AI 流式输出优先选 SSE，因为它基于 HTTP，更易与现有网关、CDN、鉴权体系集成，调试也方便。
- 超大规模实时系统可以考虑基于 WebSocket 的 Socket.IO 等封装库，或使用 WebTransport、MQTT over WebSocket 等更专业的协议。

#### 9-4. 回答要点

- SSE 基于 HTTP，是服务端到客户端的单向文本推送；WebSocket 是独立的全双工协议，支持文本和二进制。
- SSE 原生支持自动重连和 Last-Event-ID 断线续传；WebSocket 这些都要应用层自行实现。
- SSE 是标准 HTTP，代理穿透性好；WebSocket 需要 Upgrade，部分企业代理可能有问题。
- HTTP/1.1 下 SSE 受同域 6 连接限制，HTTP/2 可缓解。
- 选型核心看方向：单向推送（行情、AI 流式、通知）用 SSE；双向高频（聊天、游戏、协作、交易）用 WebSocket。

#### 9-5. 回答模板

::: tip 回答模板

SSE 和 WebSocket 都是服务端实时推送数据的技术，但它们在协议、方向和能力上有明显区别。

SSE 全称 Server-Sent Events，基于标准 HTTP 协议，使用 EventSource API。它是服务端到客户端的单向推送，客户端不能通过同一个连接向服务端发消息；数据格式只支持 UTF-8 文本。SSE 的优势是浏览器原生支持自动重连，并且通过消息 id 字段和 Last-Event-ID 请求头自动实现断线续传，服务端只需要返回 text/event-stream 格式的流即可，开发非常简单。因为走标准 HTTP，它能轻松穿透企业代理和防火墙，也可以复用现有的鉴权和网关体系。缺点是 HTTP/1.1 下浏览器对同一域名有大约 6 个并发连接的限制，且不支持二进制。

WebSocket 是一个独立的全双工协议，通过 HTTP Upgrade 握手后升级为 ws 或 wss 协议，客户端和服务端都可以随时向对方发送消息，支持文本和二进制数据。握手之后帧头部很小，高频通信效率高，适合低延迟场景。但 WebSocket 本身不提供自动重连、心跳、消息确认和断线续传，这些都需要在应用层自行实现，而且它对代理和基础设施有一定要求。

在选型上，如果业务是单向推送，比如新闻资讯、股票行情、通知中心、AI 大模型的流式输出（打字机效果）和日志流，优先选择 SSE，因为它简单可靠、原生支持断线续传。如果业务需要强双向交互，比如即时通讯、多人在线游戏、协同编辑、实时交易下单、直播弹幕和 IoT 通信，就必须使用 WebSocket。简单说就是"单向文本推送用 SSE，双向高频通信用 WebSocket"。

:::

### 10. axios 的请求/响应拦截器是如何实现的？

#### 10-1. 关键词

> - **拦截器管理器（InterceptorManager）**
> - **Promise 链式调用**
> - **责任链模式**
> - **请求拦截器 LIFO**
> - **响应拦截器 FIFO**
> - **eject 移除**

#### 10-2. 考察点

::: info 考察点

- **设计模式**：是否理解 axios 使用了责任链模式和中间件模型，通过拦截器在请求发出前后统一处理逻辑。
- **核心数据结构**：是否清楚 InterceptorManager 内部用数组存储 `{fulfilled, rejected}` 处理函数。
- **Promise 链组装**：是否掌握请求拦截器通过 unshift 插到链前、响应拦截器通过 push 追加到链后的实现方式。
- **执行顺序**：是否理解请求拦截器是后进先出（LIFO）、响应拦截器是先进先出（FIFO），以及为什么这样设计。
- **use / eject / forEach**：是否能说清三个核心方法的作用，并写出简化版实现。
- **错误处理**：是否了解 rejected 回调在链中的传播，以及如何通过 Promise.reject 中断请求。

:::

#### 10-3. 知识点详解

**一、拦截器的作用**

axios 的拦截器允许在请求被 then/catch 处理前统一插入逻辑：

- 请求拦截器：在请求发送前修改配置（如添加 token、Content-Type、loading 态、参数加密）。
- 响应拦截器：在 then/catch 前统一处理响应（如解构 data、统一错误提示、401 跳登录、Blob 下载）。

```javascript
// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) redirectLogin()
    return Promise.reject(error)
  }
)
```

**二、整体架构**

axios 实例上有两个拦截器管理器：

- `axios.interceptors.request`：管理请求拦截器。
- `axios.interceptors.response`：管理响应拦截器。

真正发请求时，axios 把这些拦截器和真正的请求方法（`dispatchRequest`）组装成一条 Promise 链。核心结构可以简化为：

```javascript
axios.request = function (config) {
  // 初始链：真正发请求的环节在中间
  const chain = [dispatchRequest, undefined]
  let promise = Promise.resolve(config)

  // 请求拦截器依次 unshift 到链前
  this.interceptors.request.forEach(interceptor => {
    chain.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  // 响应拦截器依次 push 到链后
  this.interceptors.response.forEach(interceptor => {
    chain.push(interceptor.fulfilled, interceptor.rejected)
  })

  // 成对组装 then 链
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift())
  }

  return promise
}
```

**三、InterceptorManager 的实现**

每个拦截器管理器内部维护一个 handlers 数组，use 注册、eject 移除、forEach 遍历：

```javascript
class InterceptorManager {
  constructor() {
    this.handlers = []
  }

  // 注册拦截器，返回用于移除的 id
  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    })
    return this.handlers.length - 1
  }

  // 按 id 移除拦截器（置空而不删除，保持索引稳定）
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  // 遍历有效拦截器
  forEach(fn) {
    this.handlers.forEach(h => {
      if (h !== null) fn(h)
    })
  }
}
```

在 axios 构造函数中：

```javascript
function Axios() {
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}
```

**四、执行顺序详解**

假设有如下注册：

```javascript
axios.interceptors.request.use(config => {
  console.log('请求拦截器 A')
  return config
})
axios.interceptors.request.use(config => {
  console.log('请求拦截器 B')
  return config
})

axios.interceptors.response.use(response => {
  console.log('响应拦截器 1')
  return response
})
axios.interceptors.response.use(response => {
  console.log('响应拦截器 2')
  return response
})
```

由于请求拦截器通过 `unshift` 插入，在数组中的顺序是 B、A；而响应拦截器通过 `push` 追加，顺序是 1、2。最终执行顺序为：

```
请求拦截器 B -> 请求拦截器 A -> dispatchRequest -> 响应拦截器 1 -> 响应拦截器 2
```

即：

- **请求拦截器 LIFO（后进先出）**：后注册的请求拦截器先执行。
- **响应拦截器 FIFO（先进先出）**：先注册的响应拦截器先执行。

这样设计是合理的：请求拦截器像洋葱模型的外层，后加的先包装配置；响应拦截器像请求的逆序，先加的先接触响应数据，便于分层处理（例如外层做通用错误处理，内层做业务数据解构）。

**五、完整简化版实现**

```javascript
class InterceptorManager {
  constructor() {
    this.handlers = []
  }

  use(fulfilled, rejected) {
    this.handlers.push({ fulfilled, rejected })
    return this.handlers.length - 1
  }

  eject(id) {
    if (this.handlers[id]) this.handlers[id] = null
  }

  forEach(fn) {
    this.handlers.forEach(h => h && fn(h))
  }
}

function dispatchRequest(config) {
  return fetch(config.url, config).then(res => res.json())
}

class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request(config) {
    const chain = [dispatchRequest, undefined]
    let promise = Promise.resolve(config)

    this.interceptors.request.forEach(it => {
      chain.unshift(it.fulfilled, it.rejected)
    })

    this.interceptors.response.forEach(it => {
      chain.push(it.fulfilled, it.rejected)
    })

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }

    return promise
  }

  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' })
  }
}

// 使用示例
const instance = new Axios()

instance.interceptors.request.use(config => {
  console.log('request: 注入 token')
  config.headers = { Authorization: 'Bearer xxx' }
  return config
})

instance.interceptors.response.use(
  response => {
    console.log('response: 解构 data')
    return response
  },
  error => {
    console.error('response error:', error)
    return Promise.reject(error)
  }
)

instance.get('https://api.example.com/user')
```

**六、错误处理与中断**

Promise 链中任一环节抛出错误或返回 `Promise.reject`，会跳过后续的 fulfilled 回调，直接寻找下一个 rejected 回调：

```javascript
axios.interceptors.request.use(config => {
  if (!token) {
    // 抛出错误将跳过真实请求，直接进入响应的 rejected 链路
    return Promise.reject(new Error('未登录'))
  }
  return config
})

axios.interceptors.response.use(
  response => response,
  error => {
    // 请求拦截器抛出的错误、网络错误、HTTP 4xx/5xx 都会走到这里
    Message.error(error.message)
    return Promise.reject(error)
  }
)
```

如果某个 rejected 回调返回了正常值而不是 `Promise.reject`，错误会被"吞掉"，后续 fulfilled 会继续执行。利用这一点可以在响应拦截器中对特定错误（如 401 刷新 token 后重发）做恢复处理。

**七、多个拦截器的组合与 eject**

`use` 方法返回一个数字 id，调用 `eject(id)` 可以移除对应拦截器。eject 采用置 null 的方式而非 splice，是为了保持其他拦截器的索引稳定，避免已返回的 id 失效。`forEach` 在遍历时跳过 null 项。

这让插件化的拦截器注册成为可能：一个模块可以在初始化时 use 一个拦截器，在卸载时 eject 它，而不影响其他模块。

#### 10-4. 回答要点

- axios 拦截器基于责任链模式，核心是 InterceptorManager（维护 handlers 数组）和 Promise 链组装。
- use 注册 {fulfilled, rejected} 并返回 id；eject 通过 id 置空移除；forEach 遍历有效拦截器。
- 请求时先把 dispatchRequest 放在 chain 中间，请求拦截器 unshift 到前面，响应拦截器 push 到后面，再循环 promise.then 组装。
- 执行顺序：请求拦截器后注册先执行（LIFO），响应拦截器先注册先执行（FIFO）。
- 错误通过 rejected 回调在链中传播，可以在响应拦截器统一处理，也可以返回 Promise.reject 中断。

#### 10-5. 回答模板

::: tip 回答模板

axios 的拦截器本质上是基于 Promise 链实现的责任链模式。在 axios 实例上有两个拦截器管理器，分别是 `interceptors.request` 和 `interceptors.response`，它们都是 InterceptorManager 的实例。InterceptorManager 内部维护一个 handlers 数组，提供三个核心方法：use 用来注册一个由 fulfilled 和 rejected 组成的拦截器并返回 id；eject 根据 id 把对应项置为 null 来移除（置空而不是删除是为了保持索引稳定）；forEach 用来遍历所有有效的拦截器。

真正发起请求时，axios 会先构造一个 chain 数组，把真正发送请求的 dispatchRequest 放在中间，然后把所有请求拦截器通过 unshift 成对插到数组前面，把所有响应拦截器通过 push 成对追加到后面。接着从 `Promise.resolve(config)` 开始，循环调用 `promise.then(chain.shift(), chain.shift())` 把整条链串起来。这样 config 会依次经过请求拦截器、dispatchRequest、响应拦截器，最终返回一个 Promise。

这种组装方式决定了执行顺序：请求拦截器是后注册的先执行（LIFO，类似洋葱模型的外层），响应拦截器是先注册的先执行（FIFO）。所以如果先注册了一个注入 token 的请求拦截器，又注册了一个显示 loading 的请求拦截器，会先显示 loading 再注入 token；响应回来时则按注册顺序先处理通用错误、再解构业务数据。

错误处理上，链中任何一环抛出错误或返回 Promise.reject，都会跳到下一个 rejected 回调。因此我们通常在响应拦截器的 rejected 回调里统一处理 4xx/5xx、401 跳登录、错误提示，再把错误继续 reject 给业务层。如果 rejected 回调返回正常值，错误就会被恢复，后续的 fulfilled 会继续执行，这也是刷新 token 后重发请求的实现基础。整个机制让鉴权、loading、错误处理、数据格式化等横切逻辑能够从业务代码中完全抽离。

:::

## Vue

### 11. Vuex 和 Pinia 有什么区别？为什么 Pinia 被推荐为 Vuex 的替代方案？

#### 11-1. 关键词

> - **Pinia / Vuex**
> - **状态管理**
> - **Mutation 取消**
> - **TypeScript 类型推断**
> - **defineStore**
> - **Composition API**

#### 11-2. 考察点

::: info 考察点

- **API 设计差异**：Pinia 移除 mutations，actions 支持同步/异步，组件中可直接修改 state；Vuex 严格区分 state/getters/mutations/actions。
- **TypeScript 支持**：Pinia 完整类型推断，无需装饰器或复杂类型包装；Vuex 类型推导繁琐。
- **模块组织**：Pinia 使用 defineStore，扁平结构，无嵌套模块与命名空间；Vuex 通过 modules 嵌套与 namespaced 组织。
- **体积与生态**：Pinia 约 1KB，天然 tree-shaking，devtools 完整支持，同时兼容 Vue 2 与 Vue 3。
- **组合式 API 对齐**：Pinia 提供 setup 语法，与 Composition API 心智模型一致。

:::

#### 11-3. 知识点详解

Pinia 由 Vue 官方团队成员开发，已成为 Vue 官方推荐的状态管理方案，被视为 Vuex 5 的精神继任者。其设计核心是简化心智模型、增强类型系统、拥抱 Composition API。

**1. Vuex 的严格模式与繁琐结构**

Vuex 强制将状态变更流程拆分为四个概念：state 保存数据，getters 派生数据，mutations 同步修改状态，actions 处理异步并提交 mutation。这种设计在大型项目中带来了大量模板代码。

```ts
// Vuex store 示例
import { createStore } from 'vuex'

export default createStore({
  state: () => ({ count: 0, user: null as User | null }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  mutations: {
    SET_COUNT(state, value: number) {
      state.count = value
    },
    SET_USER(state, user: User) {
      state.user = user
    },
  },
  actions: {
    async fetchUser({ commit }, id: number) {
      const res = await fetch(`/api/users/${id}`)
      const user = await res.json()
      commit('SET_USER', user)
    },
  },
  modules: {
    cart: {
      namespaced: true,
      state: () => ({ items: [] as CartItem[] }),
      mutations: {
        ADD_ITEM(state, item: CartItem) {
          state.items.push(item)
        },
      },
    },
  },
})
```

组件中使用时需要 `this.$store.commit`、`this.$store.dispatch`，TypeScript 下还需要声明模块类型、使用 `useStore` 泛型或 `@vuex/typed` 等辅助方案，类型体验较差。

**2. Pinia 的 Options API 写法**

Pinia 移除了 mutation 这一概念。同步修改直接在 action 中通过 `this` 修改 state，异步逻辑也写在 action 中；组件中甚至可以直接修改 state（可选启用 strict mode 限制）。

```ts
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, user: null as User | null }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
    async fetchUser(id: number) {
      const res = await fetch(`/api/users/${id}`)
      this.user = await res.json()
    },
  },
})
```

组件中使用：

```vue
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 直接调用 action
counter.increment()

// 也可直接修改 state（Pinia 默认允许）
counter.count++

// 异步 action 无需 dispatch
counter.fetchUser(1)
</script>

<template>
  <div>{{ counter.count }} - {{ counter.doubleCount }}</div>
</template>
```

**3. Pinia 的 Setup Store 写法**

Pinia 支持与 Composition API 完全一致的 setup 语法，使用 ref/reactive/computed 组织状态，返回需要暴露的内容。这是最推荐的写法，类型推断最自然。

```ts
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // state
  const name = ref('')
  const age = ref(0)
  const token = ref<string | null>(null)

  // getter
  const isAdult = computed(() => age.value >= 18)
  const displayName = computed(() => name.value || '匿名用户')

  // action
  function login(newToken: string) {
    token.value = newToken
  }

  async function fetchProfile() {
    const res = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    const data = await res.json()
    name.value = data.name
    age.value = data.age
  }

  function logout() {
    token.value = null
    name.value = ''
    age.value = 0
  }

  return { name, age, token, isAdult, displayName, login, fetchProfile, logout }
})
```

**4. 模块组织：扁平而非嵌套**

Vuex 使用嵌套 modules 与 namespaced 字符串路径，容易出现 `cart/ADD_ITEM` 这样的硬编码字符串。Pinia 每个 store 都是独立的扁平单元，通过 composable 函数引入，store 之间可以直接相互引用，无需嵌套。

```ts
// stores/cart.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const userStore = useUserStore() // 直接引用其他 store

  function addItem(item: CartItem) {
    if (!userStore.token) throw new Error('请先登录')
    items.value.push(item)
  }

  return { items, addItem }
})
```

**5. TypeScript 支持**

Pinia 从底层使用 TypeScript 编写，整个 API 天然具备完整类型推断。getter 与 action 的参数、返回值全部自动推导，无需额外声明模块类型。Vuex 4 虽然增加了 TS 支持，但需要 `createStore<State>` 泛型、手写 `InjectionKey`，且对嵌套 module 的类型推导仍然薄弱。

**6. 体积、兼容与生态**

Pinia 核心体积约 1KB，gzip 后更小；所有 API 均支持 tree-shaking，未使用的 store 不会被打包。Pinia 同时支持 Vue 2（通过 `@vue/composition-api` 迁移构建）和 Vue 3，也支持 Nuxt 模块 `@pinia/nuxt`。Vue DevTools 原生集成 Pinia，支持 time-travel 调试。Pinia 还内置了 SSR 支持、持久化插件生态（如 `pinia-plugin-persistedstate`）以及热更新。

#### 11-4. 回答要点

- Pinia 移除 mutation，state 修改在 action 中或组件中直接完成，同步异步统一到 action。
- Pinia 完整 TypeScript 类型推断，无需装饰器或复杂泛型声明。
- defineStore 提供 Options 与 Setup 两种写法，扁平 store 结构取代嵌套 modules/namespaced。
- 体积约 1KB，tree-shakable，同时兼容 Vue 2 与 Vue 3，devtools 原生支持。
- 与 Composition API 心智一致，是 Vue 官方推荐的状态管理方案。

#### 11-5. 回答模板

::: tip 回答模板

Vuex 和 Pinia 都是 Vue 的状态管理库，但 Pinia 在设计上做了大幅简化。

在 API 层面，Vuex 严格区分 state、getters、mutations、actions，同步修改必须通过 mutation commit，异步通过 action dispatch；而 Pinia 移除了 mutation，同步和异步逻辑都统一在 action 中，组件中也可以直接修改 state，减少了大量模板代码。

在 TypeScript 支持上，Pinia 从底层用 TS 编写，state、getters、actions 都能获得完整的类型推断；Vuex 的类型支持相对繁琐，尤其是嵌套模块需要手写大量类型声明。

在模块组织上，Vuex 使用嵌套 modules 和 namespaced 字符串路径，而 Pinia 采用扁平的 store 结构，每个 store 通过 defineStore 定义，store 之间可以直接相互调用，更符合组合式 API 的风格。

此外，Pinia 体积只有约 1KB，支持 tree-shaking，同时兼容 Vue 2 和 Vue 3，devtools 原生支持，还提供了与 Composition API 一致的 setup 写法。因此，Pinia 被官方推荐为 Vuex 的替代方案，新项目应优先选择 Pinia。

:::


## React

### 12. React 中如何实现类似 Vue 的响应式数据（基于 Proxy 的自动追踪）？

#### 12-1. 关键词

> - **useSyncExternalStore**
> - **Proxy 响应式**
> - **Valtio**
> - **Zustand / Jotai**
> - **tearing 撕裂**
> - **Signals**

#### 12-2. 考察点

::: info 考察点

- **React 默认模型**：pull-based，由 setState/useState 触发重渲染，非 Proxy 自动追踪。
- **useSyncExternalStore**：React 18 提供的订阅外部 store 的官方 Hook，解决并发渲染下的 tearing 问题。
- **外部库实现**：Valtio 基于 Proxy 实现快照与自动追踪，Zustand/Jotai 各有订阅模型。
- **React 不原生使用 Proxy 的原因**：并发渲染一致性、引用相等模型、tearing 风险。
- **Signals 趋势**：Solid、Preact Signals、@xstate/react 等将细粒度响应式引入 React 生态。

:::

#### 12-3. 知识点详解

Vue 的响应式系统基于 Proxy，在属性被访问时自动收集依赖、在属性被修改时自动触发更新，开发者无需手动声明依赖。React 的默认模型则不同：它是 pull-based 的，状态变更通过 setState 调度一次重渲染，组件在渲染过程中"拉取"最新状态。要在 React 中实现类似 Vue 的 Proxy 自动追踪，需要借助外部 store 与订阅机制。

**1. React 默认模型与 Vue 的差异**

React 中，状态更新必须通过 setState 或 useState 的 setter 触发，React 并不知道组件具体使用了 state 的哪些字段。即使只修改了一个不相关字段，只要调用了 setState，组件函数就会重新执行。Vue 则通过 Proxy 在 get 时追踪依赖、set 时触发更新，只有真正依赖该属性的副作用才会执行。

```tsx
// React：必须显式 setState 触发重渲染
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

```vue
<!-- Vue：Proxy 自动追踪，修改即更新 -->
<script setup>
import { reactive } from 'vue'
const state = reactive({ count: 0 })
</script>
<template>
  <button @click="state.count++">{{ state.count }}</button>
</template>
```

**2. useSyncExternalStore：React 18 的官方外部 store 订阅**

React 18 引入 `useSyncExternalStore`，用于安全地订阅外部 store。它接收三个参数：subscribe 函数（注册回调）、getSnapshot 函数（返回当前快照）、getServerSnapshot（SSR 用）。这个 Hook 保证在并发渲染期间读取的快照一致，避免 tearing（同一帧中不同组件读到不同 store 值）。

```tsx
import { useSyncExternalStore } from 'react'

// 一个简单的外部 store
function createStore<T>(initialState: T) {
  let state = initialState
  const listeners = new Set<() => void>()

  function getState() {
    return state
  }

  function setState(partial: Partial<T>) {
    state = { ...state, ...partial }
    listeners.forEach((listener) => listener())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, setState, subscribe }
}

const store = createStore({ count: 0, name: 'React' })

function Counter() {
  const count = useSyncExternalStore(
    store.subscribe,
    () => store.getState().count
  )
  return <button onClick={() => store.setState({ count: count + 1 })}>{count}</button>
}
```

useSyncExternalStore 在渲染期间会检测 getSnapshot 返回值是否变化（使用 Object.is 比较），若变化则触发重渲染。它在并发模式下是安全的：React 会在提交前重新读取快照，确保 UI 一致。

**3. 简化版 Valtio：基于 Proxy 的自动追踪**

Valtio 是由 Zustand 作者开发的库，使用 Proxy 实现类似 Vue reactive 的体验。其核心思路是：用 Proxy 包装 state 对象，在 get 时追踪访问的属性，在 set 时通知订阅了该属性的组件重渲染；组件通过 `useSnapshot` 获取只读快照，渲染时自动建立依赖。

下面是一个简化实现，展示核心原理：

```ts
import { useSyncExternalStore } from 'react'

function proxyObject<T extends object>(obj: T): T {
  const listeners = new Set<() => void>()
  const snapshotCache = new WeakMap<object, unknown>()

  function notify() {
    listeners.forEach((fn) => fn())
  }

  function createSnapshot(target: object): any {
    if (snapshotCache.has(target)) return snapshotCache.get(target)
    const snap: Record<string | symbol, unknown> = {}
    Reflect.ownKeys(target).forEach((key) => {
      const value = Reflect.get(target, key)
      if (value && typeof value === 'object') {
        snap[key as string] = createSnapshot(value)
      } else {
        snap[key as string] = value
      }
    })
    Object.freeze(snap)
    snapshotCache.set(target, snap)
    return snap
  }

  function wrap(target: object): any {
    return new Proxy(target, {
      get(obj, prop, receiver) {
        const value = Reflect.get(obj, prop, receiver)
        if (value && typeof value === 'object') {
          return wrap(value)
        }
        return value
      },
      set(obj, prop, value, receiver) {
        const result = Reflect.set(obj, prop, value, receiver)
        snapshotCache.delete(obj) // 失效缓存
        notify()
        return result
      },
      deleteProperty(obj, prop) {
        const result = Reflect.deleteProperty(obj, prop)
        snapshotCache.delete(obj)
        notify()
        return result
      },
    })
  }

  const proxy = wrap(obj)

  function useSnapshot() {
    return useSyncExternalStore(
      (cb) => {
        listeners.add(cb)
        return () => listeners.delete(cb)
      },
      () => createSnapshot(obj)
    )
  }

  return { proxy, useSnapshot }
}

// 使用
const state = proxyObject({ count: 0, nested: { value: 1 } })

function App() {
  const snap = state.useSnapshot()
  return (
    <div>
      <p>{snap.count}</p>
      <p>{snap.nested.value}</p>
      <button onClick={() => { state.proxy.count++ }}>+1</button>
    </div>
  )
}
```

实际 Valtio 的实现更复杂，它维护版本号、按路径追踪依赖、在 getSnapshot 中只返回被访问部分的快照，从而实现细粒度更新。但其核心就是 Proxy 拦截 + useSyncExternalStore 订阅。

**4. Zustand 与 Jotai 的不同思路**

Zustand 不使用 Proxy，而是基于订阅器模式，store 是一个 hook，组件通过 selector 选择需要的切片，配合浅比较避免不必要的渲染：

```tsx
import { create } from 'zustand'

const useStore = create<{ count: number; inc: () => void }>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}))

function Counter() {
  // selector 只订阅 count
  const count = useStore((s) => s.count)
  return <button onClick={() => useStore.getState().inc()}>{count}</button>
}
```

Jotai 则采用原子化状态模型，原子可以派生、异步，组件只订阅自己使用的 atom，天然实现细粒度更新。

**5. React 为什么不原生使用 Proxy？**

React 团队没有采用 Proxy 作为核心响应式机制，主要有以下原因：

- **并发渲染一致性**：React 18 的并发渲染可以被中断、恢复、丢弃。如果在渲染过程中 Proxy 状态被外部修改，可能导致同一次渲染中读到不一致的数据，即 tearing 问题。useSyncExternalStore 通过在提交阶段重新读取快照来解决这一问题，但原生 Proxy 自动追踪与并发模型的结合非常复杂。
- **引用相等模型**：React 依赖 Object.is 比较 state 引用是否变化来决定是否重渲染，不可变数据结构是 React 生态的基础约定。Proxy 返回的可变代理与这一模型存在冲突。
- **可预测性与调试**：显式 setState 让状态变更链路可追踪，Proxy 自动追踪虽然写起来简洁，但在复杂场景下可能隐式触发更新，增加调试难度。

**6. Signals 趋势**

近年来，Signals（信号）作为细粒度响应式原语重新流行。SolidJS 从底层基于 Signals 构建，Preact 推出了 `@preact/signals`，`@xstate/react` 也集成了信号式状态。Signals 的核心是：值变化时只更新依赖它的具体 DOM 节点或副作用，无需虚拟 DOM diff。在 React 中使用 Signals 通常通过 `useSyncExternalStore` 桥接，或者直接在 JSX 中使用信号组件以绕过 React 的重渲染。这代表了响应式编程与 React 模型融合的趋势，但 React 官方目前仍坚持以不可变状态和重渲染为核心。

#### 12-4. 回答要点

- React 默认是 pull-based 模型，由 setState/useState 驱动重渲染，不像 Vue 基于 Proxy 自动追踪。
- React 18 提供 useSyncExternalStore 用于安全订阅外部 store，解决并发渲染下的 tearing 问题。
- Valtio 通过 Proxy 包装状态、useSnapshot 返回只读快照，实现类似 Vue reactive 的自动追踪；Zustand 用 selector 订阅切片，Jotai 用原子化状态。
- React 不原生使用 Proxy 的原因包括并发渲染一致性、引用相等与不可变约定、可预测性。
- Signals 趋势（Solid、Preact Signals、@xstate/react）将细粒度响应式引入 React 生态。

#### 12-5. 回答模板

::: tip 回答模板

React 和 Vue 的响应式模型有本质区别。React 默认是 pull-based 的，组件通过 setState 或 useState 的 setter 触发重渲染，在渲染过程中拉取状态；Vue 则基于 Proxy，在属性访问时自动收集依赖，属性修改时自动触发更新。

要在 React 中实现类似 Vue 的 Proxy 自动追踪，通常需要借助外部状态库。React 18 提供了 useSyncExternalStore 这个 Hook，它接收 subscribe、getSnapshot 等参数，让组件可以安全地订阅外部 store，同时解决了并发渲染下的 tearing 问题。Valtio 就是一个典型的基于 Proxy 的库，它用 Proxy 包装状态对象，在 get 时追踪访问、set 时通知更新，组件通过 useSnapshot 获取快照并自动建立依赖关系，体验非常接近 Vue 的 reactive。Zustand 和 Jotai 则采用不同的思路，Zustand 通过 selector 订阅状态切片，Jotai 采用原子化状态模型。

React 没有原生采用 Proxy，主要是因为并发渲染要求状态在一次渲染中保持一致，Proxy 可变代理与 React 的不可变数据和引用相等模型存在冲突，也可能引入隐式更新和调试困难。

近年来 Signals 趋势明显，Solid、Preact Signals 等将细粒度响应式推向主流，在 React 中通常通过 useSyncExternalStore 桥接，代表了响应式与 React 模型融合的方向。

:::

### 13. React Hooks 为什么不能在条件语句或循环中调用？底层原理是什么？

#### 13-1. 关键词

> - **Hooks 调用顺序**
> - **链表 linked list**
> - **fiber.memoizedState**
> - **Dispatcher**
> - **ESLint 插件**
> - **React Compiler**

#### 13-2. 考察点

::: info 考察点

- **调用顺序依赖**：Hooks 依赖固定的调用顺序，通过 next 指针形成链表挂载在 fiber 节点上。
- **链表匹配机制**：每次渲染 React 按顺序遍历链表，将 Hook 与上次状态一一对应。
- **条件调用的危害**：if/for 中调用 Hook 会导致顺序错乱，后续 Hook 读到错误的状态。
- **底层实现**：Dispatcher 分发，memoizedState 队列保存状态，updateQueue 串联更新。
- **工程约束与演进**：ESLint 插件强制规则，React 19 Compiler 优化但规则仍适用。

:::

#### 13-3. 知识点详解

Hooks 是 React 函数组件中管理状态和副作用的机制。React 要求 Hooks 必须在函数组件顶层调用，不能放在 if、for、嵌套函数或条件表达式中。这一限制不是语法层面的，而是由 Hooks 的底层存储结构决定的。

**1. 核心原理：按调用顺序匹配状态**

React 在每个 fiber 节点上维护一个 Hook 链表（旧版本通过 `memoizedState` 字段串联）。每次组件渲染时，Hooks 按代码书写顺序依次执行，每执行一个 Hook，React 就从链表当前节点读取或更新状态，然后将指针移动到下一个节点。下一次渲染时，React 仍然从链表头开始，按同样的顺序依次匹配。

这意味着 Hook 与状态的对应关系完全依赖调用顺序，而不依赖变量名或其他标识。

```tsx
function Form() {
  // 第 1 个 Hook：name 对应链表第 1 个节点
  const [name, setName] = useState('')
  // 第 2 个 Hook：email 对应链表第 2 个节点
  const [email, setEmail] = useState('')
  // 第 3 个 Hook：effect 对应链表第 3 个节点
  useEffect(() => {
    localStorage.setItem('form', JSON.stringify({ name, email }))
  }, [name, email])

  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

上面的组件每次渲染时，useState 调用顺序固定为 name、email，useEffect 在最后，链表节点与状态一一对应。

**2. 条件调用为什么会出错**

如果在条件语句中调用 Hook，某次渲染时条件为 true 执行了该 Hook，另一次渲染时条件为 false 跳过了它，后续 Hook 的顺序就会整体错位。

```tsx
// 错误示例
function UserPanel({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) {
    // 条件为 false 时这个 Hook 被跳过
    const [user, setUser] = useState(null)
  }

  // 无论条件如何都会执行，但此时链表指针位置已经错乱
  // isLoggedIn=false 时，这个 useEffect 会读到本属于 user 的状态节点
  useEffect(() => {
    console.log('mounted')
  }, [])

  return <div>...</div>
}
```

当 isLoggedIn 从 true 变为 false 时，第二次渲染跳过了第二个 useState，导致 useEffect 匹配到了原本属于 user 的链表节点。这会引发状态错乱、effect 读取错误值甚至崩溃，且这类 bug 极难排查。

循环中的 Hook 同理：循环次数变化会导致 Hook 数量和顺序不稳定。

**3. 底层数据结构：Hook 链表**

React 内部每个 fiber 节点的 `memoizedState` 字段指向该组件的第一个 Hook 节点。每个 Hook 节点包含以下核心字段：

```ts
interface Hook {
  memoizedState: any      // 当前 Hook 的状态值
  baseState: any          // 基础状态（用于 reducer 队列）
  baseQueue: Update<any> | null // 待处理的更新队列基础
  queue: UpdateQueue | null     // 更新队列
  next: Hook | null       // 指向下一个 Hook
}
```

Hook 通过 next 指针形成单向链表。函数组件执行时，React 维护一个"当前正在处理的 Hook"指针（内部称为 workInProgressHook），每调用一个 Hook，就将指针向后移动。

下面是一个极度简化的 Hooks 实现，帮助理解链表机制：

```ts
// 简化示意，非 React 真实源码
let workInProgressHook: Hook | null = null
let currentHook: Hook | null = null

function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  }

  if (workInProgressHook === null) {
    // 第一个 Hook，挂载到 fiber.memoizedState
    currentlyRenderingFiber.memoizedState = hook
  } else {
    // 追加到链表末尾
    workInProgressHook.next = hook
  }
  workInProgressHook = hook
  return hook
}

function updateWorkInProgressHook(): Hook {
  // 复用上一次渲染的 Hook 节点
  if (currentHook === null) {
    currentHook = currentlyRenderingFiber.memoizedState
  } else {
    currentHook = currentHook.next
  }
  // 按顺序创建/复用 workInProgress 节点
  workInProgressHook = currentHook
  return workInProgressHook
}

function useState<S>(initialState: S | (() => S)): [S, (s: S) => void] {
  const hook =
    currentlyRenderingFiber.memoizedState === null
      ? mountWorkInProgressHook()
      : updateWorkInProgressHook()

  if (hook.memoizedState === null) {
    hook.memoizedState =
      typeof initialState === 'function' ? (initialState as () => S)() : initialState
  }

  const setState = (action: S | ((prev: S) => S)) => {
    // 将更新加入 queue，调度重渲染
    scheduleUpdateOnFiber(hook, action)
  }

  return [hook.memoizedState, setState]
}
```

关键点在于：mount 时按顺序构建链表，update 时按顺序遍历链表复用节点。两次渲染的 Hook 调用顺序必须完全一致，否则 next 指针对不上，状态就会张冠李戴。

**4. Dispatcher 机制**

React 通过 Dispatcher 对象来分发不同的 Hook 实现。在函数组件渲染前，React 会根据当前阶段（mount、update、function 组件外等）将 `ReactSharedInternals.H` 指向不同的 dispatcher。`useState`、`useEffect` 等函数实际上只是调用 `ReactSharedInternals.H.useState(...)`。在函数组件外部调用 Hook 时，dispatcher 为 null 或 ContextOnlyDispatcher，会抛出 "Invalid hook call" 错误。

```ts
// React 内部伪代码
const HooksDispatcherOnMount = {
  useState: mountState,
  useEffect: mountEffect,
  useReducer: mountReducer,
  // ...
}

const HooksDispatcherOnUpdate = {
  useState: updateState,
  useEffect: updateEffect,
  useReducer: updateReducer,
  // ...
}

const ContextOnlyDispatcher = {
  useState: throwInvalidHookError,
  // ...
}
```

**5. updateQueue 与状态更新**

useState 和 useReducer 的 Hook 节点上有一个 queue 字段，保存了该状态的所有待处理更新，形成循环链表。每次渲染时，React 从 baseState 开始依次应用 queue 中的更新，计算出最新 memoizedState。这也是为什么多次调用 setState 会在一次渲染中批量处理。

**6. 如何避免违反规则**

React 官方提供了 `eslint-plugin-react-hooks`，其中 `rules-of-hooks` 规则会在编译期检查 Hook 是否被条件或循环包裹。它会识别以 use 开头的函数调用，确保它们只出现在函数组件或自定义 Hook 的顶层。

React 19 引入的 React Compiler 可以自动优化组件重渲染，但它仍然假设 Hooks 规则被遵守。Compiler 不会让条件调用 Hook 变得合法，相反，它依赖规则的正确性来进行记忆化优化。

如果确实需要条件性地使用副作用或状态，正确的做法是在 Hook 内部处理条件：

```tsx
// 正确：在 Hook 内部判断条件
function UserPanel({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) return
    fetchUser().then(setUser)
  }, [isLoggedIn])

  return <div>...</div>
}
```

#### 13-4. 回答要点

- Hooks 依赖固定调用顺序，每个 Hook 在 fiber.memoizedState 链表中按顺序对应一个节点。
- 每次渲染 React 从链表头开始按顺序遍历，将 Hook 与上次状态一一匹配。
- 在条件或循环中调用 Hook 会导致不同渲染间顺序不一致，后续 Hook 读到错误状态。
- 底层通过 Dispatcher 分发 mount/update 实现，Hook 节点包含 memoizedState、queue、next 等字段。
- eslint-plugin-react-hooks 在编译期强制规则；React Compiler 优化但不改变规则；条件逻辑应放在 Hook 内部。

#### 13-5. 回答模板

::: tip 回答模板

React Hooks 不能在条件语句或循环中调用，根本原因是 Hooks 依赖固定的调用顺序来匹配状态。

React 在每个 fiber 节点的 memoizedState 字段上维护一个 Hook 单向链表。组件首次渲染时，Hooks 按代码书写顺序依次执行，每执行一个 Hook 就在链表上追加一个节点，节点中保存该 Hook 的状态和更新队列。后续渲染时，React 从链表头开始，按完全相同的顺序依次遍历节点，将每个 Hook 与它上一次的状态对应起来。Hook 与状态的关联完全依赖顺序，而不依赖变量名。

如果在 if 或 for 中调用 Hook，某次渲染执行了该 Hook、另一次渲染跳过了它，链表顺序就会发生错位，后面的所有 Hook 都会读到错误的状态节点，导致状态混乱甚至崩溃。

底层实现上，React 通过 Dispatcher 分发 mount 和 update 阶段的不同 Hook 实现。每个 Hook 节点包含 memoizedState、baseState、queue、next 等字段，updateState 时通过 next 指针按顺序复用节点。useState/useReducer 的更新通过 queue 循环链表串联，在渲染时批量计算最终状态。

工程上，eslint-plugin-react-hooks 的 rules-of-hooks 规则会在编译期检查并报错；React 19 的 React Compiler 虽然能自动优化重渲染，但仍要求遵守 Hooks 规则。如果需要条件逻辑，应将条件写在 Hook 内部，而不是有条件地调用 Hook。

:::

### 14. React 的 Diff 算法和 Vue 的 Diff 算法有什么异同？

#### 14-1. 关键词

> - **同层比较**
> - **key 复用**
> - **O(n) 启发式**
> - **Fiber 协调**
> - **patchFlag / Block Tree**
> - **最长递增子序列**

#### 14-2. 考察点

::: info 考察点

- **共同策略**：同层比较不跨层、type/key 判断复用、O(n) 启发式而非 O(n^3) 最优解。
- **React Diff**：基于 Fiber 协调，key + type 启发式，单方向遍历配合 key 映射，重排通过 keyed reconciliation。
- **Vue 2 Diff**：双端比较（首尾指针）算法。
- **Vue 3 Diff**：快速路径处理首尾相同的前缀后缀，中间部分用 key 映射 + 最长递增子序列最小化 DOM 移动。
- **编译时优化差异**：Vue 3 有 patchFlag、Block Tree、静态提升，React Diff 纯运行时。
- **key 的作用**：两者都用 key 作为身份标识，帮助复用节点。

:::

#### 14-3. 知识点详解

React 和 Vue 都使用虚拟 DOM（Virtual DOM）描述 UI，在更新时通过 Diff 算法比较新旧虚拟 DOM 树，计算出最小的 DOM 操作。两者在高层策略上有共同之处，但在具体实现和编译时优化上有显著差异。

**1. 共同的设计哲学**

React 和 Vue 的 Diff 算法都基于以下三个假设，将理论上的 O(n^3) 最优树编辑距离降为 O(n)：

1. **只进行同层比较**：不会跨层级移动节点。如果父节点类型不同，直接销毁整棵子树重建，而不是尝试在不同层级间复用。
2. **type 不同则销毁重建**：如果元素类型不同（如 div 变成 span），直接卸载旧节点、挂载新节点。
3. **key 作为身份标识**：开发者通过 key 告知框架哪些子节点是稳定的，可以跨渲染复用。key 相同则尝试复用，不同则创建或删除。

**2. React 的 Reconciliation（Fiber 协调）**

React 的 Diff 过程称为 reconciliation。在 React 16 引入 Fiber 后，Diff 发生在 render 阶段，可以被中断和恢复。对于子节点数组，React 的 diffChildren 逻辑大致如下：

- 先按索引位置逐一比较新旧节点，若 type 和 key 都相同则复用，直到遇到第一个不匹配的节点。
- 遇到不匹配后，将剩余新子节点构建为一个 key 到 fiber 的 Map。
- 遍历剩余旧子节点，在 Map 中查找是否有可复用的节点：找到则移动，找不到则删除；Map 中剩余的标记为新增。
- 移动逻辑通过记录 lastPlacedIndex 实现：如果可复用节点的旧索引小于 lastPlacedIndex，则需要向右移动 DOM。

```tsx
// React 子节点 Diff 伪代码
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  let oldFiber = currentFirstChild
  let newIdx = 0
  let nextOldFiber = null
  let resultingFirstChild = null
  let previousNewFiber = null

  // 第一步：按索引位置逐一比较
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber
      oldFiber = null
    } else {
      nextOldFiber = oldFiber.sibling
    }

    const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx])
    if (newFiber === null) {
      if (oldFiber === null) oldFiber = nextOldFiber
      break
    }
    // ... 串联 fiber
    oldFiber = nextOldFiber
  }

  // 第二步：新节点遍历完，删除剩余旧节点
  if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultingFirstChild
  }

  // 第三步：旧节点遍历完，创建剩余新节点
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx])
      // ...
    }
    return resultingFirstChild
  }

  // 第四步：将剩余旧节点放入 Map，按 key 匹配
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber)
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx]
    )
    // ... 处理移动
  }
  return resultingFirstChild
}
```

React 的 Diff 是单方向遍历配合 key Map，不计算最优移动方案，而是用 lastPlacedIndex 启发式：节点只向右移动，不向左移动。这不是移动次数最少的方案，但实现简单、性能可接受。

**3. Vue 2 的双端比较**

Vue 2 的 `patchChildren` 采用双端比较算法（也叫头尾指针法），使用四个指针分别指向旧子节点列表的首尾和新子节点列表的首尾，按照以下顺序比较：

1. 旧头 vs 新头
2. 旧尾 vs 新尾
3. 旧头 vs 新尾
4. 旧尾 vs 新头

每命中一种情况就移动指针对应并复用节点，四种都不命中时才用 key 到索引的 Map 查找。双端比较能高效处理首尾稳定、中间变化的列表，但在复杂乱序场景下仍需较多 DOM 移动。

```js
// Vue 2 双端比较核心逻辑伪代码
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
      // 旧头 = 新头，复用，指针后移
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 旧尾 = 新尾，复用，指针前移
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 旧头移到新尾
      patchVnode(oldStartVnode, newEndVnode)
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 旧尾移到新头
      patchVnode(oldEndVnode, newStartVnode)
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 四种都不命中，用 key Map 查找
      // ...
    }
  }
}
```

**4. Vue 3 的快速 Diff**

Vue 3 重写了 Diff 算法，采用更高效的策略：

1. **前缀和后缀快速比较**：从头部和尾部分别比较，跳过相同的节点，缩小需要处理的中间范围。
2. **中间部分 key 映射**：对未匹配的中间节点，建立 key 到新节点索引的 Map。
3. **最长递增子序列（LIS）**：在中间部分计算旧节点在新序列中的位置数组，求其最长递增子序列。位于 LIS 中的节点保持不动，其余节点移动或新增，从而最小化 DOM 移动次数。

```ts
// Vue 3 快速 Diff 核心步骤伪代码
function patchKeyedChildren(c1, c2, ...) {
  let i = 0
  const l2 = c2.length
  let e1 = c1.length - 1
  let e2 = l2 - 1

  // 1. 从头部开始同步相同节点
  while (i <= e1 && i <= e2) {
    if (isSameVNodeType(c1[i], c2[i])) {
      patch(c1[i], c2[i])
    } else break
    i++
  }

  // 2. 从尾部开始同步相同节点
  while (i <= e1 && i <= e2) {
    if (isSameVNodeType(c1[e1], c2[e2])) {
      patch(c1[e1], c2[e2])
    } else break
    e1--
    e2--
  }

  // 3. 纯新增或纯删除的快速路径
  if (i > e1) {
    if (i <= e2) {
      // 新增 c2[i..e2]
    }
  } else if (i > e2) {
    // 删除 c1[i..e1]
  } else {
    // 4. 中间部分：key Map + 最长递增子序列
    const s1 = i
    const s2 = i
    const keyToNewIndexMap = new Map()
    for (i = s2; i <= e2; i++) {
      keyToNewIndexMap.set(c2[i].key, i)
    }

    const newIndexToOldIndexMap = new Array(e2 - s2 + 1).fill(0)
    for (i = s1; i <= e1; i++) {
      const oldVNode = c1[i]
      const newIndex = keyToNewIndexMap.get(oldVNode.key)
      if (newIndex !== undefined) {
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        patch(oldVNode, c2[newIndex])
      } else {
        unmount(oldVNode)
      }
    }

    // 求最长递增子序列，序列中的节点无需移动
    const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap)
    // 从后向前遍历，移动或挂载节点
    // ...
  }
}
```

最长递增子序列的优势在于：它找出的序列在新旧列表中相对顺序一致，这些节点完全不需要移动 DOM，只需要移动不在序列中的节点。相比 Vue 2 的双端比较和 React 的 lastPlacedIndex，Vue 3 产生的 DOM 移动次数更少。

**5. 编译时优化：Vue 3 的 patchFlag 与 Block Tree**

这是 React 与 Vue 最大的架构差异之一。React 的 Diff 是纯运行时的，每个子节点都需要逐一比较 type 和 key。Vue 3 在编译阶段分析模板，为动态节点打上 patchFlag，标记该节点哪些内容是动态的（text、class、style、props 等），Diff 时只比较被标记的部分，跳过静态内容。

```vue
<template>
  <div class="container">
    <h1>静态标题</h1>
    <p :class="className">{{ text }}</p>
    <span>静态文本</span>
  </div>
</template>
```

编译后，`<p>` 节点会被标记 patchFlag（如 CLASS + TEXT），更新时只比较 class 和 textContent，而 h1 和 span 作为静态节点被提升（hoist），每次渲染复用同一引用，完全不参与 Diff。Block Tree 还会将动态子节点收集到一个数组中，Diff 时直接遍历动态节点，跳过静态层级。

React 没有编译时优化（在 React Compiler 之前），所有节点都进入运行时 Diff。React Compiler 正在改变这一点，但它目前主要做自动记忆化，而非类似 patchFlag 的 Diff 剪枝。

**6. key 的使用**

两者都依赖 key 作为节点身份标识。key 的作用是：当子节点顺序变化时，框架通过 key 判断节点是否可复用，而不是按位置销毁重建。使用稳定且唯一的 key 至关重要，使用数组索引作为 key 在列表重排时可能导致状态错位。

#### 14-4. 回答要点

- React 和 Vue 都做同层比较、type/key 判断复用、采用 O(n) 启发式而非 O(n^3)。
- React 基于 Fiber 协调，子节点 Diff 先按索引比较再用 key Map，lastPlacedIndex 启发式移动节点。
- Vue 2 使用双端比较（头尾四指针）；Vue 3 先比较首尾相同部分，中间用 key Map + 最长递增子序列最小化 DOM 移动。
- Vue 3 有编译时优化（patchFlag、Block Tree、静态提升），Diff 可跳过静态节点；React 为纯运行时 Diff。
- 两者都用 key 作为身份提示，帮助复用节点、避免错误重建。

#### 14-5. 回答模板

::: tip 回答模板

React 和 Vue 的 Diff 算法在高层策略上有很多共同点，也在具体实现和优化方向上有明显差异。

共同点方面，两者都遵循三个基本假设：只做同层比较不跨层级移动；节点 type 不同时直接销毁重建；使用 key 作为节点身份标识来辅助复用。这些假设将理论上 O(n^3) 的最优树编辑距离降到了 O(n)。

React 的 Diff 基于 Fiber 协调。对子节点数组，React 先按索引位置逐一比较，遇到不匹配后将剩余新节点构建成 key 到 fiber 的 Map，再遍历旧节点在 Map 中查找可复用项，通过 lastPlacedIndex 决定是否移动 DOM，是一种单方向遍历配合 key 映射的启发式策略。

Vue 的 Diff 经历了演进：Vue 2 采用双端比较算法，用旧头新头、旧尾新尾、旧头新尾、旧尾新头四种匹配方式处理首尾节点，不命中时再用 key 查找；Vue 3 改为快速 Diff，先比较并跳过首尾相同的前缀和后缀，对中间部分建立 key 映射，再通过求最长递增子序列找出不需要移动的节点，从而最小化 DOM 操作次数。

最大的架构差异在于编译时优化。Vue 3 在编译阶段分析模板，为动态节点打上 patchFlag，结合 Block Tree 和静态提升，Diff 时只比较动态部分、跳过静态节点；React 的 Diff 是纯运行时的，每个节点都需要逐一比较，React Compiler 目前主要做记忆化优化而非类似剪枝。

两者都依赖 key 作为身份提示，使用稳定唯一的 key 对正确复用节点至关重要。

:::

### 15. 请详细解释 React Fiber 架构。

#### 15-1. 关键词

> - **Fiber 架构**
> - **可中断渲染**
> - **child / sibling / return**
> - **workInProgress / current**
> - **render 阶段 / commit 阶段**
> - **Lanes 优先级**
> - **Scheduler 调度**

#### 15-2. 考察点

::: info 考察点

- **诞生背景**：旧版 Stack Reconciler 递归不可中断，复杂更新阻塞主线程导致掉帧。
- **Fiber 本质**：一个 JS 对象，表示一个工作单元，也是可中断的自定义调用栈。
- **数据结构**：child、sibling、return 指针构成链表树，DFS 遍历而非递归。
- **双缓冲**：current 树与 workInProgress 树交替构建，commit 时一次性切换。
- **阶段划分**：render 阶段可中断（beginWork/completeUnitOfWork），commit 阶段原子执行（DOM 变更）。
- **优先级与调度**：Lanes 模型、Scheduler 优先级、shouldYield 让出主线程、饥饿问题处理。

:::

#### 15-3. 知识点详解

**注意：本题将 Fiber 架构的背景、数据结构、工作流程与优先级调度合并为一题，进行完整说明。**

Fiber 是 React 16 引入的核心架构重写，目标是让 React 具备异步可中断的渲染能力，解决旧版递归协调器在复杂更新时阻塞主线程的问题。

**1. 为什么需要 Fiber**

在 React 15 及之前，协调过程（reconciliation）是递归的：从根组件开始，递归调用每个组件的 render 方法，构建虚拟 DOM 树并同步更新真实 DOM。这个过程一旦开始就无法中断。如果组件树很大，递归调用可能持续超过 16ms，占据浏览器主线程，导致动画卡顿、输入无响应。

浏览器的主线程负责 JavaScript 执行、样式计算、布局、绘制和响应用户输入。React 的同步递归渲染会让这些任务排队等待。Fiber 的核心思路是将渲染工作拆分成小的工作单元（unit of work），每个单元完成后检查是否需要让出主线程给更高优先级任务（如用户输入、动画），从而实现可中断、可恢复、可优先级调度的渲染。

**2. Fiber 是什么**

Fiber 既是一个数据结构，也是一个工作单元：

- **作为数据结构**：每个 React 元素（组件、DOM 节点）对应一个 Fiber 节点，它是一个普通 JavaScript 对象，保存了组件类型、props、state、DOM 节点引用、子节点指针、更新队列等信息。
- **作为工作单元**：每个 Fiber 节点代表一块需要执行的工作（如更新一个组件、挂载一个 DOM 节点）。React 可以独立地开始、暂停、恢复这个工作单元。
- **作为自定义调用栈**：Fiber 通过 return 指针回到父节点，模拟了函数调用栈的返回地址，但不受原生调用栈不可中断的限制。

Fiber 节点的核心字段：

```ts
interface FiberNode {
  // 类型与属性
  type: any                  // 组件函数/类或 DOM 标签名
  tag: WorkTag               // 节点类型（FunctionComponent/HostComponent/...）
  key: null | string
  ref: any

  // 树结构指针（构成链表树）
  child: FiberNode | null    // 第一个子节点
  sibling: FiberNode | null  // 下一个兄弟节点
  return: FiberNode | null   // 父节点（返回指针）
  index: number              // 在兄弟节点中的索引

  // 状态
  pendingProps: any
  memoizedProps: any
  memoizedState: any         // 函数组件的 Hook 链表、类组件的 state
  updateQueue: UpdateQueue | null

  // 双缓冲
  alternate: FiberNode | null // 指向另一棵树中的对应节点

  // 副作用
  flags: Flags                // 标记（Placement/Update/Deletion 等）
  subtreeFlags: Flags
  lanes: Lanes                // 该节点上的优先级
  // ...
}
```

**3. 链表树结构：child / sibling / return**

Fiber 树不是用 children 数组表示，而是用 child（第一个子节点）、sibling（下一个兄弟节点）、return（父节点）三个指针构成的单链表树。这种结构使得遍历可以手动控制，随时暂停和恢复。

```
                    [Root]
                      |
                    child
                      |
                      v
                   [App] <---------- return --------+
                    |                                |
                  child                              |
                    |                                |
                    v                                |
                 [Header] --- sibling ---> [Content] --- sibling ---> [Footer]
                    |                        |        |                   |
                  child                    child    return              child
                    |                        |          |                 |
                    v                        v          v                 v
                  [Logo]                  [Post]     [App]            [Links]
                                           |
                                         child
                                           |
                                           v
                                        [Title]
```

遍历采用深度优先搜索（DFS）：

1. 从根节点开始，进入 `beginWork`（向下处理子节点）。
2. 如果有 child，沿 child 向下。
3. 如果没有 child，进入 `completeUnitOfWork`（完成当前节点），然后尝试 sibling。
4. 如果没有 sibling，沿 return 回到父节点，继续父节点的 completeWork。
5. 直到回到根节点，render 阶段完成。

这种遍历不是通过递归函数调用实现的，而是在一个循环中手动维护当前 Fiber 指针，因此可以在任意节点间中断和恢复。

**4. 双缓冲：current 与 workInProgress**

React 同时维护两棵 Fiber 树：

- **current 树**：当前已经显示在屏幕上的 Fiber 树，根容器的 `current` 字段指向它。
- **workInProgress 树**：正在构建中的新树，代表下一次渲染的结果。

每个 Fiber 节点通过 `alternate` 字段指向另一棵树中的对应节点。更新时，React 从 current 树的根开始，为每个有变化的节点在 workInProgress 树中创建或复用 alternate 节点，在 workInProgress 树上完成所有工作。当 render 阶段完成、commit 阶段执行后，根容器的 current 指针切换到 workInProgress 树，原 current 树变为下次更新的 workInProgress 备用。这种双缓冲机制保证了屏幕上始终显示一致的 UI，不会出现中间状态。

```ts
// 创建或复用 alternate
function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate
  if (workInProgress === null) {
    workInProgress = createFiber(current.type, pendingProps)
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
    workInProgress.flags = NoFlags
  }
  workInProgress.child = current.child
  // ...
  return workInProgress
}
```

**5. 两个阶段：render 与 commit**

Fiber 架构将更新分为两个阶段。

**render 阶段（可中断）**：负责找出哪些节点需要更新，构建 workInProgress 树。这个阶段不触碰真实 DOM，因此可以被中断、恢复、丢弃。核心函数是 `beginWork`（向下递归，处理组件的状态计算和子节点协调）和 `completeUnitOfWork`（向上归，收集副作用、创建 DOM 节点实例）。React 在每个工作单元完成后调用 `shouldYield()`，检查是否已超出时间片（通常 5ms），如果超出则暂停，将主线程交还给浏览器，等待下一个宏任务再继续。

```ts
// render 阶段工作循环伪代码
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate
  // beginWork：处理当前节点，返回第一个子节点
  const next = beginWork(current, unitOfWork, renderLanes)
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // 没有子节点，完成当前节点并处理兄弟/父节点
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }
}
```

**commit 阶段（不可中断，同步执行）**：当 render 阶段完成整棵树的构建后，React 进入 commit 阶段，同步执行所有 DOM 变更（插入、更新、删除）、执行生命周期方法（如 componentDidMount、useEffect 的被动回调被调度异步执行，而 useLayoutEffect 同步执行）。这个阶段不能中断，因为用户不能看到部分更新的 UI。commit 又分为 before mutation、mutation、layout 三个子阶段。

**6. 优先级模型：Lanes**

React 18 使用 Lanes（车道）模型表达优先级。Lanes 是用二进制位表示的优先级集合，不同更新被赋予不同的 lane，React 选择最高优先级的 lane 进行渲染。相比早期的 expirationTime 模型，Lanes 可以表示批量优先级范围，更好地支持并发特性。

Lane 的优先级从高到低大致包括：

- **SyncLane**：同步最高优先级（如离散用户输入事件 click、input）。
- **InputContinuousLane**：连续输入事件（如 mouse move、scroll）。
- **DefaultLane**：默认优先级（如 setTimeout、Promise 回调中的更新）。
- **TransitionLane**：过渡更新（startTransition、useTransition），可被更高优先级打断。
- **IdleLane**：空闲优先级（offscreen 内容）。

Scheduler 是独立于 React 的调度包，提供了 Immediate、UserBlocking、Normal、Low、Idle 五个优先级，与浏览器的 `requestIdleCallback` 和 `MessageChannel` 配合，在空闲时执行低优先级工作。

**7. 可中断与饥饿问题**

可中断渲染带来了一个问题：如果高优先级更新持续到来（如用户持续输入），低优先级更新可能永远无法完成，即"饥饿"。React 的处理方式是：在每个工作单元检查是否有更高优先级的更新，如果有则丢弃当前 workInProgress 树，从根开始用高优先级重新渲染；同时，低优先级更新不会被永久丢弃，它的 lane 一直保留，当高优先级任务完成后会继续处理。Lanes 模型也会跟踪"过期"的更新，对即将饿死的任务提升优先级，确保最终完成。

**8. startTransition 与 useTransition**

Fiber 架构使 React 能够区分紧急更新和非紧急更新。`startTransition` 将其中的更新标记为 transition 优先级，它们可以被紧急更新（如输入框输入）中断。这使得大型列表过滤、页面切换等耗时更新不会阻塞用户交互。

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value) // 紧急更新：输入框立即响应
    startTransition(() => {
      // transition 更新：可被中断，不阻塞输入
      const filtered = hugeList.filter((item) => item.includes(e.target.value))
      setResults(filtered)
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <p>加载中...</p> : <ResultList items={results} />}
    </>
  )
}
```

#### 15-4. 回答要点

- Fiber 解决了旧版递归协调不可中断、阻塞主线程的问题，将渲染拆分为可中断的工作单元。
- 每个 Fiber 是一个 JS 对象，含 type、props、state、child/sibling/return 指针、alternate、flags 等。
- 链表树通过 child、sibling、return 构成，DFS 遍历可手动控制，替代递归调用栈。
- current 与 workInProgress 双缓冲树在 commit 时切换，保证 UI 一致性。
- render 阶段可中断（beginWork/completeUnitOfWork，shouldYield 让出主线程），commit 阶段原子同步执行 DOM 变更。
- Lanes 二进制模型管理优先级，Scheduler 调度，高优先级可打断低优先级，过期任务防饥饿。

#### 15-5. 回答模板

::: tip 回答模板

React Fiber 是 React 16 引入的核心架构重写，主要解决旧版 Stack Reconciler 递归渲染不可中断、复杂更新阻塞主线程导致卡顿的问题。

Fiber 有三层含义：第一，它是一个 JavaScript 对象，每个组件或 DOM 节点对应一个 Fiber 节点，保存类型、props、state、DOM 引用和更新队列等；第二，它是一个工作单元，每个 Fiber 代表一块可独立执行、暂停和恢复的工作；第三，它是一个自定义调用栈，通过 return 指针模拟函数返回，但不受原生调用栈不可中断的限制。

在数据结构上，Fiber 树通过 child、sibling、return 三个指针构成链表树：child 指向第一个子节点，sibling 指向下一个兄弟节点，return 指向父节点。遍历采用深度优先搜索，beginWork 向下处理，completeUnitOfWork 向上完成，整个过程在循环中手动维护指针，因此可以随时中断。

React 同时维护 current 树和 workInProgress 树，通过 alternate 字段互相关联。更新在 workInProgress 树上构建，完成后在 commit 阶段一次性切换 current 指针，这就是双缓冲机制。

工作流程分为两个阶段：render 阶段是可中断的，负责协调组件和构建 effect 链，每个工作单元后调用 shouldYield 检查是否需要让出主线程；commit 阶段是同步不可中断的，原子地执行所有 DOM 变更和副作用。

优先级方面，React 18 使用 Lanes 二进制模型表示不同优先级，配合独立的 Scheduler 调度器，支持同步、用户阻塞、默认、过渡、空闲等优先级。高优先级更新可以中断低优先级渲染，startTransition 和 useTransition 让开发者可以标记非紧急更新。Lanes 还会跟踪过期任务以防饥饿，确保低优先级更新最终也能完成。

:::

### 16. 什么是受控组件和非受控组件？如何选择？

#### 16-1. 关键词

> - **受控组件 Controlled**
> - **非受控组件 Uncontrolled**
> - **value / onChange**
> - **defaultValue / ref**
> - **file input 限制**
> - **forwardRef / useId**

#### 16-2. 考察点

::: info 考察点

- **受控组件**：value 由 React state 控制，onChange 更新 state，React 是唯一数据源，每次输入触发重渲染。
- **非受控组件**：使用 defaultValue 设初始值，通过 ref 在需要时读取 DOM 值，DOM 是数据源。
- **典型场景**：input、select、checkbox、radio 都有两种模式；file input 在 React 中始终是非受控的。
- **选择依据**：需要实时验证、格式化、条件提交、即时反馈时用受控；简单表单、集成非 React 库、避免大规模重渲染时用非受控。
- **混合模式**：defaultValue 提供初始值，非受控运行，在特定事件时读取；配合 forwardRef、useId 使用。

:::

#### 16-3. 知识点详解

在 React 中处理表单数据有两种模式：受控组件和非受控组件。它们的核心区别在于表单数据由谁管理：是 React state 还是 DOM 自身。

**1. 受控组件（Controlled Components）**

受控组件的表单数据由 React state 管理。输入元素的 value 属性绑定到 state，onChange 事件处理器更新 state，形成单向数据流。React state 是唯一数据源（single source of truth），输入框显示的值始终与 state 一致。

```tsx
import { useState } from 'react'

function ControlledInput() {
  const [name, setName] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        alert(`提交的名字：${name}`)
      }}
    >
      <label>
        姓名：
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <p>实时预览：{name}</p>
      <button type="submit">提交</button>
    </form>
  )
}
```

每次按键都会触发 onChange，调用 setName，导致组件重渲染。这看起来有性能开销，但带来了强大的控制能力。

select、textarea、checkbox、radio 的受控写法：

```tsx
function ControlledForm() {
  const [fruit, setFruit] = useState('apple')
  const [agreed, setAgreed] = useState(false)
  const [gender, setGender] = useState('male')
  const [bio, setBio] = useState('')

  return (
    <form>
      {/* select 受控 */}
      <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
        <option value="apple">苹果</option>
        <option value="banana">香蕉</option>
      </select>

      {/* checkbox 受控 */}
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        同意协议
      </label>

      {/* radio 受控 */}
      <label>
        <input
          type="radio"
          value="male"
          checked={gender === 'male'}
          onChange={(e) => setGender(e.target.value)}
        />
        男
      </label>
      <label>
        <input
          type="radio"
          value="female"
          checked={gender === 'female'}
          onChange={(e) => setGender(e.target.value)}
        />
        女
      </label>

      {/* textarea 受控 */}
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
    </form>
  )
}
```

受控组件还支持实时验证、动态格式化等高级功能：

```tsx
function FormattedInput() {
  const [phone, setPhone] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 只保留数字并格式化为 xxx-xxxx-xxxx
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    const formatted = raw.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    setPhone(formatted)
  }

  return <input value={phone} onChange={handleChange} placeholder="手机号" />
}
```

**2. 非受控组件（Uncontrolled Components）**

非受控组件的表单数据由 DOM 自身管理，不绑定 value 到 state，而是使用 defaultValue 设置初始值，在需要时通过 ref 读取 DOM 的当前值。DOM 是数据源。

```tsx
import { useRef } from 'react'

function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`提交的名字：${inputRef.current?.value}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        姓名：
        <input type="text" ref={inputRef} defaultValue="" />
      </label>
      <button type="submit">提交</button>
    </form>
  )
}
```

注意：非受控组件使用 `defaultValue` 而非 `value`。如果给非受控元素设置了 value 属性，React 会警告用户可能想将其改为受控组件。checkbox 和 radio 使用 `defaultChecked`。

非受控 select 和 checkbox：

```tsx
function UncontrolledForm() {
  const selectRef = useRef<HTMLSelectElement>(null)
  const checkRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('选择：', selectRef.current?.value)
    console.log('勾选：', checkRef.current?.checked)
  }

  return (
    <form onSubmit={handleSubmit}>
      <select ref={selectRef} defaultValue="apple">
        <option value="apple">苹果</option>
        <option value="banana">香蕉</option>
      </select>

      <label>
        <input type="checkbox" ref={checkRef} defaultChecked />
        记住我
      </label>

      <button type="submit">提交</button>
    </form>
  )
}
```

**3. file input 始终是非受控的**

`<input type="file" />` 在 React 中始终是非受控组件，因为文件选择是浏览器安全限制，JavaScript 无法编程式设置文件值（只能由用户通过文件选择对话框选择，防止网页窃取用户文件）。只能通过 ref 读取 FileList：

```tsx
function FileUpload() {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const files = fileRef.current?.files
    if (files && files.length > 0) {
      const formData = new FormData()
      formData.append('file', files[0])
      fetch('/api/upload', { method: 'POST', body: formData })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} />
      <button type="submit">上传</button>
    </form>
  )
}
```

**4. 如何选择**

| 考量维度 | 受控组件 | 非受控组件 |
| --- | --- | --- |
| 数据源 | React state | DOM |
| 实时访问 | 每次输入立即可用 | 需通过 ref 读取 |
| 实时验证 | 方便，每次 onChange 即可校验 | 不方便，需手动监听 DOM 事件 |
| 动态格式化 | 方便，在 onChange 中转换值 | 困难 |
| 条件禁用提交 | 方便，依据 state 判断 | 需手动查询 DOM |
| 性能 | 每次按键重渲染 | 不触发 React 重渲染 |
| 集成非 React 代码 | 不便 | 方便，直接操作 DOM |
| 代码量 | 较多模板代码 | 较少 |

选择受控的场景：
- 需要实时表单验证（如密码强度提示、邮箱格式校验）。
- 需要根据输入动态格式化（如手机号、信用卡号分段）。
- 需要条件性启用/禁用提交按钮。
- 需要多个输入联动（如省市级联选择）。
- 需要即时反馈（搜索建议、字符计数）。

选择非受控的场景：
- 表单非常简单，只需在提交时读取一次值。
- 需要集成非 React 的表单库（如 jQuery 插件、原生 Web Components）。
- 表单极大（如成百上千个输入框），受控每次按键全量重渲染有性能压力。
- 原型或快速开发，不想为每个字段编写 state。

**5. 混合模式与最佳实践**

实际项目中常见混合模式：用 defaultValue 提供初始值，组件内部非受控运行，仅在特定事件（blur、submit）时通过 ref 读取值。这在性能与控制力之间取得平衡。

```tsx
function HybridForm({ initialEmail }: { initialEmail: string }) {
  const emailRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  function handleBlur() {
    const value = emailRef.current?.value ?? ''
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError('邮箱格式不正确')
    } else {
      setError('')
    }
  }

  return (
    <form>
      <input
        type="email"
        ref={emailRef}
        defaultValue={initialEmail}
        onBlur={handleBlur}
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </form>
  )
}
```

在可复用组件封装中，常配合 `forwardRef` 将内部 ref 暴露给父组件，用 `useId` 生成唯一的 label/htmlFor 关联：

```tsx
import { forwardRef, useId } from 'react'

interface InputProps {
  label: string
  defaultValue?: string
  type?: string
}

const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, defaultValue = '', type = 'text' }, ref) => {
    const id = useId()
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} ref={ref} defaultValue={defaultValue} />
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
```

#### 16-4. 回答要点

- 受控组件 value 绑定 React state，onChange 更新 state，React 是唯一数据源，每次输入触发重渲染。
- 非受控组件用 defaultValue 设初始值，通过 ref 在提交或需要时读取 DOM 值，DOM 是数据源。
- input、select、checkbox、radio 均有两种模式；file input 因浏览器安全限制始终非受控，必须用 ref 读取。
- 需要实时验证、格式化、条件提交、联动反馈时选受控；简单表单、集成非 React 库、避免大规模重渲染时选非受控。
- 可采用混合模式（defaultValue + ref + 事件时读取），配合 forwardRef、useId 封装可复用组件。

#### 16-5. 回答模板

::: tip 回答模板

受控组件和非受控组件是 React 处理表单的两种模式，核心区别在于表单数据由谁管理。

受控组件的 value 绑定到 React state，通过 onChange 事件更新 state，React state 是唯一数据源，输入框显示的值始终与 state 保持一致。每次按键都会触发重渲染，这使得实时验证、动态格式化、条件禁用提交按钮、多字段联动等功能非常容易实现。input、select、textarea、checkbox、radio 都可以写成受控组件，checkbox 用 checked 和 onChange 管理布尔值。

非受控组件则不把值绑定到 state，而是用 defaultValue 或 defaultChecked 设置初始值，在需要时通过 ref 直接读取 DOM 节点的 value。DOM 自身是数据源，输入过程不触发 React 重渲染，代码更简洁。值得注意的是，file input 在 React 中始终是非受控的，因为浏览器安全限制不允许 JavaScript 编程式设置文件值，只能通过 ref 读取用户选择的 FileList。

选择上，如果需要实时验证、动态格式化、即时反馈、条件提交或多字段联动，应使用受控组件；如果表单很简单只需在提交时读取一次、需要集成非 React 库、或者表单规模很大需要避免每次按键的重渲染开销，可以使用非受控组件。实际项目中也常用混合模式：用 defaultValue 提供初始值，组件非受控运行，在 blur 或 submit 时通过 ref 读取值并校验。封装可复用表单组件时，可配合 forwardRef 暴露 ref、useId 生成唯一 ID。

:::

## 性能优化

### 17. 前端图片优化有哪些手段？

#### 17-1. 关键词

> - **图片格式选择（WebP / AVIF）**
> - **响应式图片（srcset / sizes / picture）**
> - **图片懒加载（loading="lazy" / Intersection Observer）**
> - **CDN 与图片处理服务**
> - **图片压缩（imagemin / squoosh / mozjpeg / oxipng）**
> - **雪碧图与占位策略（LQIP / SQIP）**
> - **避免布局偏移（width / height / aspect-ratio）**

#### 17-2. 考察点

::: info 考察点

- **格式选型**：能否根据场景（照片、图标、透明图、动图）合理选择 JPEG、PNG、WebP、AVIF、SVG，并理解各格式压缩率与兼容性的权衡。
- **响应式与按需加载**：是否掌握 `srcset` / `sizes` / `<picture>` 的用法，能够根据 DPR、视口宽度、浏览器支持返回合适尺寸与格式的图片。
- **加载策略**：是否理解懒加载、预加载、占位图（LQIP/SQIP/blur-up）的取舍，以及对 LCP、CLS 的影响。
- **工程化能力**：是否了解构建阶段压缩（imagemin、squoosh、mozjpeg、oxipng）、CDN 实时处理（Accept 头协商、resize、quality 参数）以及雪碧图等手段。
- **性能指标意识**：能否从 LCP、CLS、带宽、解码耗时等维度评估图片优化的效果。

:::

#### 17-3. 知识点详解

图片通常占据网页平均字节体积的 60% 以上，是首屏加载和 LCP 优化的重点。优化需要从「格式、尺寸、加载时机、缓存、布局稳定」五个维度同时入手。

**1. 格式选择**

- **JPEG**：适用于色彩丰富的照片，有损压缩，不支持透明。使用 mozjpeg 编码可在同等画质下再减小 10%~15% 体积。
- **PNG**：适用于需要透明通道或需要无损的截图、Logo，体积较大；应优先使用 oxipng 等工具优化。
- **WebP**：同时支持有损/无损与透明，相比 JPEG 平均节省 25%~35%，现代浏览器已全面支持。
- **AVIF**：基于 AV1，压缩率比 WebP 再高约 20%，尤其适合大尺寸照片；编码较慢，适合在构建或 CDN 侧处理。
- **SVG**：矢量图标和简单图形应首选 SVG，可内联、可被 CSS 控制、任意缩放无锯齿。
- **避免 GIF**：动图应使用 `<video>` + H.264/MP4 或 WebM（静音自动播放），体积通常只有 GIF 的十分之一。

通过 `<picture>` 进行格式回退：

```html
<picture>
  <source type="image/avif" srcset="/img/hero.avif" />
  <source type="image/webp" srcset="/img/hero.webp" />
  <img
    src="/img/hero.jpg"
    alt="hero"
    width="1200"
    height="600"
    decoding="async"
  />
</picture>
```

浏览器会选择第一个它支持的 `<source>`，全部不支持时回退到 `<img>`。

**2. 响应式图片**

`srcset` 与 `sizes` 让浏览器根据 DPR 和视口宽度自行选择最合适的资源，避免在小屏手机上下载 4K 图：

```html
<img
  srcset="/img/p-400.webp 400w,
          /img/p-800.webp 800w,
          /img/p-1200.webp 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1200px) 50vw,
         600px"
  src="/img/p-800.jpg"
  alt="product"
  width="800"
  height="600"
  loading="lazy"
/>
```

艺术指导（Art Direction）场景——不同断点下需要不同裁剪比例的图——使用 `<picture>` + 媒体查询：

```html
<picture>
  <source media="(min-width: 768px)" srcset="/img/hero-desktop.webp" />
  <source media="(max-width: 767px)" srcset="/img/hero-mobile.webp" />
  <img src="/img/hero.jpg" alt="hero" width="1200" height="600" />
</picture>
```

**3. 懒加载**

原生懒加载最简单：

```html
<img src="photo.jpg" loading="lazy" alt="..." width="400" height="300" />
<iframe src="..." loading="lazy"></iframe>
```

`loading="lazy"` 的阈值由浏览器决定，首屏图片切勿加该属性，否则会拖慢 LCP。对自定义动画、占位、错误回退有要求时，使用 Intersection Observer：

```js
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
}, { rootMargin: '200px 0px' }); // 提前 200px 加载，减少白屏

document.querySelectorAll('img[data-src]').forEach(el => io.observe(el));
```

避免使用 scroll 事件监听实现懒加载，它会在主线程上频繁触发，且容易引发强制同步布局。

**4. CDN 与图片处理服务**

接入七牛、阿里云 OSS、Cloudflare Images、Imgix 等服务后，可通过 URL 参数动态裁剪、压缩并根据 `Accept` 头自动协商格式：

```html
<img
  src="https://cdn.example.com/photo.jpg?w=800&q=75&format=auto"
  srcset="https://cdn.example.com/photo.jpg?w=400&q=75&format=auto 400w,
          https://cdn.example.com/photo.jpg?w=800&q=75&format=auto 800w,
          https://cdn.example.com/photo.jpg?w=1200&q=75&format=auto 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="..."
  width="800"
  height="600"
/>
```

`format=auto` 会根据请求 `Accept: image/avif,image/webp,*/*` 自动返回 AVIF/WebP/JPEG，免去手动维护多格式文件。

**5. 构建阶段压缩**

在 Vite/Webpack 中集成压缩插件，在保证视觉质量前提下自动处理：

```js
// vite.config.js
import ViteImagemin from 'vite-plugin-imagemin';

export default {
  plugins: [
    ViteImagemin({
      mozjpeg: { quality: 75, progressive: true },
      oxipng: { optimizationLevel: 3 },
      webp: { quality: 75 },
      avif: { quality: 50 },
      gifsicle: { optimizationLevel: 3 }
    })
  ]
};
```

也可在本地用 Squoosh CLI 批量处理，或在 CI 中校验图片体积。

**6. 雪碧图与 SVG 图标**

小图标可合并为雪碧图（Sprite），通过 `background-position` 定位，减少请求数。但在 HTTP/2 多路复用普及后，雪碧图的收益在下降，更现代的做法是：

- 单色或简单图标使用 SVG symbol + `<use>`，或直接内联 SVG；
- 多色图标使用 SVG sprite；
- 图标字体（Icon Font）应尽量避免，存在可访问性与渲染抖动问题。

```html
<svg aria-hidden="true" style="position:absolute;width:0;height:0">
  <symbol id="icon-search" viewBox="0 0 24 24">
    <path d="M10 2a8 8 0 105.3 14l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0010 2z"/>
  </symbol>
</svg>
<svg><use href="#icon-search"/></svg>
```

**7. 占位策略与过渡**

图片加载完成前展示占位，避免白屏并降低 CLS：

- **LQIP（Low Quality Image Placeholder）**：使用一张 20~30px、极低质量的模糊图作为占位，加载高清图后替换；
- **SQIP（SVG-based LQIP）**：基于 SVG 的矢量轮廓占位，体积更小；
- **blur-up**：在 LQIP 上加 CSS `filter: blur()` 再淡入；
- **主色占位**：取图片主色作为 `background-color`，视觉过渡平滑。

**8. 预加载关键图片**

LCP 图片（如首屏 Banner）应使用 `preload` 提前发现，避免被 CSS/JS 阻塞：

```html
<link
  rel="preload"
  as="image"
  href="/img/hero.avif"
  imagesrcset="/img/hero-400.avif 400w, /img/hero-1200.avif 1200w"
  imagesizes="100vw"
  type="image/avif"
  fetchpriority="high"
/>
```

`fetchpriority="high"` 可提升其网络优先级，但仅限真正关键的一两张图片。

**9. 避免布局偏移（CLS）**

始终为 `<img>`、`<video>` 设置 `width`、`height`，浏览器会据此计算 `aspect-ratio`，在 CSS 中再使用 `max-width: 100%; height: auto;` 即可保持比例：

```css
img {
  max-width: 100%;
  height: auto;
}
```

对于无法提前知道尺寸的图片，可使用 CSS `aspect-ratio`：

```css
.card-cover {
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
  object-fit: cover;
}
```

**10. 能用 CSS/字体就不用图片**

- 简单几何图形、渐变、阴影使用 CSS；
- 图标使用 SVG 或图标字体；
- 装饰性动图优先 CSS animation / Lottie / WebM；
- 文字不要做成图片，影响可访问性和 SEO。

**11. 支持性检测与渐进降级**

在 JS 中检测 WebP/AVIF 支持，或依赖 `<picture>` 的多源声明。现代浏览器对 WebP 支持率已超过 97%，AVIF 也在快速普及，通常无需 JS 检测，直接用 `<picture>` 声明即可。

#### 17-4. 回答要点

- 先从「选对格式」入手：照片用 JPEG/WebP/AVIF，图标用 SVG，透明图用 PNG/WebP，动图用视频而非 GIF。
- 使用 `<picture>` 做格式回退，使用 `srcset` + `sizes` 做尺寸自适应，让浏览器按 DPR 与视口选择资源。
- 非首屏图片统一 `loading="lazy"`，自定义场景用 Intersection Observer，避免 scroll 监听。
- 首屏 LCP 图片通过 `<link rel="preload" as="image" fetchpriority="high">` 提前加载。
- 接入 CDN 图片处理服务，通过 URL 参数动态裁剪、压缩，并利用 Accept 头自动协商格式。
- 构建阶段用 imagemin / mozjpeg / oxipng / squoosh 批量压缩，在 CI 中卡住体积阈值。
- 小图标使用 SVG sprite，避免过时的 GIF；装饰性元素用 CSS 渐变、字体、SVG 替代图片。
- 使用 LQIP/SQIP/主色占位与 blur-up 过渡，提升感知体验。
- 必须设置 `width`/`height` 或 CSS `aspect-ratio`，杜绝 CLS。
- 最终以 LCP、CLS、图片字节总量、请求数作为验收指标，用 Lighthouse 与 Performance 面板量化。

#### 17-5. 回答模板

::: tip 回答模板

前端图片优化我会从格式、尺寸、加载时机、缓存和布局稳定性五个方面系统处理。

第一，选对格式。照片类用 JPEG 作为兜底，同时提供 WebP 和 AVIF；需要透明的图用 PNG 或 WebP；图标一律用 SVG；动图用静音自动播放的 MP4/WebM 替代 GIF。通过 `<picture>` 做多源声明，浏览器自动选择支持的格式。

第二，做响应式。结合 `srcset` 和 `sizes` 提供多档尺寸的图片，让浏览器根据 DPR 和视口宽度选择最合适的资源；不同裁剪比例的艺术指导场景用 `<picture>` + `media` 切换。

第三，优化加载时机。非首屏图片加 `loading="lazy"`，需要自定义占位和动画时使用 Intersection Observer，并设置 `rootMargin` 提前加载；首屏 LCP 图片用 `<link rel="preload" as="image" fetchpriority="high">` 提前发现。

第四，工程化压缩和分发。在 Vite/Webpack 中接入 imagemin，使用 mozjpeg、oxipng、webp、avif 编码器；接入 CDN 图片服务，通过 URL 参数实时裁剪、压缩，并依据 Accept 头自动返回 AVIF/WebP。

第五，体验和稳定性。使用 LQIP、SQIP、主色占位和 blur-up 减少白屏；所有图片都设置 `width`/`height` 或 CSS `aspect-ratio` 避免 CLS；图标使用 SVG sprite，简单图形用 CSS 渐变或字体代替图片。

最终通过 Lighthouse、Performance 面板以及 LCP、CLS、图片总体积等指标验证效果，形成「测量—优化—回归」的闭环。

:::

### 18. 如何优化长列表滚动性能？

#### 18-1. 关键词

> - **滚动卡顿原因（DOM 过多、样式复杂、强制同步布局）**
> - **虚拟滚动 / 窗口化（windowing）**
> - **DOM 回收与 overscan**
> - **CSS containment / content-visibility**
> - **passive 监听器与 requestAnimationFrame 节流**
> - **Intersection Observer 替代 scroll 监听**
> - **GPU 合成（transform / will-change）**

#### 18-2. 考察点

::: info 考察点

- **渲染管线理解**：是否清楚 JS → Style → Layout → Paint → Composite 各阶段的开销，以及在滚动过程中哪些操作会触发重排重绘。
- **虚拟列表**：是否理解窗口化（windowing）思想，能否说明固定高度与不定高虚拟列表的实现差异。
- **事件与节流**：是否知道 scroll 事件中执行高开销代码的危害，能否正确使用 passive、rAF 节流或改用 Intersection Observer。
- **CSS 优化**：是否掌握 `contain`、`content-visibility`、`will-change`、`transform` 等属性在长列表场景下的使用方式和副作用。
- **数据加载策略**：能否区分无限滚动与分页的取舍，是否对数据请求做防抖/节流和缓存。

:::

#### 18-3. 知识点详解

长列表滚动性能问题几乎都源于「主线程在一帧（约 16.6ms）内做了太多事」。要做到 60FPS，每帧预算只有 16ms，其中浏览器自身还要消耗 4~6ms，留给业务代码的大约只有 10ms。

**1. 找到卡顿的根源**

常见原因：

- **DOM 节点过多**：渲染 10000 条数据会创建 10000 个 DOM 节点，首次挂载、样式计算、布局都非常慢，内存占用高。
- **样式复杂**：深层嵌套选择器、通配符、大量 `box-shadow`、`filter: blur()`、`backdrop-filter`、渐变会显著增加绘制耗时。
- **scroll 事件里做重活**：在监听中读取 `offsetTop`、`getBoundingClientRect()` 后立刻写入样式，会触发强制同步布局（Forced Synchronous Layout，又称布局抖动）。
- **频繁重排重绘**：滚动时不断修改影响布局的属性（width、height、top、margin）。
- **图片/视频大量并发加载**：滑动时一次性加载成百上千张图片，挤占网络与解码线程。
- **sticky / 大 backdrop-filter**：固定定位元素配合大面积模糊会在每帧触发昂贵的合成与绘制。

排查方法：

- Chrome DevTools → Performance 面板录制滚动过程，查看 Main 线程长任务、Layout / Paint / Composite 耗时。
- Rendering 面板开启「Paint flashing」「Layer borders」「FPS meter」观察重绘区域。
- Layers 面板查看是否产生了不必要的合成层。

**2. 虚拟滚动（Windowing）**

核心思想是「只渲染可视区域 + 少量缓冲」，DOM 节点数从 N 降为常数。这是处理超长列表的根本手段，下一题会详细展开。常用库：

- React：`react-window`、`react-virtualized`、`@tanstack/react-virtual`；
- Vue：`vue-virtual-scroller`、`@tanstack/vue-virtual`；
- 原生或跨框架：`@tanstack/virtual-core`。

**3. DOM 回收与 overscan**

虚拟列表在滚动时不断卸载离开视口的项、挂载进入视口的项。为避免快速滑动出现白屏，需要在前后多渲染几条，称为 overscan（常见 5~10 条）。部分库使用「节点池」复用 DOM，通过 key 复用而非销毁重建，进一步降低 GC 压力。

**4. CSS Containment 与 content-visibility**

让浏览器知道列表项之间互相独立，从而跳过对不可见项的渲染计算：

```css
.list-item {
  contain: layout style paint;
}

.offscreen-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 120px; /* 预估高度，避免滚动条跳动 */
}
```

- `contain: layout style paint` 告诉浏览器该子树的布局、样式和绘制不影响外部；
- `content-visibility: auto` 让浏览器在元素不可见时跳过其渲染（包括布局和绘制），是「穷人版虚拟列表」，对中等长度（几百到几千）的静态内容非常有效；
- 必须配合 `contain-intrinsic-size` 给出预估尺寸，否则滚动条长度会变化。

注意：`content-visibility: auto` 不能完全替代虚拟列表，因为未渲染的 DOM 节点仍然存在、事件处理和数据仍在内存中；数据量达到十万级仍需虚拟列表。

**5. 避免在 scroll 中做重活**

不要这样写：

```js
// 反例：每次滚动都读写布局，触发强制同步布局
window.addEventListener('scroll', () => {
  const top = header.getBoundingClientRect();
  if (top < 0) nav.style.top = '0px';
});
```

正确做法：

- 能用 Intersection Observer 就不要用 scroll 监听（吸顶、懒加载、曝光埋点）：

```js
const io = new IntersectionObserver(([entry]) => {
  nav.classList.toggle('is-stuck', !entry.isIntersecting);
}, { rootMargin: '0px 0px -100% 0px', threshold: 0 });
io.observe(sentinel);
```

- 必须使用 scroll 时，加 `{ passive: true }` 让浏览器知道不会 `preventDefault`，从而可以立即滚动而不等待 JS：

```js
window.addEventListener('scroll', onScroll, { passive: true });
```

- 在回调中使用 `requestAnimationFrame` 节流，把视觉更新合并到下一帧：

```js
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateParallax(window.scrollY);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

- 避免在滚动回调中调用 `offsetTop`、`offsetWidth`、`getBoundingClientRect()`、`scrollTo()` 后又写样式，读写要分离并批量处理。

**6. 减少绘制与合成开销**

- 滚动期间尽量只改 `transform` 和 `opacity`，它们只走合成线程，不触发布局和绘制：

```css
.parallax-bg {
  will-change: transform;
  transform: translate3d(0, 0, 0);
}
```

- 避免在滚动项上使用 `box-shadow`、`filter: blur()`、`backdrop-filter`，这些会显著增加绘制区域和耗时；必须使用时可在滚动时临时加一个 `.is-scrolling` 类关闭昂贵效果：

```js
let scrollTimer;
window.addEventListener('scroll', () => {
  document.body.classList.add('is-scrolling');
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    document.body.classList.remove('is-scrolling');
  }, 150);
}, { passive: true });
```

```css
.list-item .card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: box-shadow .2s;
}
body.is-scrolling .list-item .card {
  box-shadow: none;
}
```

- 谨慎使用 `will-change`：它会提前创建合成层，过量使用会吃掉大量显存；只在确实需要动画的少数元素上使用，并在动画结束后移除。

**7. 滚动加载数据：无限滚动 vs 分页**

- **无限滚动**：浏览体验流畅，但 DOM 数量、内存会持续增长，必须配合虚拟列表；
- **分页**：更利于 SEO、分享定位和性能控制；
- **「查看更多」按钮**：在移动端是无限滚动与分页的折中。

数据加载需要防抖/节流，避免快速滚动时发起大量重复请求：

```js
async function loadMore() {
  if (loading || done) return;
  loading = true;
  try {
    const data = await fetchPage(page++);
    appendItems(data);
  } finally {
    loading = false;
  }
}

const sentinelObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadMore();
}, { rootMargin: '200px 0px' });
sentinelObserver.observe(sentinel);
```

对已加载数据做缓存，避免来回滚动重复请求。

**8. 其他细节**

- 列表图片必须设置 `width`/`height`、`loading="lazy"`、`decoding="async"`，避免在滚动时触发同步解码；
- 避免在列表项中使用 `position: sticky` 叠加大面积 `backdrop-filter`；如必须吸顶，给吸顶元素独立合成层并缩小模糊区域；
- 事件委托：把点击等事件挂到列表容器，利用冒泡处理，避免每个项都绑定监听器；
- 复杂项使用 `v-once` / `React.memo` / `shouldComponentUpdate` 避免无意义重渲染；
- 长列表内尽量不要使用 `<table>` 的复杂布局，表格布局计算成本高于 `div + flex/grid`；
- 在移动端监听 `touchmove` 时同样使用 `passive: true`。

#### 18-4. 回答要点

- 先测量，使用 Performance 面板和 Rendering 工具定位是脚本、布局、绘制还是合成的瓶颈。
- 数据量大时使用虚拟滚动（react-window / vue-virtual-scroller / TanStack Virtual），只渲染可见区 + overscan，并配合 DOM 回收。
- 对中等长度的静态内容可使用 `content-visibility: auto` + `contain-intrinsic-size` 让浏览器跳过不可见项的渲染。
- scroll 监听必须加 `{ passive: true }`，并使用 rAF 节流；能使用 Intersection Observer 实现的吸顶、曝光、懒加载、加载更多，就不要使用 scroll。
- 避免在滚动中读写布局属性造成强制同步布局；动画只改 `transform` 和 `opacity`。
- 滚动期间临时简化样式，如关闭 `box-shadow`、`filter: blur()`、`backdrop-filter`；谨慎使用 `will-change`。
- 列表项使用 `contain: layout style paint`，告诉浏览器子树之间互相独立。
- 图片必须懒加载、异步解码并预留尺寸；事件使用委托；复杂项做记忆化避免重渲染。
- 数据加载使用 Intersection Observer + 防抖/节流 + 缓存，根据场景选择无限滚动或分页。
- 最终以 FPS、长任务数、滚动时的 Layout/Paint 耗时和内存曲线作为验收指标。

#### 18-5. 回答模板

::: tip 回答模板

长列表滚动卡顿本质上是主线程在 16ms 内做了太多工作，我会按「先测量、再减载、最后优化样式和事件」的思路来处理。

第一步，用 Chrome Performance 面板录制滚动过程，配合 Rendering 面板的 Paint flashing、FPS meter 和 Layers 面板，判断瓶颈是 JS 长任务、强制同步布局、重绘还是合成层过多。

第二步，从根本上减少 DOM。数据量超过几百条时使用虚拟滚动，例如 React 用 react-window 或 TanStack Virtual，Vue 用 vue-virtual-scroller，只渲染可视区域加上 5~10 条 overscan，并通过 key 复用 DOM。对于几千条的静态内容，可以先尝试 `content-visibility: auto` 配合 `contain-intrinsic-size`，让浏览器跳过不可见项的布局和绘制；列表项加上 `contain: layout style paint` 进一步隔离渲染。

第三步，优化滚动事件。能用 Intersection Observer 做的吸顶、懒加载、曝光埋点和加载更多就不用 scroll；必须用 scroll 时，一定加 `{ passive: true }`，在 rAF 里更新视图，并避免在回调中同时读写 `offsetTop`、`getBoundingClientRect` 等触发强制同步布局。数据请求加防抖和缓存，防止快速滚动时重复请求。

第四步，降低绘制和合成成本。滚动时只改 `transform` 和 `opacity`，避免修改 width、top 等布局属性；在滚动期间通过 `.is-scrolling` 类临时关闭昂贵的 `box-shadow`、`filter: blur()`、`backdrop-filter`；只在真正需要动画的元素上谨慎使用 `will-change`，避免显存暴涨。

第五步，处理细节。列表图片统一 `loading="lazy"`、`decoding="async"` 并设置尺寸；事件挂在容器上做委托；复杂项用 React.memo / v-once 记忆化；移动端 `touchmove` 同样加 passive。

最后再用 Performance 面板回归，确认 FPS 稳定在 60、没有长任务、Layout/Paint 耗时显著下降，并且内存没有持续上涨。

:::

### 19. 什么是虚拟列表？它的实现原理是什么？

#### 19-1. 关键词

> - **虚拟滚动 / 窗口化（windowing）**
> - **可视区域 + 缓冲区（overscan）**
> - **scrollTop / itemHeight / startIndex / endIndex**
> - **占位容器撑开滚动条**
> - **绝对定位 / transform 偏移**
> - **不定高虚拟列表（预估高度 + 测量缓存）**
> - **ResizeObserver 与动态内容**
> - **react-window / vue-virtual-scroller / TanStack Virtual**

#### 19-2. 考察点

::: info 考察点

- **问题理解**：能否说清直接渲染海量 DOM 带来的首次挂载慢、内存高、布局重、滚动卡等问题。
- **核心原理**：是否掌握「外层容器固定高度、内层占位容器撑起总高度、根据 scrollTop 计算可见区间、绝对定位渲染可见项」这一基本结构。
- **定高实现**：能否手写一个固定高度虚拟列表，正确计算 startIndex、endIndex、偏移量和 overscan。
- **不定高处理**：是否理解预估高度 + 测量缓存 + ResizeObserver 的方案，以及如何处理滚动位置跳跃。
- **工程经验**：是否了解虚拟列表常见问题（快速滚动白屏、动态高度、滚动锚定、搜索定位）以及成熟库的选择。

:::

#### 19-3. 知识点详解

**1. 为什么需要虚拟列表**

直接渲染 10000 条数据会产生 10000 个 DOM 节点，带来三个问题：

- **首次挂载慢**：Vue/React 需要为每条数据创建 VNode、真实 DOM，绑定事件，可能耗时数百毫秒到数秒；
- **内存占用高**：每个 DOM 节点持有大量属性，10000 条记录轻松占用上百 MB；
- **滚动卡顿**：浏览器在每帧都要对所有节点做样式计算、布局和命中测试，即便它们不在视口内。

而用户一屏只能看到 10~20 条，渲染其余 9980 条纯属浪费。虚拟列表（Virtual List / Windowing）就是只渲染「可视区域 + 少量缓冲」，把 DOM 数量从 O(N) 降到 O(1)。

**2. 固定高度虚拟列表的实现**

固定高度是最容易理解的版本，整体结构：

```html
<div class="viewport" id="viewport">           <!-- 固定高度，overflow: auto -->
  <div class="spacer" id="spacer"></div>       <!-- 高度 = total * itemHeight，撑起滚动条 -->
  <div class="visible" id="visible"></div>     <!-- 绝对定位，渲染可见项 -->
</div>
```

```css
.viewport {
  position: relative;
  height: 600px;
  overflow-y: auto;
  contain: strict;
}
.visible {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}
.item {
  height: 60px;
  box-sizing: border-box;
}
```

原生 JS 实现：

```js
const data = Array.from({ length: 100000 }, (_, i) => `Item ${i}`);
const ITEM_HEIGHT = 60;
const OVERSCAN = 5;

const viewport = document.getElementById('viewport');
const spacer = document.getElementById('spacer');
const visible = document.getElementById('visible');

spacer.style.height = data.length * ITEM_HEIGHT + 'px';

function render() {
  const scrollTop = viewport.scrollTop;
  const viewportHeight = viewport.clientHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + viewportHeight) / ITEM_HEIGHT) + OVERSCAN
  );

  const offsetY = startIndex * ITEM_HEIGHT;
  visible.style.transform = `translateY(${offsetY}px)`;

  let html = '';
  for (let i = startIndex; i < endIndex; i++) {
    html += `<div class="item" data-index="${i}">${data[i]}</div>`;
  }
  visible.innerHTML = html;
}

viewport.addEventListener('scroll', render, { passive: true });
render();
```

关键点：

- **spacer 撑开总高度**：让滚动条比例正确，并能滚到真实位置；
- **translateY 偏移**：将可见容器整体下移到 `startIndex * itemHeight`，避免为每个项单独计算 top；
- **overscan**：在可视区前后多渲染若干条，防止快速滚动出现白屏；
- **passive 监听**：滚动事件不阻塞浏览器合成。

在 React 中使用 `react-window` 写法：

```jsx
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style} className="item">Row {index}</div>
);

export default function App() {
  return (
    <List height={600} itemCount={100000} itemSize={60} width="100%">
      {Row}
    </List>
  );
}
```

**3. 不定高虚拟列表**

真实业务中，列表项高度常因文字换行、图片、富文本而不同，无法用 `index * itemHeight` 直接定位。常见做法：

- **预估高度 + 测量缓存**：先用一个估值（如平均高度）生成初始位置，项渲染后通过 `getBoundingClientRect` 或 `ResizeObserver` 测量真实高度，写入缓存并累加偏移；
- **二分查找定位**：从 scrollTop 找到对应索引时，由于高度不均匀，使用二分搜索在已缓存的位置数组中查找；未测量部分回退到估算；
- **滚动锚定修正**：测量后总高度变化，需要保持当前可视项的位置不跳动，可在测量前后比较并补偿 `scrollTop`；
- **ResizeObserver**：监听项尺寸变化（例如图片加载完成后高度变化），更新缓存并重新渲染。

简化的不定高核心数据结构：

```js
const measured = new Map();          // index -> 真实高度
const estimated = 80;                // 预估高度
const positions = [];                // { index, top, height, bottom }

function getHeight(i) {
  return measured.get(i) ?? estimated;
}

function initPositions(len) {
  let top = 0;
  for (let i = 0; i < len; i++) {
    const h = getHeight(i);
    positions[i] = { index: i, top, height: h, bottom: top + h };
    top += h;
  }
}

function findStartIndex(scrollTop) {
  let lo = 0, hi = positions.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const p = positions[mid];
    if (p.bottom < scrollTop) lo = mid + 1;
    else if (p.top > scrollTop) hi = mid - 1;
    else return mid;
  }
  return lo;
}

function measureItem(index, node) {
  const h = node.getBoundingClientRect().height;
  if (Math.abs(h - positions[index].height) < 0.5) return;
  measured.set(index, h);
  // 重新计算该 index 之后的所有位置
  for (let i = index; i < positions.length; i++) {
    const prev = positions[i - 1];
    positions[i].top = prev ? prev.bottom : 0;
    positions[i].height = getHeight(i);
    positions[i].bottom = positions[i].top + positions[i].height;
  }
  spacer.style.height = positions[positions.length - 1].bottom + 'px';
}
```

在 React/Vue 中，项挂载后通过 ref 拿到 DOM，注册 `ResizeObserver` 来测量并更新缓存。这也是 `react-window` 的 `VariableSizeList`、`vue-virtual-scroller` 的 `DynamicScroller` 以及 TanStack Virtual 的 `measureElement` 所采用的思路。

**4. overscan 与白屏**

- overscan 太小，快速滚动（滚轮、拖动滚动条、键盘 PageDown）时新项还未渲染就会短暂白屏；
- 过大会渲染过多节点，抵消虚拟列表收益，通常 5~10 条或 1~2 屏；
- 部分库支持按像素而非条数设置 overscan。

**5. 常见坑点**

- **滚动位置跳变（Scroll Jump）**：不定高项测量后总高度变化，如果当前项高度增加，下面的内容会被推下去，视觉上像跳了一下。解决方法是测量时若被测量项位于当前视口之上，则将差值加到 `scrollTop`；现代浏览器也可使用 CSS `overflow-anchor: auto` 作为辅助。
- **初始白屏**：首次渲染时数据未到位或字体未加载，可使用骨架屏或预估高度占位。
- **搜索/定位跳转**：跳到第 N 条时，如果它的高度尚未测量，需要先按估值滚动，再在测量后修正；TanStack Virtual 提供 `scrollToIndex` 并支持 `align`。
- **两端加载（聊天记录）**：向上加载历史消息时，需要在数据 prepend 后保持当前可视项位置不变，记录第一个可见项的偏移并补偿。
- **可访问性**：虚拟列表只渲染部分 DOM，屏幕阅读器浏览顺序可能错乱，需要在容器上提供正确的 ARIA 角色与虚拟焦点管理。
- **横向虚拟列表**：原理相同，把 `scrollTop / height` 换成 `scrollLeft / width`。
- **网格虚拟列表**：需要按列数计算索引，可使用 `VariableSizeGrid` / `FixedSizeGrid`。

**6. 成熟库对比**

- **react-window**：轻量（~6KB），API 简洁，作者是 react-virtualized 的作者，推荐在新项目中使用；
- **react-virtualized**：功能最全（Table、Grid、Collection、Masonry），但体积较大；
- **@tanstack/react-virtual**：Headless，只提供核心计算，UI 完全自控，支持 React/Vue/Svelte/Solid 等；
- **vue-virtual-scroller**：Vue 生态成熟方案，支持 `RecycleScroller`（定高/不定高）和 `DynamicScroller`（自动测量）；
- **@tanstack/vue-virtual**：TanStack 的 Vue 版本，headless 风格；
- **原生场景**：数据量不是极大时，也可以直接使用 CSS `content-visibility: auto`，无需 JS 虚拟列表。

#### 19-4. 回答要点

- 虚拟列表解决的是海量 DOM 节点导致的挂载慢、内存高、布局重和滚动卡问题，本质是「窗口化」：只渲染可见区域 + overscan，DOM 数与数据量解耦。
- 固定高度实现的三个关键点：外层 `overflow:auto` 容器、高度为 `total * itemHeight` 的占位 spacer、绝对定位并通过 `translateY` 偏移的可见容器。
- 渲染时根据 `scrollTop`、`viewportHeight`、`itemHeight` 计算 `startIndex`、`endIndex`，再加上前后 overscan。
- 不定高场景使用「预估高度 + 测量缓存 + ResizeObserver + 二分查找」，测量后需要更新位置数组与总高度，并处理滚动锚定防止跳变。
- overscan 防止快速滚动白屏，通常 5~10 条；passive scroll + rAF 保证滚动流畅。
- 常见问题：动态内容加载后高度变化、向上/向下加载历史数据时保持位置、搜索跳转未测量项、可访问性、表格/网格/横向场景。
- 成熟库：react-window（轻量）、react-virtualized（功能全）、TanStack Virtual（headless 跨框架）、vue-virtual-scroller（Vue）；数据量中等时也可直接用 CSS `content-visibility: auto`。

#### 19-5. 回答模板

::: tip 回答模板

虚拟列表也叫窗口化技术，解决的是海量数据一次性渲染造成 DOM 节点过多、首次挂载慢、内存占用高以及滚动卡顿的问题。它的核心思路是：任何时刻用户只能看到视口内的十几条数据，那么就只渲染这些可见项，再加上少量缓冲区，DOM 节点数从 O(N) 降到 O(1)。

固定高度虚拟列表的实现由三部分组成：一个固定高度并设置 `overflow: auto` 的外层容器；一个高度等于「数据总数 × 单项高度」的占位元素，用来撑起滚动条；一个绝对定位的可见容器，里面只渲染当前区间的项。滚动时根据 `scrollTop`、容器高度和 `itemHeight` 计算出 `startIndex = floor(scrollTop / itemHeight)` 和 `endIndex = ceil((scrollTop + viewportHeight) / itemHeight)`，再各加几条 overscan，最后把可见容器通过 `translateY(startIndex * itemHeight)` 偏移到正确位置。scroll 事件使用 passive 监听，避免阻塞合成。

不定高虚拟列表会更复杂。常见方案是给每项一个预估高度先生成位置数组，项挂载后用 `getBoundingClientRect` 或 `ResizeObserver` 测量真实高度，写回缓存并重新计算之后所有项的 top/bottom，同时更新占位总高度。从 scrollTop 定位到索引时使用二分查找。这里最大的坑是测量后总高度变化会导致视觉跳动，需要做滚动锚定：如果被测量项在当前视口之上，就把高度差补偿到 `scrollTop`，保持用户当前看到的内容不动。动态图片加载、富文本展开、向上加载聊天记录也都需要类似处理。

工程上我会优先使用成熟库：React 用 react-window 或 TanStack Virtual，Vue 用 vue-virtual-scroller，需要跨框架或完全自定义 UI 时选 TanStack Virtual 的 headless 方案；react-virtualized 适合需要 Table、Masonry 等复杂场景。overscan 一般设 5~10 条防止快速滚动白屏，列表项配合 `contain` 和 `content-visibility` 进一步降低渲染开销。如果数据量只有几百到几千条，其实直接用 CSS `content-visibility: auto` 加 `contain-intrinsic-size` 就足够了，不需要引入虚拟列表。

:::

### 20. 首屏加载慢，如何排查和优化？

#### 20-1. 关键词

> - **Core Web Vitals（LCP / INP / CLS / TTFB / FCP）**
> - **Lighthouse / Performance / Network 面板**
> - **代码分割（code splitting）与动态 import**
> - **Tree Shaking 与 Bundle 分析**
> - **资源预加载（preload / prefetch / preconnect / dns-prefetch）**
> - **渲染阻塞资源（defer / async / critical CSS）**
> - **HTTP 缓存与压缩（Cache-Control / ETag / gzip / Brotli）**
> - **CDN 与 SSR / SSG**
> - **Service Worker / PWA**

#### 20-2. 考察点

::: info 考察点

- **测量与指标**：是否以数据驱动优化，能否说清 LCP、FCP、TTFB、CLS、INP 等指标的含义、目标值和测量方式。
- **排查思路**：能否系统使用 Lighthouse、Network、Performance、Profiler 面板定位瓶颈（资源体积、请求数、接口耗时、主线程长任务、渲染阻塞）。
- **资源优化**：是否掌握代码分割、Tree Shaking、懒加载、Bundle 分析、压缩、图片优化、HTTP 缓存、CDN 等手段。
- **关键渲染路径**：是否理解 preload/prefetch/preconnect、defer/async、critical CSS 内联等对首屏的影响。
- **架构与渲染**：是否了解 SSR/SSG 对 FCP/LCP 的帮助、Service Worker 二次访问加速、第三方脚本治理等进阶方案。

:::

#### 20-3. 知识点详解

首屏加载优化必须遵循「先测量、再定位、后优化、再回归」的流程，不能凭感觉改。一个常见误区是直接做图片懒加载、加 CDN，却忽略了真正的瓶颈是一个 2MB 的第三方脚本或一个 3 秒的接口。

**1. 建立指标体系：Core Web Vitals**

Google 定义的核心用户体验指标：

- **LCP（Largest Contentful Paint）**：最大内容绘制时间，衡量「主要内容何时出现」，目标 < 2.5s；
- **INP（Interaction to Next Paint）**：交互到下次绘制延迟，衡量响应性，2024 年取代 FID，目标 < 200ms；
- **CLS（Cumulative Layout Shift）**：累计布局偏移，目标 < 0.1；
- 附加指标：
  - **FCP（First Contentful Paint）**：首次内容绘制 < 1.8s；
  - **TTFB（Time to First Byte）**：首字节时间 < 800ms；
  - **TBT（Total Blocking Time）**：总阻塞时间 < 200ms（Lighthouse 实验室指标）；
  - **SI（Speed Index）**：速度指数 < 3.4s。

测量工具：

- **Lighthouse**：综合审计，给出性能分、机会列表和诊断；
- **Chrome DevTools**：
  - Network 面板查看资源瀑布流、排队时间、下载时间、是否命中缓存；
  - Performance 面板录制加载过程，分析长任务、渲染、绘制；
  - Performance Insights 面板提供更结构化的加载阶段；
  - Rendering 面板查看布局偏移区域；
- **web-vitals 库 + RUM**：在真实用户环境上报 LCP/INP/CLS，关注 P75 而非平均值；
- **CrUX 报告 / PageSpeed Insights**：查看真实用户的字段数据。

```js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function send(metric) {
  navigator.sendBeacon('/analytics', JSON.stringify(metric));
}
onLCP(send);
onINP(send);
onCLS(send);
onFCP(send);
onTTFB(send);
```

**2. 排查常见原因**

按出现频率，首屏慢通常由以下原因造成：

- **JavaScript 包过大**：未做拆分、引入整个 UI 库或 Moment.js 等重型依赖；
- **渲染阻塞资源**：`<head>` 中同步加载的 JS 和 CSS 阻塞首屏渲染；
- **接口慢**：首屏依赖多个串行接口，或接口在服务端耗时长；
- **图片未优化**：首屏 Banner 几 MB、未使用现代格式、未做响应式；
- **无缓存或缓存策略差**：每次访问都重新下载静态资源；
- **请求数过多**：未做合并、未利用 HTTP/2，小文件请求成百上千；
- **第三方脚本**：统计、客服、广告、A/B 测试脚本在主线程长任务；
- **服务器响应慢**：TTFB 高，需排查后端、数据库、网络；
- **字体阻塞**：Web Font 未做 font-display 处理，出现 FOIT/FOUT 与布局偏移。

**3. 代码分割与懒加载**

按路由拆分是收益最高的手段，首屏只下载当前路由所需代码：

```js
// Vue Router
const routes = [
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  }
];

// React Router
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('./views/Dashboard'));

<Route
  path="/dashboard"
  element={
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  }
/>;
```

组件级懒加载用于非首屏或折叠线以下的重型组件：

```js
const HeavyChart = defineAsyncComponent(() => import('../components/HeavyChart.vue'));
```

在 Vite/Webpack 中，动态 `import()` 会自动产生独立 chunk；通过魔法注释可给 chunk 命名或合并。

**4. Tree Shaking 与依赖治理**

- 使用 ES Module，确保构建工具能做 Tree Shaking；
- 引入组件库时使用按需引入（`babel-plugin-import` 或 ESM 版本），避免 `import _ from 'lodash'` 整包引入；
- 用 `date-fns`、`dayjs` 替代 `moment.js`；
- 用 `import { throttle } from 'lodash-es'` 替代 `import _ from 'lodash'`；
- 定期做依赖审计，移除未使用的包。

**5. Bundle 分析**

- Webpack：`webpack-bundle-analyzer`；
- Vite/Rollup：`rollup-plugin-visualizer`；

```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'stats.html'
    })
  ]
};
```

关注最大的几个 chunk，判断是业务代码、第三方依赖还是误打包的源图/字体。

**6. 资源提示与关键渲染路径**

- **preload**：提前发现首屏关键资源（字体、LCP 图片、关键 CSS/JS）：

```html
<link rel="preload" as="font" type="font/woff2" href="/font.woff2" crossorigin />
<link rel="preload" as="image" href="/hero.avif" imagesrcset="/hero-400.avif 400w,/hero-1200.avif 1200w" imagesizes="100vw" fetchpriority="high" />
```

- **prefetch**：预取未来导航可能用到的资源（低优先级）：

```html
<link rel="prefetch" as="script" href="/js/dashboard.js" />
```

- **preconnect / dns-prefetch**：提前完成第三方域名的 DNS、TCP、TLS：

```html
<link rel="preconnect" href="https://cdn.example.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

- **defer / async**：非关键 JS 不要阻塞解析：

```html
<script src="/app.js" defer></script>
<script src="https://third-party.com/tracker.js" async></script>
```

`defer` 按顺序执行，在 DOMContentLoaded 前完成；`async` 下载完即执行，顺序不保证，适合无依赖的第三方脚本。

- **critical CSS 内联**：把首屏用到的关键 CSS 内联到 `<head>`（一般 < 14KB），其余 CSS 异步加载：

```html
<style>
  /* critical CSS: header, hero, layout above fold */
</style>
<link rel="preload" as="style" href="/non-critical.css" onload="this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/non-critical.css" /></noscript>
```

Vite 可使用 `vite-plugin-critical` 自动提取。

**7. 压缩与缓存**

- 开启 **Brotli**（优于 gzip 15%~20%），老浏览器回退 gzip：

```nginx
gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
brotli on;
brotli_types text/css application/javascript application/json image/svg+xml;
```

- 静态资源使用内容哈希文件名，并配置长期缓存：

```http
Cache-Control: public, max-age=31536000, immutable
```

- HTML 使用协商缓存：

```http
Cache-Control: no-cache
ETag: "abc123"
```

- Service Worker 做二次访问缓存，支持离线：

```js
// sw.js（简化版）
const CACHE = 'v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/app.js', '/style.css'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

可使用 Workbox 自动生成预缓存与运行时缓存策略。

**8. 图片、字体与第三方脚本**

- 图片按上一题的方式处理：WebP/AVIF、srcset/sizes、懒加载、preload LCP 图、设置尺寸避免 CLS；
- 字体使用 `font-display: swap`，并 preload 关键字体，避免 FOIT：

```css
@font-face {
  font-family: 'Inter';
  src: url('/inter.woff2') format('woff2');
  font-display: swap;
}
```

- 第三方脚本治理：
  - 统计、广告、客服等使用 `async` 或延迟到 `requestIdleCallback` 加载；
  - 评估是否必须，删除不再使用的脚本；
  - 使用 Tag Manager 统一管理并按需触发；
  - 通过 `<link rel="preconnect">` 提前建连；
  - 必要时用 Web Worker 或部分加载（如只引入分析库的轻量版本）。

**9. 网络与服务端**

- 静态资源上 **CDN**，利用边缘节点降低 RTT；
- 启用 HTTP/2 或 HTTP/3，多路复用、头部压缩；
- 开启 TLS 1.3、OCSP Stapling；
- 接口合并/BFF 聚合，减少首屏前的串行请求；
- 慢接口加缓存（Redis、CDN 缓存）、优化数据库与索引；
- 渲染模式：
  - **SPA + 代码分割**：适合交互重的后台系统；
  - **SSR（Nuxt/Next）**：服务端直出 HTML，显著改善 FCP/LCP，但增加服务器成本；
  - **SSG（VitePress/Astro/Nuxt generate/Next static）**：构建时生成静态 HTML，首屏最快、可直接走 CDN，适合内容型站点；
  - **流式 SSR + Selective Hydration**：在 React 18/Vue 3 中可以更快发字节并按需水合。

**10. 优化前后验证**

- 本地用 Lighthouse 跑前后对比，注意在隐身模式、限速（Fast 4G / 4x CPU）下模拟移动端；
- 合并报告关注 LCP、TBT、SI、首屏资源体积、请求数；
- 上线后通过 web-vitals 监控真实用户 P75，建立告警；
- 每次发版做 Bundle 体积守卫（如 size-limit、bundlesize），防止回退。

#### 20-4. 回答要点

- 先测量再优化：用 Lighthouse、Network、Performance 面板和 web-vitals 拿到 LCP、FCP、TTFB、CLS、INP、TBT 等指标，定位真正瓶颈。
- 资源体积：路由级代码分割 + 动态 import；Tree Shaking 与按需引入；用 rollup-plugin-visualizer / webpack-bundle-analyzer 找出大 chunk；替换 moment 等重型依赖。
- 关键渲染路径：非关键 JS 用 defer/async；关键 CSS 内联，其余异步加载；preload LCP 图片、关键字体；preconnect/dns-prefetch 第三方域名。
- 网络：CDN + HTTP/2/3；Brotli/gzip 压缩；静态资源内容哈希 + `Cache-Control: immutable`；HTML 用 ETag 协商缓存；Service Worker 加速二次访问。
- 内容：图片按 WebP/AVIF + srcset + 懒加载 + preload LCP + 宽高防 CLS；字体 `font-display: swap`；接口合并、缓存、并行化。
- 渲染：内容型站点优先 SSG（VitePress/Astro），需要 SEO 和动态数据时用 SSR；React 18/Vue 3 可用流式渲染与选择性水合。
- 第三方：删除无用脚本，async/延迟加载，preconnect 建连，必要时放到 Worker 或通过 Tag Manager 按需触发。
- 长期治理：上线后用 RUM 上报 web-vitals，关注 P75；CI 中加 Bundle 体积门禁，每次发版做 Lighthouse 回归。

#### 20-5. 回答模板

::: tip 回答模板

首屏加载慢我会先建立指标，再定位瓶颈，最后有针对性地优化，并形成长期监控。

首先是测量。用 Lighthouse 在 Fast 4G + 4x CPU 限速下跑一次实验室数据，关注 LCP、FCP、TTFB、TBT、CLS、SI；同时用 Chrome DevTools 的 Network 面板看资源瀑布流和体积，用 Performance 面板看主线程长任务和渲染阶段；线上通过 web-vitals 库采集真实用户的 P75 数据，重点是 LCP、INP、CLS 和 TTFB，避免只看平均值。

定位到瓶颈后按层优化：

第一层是 JS 体积。按路由做代码分割，首屏只加载当前路由 chunk：Vue/React 使用 `() => import()` 和 `React.lazy`；组件级重型组件（图表、富文本）也做异步加载。配合 Tree Shaking、组件库按需引入、用 dayjs 替换 moment 等手段减少体积，并通过 webpack-bundle-analyzer 或 rollup-plugin-visualizer 找出最大的几个 chunk 逐一治理。

第二层是关键渲染路径。非关键脚本加 `defer` 或 `async`，第三方统计/客服脚本延迟到 `requestIdleCallback` 加载；把首屏 critical CSS 内联到 `<head>`（约 14KB 以内），其余 CSS 用 preload + onload 异步加载；LCP 图片和关键字体用 `<link rel="preload">` 提前发现；对第三方域名用 `preconnect` 和 `dns-prefetch` 建连。

第三层是网络和缓存。静态资源全部上 CDN，启用 HTTP/2 或 HTTP/3 与 TLS 1.3；Brotli 优先、gzip 兜底；JS/CSS/图片/字体使用内容哈希文件名并设置 `Cache-Control: public, max-age=31536000, immutable`，HTML 走 ETag 协商缓存；二次访问通过 Service Worker（Workbox）做预缓存和运行时缓存。

第四层是内容和接口。图片使用 WebP/AVIF、srcset/sizes 响应式、懒加载，并 preload 首屏 LCP 图、设置 width/height 避免 CLS；字体使用 `font-display: swap`；首屏接口通过 BFF 聚合或并行请求，慢接口加 Redis/CDN 缓存并优化数据库。

第五层是渲染架构。内容型站点直接用 SSG（VitePress、Astro、Nuxt generate），首屏 HTML 直接走 CDN；需要 SEO 与动态数据时使用 SSR，React 18/Vue 3 可结合流式渲染与选择性水合，进一步提前 FCP/LCP。

最后做长期治理：CI 中用 size-limit 卡住 Bundle 体积，发版前自动跑 Lighthouse 并对比基线；线上通过 RUM 监控 web-vitals 的 P75 并设置告警；每次大版本做一次完整的性能回归，避免优化被后续迭代悄悄抵消。

:::

## 线上排查与监控

### 21. 线上白屏如何排查？

#### 21-1. 关键词

> - **白屏排查**
> - **错误监控**
> - **Source Map**
> - **CDN 缓存**
> - **SPA 路由**

#### 21-2. 考察点

::: info 考察点

- **问题分类能力**：能否将白屏原因划分为 JS 错误、资源加载失败、路由问题、环境兼容、网络/CDN、服务端错误等类别，避免盲查。
- **系统化排查思路**：是否具备从控制台、网络面板、HTML 源码、复现环境、监控平台、CDN 版本、路由配置等多维度逐层定位的方法论。
- **线上工具使用**：是否熟悉 Sentry/FrontJS、BrowserStack、curl、DevTools 等工具在排查中的作用，以及 Source Map 反解压缩代码的能力。
- **预防与治理**：能否提出错误边界、灰度发布、健康检查、chunk 加载失败自动刷新、兜底错误页等长效方案。

:::

#### 21-3. 知识点详解

线上白屏通常不是单一原因造成的，需要建立一套从现象到根因的排查路径。

**1. 白屏原因分类**

- **JS 执行错误**：某个 chunk 存在语法错误、运行时异常、未捕获的 Promise rejection，导致根组件未挂载。
- **资源加载失败**：JS/CSS/字体返回 404、被 CDN 缓存为旧版本、CSP 拦截、跨域脚本错误（Script error）。
- **路由/SPA 问题**：history 模式下服务端未配置 fallback，直接访问深层路由返回 404；base 路径配置错误；新发布后旧页面懒加载 chunk 已被删除导致 `Loading chunk failed`。
- **环境与浏览器兼容**：缺少 polyfill 导致旧浏览器报错；特定机型/系统/WebView 内核不支持新语法；扩展插件注入脚本冲突。
- **网络与 CDN**：CDN 节点缓存不一致（部分节点仍是旧版本 HTML、部分已是新 hash 资源）；DNS 污染；运营商劫持；弱网下关键资源加载超时。
- **服务端错误**：SSR 场景下服务端渲染抛错返回空 HTML；接口 5xx 导致前端关键数据缺失进入异常分支。
- **其他**：死循环导致页面假死、内存溢出崩溃、根挂载节点 `#app` 被其他逻辑清空、CSP 策略误拦截。

**2. 系统化排查步骤**

第一步，查看控制台错误。打开 DevTools Console，关注红色报错。对于压缩代码，需要上传 Source Map 到监控平台或本地借助 source-map 反解：

```js
// 典型的 chunk 加载失败
Loading chunk 12 failed.
(error: https://cdn.example.com/static/js/12.abc123.js)
```

第二步，检查 Network 面板。筛选 JS/CSS，确认是否有 404/5xx/CORS 错误；查看关键接口是否 200 且返回数据正常；检查响应头是否包含 `Content-Security-Policy` 拦截了资源。

第三步，确认 HTML 是否正常返回。右键查看网页源代码，或使用 curl：

```bash
curl -I https://example.com/some/route
curl https://example.com/some/route -o index.html
```

如果 HTML 本身为空或返回 404，问题在服务端/网关；如果 HTML 正常但页面空白，问题在前端资源或执行阶段。

第四步，精准复现。通过监控平台获取用户的浏览器版本、操作系统、设备型号、网络环境、地域、用户 ID 等标签，使用 BrowserStack 或真机复现。注意区分登录态/未登录态、灰度人群、A/B 测试分组、权限差异。

第五步，查看错误监控平台。在 Sentry/FrontJS 中按 `release`、`browser`、`route` 分组，观察白屏时间点前后是否有错误率尖刺：

```text
Sentry Issue: ChunkLoadError
  -- First seen: 2026-08-12 10:12
  -- Events: 12,843
  -- Release: v2.8.3
  -- Browsers: Chrome 120+, Safari on iOS 17
```

第六步，检查 CDN 与版本一致性。发布后是否存在 HTML 引用新 hash 但 CDN 尚未回源、或旧 HTML 引用已删除旧 hash 的情况。可对比多节点响应：

```bash
dig example.com
for ip in $(dig +short example.com); do curl -s -I http://$ip/ | grep ETag; done
```

第七步，检查路由与懒加载。SPA history 模式需服务端将所有路由 fallback 到 `index.html`；新发布后旧会话加载已失效 chunk 时，应有版本检查与自动刷新逻辑。

**3. 常见具体原因清单**

- 某个 chunk 中存在未被测试覆盖的语法错误（如可选链在旧构建目标下未转译）。
- 缺少 `core-js` polyfill，在低版本浏览器中 `Promise.allSettled is not a function`。
- CSP 策略升级后未加入新的第三方域名。
- 根组件内存在无限递归渲染或死循环。
- 页面内存占用过高导致移动端 WebView 被系统杀掉。
- `el: '#app'` 与 HTML 中的挂载节点 id 不一致。
- 第三方脚本（广告、埋点）阻塞或篡改了 DOM。

**4. 预防机制**

- React 使用 Error Boundary、Vue 使用 `errorCaptured`/全局 `app.config.errorHandler` 捕获渲染错误，展示兜底 UI。
- 错误监控平台集成 Source Map，开启 release 追踪和告警。
- 发布前健康检查：HTML 200、关键 chunk 200、关键接口 200。
- 灰度/金丝雀发布，按用户比例放量，出现异常快速回滚。
- chunk 加载失败时检测版本并提示刷新：

```js
router.onError((error) => {
  if (/Loading chunk \d+ failed/.test(error.message)) {
    if (confirm('平台已升级，点击确定刷新页面')) {
      window.location.reload();
    }
  }
});
```

- 离线包/资源版本校验，避免 HTML 与 chunk hash 错配。
- 配置合理的 CSP，并在 Report-Only 模式下先观察。
- 关键页面提供骨架屏和错误兜底，避免完全白屏。

#### 21-4. 回答要点

- 按 JS 错误、资源加载、路由、环境兼容、网络/CDN、服务端六大类对因分类。
- 排查顺序：控制台报错 -> Network 面板 -> HTML 源码/curl -> 精准复现 -> 监控平台 -> CDN 版本 -> 路由与懒加载。
- 利用 Source Map 反解压缩代码，利用 Sentry 按 release/browser 聚合定位。
- 常见根因：chunk 加载失败、polyfill 缺失、CSP 拦截、CDN 缓存不一致、SPA fallback 缺失、死循环/内存崩溃。
- 预防手段：错误边界、Source Map 监控、健康检查、灰度发布、chunk 失败自动刷新、兜底错误页。

#### 21-5. 回答模板

::: tip 回答模板

线上白屏我通常按"分类—定位—复现—根治"四步走。

先分类。白屏原因可以归为六类：JS 执行错误（语法错误、运行时异常、未捕获 Promise）、资源加载失败（404、CORS、CSP 拦截）、SPA 路由问题（history fallback、base 路径、懒加载 chunk 失效）、浏览器/环境兼容（polyfill 缺失、WebView 差异）、网络/CDN（缓存不一致、DNS 劫持、弱网超时）、服务端错误（SSR 抛错、接口 5xx）。另外还要警惕死循环、内存崩溃、挂载节点不匹配等特殊情况。

再定位。第一步看 Console，拿到报错栈，配合 Source Map 反解压缩代码；第二步看 Network，筛 JS/CSS 和关键接口，确认是否有 404/5xx/CORS/被 CSP 拦截；第三步用 curl 或查看源码确认 HTML 是否正常返回，HTML 正常就说明是前端执行阶段的问题；第四步在 Sentry/FrontJS 等监控平台按 release、浏览器、路由聚合，看错误率尖刺和影响面；第五步检查 CDN 多节点缓存是否一致、新旧 hash 是否错配；第六步检查路由 fallback、base 以及发布后懒加载 chunk 是否还存在。

然后复现。根据监控拿到的浏览器版本、OS、设备、登录态、灰度分组、A/B 分组，用 BrowserStack 或真机在相同条件下复现。我遇到过几次典型案例：发布后旧页面加载已删除的 chunk 报 `Loading chunk failed`、低版本 iOS 缺少 polyfill、CSP 升级拦截了新埋点域名、SSR 容器内接口超时返回空 HTML。

最后根治。常规手段包括：React/Vue 的错误边界和全局错误处理器展示兜底 UI；Sentry 集成 Source Map 并配置错误率告警；发布前对 HTML、关键 chunk、关键接口做健康检查；灰度/金丝雀发布并保留快速回滚能力；在路由 chunk 加载失败时检测版本并提示用户刷新；离线包和资源版本校验避免 HTML 与 chunk hash 错配；关键页加骨架屏，即使局部异常也不会整页白屏。

:::

### 22. 如何设计一个前端监控系统？

#### 22-1. 关键词

> - **前端监控 SDK**
> - **Web Vitals**
> - **错误捕获**
> - **数据上报**
> - **RUM**

#### 22-2. 考察点

::: info 考察点

- **监控数据分类**：是否清晰区分错误监控、性能监控、行为监控三类数据及各自指标。
- **SDK 采集能力**：是否掌握 `window.onerror`、`unhandledrejection`、重写 fetch/XHR、PerformanceObserver、sendBeacon 等底层采集手段。
- **上报链路设计**：是否理解批量发送、sendBeacon、图片打点、采样率、降级等上报策略。
- **后端架构认知**：是否了解 Kafka 接入、ClickHouse/ES 存储、聚合告警、Source Map 反解的整体链路。
- **行业视野**：是否了解 RUM 与合成监控的差异、隐私合规要求，以及 Sentry、Datadog RUM、ARMS、Fundebug 等开源/商用方案。

:::

#### 22-3. 知识点详解

一个完整的前端监控系统由"采集 SDK + 上报通道 + 数据处理后端 + 存储查询 + 告警看板"组成，核心目标是回答三个问题：有没有错、慢不慢、用户怎么用的。

**1. 数据分类与指标**

错误监控：

- JS 运行时错误：`window.onerror` / `window.addEventListener('error')`。
- Promise 未捕获异常：`unhandledrejection` 事件。
- 资源加载错误：在捕获阶段监听 `error`，区分 `event.target instanceof HTMLScriptElement` 等。
- 接口错误：劫持 `fetch` 和 `XMLHttpRequest`，记录 url、method、status、duration、请求/响应摘要。
- 框架错误：React Error Boundary、Vue `app.config.errorHandler`、小程序 `onError`/`onUnhandledRejection`。
- 白屏检测：定时探测根节点是否为空、关键元素是否渲染。

性能监控（基于 Web Vitals）：

- LCP（Largest Contentful Paint）：最大内容绘制，衡量加载体验，目标 < 2.5s。
- INP（Interaction to Next Paint）：交互响应，取代 FID，目标 < 200ms。
- CLS（Cumulative Layout Shift）：视觉稳定性，目标 < 0.1。
- FCP（First Contentful Paint）、TTFB（Time to First Byte）。
- 通过 `PerformanceObserver` 获取：

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      report('lcp', { value: entry.startTime, url: entry.url });
    }
    if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
      report('cls', { value: entry.value });
    }
    if (entry.entryType === 'longtask') {
      report('longtask', { duration: entry.duration });
    }
  }
});
observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'longtask', 'paint', 'navigation'] });
```

- 还可通过 `performance.timing` / `PerformanceNavigationTiming` 计算 DNS、TCP、TTFB、DOM Ready、Load 等阶段耗时；`PerformanceResourceTiming` 分析静态资源耗时。

行为监控：

- PV/UV、页面停留时长、路由切换（SPA 需要劫持 history.pushState/replaceState 和 hashchange）。
- 点击事件、曝光埋点、点击热图（记录坐标和元素选择器）。
- 自定义业务事件（下单、支付失败等）。
- 用户旅程（session 串联，复现用户操作链路）。

**2. SDK 架构设计**

SDK 一般分为以下模块：

```text
┌─────────────────────────────────────────────┐
│                  Monitor SDK                 │
├──────────────┬──────────────┬───────────────┤
│  ErrorPlugin │ PerfPlugin   │ BehaviorPlugin│
│ - onerror    │ - Web Vitals │ - PV/UV       │
│ - rejection  │ - NavTiming  │ - route       │
│ - resource   │ - Resource   │ - click       │
│ - api hook   │ - Long Task  │ - custom      │
├──────────────┴──────────────┴───────────────┤
│           Context (user/session/release)      │
├──────────────────────────────────────────────┤
│            Reporter (batch/beacon/img)        │
└──────────────────────────────────────────────┘
```

错误采集示例：

```js
// JS 错误
window.addEventListener('error', (e) => {
  if (e.target && e.target !== window) {
    // 资源加载错误
    report('resourceError', { src: e.target.src || e.target.href });
  } else {
    report('jsError', { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno, stack: e.error?.stack });
  }
}, true);

// Promise 未捕获
window.addEventListener('unhandledrejection', (e) => {
  report('promiseError', { reason: String(e.reason), stack: e.reason?.stack });
});
```

接口劫持示例：

```js
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const start = performance.now();
  try {
    const res = await originalFetch.apply(this, args);
    report('api', { url: args[0], status: res.status, duration: performance.now() - start });
    return res;
  } catch (err) {
    report('apiError', { url: args[0], error: String(err), duration: performance.now() - start });
    throw err;
  }
};
```

**3. 数据上报策略**

- **批量发送**：在内存中维护队列，达到数量阈值或时间阈值再发送，减少请求数。
- **sendBeacon**：页面卸载时使用 `navigator.sendBeacon`，浏览器保证异步发出，不阻塞跳转：

```js
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/report', JSON.stringify(queue));
  }
});
```

- **图片打点降级**：使用 `new Image().src = '/report.gif?d=...'` 兼容老旧浏览器和跨域场景。
- **采样率**：性能日志、行为日志量巨大，按用户/session 采样（如 10%），错误日志通常全量。
- **压缩与分片**：大 payload 使用 `sendBeacon` + Blob，或分片上报。
- **重试与离线缓存**：失败数据写入 IndexedDB，下次启动补发。

上报数据统一携带上下文：`userId`、`sessionId`、`release`、`environment`、`browser`、`os`、`device`、`network`、`page`、`route`、`sdkVersion`。

**4. 后端架构**

典型链路：

```text
SDK -> 接入层(Nginx) -> Kafka -> Flink/Spark 实时聚合
                              -> ClickHouse / Elasticsearch 存储
                              -> 告警服务(错误率、性能阈值)
                              -> Source Map 反解服务
                              -> 可视化看板(Grafana/Kibana/自研)
```

- 接入层负责接收上报、做初步校验和限流。
- Kafka 削峰填谷，应对大流量。
- 实时流计算统计错误率、P50/P95/P99、各维度 Top N。
- ClickHouse 适合高性能时序和聚合查询；ES 适合全文检索错误栈和自由筛选。
- 构建时上传 Source Map，后端根据 release + 文件名反解压缩栈。
- 告警规则包括：错误率突增、新增 Issue、LCP/INP 超阈值、接口失败率超阈值。

**5. RUM 与合成监控**

- RUM（Real User Monitoring）采集真实用户数据，反映真实分布，但依赖用户访问。
- 合成监控（Synthetic）从受控节点定期拨测，适合竞品对比、发布前巡检、弱网模拟，两者互补。

**6. 隐私与合规**

- 过滤 PII：请求体、响应体、input 值、URL query 中的手机号/身份证/token 需脱敏。
- 遵守 GDPR/个人信息保护法，提供埋点开关和用户同意机制。
- 敏感接口默认不采集 body，可配置采样。

**7. 开源与商用方案**

- Sentry：错误监控事实标准，自建友好，支持 Source Map 和 release。
- Datadog RUM：错误、性能、用户行为一体化，SaaS 为主。
- 阿里云 ARMS、腾讯云前端性能监控 RUM：国内接入方便。
- Fundebug、FrontJS：国内老牌错误监控。
- 自建核心：SDK 自研 + Kafka + ClickHouse + Grafana 是常见组合。

#### 22-4. 回答要点

- 数据分三类：错误（JS/Promise/资源/接口/框架）、性能（LCP/INP/CLS/FCP/TTFB/Long Task/Navigation/Resource Timing）、行为（PV/UV、路由、点击、自定义事件）。
- SDK 采集：`onerror`、`unhandledrejection`、捕获阶段 error、重写 fetch/XHR、PerformanceObserver、框架错误钩子、白屏检测。
- 上报策略：批量队列、sendBeacon、图片打点降级、采样率、IndexedDB 失败重试、统一上下文。
- 后端链路：接入层 -> Kafka -> Flink 聚合 -> ClickHouse/ES 存储 -> Source Map 反解 -> 告警与看板。
- RUM 与合成监控互补；注意 PII 脱敏和 GDPR；可选型 Sentry、Datadog RUM、ARMS、Fundebug 或自研。

#### 22-5. 回答模板

::: tip 回答模板

设计前端监控系统，我会从数据分类、SDK 采集、上报通道、后端链路、治理与合规几个层面来展开。

数据分三类。错误监控包括 JS 运行时错误、未捕获 Promise、资源加载错误、接口错误以及框架错误（React Error Boundary、Vue errorHandler）。性能监控以 Web Vitals 为核心，包括 LCP、INP、CLS、FCP、TTFB，结合 Navigation Timing、Resource Timing 和 Long Task，刻画加载、交互和稳定性。行为监控包括 PV/UV、SPA 路由切换、点击热图、曝光埋点、自定义业务事件和用户旅程。

SDK 采用插件化架构，分为 ErrorPlugin、PerfPlugin、BehaviorPlugin、Context、Reporter。错误通过 window.onerror、unhandledrejection、捕获阶段 error 事件采集；接口通过劫持 fetch 和 XMLHttpRequest 记录 url、status、耗时；性能通过 PerformanceObserver 监听 largest-contentful-paint、layout-shift、longtask、paint、navigation 等 entry；SPA 路由通过劫持 pushState/replaceState 和 hashchange 记录。每条日志统一附带上 userId、sessionId、release、browser、os、device、network、route 等上下文。

上报考虑可靠性和成本。SDK 内部维护队列，按数量和时间阈值批量发送；页面 hidden 时用 navigator.sendBeacon 保证卸载前不丢数据；老旧浏览器用 1x1 图片打点降级；性能和行为日志按用户采样，错误日志全量；失败数据写入 IndexedDB 下次补发；大 payload 做压缩和分片。

后端典型链路是：SDK -> Nginx -> Kafka -> Flink 实时聚合 -> ClickHouse/Elasticsearch -> 告警与看板。ClickHouse 适合时序指标聚合，ES 适合错误栈全文检索。构建时上传 Source Map，后端根据 release 反解压缩栈。告警覆盖错误率突增、新增 Issue、LCP/INP 超阈值、接口失败率等场景。

此外要区分 RUM 和合成监控：RUM 反映真实用户分布，合成监控用于发布前巡检、竞品对比和弱网模拟，两者互补。合规上需要对请求体、URL 参数、表单输入做 PII 脱敏，提供埋点开关并遵守 GDPR/个保法。选型上，自建可以 Sentry 为基础二次开发，或使用 SDK + Kafka + ClickHouse + Grafana 的自研组合；商用可选 Datadog RUM、阿里云 ARMS、腾讯云 RUM、Fundebug 等。

:::


## 跨端与架构

### 23. 微信小程序性能优化有哪些手段？

#### 23-1. 关键词

> - **setData 优化**
> - **分包加载**
> - **图片与节点**
> - **懒加载**
> - **Skyline**

#### 23-2. 考察点

::: info 考察点

- **渲染层与逻辑层通信**：是否理解小程序双线程模型，setData 是跨线程通信，性能开销在序列化和 JS-Native 桥。
- **setData 最佳实践**：能否从数据量、频率、字段粒度、data 与 properties 区分等方面给出优化方案。
- **包体积与启动**：是否熟悉分包、独立分包、preloadRule、按需注入、组件懒加载对启动速度的影响。
- **运行时优化**：图片优化、WXML 节点数、虚拟列表、长任务拆分、组件通信、缓存与骨架屏等手段。
- **新渲染引擎与工具**：是否了解 Skyline 与 WebView 的差异，以及开发者工具 Performance/Audits 面板的使用。

:::

#### 23-3. 知识点详解

微信小程序运行在逻辑层（AppService）和渲染层（WebView 或 Skyline）分离的架构中，两个线程通过 Native 桥通信，所有性能问题几乎都围绕"通信成本"和"渲染成本"展开。

**1. setData 优化**

setData 是最频繁的性能瓶颈，因为数据需要从逻辑层序列化后跨线程传到渲染层：

- 控制数据量，只传界面实际用到的字段，不要把整个接口响应塞进 data。
- 控制频率，避免连续多次 setData，合并为一次：

```js
// 不推荐
this.setData({ a: 1 });
this.setData({ b: 2 });

// 推荐
this.setData({ a: 1, b: 2 });
```

- 使用数据路径精准更新，避免传输大对象：

```js
this.setData({
  'list[0].name': 'new name',
  'user.profile.avatar': url
});
```

- 不在 data 中放渲染无关的大对象（如长列表原始数据、富文本 HTML、函数引用）。
- 区分 data 和 properties：properties 用于父组件传入，data 用于组件内部状态；父组件更新 properties 也会触发子组件 rerender，因此要避免传递频繁变化的大块数据。
- 用户交互等高频场景（滚动、输入）做节流/防抖：

```js
onPageScroll(e) {
  this.throttle(() => {
    this.setData({ scrollTop: e.scrollTop });
  }, 100)();
}
```

- 纯数据字段（`pureDataPattern`）配置不参与渲染的数据，避免序列化到视图层：

```json
{
  "pureDataPattern": "^_",
  "data": {
    "_rawList": [],
    "displayList": []
  }
}
```

**2. 分包加载**

主包应只包含启动必需页面，其余业务放入分包：

```json
{
  "pages": [
    "pages/index/index",
    "pages/home/home"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": ["pages/cart/cart", "pages/order/order"]
    },
    {
      "root": "packageB",
      "name": "shared",
      "pages": ["pages/detail/detail"],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "wifi",
      "packages": ["packageA"]
    }
  }
}
```

- 普通分包：进入分包页面时下载，可被主包和其他分包共享。
- 独立分包：`independent: true`，可不依赖主包直接运行，适合活动页、广告落地页。
- preloadRule：在某页面空闲时预下载分包，显著降低跳转等待，但要控制在 wifi 网络下。
- 分包异步化：`requireAsync` 在分包内引用其他分包的 JS/组件，进一步解耦。
- 控制总包体积不超过 20MB（主包不超过 2MB，单个分包/普通分包总和不超过 20MB），超出需考虑资源上 CDN。

**3. 生命周期与启动优化**

- onLoad 只做一次性初始化（拿参数、发起首屏请求），onReady 才操作节点；onShow 每次显示都会触发，避免重复重活。
- 非首屏逻辑延迟执行，使用 `setTimeout` 或 `wx.nextTick` 分片：

```js
onLoad() {
  this.fetchHomeData();
  setTimeout(() => this.initReport(), 0);
  setTimeout(() => this.prefetchCart(), 500);
}
```

- 开启按需注入（`lazyCodeLoading: "requiredComponents"`），启动时仅注入当前页面所需组件代码。
- 组件按需注入，合理使用组件占位（`componentPlaceholder`）。

**4. 图片优化**

- 使用 WebP 格式（微信内支持良好），体积可降 30%-50%。
- 图片走 CDN，按显示尺寸裁剪/压缩（使用 `?imageView2/2/w/400` 等参数）。
- 开启 `lazy-load`，长列表图片只在进入视口附近加载：

```html
<image lazy-load src="{{item.cover}}" mode="aspectFill" />
```

- 选择正确的 mode（aspectFill/aspectFit/widthFix），避免布局抖动。
- 大背景图、雪碧图、base64 小图标权衡使用，避免大图 inline 进 WXSS。

**5. WXML 节点与长列表**

- 避免深层嵌套，控制节点总数在 1000 以内、层级不超过 30 层。
- 长列表使用官方 `recycle-view` 或第三方虚拟列表组件，只渲染可视区域：

```html
<recycle-view batch="{{batchSetRecycleData}}" id="recycleId">
  <recycle-item wx:for="{{recycleList}}" wx:key="id">
    <view>{{item.title}}</view>
  </recycle-item>
</recycle-view>
```

- 避免在 `wx:for` 中使用复杂表达式和大对象，提前在 JS 中处理。
- key 必须稳定且唯一，避免使用 index 作为 key 导致全量重渲染。

**6. 避免阻塞 JS 初始化**

- 把非关键任务（埋点、预拉取、初始化第三方 SDK）拆到 `setTimeout(fn, 0)` 或空闲时执行。
- 大数据计算使用 Web Worker（Worker 能力）或放到后端。
- 同步存储读取 `wx.getStorageSync` 只在启动时读取必要字段，其余使用异步 API。

**7. 组件通信与状态管理**

- 父子通信用 properties 和 triggerEvent，避免通过 globalData 或 getCurrentPages 强耦合。
- 跨组件、跨页面共享状态使用 mobx-miniprogram、redux 等成熟方案，不要滥用 getApp().globalData 触发频繁刷新。
- observers 监听字段时避免在其中再次 setData 被监听字段，防止循环。
- 事件总线要在 onUnload 中解绑，避免内存泄漏。

**8. 组件与资源懒加载**

- 页面配置中 `usingComponents` 只注册当前页面用到的组件；不再使用的及时移除。
- 对低频组件使用组件占位：

```json
{
  "usingComponents": {
    "heavy-comp": "/components/heavy/index"
  },
  "componentPlaceholder": {
    "heavy-comp": "view"
  }
}
```

- 视频、地图等重量级原生组件延迟渲染，用户进入视口再挂载。

**9. 感知性能与缓存**

- 首屏加骨架屏，减少白屏体感。
- 数据缓存到 Storage：`wx.setStorage`，下次进入先展示缓存再静默刷新（stale-while-revalidate）。
- 利用 storage 缓存配置、字典、用户信息等低变更数据。
- 合理使用 mixins/behaviors 复用逻辑，避免重复代码。

**10. Skyline 渲染引擎**

- Skyline 是小程序新一代渲染引擎，使用原生渲染组件，相比 WebView 在长列表、动画、手势等方面性能显著更好。
- 通过 `renderer: "skyline"` 开启，配合 `<scroll-view type="custom">`、worklet 动画、grid 组件等。
- 迁移需注意 CSS 支持差异，部分 WebView 特性不兼容，建议新页面优先使用 Skyline，旧页面渐进迁移。

**11. 性能度量与审计**

- 使用开发者工具 Performance 面板录制启动、交互过程，查看 setData 调用次数、耗时、长任务。
- Audits/体验评分面板给出启动、渲染、网络、JS 等维度评分和具体建议。
- 真实性能通过 `wx.getPerformance()` 采集，或使用小程序后台的性能看板、`wx.reportPerformance` 自定义指标。

#### 23-4. 回答要点

- setData 是跨线程通信：减小数据量、降低频率、使用数据路径、纯数据字段、高频场景节流。
- 分包：主包精简、普通分包、独立分包、preloadRule 预下载、分包异步化、控制包体积。
- 启动：onLoad/onReady 区分、非关键逻辑延迟、按需注入 lazyCodeLoading、组件占位。
- 图片与节点：WebP、CDN 裁剪、lazy-load、正确 mode；控制节点数和层级，长列表用 recycle-view 虚拟列表。
- 其他：组件通信规范、重量级组件懒挂载、骨架屏、Storage 缓存、Skyline 渲染引擎、Performance/Audits 度量。

#### 23-5. 回答模板

::: tip 回答模板

小程序性能优化我会从"通信、包体积、渲染、启动、感知、度量"六个维度来做。

第一，setData 是逻辑层到渲染层的跨线程通信，是最常见的瓶颈。优化原则是"少、小、准、稳"：减少调用频率，把多次 setData 合并；只传界面需要的字段，不把大对象塞进 data；用数据路径精准更新数组项或嵌套字段；高频事件做节流防抖；渲染无关的大字段用 pureDataPattern 标为纯数据字段；同时区分 data 和 properties，避免父组件把频繁变化的大块数据传给子组件。

第二，包体积和分包。主包只保留启动必需页面，业务模块放普通分包；活动页、落地页用独立分包，不依赖主包；通过 preloadRule 在 wifi 下预下载即将进入的分包；使用分包异步化和 requireAsync 解耦；总包控制在 20MB 内、主包 2MB 内，超大资源走 CDN。

第三，启动优化。onLoad 只做首屏初始化，onReady 再操作节点；非关键逻辑（埋点、预拉取、第三方 SDK）用 setTimeout 分片延迟；开启 lazyCodeLoading: requiredComponents 按需注入；低频组件用 componentPlaceholder 占位；视频、地图等重组件用户进入视口再挂载。

第四，渲染优化。图片用 WebP、CDN 裁剪、lazy-load、合理的 mode；控制 WXML 节点数在 1000 以内、层级不超过 30 层；长列表使用官方 recycle-view 或虚拟列表，key 保持稳定唯一；避免在 wx:for 中写复杂表达式。

第五，运行时和感知优化。大数据计算用 Worker 或下沉后端；同步 Storage 只读必要字段；父子组件用 properties/triggerEvent，跨页面状态用 mobx-miniprogram 等方案，observers 中避免循环 setData，事件总线在 onUnload 解绑；首屏加骨架屏，数据用 Storage 做 stale-while-revalidate 缓存；公共逻辑用 behaviors 复用。

第六，新渲染引擎和度量。新页面优先使用 Skyline 渲染引擎，配合 scroll-view type=custom、worklet 动画获得类原生性能，旧页面渐进迁移并注意 CSS 兼容差异。性能度量上，用开发者工具 Performance 面板分析 setData 次数和长任务，用 Audits 面板看体验评分，线上通过 wx.getPerformance、wx.reportPerformance 以及小程序后台性能看板监控真实用户数据。

:::

### 24. 单点登录（SSO）的原理是什么？如何实现自动登录？

#### 24-1. 关键词

> - **SSO**
> - **CAS/OAuth2/OIDC**
> - **TGC 与 Ticket**
> - **JWT 与 Refresh Token**
> - **静默续期**

#### 24-2. 考察点

::: info 考察点

- **SSO 核心流程**：是否讲清认证中心、业务系统、TGC Cookie、Ticket 颁发与校验的完整闭环。
- **协议对比**：是否了解 CAS、SAML 2.0、OAuth 2.0/OIDC 的定位与差异，以及 OAuth 授权模式。
- **Token 与 Session**：是否理解 JWT 与 Session Cookie 的取舍，以及 httpOnly Cookie 和 localStorage 的 XSS/CSRF 权衡。
- **自动登录与续期**：是否能说明 refresh token、隐藏 iframe 静默续期、postMessage、PKCE 的实现要点。
- **安全与登出**：是否关注 state 防 CSRF、SameSite、XSS 防护、token 吊销、前后端通道登出。

:::

#### 24-3. 知识点详解

单点登录（Single Sign-On，SSO）指在多个相互信任的业务系统中，用户只需在统一认证中心登录一次，便可免登录访问其他系统。

**1. SSO 核心角色与流程（以 CAS 为例）**

角色：

- User Agent：浏览器。
- Client：业务系统 A、B。
- SSO Server：统一认证中心，维护全局会话。
- TGC（Ticket Granting Cookie）：SSO Server 种下的全局会话 Cookie。
- ST（Service Ticket）：一次性票据，用于业务系统向 SSO 校验用户身份。

首次访问系统 A：

```text
1. 用户访问 appA.com，未登录
2. appA 重定向到 sso.com/login?service=https://appA.com/callback
3. SSO 发现没有 TGC，展示登录页
4. 用户输入账号密码，SSO 验证通过
5. SSO 种下 TGC Cookie（写在 sso.com 域下，httpOnly、Secure），并生成 ST
6. 重定向回 appA：https://appA.com/callback?ticket=ST-xxx
7. appA 后端用 ST 向 SSO 发起服务端校验：/serviceValidate?ticket=...&service=...
8. SSO 返回用户身份（用户名、属性），appA 创建自己的会话（种自己域下的 session cookie）
```

随后访问系统 B：

```text
1. 用户访问 appB.com，未登录
2. appB 重定向到 sso.com/login?service=...
3. 浏览器自动携带 sso.com 域下的 TGC
4. SSO 识别 TGC 有效，无需再次登录，直接签发 ST
5. 重定向回 appB 并完成同样的 ST 校验流程
```

关键点：TGC 只在 SSO 域流转，业务系统之间永远不共享密码；ST 一次性、短时效，且与 service 绑定，防止被截获重用。

**2. 主流协议对比**

- **CAS（Central Authentication Service）**：院校和传统企业常用，流程简单，专注于认证。
- **SAML 2.0**：基于 XML，企业级 IdP/SP 模式广泛使用（如 Azure AD、Okta），适合 Web SSO。
- **OAuth 2.0**：授权框架，本身不定义认证，用于让第三方应用在用户授权下访问资源。
- **OIDC（OpenID Connect）**：在 OAuth 2.0 之上加了身份层，返回 ID Token（JWT），是现代移动端、SPA、SSO 的事实标准。

OAuth 2.0 常见授权模式：

- Authorization Code：服务端 Web 应用最安全，配合 PKCE 也用于公共客户端（SPA、App）。
- Client Credentials：机器对机器，无用户参与。
- Refresh Token：用于获取新的 access token。
- 已不推荐 Implicit 和 Password 模式。

**3. JWT 与 Session Cookie**

- Session Cookie：服务端保存会话状态，Cookie 只存 sessionId，可随时吊销，但需要共享 session 存储或粘性会话。
- JWT：无状态、可跨域、自带声明；但一旦签发难以吊销，需配合短有效期 + 黑名单/版本号。
- 现代 SSO 通常采用 OIDC：ID Token（JWT）表明身份，Access Token 调接口，Refresh Token 续期。

**4. Token 存储与安全**

| 存储方式 | 优点 | 风险 |
|---------|------|------|
| httpOnly + Secure + SameSite Cookie | JS 读不到，抗 XSS 窃取；适合 access token | 需防 CSRF，配合 state/SameSite |
| localStorage | 实现简单，跨子域共享方便 | 任何 JS 可读，XSS 即可窃取 |
| 内存（JS 变量） | 刷新即丢，最安全 | 刷新页面需重新获取，依赖静默续期 |

最佳实践：refresh token 放 httpOnly Cookie 且严格 SameSite；access token 短期有效可放内存；前端不直接接触 refresh token。

**5. 自动登录与静默续期**

自动登录不是"记住密码"，而是通过长效凭证换取短期会话：

- 登录成功后 SSO 下发长效 refresh token（如 7-30 天），access token 短时效（如 15 分钟）。
- access token 过期前，前端通过隐藏 iframe 或后端代理调用 SSO 的 token 端点，用 refresh token 换新 access token，对用户无感知：

```js
// 隐藏 iframe 静默续期
function silentRefresh() {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://sso.com/silent-refresh?client_id=xxx&redirect_uri=https://appA.com/silent-callback';
    iframe.style.display = 'none';
    window.addEventListener('message', (e) => {
      if (e.origin !== 'https://sso.com') return;
      if (e.data.type === 'token') resolve(e.data.accessToken);
      else reject(e.data.error);
    });
    document.body.appendChild(iframe);
  });
}
```

在 silent-callback 页面中，SSO 通过 postMessage 把新 token 回传给父页面：

```js
const token = new URLSearchParams(location.hash.slice(1)).get('access_token');
parent.postMessage({ type: 'token', accessToken: token }, 'https://appA.com');
```

- 跨域 iframe 需要 SSO 允许第三方 Cookie（SameSite=None; Secure），现代浏览器对第三方 Cookie 限制越来越严，可改用后端 BFF 代理 refresh。
- SPA 和 App 等公共客户端必须使用 PKCE：

```text
code_verifier = 随机字符串
code_challenge = BASE64URL(SHA256(code_verifier))
授权请求带 code_challenge，换取 token 时带 code_verifier，防止授权码被截获
```

- "记住我"本质是在登录时延长 refresh token 有效期或单独下发持久化凭证（持久 Cookie、设备绑定 token）。

**6. 安全防护**

- CSRF：授权请求带 state 参数，回调时校验；Cookie 设置 SameSite=Lax/Strict。
- XSS：对用户输入和富文本做转义，开启 CSP，避免 access token 落 localStorage。
- Token 吊销：维护 refresh token 黑名单或版本号，用户改密、登出、异常设备时吊销。
- HTTPS 全站强制，Cookie 加 Secure。
- 重定向 URI 白名单严格校验，防止开放重定向。

**7. 单点登出**

- 前端通道登出（Front-Channel）：SSO 通过 iframe 通知各业务系统登出回调 URL。
- 后端通道登出（Back-Channel）：SSO 服务端调用各业务系统的 logout API，更可靠。
- 客户端需清除本地会话、access token、内存状态。

#### 24-4. 回答要点

- SSO 角色：用户、业务系统、SSO 认证中心；TGC 是 SSO 域全局会话，ST 是一次性票据。
- 流程：未登录访问业务系统 -> 跳 SSO 登录 -> 种 TGC、签发 ST -> 回跳业务系统 -> 业务系统后端校验 ST 建会话；再次访问其他系统时 SSO 凭 TGC 直接签发 ST。
- 协议：CAS 简单直接，SAML 2.0 企业级 XML，OIDC 是 OAuth 2.0 + 身份层，现代首选；OAuth 授权码 + PKCE 适用于 SPA/App。
- Token 存储：refresh token 放 httpOnly/Secure/SameSite Cookie，access token 可放内存；JWT 无状态但难吊销。
- 自动登录：长效 refresh token + access token 过期前静默续期（隐藏 iframe + postMessage 或 BFF 代理），公共客户端用 PKCE。
- 安全：state 防 CSRF、SameSite、CSP 防 XSS、redirect_uri 白名单、token 吊销、前后端通道登出。

#### 24-5. 回答模板

::: tip 回答模板

单点登录的核心是引入一个统一的认证中心 SSO Server，所有业务系统都信任它。用户登录后，SSO 在自己域下种下一个全局会话 Cookie（TGC），并为每次跳转颁发一次性、短时效的票据（Ticket/ST）。

以 CAS 流程为例：用户访问系统 A 时，A 发现未登录就 302 到 SSO，SSO 没有 TGC 就展示登录页，登录成功后种下 TGC 并签发 ST，回跳到 A 的回调地址；A 的后端拿 ST 到 SSO 做服务端校验，拿到用户身份后在自己域下创建局部会话。当用户访问系统 B 时，B 同样跳 SSO，但浏览器会自动带上 TGC，SSO 识别已登录就直接签发 ST，不再要求输入密码，从而实现"一次登录、处处访问"。

协议层面，传统 Web 常用 CAS 和 SAML 2.0；现代应用更多使用 OIDC，它在 OAuth 2.0 之上加了身份层，返回 ID Token（JWT）、Access Token 和 Refresh Token。OAuth 2.0 的授权码模式最安全，SPA 和 App 等无法保密 client_secret 的公共客户端必须配合 PKCE，防止授权码被截获。

Token 存储要权衡 XSS 和 CSRF。推荐 refresh token 放在 httpOnly、Secure、SameSite 的 Cookie 中，JS 读不到；access token 时效短，可以放内存；避免把长效 token 存进 localStorage。JWT 的优点是无状态、便于跨域，但一旦签发难吊销，所以要配合短有效期、黑名单或 token 版本号。

自动登录的本质是用长效凭证换短期会话。用户勾选"记住我"时签发长效 refresh token；access token 过期前，前端通过隐藏 iframe 调用 SSO 的静默续期端点，SSO 在 iframe 内通过 postMessage 回传新 token，整个过程用户无感知。由于现代浏览器对第三方 Cookie 限制趋严，更稳妥的方案是通过业务后端 BFF 代理 refresh 请求。移动端和 SPA 必须使用 PKCE：授权时带 code_challenge，换 token 时带 code_verifier。

安全上需要注意：state 参数和 SameSite Cookie 防 CSRF；CSP、输入转义防 XSS；redirect_uri 严格白名单防开放重定向；refresh token 支持吊销，用户改密或异常登录时失效；全站 HTTPS。登出则通过前端通道 iframe 通知或后端通道回调，让各业务系统清除局部会话和 token。

:::

### 25. 大文件分片上传是如何实现的？

#### 25-1. 关键词

> - **File.slice**
> - **文件 Hash**
> - **并发控制**
> - **断点续传**
> - **秒传**

#### 25-2. 考察点

::: info 考察点

- **分片原理**：是否理解为什么分片（突破大小限制、失败可续、并发提速、进度可控）以及 File/Blob.slice 的使用。
- **Hash 与秒传**：是否掌握使用 SparkMD5 结合 Web Worker 计算文件 hash，以及通过 hash 做秒传和已上传分片校验。
- **上传流程**：能否讲清"hash -> 校验 -> 并发上传 -> 合并 -> 完整性校验"的完整链路。
- **工程化能力**：是否处理暂停/续传、失败重试、进度聚合、并发数控制、孤儿分片清理。
- **生态认知**：是否了解 tus 协议、Resumable.js、WebUploader，以及 S3 multipart upload 等业界方案。

:::

#### 25-3. 知识点详解

大文件分片上传的核心思路是：把一个文件切成多个小块分别上传，服务端接收完毕后合并成原文件，从而获得断点续传、并发上传、失败重传等能力。

**1. 为什么要分片**

- 突破服务器/网关的请求体大小限制（Nginx `client_max_body_size`、应用服务器限制）。
- 弱网下失败只需重传失败分片，而不是整个 GB 级文件。
- 可以并发上传多个分片，充分利用带宽。
- 进度条更精细，用户体验更好。
- 支持暂停后继续、关闭浏览器后续传。

**2. 文件切片**

HTML5 File API 中，File 继承自 Blob，可以用 `slice(start, end)` 切出 Blob 分片：

```js
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

function createChunks(file, chunkSize = CHUNK_SIZE) {
  const chunks = [];
  let start = 0;
  while (start < file.size) {
    chunks.push(file.slice(start, start + chunkSize));
    start += chunkSize;
  }
  return chunks;
}
```

每个 Blob 分片可以直接通过 FormData 上传，附带文件 hash、分片序号、总分片数等元信息。

**3. 文件 Hash 计算**

文件 hash 用于服务端识别文件，实现秒传和断点续传。通常用 MD5（足够标识，且性能好），通过 SparkMD5 增量计算。为避免大文件 hash 阻塞 UI，需要放进 Web Worker，并按 chunk 增量喂给 SparkMD5：

主线程：

```js
function calculateHash(file) {
  return new Promise((resolve) => {
    const worker = new Worker('/hash.worker.js');
    worker.postMessage({ file, chunkSize: CHUNK_SIZE });
    worker.onmessage = (e) => {
      if (e.data.progress) {
        updateProgress(e.data.progress);
      } else {
        resolve(e.data.hash);
        worker.terminate();
      }
    };
  });
}
```

hash.worker.js：

```js
importScripts('https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js');

self.onmessage = async (e) => {
  const { file, chunkSize } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  const chunks = Math.ceil(file.size / chunkSize);
  let start = 0;
  for (let i = 0; i < chunks; i++) {
    const buf = await file.slice(start, start + chunkSize).arrayBuffer();
    spark.append(buf);
    start += chunkSize;
    self.postMessage({ progress: ((i + 1) / chunks) * 100 });
  }
  self.postMessage({ hash: spark.end() });
};
```

对于超大文件，可以采用"采样 hash"加速：取首块、尾块和中间若干块计算 hash，虽然不能严格保证唯一，但在大多数业务场景下足够，工程上常和文件大小、修改时间组合使用。

**4. 完整上传流程**

```text
1. 切片：把文件切成 N 个 Blob
2. 计算文件 hash（Web Worker + SparkMD5）
3. 调用 verify 接口：传入 hash，服务端返回
   - alreadyUploaded: true（整文件已存在）-> 秒传
   - uploadedChunks: [0,1,2,...]（已上传分片索引）-> 断点续传
4. 并发上传未上传的分片（控制并发数）
5. 全部上传完成后调用 merge 接口，服务端按序号合并分片
6. 服务端校验合并后文件的 hash/大小，返回最终 URL
```

verify 接口示例：

```js
async function verify(hash, fileName) {
  const res = await fetch('/upload/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash, fileName })
  });
  return res.json(); // { shouldUpload, uploadedChunks }
}
```

**5. 并发控制（Promise 池）**

不能一次性把所有分片同时发出去，需要限制并发数：

```js
async function uploadChunks(chunks, hash, uploadedChunks, concurrency = 4) {
  const tasks = chunks
    .map((chunk, index) => ({ chunk, index }))
    .filter(({ index }) => !uploadedChunks.includes(index))
    .map(({ chunk, index }) => () => uploadChunk(chunk, index, hash));

  return runPool(tasks, concurrency);
}

function runPool(tasks, concurrency) {
  return new Promise((resolve, reject) => {
    let next = 0;
    let done = 0;
    const result = [];
    function run() {
      if (next >= tasks.length) {
        if (done === tasks.length) resolve(result);
        return;
      }
      const current = next++;
      tasks[current]()
        .then((res) => {
          result[current] = res;
          done++;
          run();
        })
        .catch(reject);
    }
    for (let i = 0; i < Math.min(concurrency, tasks.length); i++) run();
  });
}

function uploadChunk(chunk, index, hash) {
  const form = new FormData();
  form.append('chunk', chunk);
  form.append('hash', hash);
  form.append('index', index);
  return fetch('/upload/chunk', { method: 'POST', body: form });
}
```

**6. 进度聚合**

每个分片有自己的进度，需要聚合成总进度：

```js
function createProgress(total) {
  const loaded = new Array(total).fill(0);
  return (index, e) => {
    loaded[index] = e.loaded;
    const sum = loaded.reduce((a, b) => a + b, 0);
    const percent = Math.floor((sum / totalSize) * 100);
    updateBar(percent);
  };
}
```

如果用 axios/XHR，可在 `onUploadProgress` 中按分片更新。

**7. 暂停、续传与重试**

- 暂停：调用 XHR 的 `abort()` 或 AbortController 取消进行中的请求，记录已完成分片。
- 续传：再次上传前先调用 verify 接口，拿到已上传分片列表，跳过它们。
- 重试：单个分片失败时按指数退避重试若干次，全部失败再抛出。

```js
async function uploadChunkWithRetry(chunk, index, hash, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await uploadChunk(chunk, index, hash);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2 ** i * 500));
    }
  }
}
```

**8. 秒传**

verify 接口判断服务端是否已存在相同 hash 的完整文件，若存在则直接返回文件 URL，跳过上传。这在云盘、素材库等场景非常常见。

**9. 服务端职责**

- 接收分片：按 hash 建临时目录，文件名使用分片序号，保证顺序。
- 校验：检查分片大小、hash（可选，每个分片带 crc32/md5）。
- 合并：所有分片到齐后按序号顺序读流写入目标文件。
- 完整性校验：合并后计算整体 MD5 与前端 hash 比对。
- 清理：定时任务清理未完成的孤儿分片目录（如超过 24 小时）。
- 幂等：相同 hash + index 的分片重复上传应直接返回成功。

Nginx 调优：调整 `client_max_body_size`、`proxy_request_buffering off` 等，避免大分片被缓冲。

**10. 业界方案**

- tus 协议：开源的标准断点续传协议，基于 HTTP，有各语言服务端和 JS 客户端（tus-js-client）。
- Resumable.js：老牌分片上传库，基于 HTML5 File API。
- WebUploader：百度 FEX 出品，支持分片、并发、MD5、预览，国内项目常用。
- 阿里云 OSS / 腾讯云 COS / AWS S3 Multipart Upload：对象存储原生支持分片，前端直接拿到分片签名 URL 直传，服务端只做签名和合并触发，可显著降低业务服务器带宽压力。
- S3 Multipart Upload 流程：initiateMultipartUpload -> uploadPart（返回 ETag）-> completeMultipartUpload（提交 ETag 列表）-> 服务端合并；支持 listParts 查询已上传分片、abortMultipartUpload 清理。

#### 25-4. 回答要点

- 分片目的：突破大小限制、失败重传代价小、并发提速、暂停续传、进度精细。
- 核心 API：`File.slice/Blob.slice` 切出 Blob，通过 FormData 上传。
- Hash：SparkMD5 增量计算，放在 Web Worker 中避免阻塞 UI；超大文件可采样 hash。
- 流程：切片 -> 算 hash -> verify 接口判断秒传/已上传分片 -> 并发上传缺失分片 -> merge 合并 -> 完整性校验。
- 工程要点：Promise 池控制并发、XHR/AbortController 暂停、verify 续传、失败指数退避重试、进度按分片加权聚合。
- 服务端：分片临时存储、按序合并、hash 校验、孤儿分片清理、幂等。
- 生态：tus、Resumable.js、WebUploader，以及 S3/OSS/COS 的 Multipart Upload 直传方案。

#### 25-5. 回答模板

::: tip 回答模板

大文件分片上传的核心是"切片—标识—校验—并发—合并"五步。

为什么要分片？一是突破 Nginx 和应用服务器的请求体大小限制；二是失败时只重传出问题的分片，不用整个 GB 级文件重来；三是可以并发上传提速；四是支持暂停、断点续传和精细化进度。

切片用 HTML5 File API 的 `file.slice(start, end)`，把 File 切成若干 Blob，通常每片 5MB。每个 Blob 通过 FormData 上传，附带文件 hash、分片序号、总分片数等信息。

文件标识用 MD5。工程上使用 SparkMD5 增量计算：在 Web Worker 中按 chunk 读取 ArrayBuffer 并 append 到 SparkMD5，最后 end 得到完整 hash。为了不阻塞主线程，必须放 Worker；对超大文件还可以采用采样 hash（首尾和中间若干块）配合文件大小、修改时间，在保证业务可接受的前提下加速。

完整流程是：前端切片 -> Worker 计算 hash -> 调用 verify 接口把 hash 发给服务端。服务端返回三种情况：如果整文件已存在，直接返回 URL，实现秒传；如果存在部分分片，返回已上传索引列表，前端跳过它们做断点续传；否则全量上传。未上传的分片通过一个 Promise 池做并发控制（例如并发 4），每个分片失败按指数退避重试；进度条按各分片 loaded 求和除以总大小聚合。全部完成后调用 merge 接口，服务端按分片序号顺序读流合并，再计算整体 MD5 与前端 hash 比对，确认无误后返回文件 URL。

暂停通过 XHR 的 abort 或 fetch 的 AbortController 取消进行中的请求；恢复时再次调用 verify 拿已上传列表即可。服务端需要按 hash 建临时目录存放分片，合并完成后清理，并通过定时任务清理长时间未完成的孤儿分片；接口要幂等，相同 hash 和 index 重复上传直接成功。

实际项目中通常不会从零造轮子。标准协议可以用 tus（tus-js-client + 各语言服务端）；老项目常用 Resumable.js 或百度 WebUploader；云场景下更推荐阿里云 OSS、腾讯云 COS、AWS S3 的 Multipart Upload：业务服务器只负责签发上传 URL 和触发合并，前端直接把分片传到对象存储，既省带宽又省去自己维护合并和存储的成本，流程是 initiate -> uploadPart（拿 ETag）-> complete（带 ETag 列表），并支持 listParts 和 abortMultipartUpload 做续传和清理。

:::

## AI 工程实践

### 26. 如何对 AI 生成的组件/代码做质量把控？

#### 26-1. 关键词

> - **质量门禁**、**静态检查**、**自动化测试**、**人工评审**、**运行时兜底**、**提示词约束**、**LLM-as-judge**、**幻觉依赖检测**

#### 26-2. 考察点

::: info 考察点

- **分层质量门禁意识**：能否将质量把控拆解为写前（提示词约束）、写后（静态检查 + 测试）、合入前（人工评审）、上线后（运行时监控）多个层级
- **前端工程化落地能力**：是否熟悉 ESLint/Prettier/TS/Stylelint/Vitest/Playwright/Chromatic 等工具链并能组合使用
- **风险识别能力**：能否识别 AI 代码的典型风险——幻觉 API、不存在的依赖包、可访问性缺失、安全漏洞、样式不一致
- **AI 辅助工作流认知**：是否理解"AI 输出作为建议而非直接合入"的原则，是否了解 Copilot/Cursor 的评审流与强模型复审

:::

#### 26-3. 知识点详解

对 AI 生成代码的质量把控，本质上是一套"层层过滤、逐层收敛风险"的工程体系。不能依赖任何单一环节，而要把静态检查、自动化测试、人工评审、运行时兜底串成一条流水线，并在源头通过提示词降低方差。

**第一层：写前约束——提示词工程**

AI 输出的方差很大程度上取决于输入。在提示词中显式注入以下上下文，可以显著降低后续返工：

- 设计系统 Token（颜色、间距、字号、圆角、阴影变量名），禁止 AI 硬编码十六进制色值。
- 现有组件模式（目录结构、命名约定、Composition API/Options API 选型、`<script setup>` 规范）。
- 代码风格约定（导入顺序、文件命名 kebab-case/PascalCase、注释语言）。
- 明确的"负面清单"：不得使用已废弃 API、不得引入未在 lockfile 中出现的包、不得使用 `any`。

以 Cursor 为例，可以将这些规则写入 `.cursorrules`；在 Copilot Chat 中则通过自定义指令或仓库级 `copilot-instructions.md` 固定下来。

```md
// .cursorrules
- 使用 Vue 3 `<script setup lang="ts">`，禁止 Options API。
- 样式使用项目内 `@/styles/tokens.css` 暴露的 CSS 变量，禁止硬编码色值。
- 组件名使用 PascalCase，文件名与组件名一致。
- 引入第三方包前必须确认其已存在于 package.json 的 dependencies 中。
- 所有交互元素必须具备可聚焦状态与 aria-label。
```

**第二层：静态检查**

提交即触发，不通过不得进入下一步：

- `eslint --max-warnings 0`：配合 `@typescript-eslint`、`eslint-plugin-vue`、`eslint-plugin-vuejs-accessibility` 拦截可访问性与类型风格问题。
- `prettier --check`：格式统一，消除无意义 diff。
- `vue-tsc --noEmit`：完整的 TypeScript 类型检查，能抓出大量 AI 幻觉的属性名与参数类型。
- `stylelint`：CSS 变量使用、未知属性、废弃属性。
- 安全扫描：`npm audit`、Snyk、OSV-Scanner 检测已知漏洞依赖；同时用 `depcheck` 检查是否引入了未使用的新依赖。

针对 AI 幻觉依赖，建议加一道自定义脚本：解析新代码中的 `import` 语句，对 bare import 的包名与 `package.json`/lockfile 做比对，发现不存在直接 fail。

```ts
// scripts/check-imports.mjs
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const allowed = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
])

const changed = execSync('git diff --name-only --cached')
  .toString()
  .split('\n')
  .filter(f => /\.(ts|tsx|vue|js)$/.test(f))

for (const file of changed) {
  const src = readFileSync(file, 'utf8')
  const imports = [...src.matchAll(/from\s+['"]([^'"./@][^'"]*)['"]/g)]
  for (const [, mod] of imports) {
    const name = mod.startsWith('@') ? mod.split('/').slice(0, 2).join('/') : mod.split('/')[0]
    if (!allowed.has(name)) {
      console.error(`[import-check] ${file} 引入了未声明依赖: ${name}`)
      process.exit(1)
    }
  }
}
```

**第三层：自动化测试**

AI 最擅长写"看起来对"的代码，因此测试必须真正执行：

- 单元测试：使用 Vitest/Jest，AI 可以生成测试初稿，但必须人工评审断言是否真的覆盖了边界条件——AI 倾向于写"永远成立"的弱断言。
- 组件测试：Vue Test Utils 或 React Testing Library，围绕用户行为而非实现细节断言。
- 快照测试：对稳定的组件结构做 jest/vitest snapshot，但快照不是"写了就过"，需要在 PR 中人工核对 diff。
- 视觉回归：Chromatic（Storybook）或 Playwright `toHaveScreenshot` 对比像素差异，专门拦截 AI 生成样式与设计稿的偏差。
- E2E：Playwright/Cypress 覆盖关键路径（登录、下单、表单提交）。

一个实用做法是让 AI 在生成组件时同步生成测试，但在 CI 中强制要求覆盖率不下降，且关键分支必须有断言。

**第四层：人工评审**

AI 代码绝不能自动合入。PR 模板中应包含针对 AI 代码的检查清单：

- 是否存在幻觉 API 或不存在的属性？
- 是否遵循了设计 Token，没有硬编码？
- 交互元素是否具备键盘可达性、aria-label、焦点样式？
- 是否处理了 loading、empty、error 三种状态？
- 是否考虑了国际化（不拼接句子、使用 i18n key）？
- 是否存在性能反模式（大列表无虚拟化、watcher 死循环、未清理的定时器）？
- 提交信息是否准确描述了"AI 生成 + 人工修改"的范围？

工具层面，GitHub Copilot 的代码评审、Cursor 的 Review 快捷键，以及"强模型复审弱模型输出"的做法都值得采用：用 Claude Opus/GPT-4 级别的模型对 Sonnet/Haiku 或补全模型的产出做 LLM-as-judge，按可维护性、正确性、安全性打分并输出问题清单。

**第五层：运行时兜底**

即便通过以上全部门禁，线上仍需最后一道防线：

- 错误边界（Vue 的 `errorCaptured`、React 的 `ErrorBoundary`）隔离 AI 组件崩溃。
- Feature Flag 控制 AI 功能灰度，按用户百分比放量。
- 金丝雀发布与对比指标（错误率、LCP、交互延迟）。
- 前端监控（Sentry、自研性能埋点）捕获运行时异常与长任务。
- 对 AI 生成的动态配置或远程下发代码，使用沙箱（`iframe sandbox`、Web Worker、`Proxy` 沙箱）隔离执行。

**第六层：持续评估**

把每次 PR 中 AI 产出的典型问题沉淀成：

- 负面用例加入 ESLint 自定义规则或测试用例；
- 提示词中的新约束；
- 评审清单的新条目；
- LLM-as-judge 的评分 rubric。

这样质量把控不是一次性投入，而是随项目迭代不断收紧的闭环。

#### 26-4. 回答要点

- 分层思路：写前提示词约束、静态检查、自动化测试、人工评审、运行时兜底、持续评估。
- 静态检查要点：ESLint/Prettier/vue-tsc/Stylelint、安全扫描、自定义 import 校验抓幻觉依赖。
- 测试要点：AI 生成测试需人工审断言，视觉回归与 E2E 不可省。
- 人工评审：AI 输出是建议而非合入，清单覆盖可访问性、性能、i18n、状态完备性。
- 运行时：错误边界、Feature Flag、金丝雷、监控。
- 评估闭环：强模型复审、问题反哺提示词与规则。

#### 26-5. 回答模板

::: tip 回答模板

我会把 AI 代码的质量把控拆成六层。第一层是写前约束，通过 `.cursorrules`、`copilot-instructions.md` 把设计 Token、组件模式、命名规范、禁用项固化到提示词里，从源头降低方差。第二层是静态检查，在 pre-commit 和 CI 里跑 ESLint、Prettier、vue-tsc、Stylelint，再用 npm audit/Snyk 扫依赖漏洞，并加一道自定义脚本比对 import 与 lockfile，抓 AI 幻觉出来的不存在的包。第三层是自动化测试，Vitest 单测 + Vue Test Utils 组件测 + Playwright E2E，视觉回归用 Chromatic 或 Playwright 截图对比；AI 可以生成测试，但断言必须人工审，避免出现"恒真断言"。第四层是人工评审，AI 代码一律走 PR，清单覆盖幻觉 API、设计 Token、键盘可达性、loading/empty/error 三态、i18n 和性能反模式，并用更强的模型对 AI 产出做 LLM-as-judge 打分。第五层是运行时兜底，错误边界隔离、Feature Flag 灰度、金丝雀发布、Sentry 监控。第六层是持续评估，把每次出问题的 case 反哺成自定义 ESLint 规则、提示词新约束和评审清单条目，形成闭环。核心原则是：AI 输出只是建议，不能自动合入，更不能直接上线。

:::

### 27. AI 流式输出导致 UI 抖动/布局偏移（CLS），如何解决？

#### 27-1. 关键词

> - **流式输出**、**CLS（Cumulative Layout Shift）**、**布局偏移**、**min-height 预留**、**rAF 批量更新**、**CSS containment**、**content-visibility**、**虚拟滚动**、**滚动锚定**

#### 27-2. 考察点

::: info 考察点

- **问题根因分析**：能否解释流式 token 逐字到达导致容器高度持续变化、后续元素被反复推挤的机制
- **CSS 布局稳定性**：是否掌握 min-height、aspect-ratio、grid 轨道、contain、content-visibility 等稳定布局的手段
- **渲染性能优化**：是否懂得用 requestAnimationFrame 合批 token 更新，避免逐 token 触发重排重绘
- **复杂场景处理**：代码块、Markdown、长列表、滚动定位等场景下的针对性方案
- **用户体验判断**：是否知道"用户已上滚查看历史时不要强制滚到底部"这类细节

:::

#### 27-3. 知识点详解

大模型通常以 SSE 或 fetch stream 的方式逐 token 返回内容，前端每收到一个 token 就 `setState` 追加到当前消息中。如果直接渲染，容器高度会在几十到几百毫秒内连续变化，带来三类问题：CLS 升高、滚动条跳动、低端设备上的卡顿。

**根因**

1. 容器高度未预留，内容逐字增长导致后续节点 reflow。
2. 每个 token 触发一次组件重渲染，markdown 解析、代码高亮、DOM diff 全量重跑。
3. 滚动锚定策略粗暴——只要有新内容就强制 `scrollTop = scrollHeight`，覆盖了用户上滚查看历史的意图。
4. 代码块、图片、表格等异步元素尺寸未知，加载完成后再次偏移。

**方案一：预留空间**

为流式容器设置合理的 `min-height`，骨架屏尺寸尽量贴近最终内容。对包含图片/代码块的回答，可以基于预估行数估算高度：

```css
.ai-message--streaming {
  min-height: 120px;
  contain: layout style paint;
}

.ai-message__media {
  aspect-ratio: 16 / 9;
  background: var(--skeleton-bg);
}

.ai-message__code {
  /* 估算 12 行，每行 20px，加上内边距 */
  min-height: calc(12 * 20px + 32px);
}
```

骨架屏应与最终内容共用同一套宽度、间距、行高，避免"骨架到正文"自身也产生一次 CLS。

**方案二：稳定布局结构**

- 使用 CSS Grid 并显式定义 `grid-template-rows/columns`，避免 auto 轨道随内容反复计算。
- 头像、操作按钮等定宽元素使用固定宽高，不随文本变化。
- 流式期间禁用高度/宽度的过渡动画，避免动画与 reflow 叠加。

```css
.ai-message {
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-areas: 'avatar body' '. actions';
  gap: 12px;
}
.ai-message__avatar { grid-area: avatar; width: 40px; height: 40px; }
.ai-message__body { grid-area: body; min-width: 0; }
.ai-message__actions { grid-area: actions; }
```

**方案三：rAF 合批 token 更新**

不要每个 token 都触发一次 setState，而是把 token 写入缓冲区，在 `requestAnimationFrame` 回调中一次性刷新。这样一帧内最多更新一次 DOM，与浏览器渲染节奏对齐：

```ts
import { ref, onBeforeUnmount } from 'vue'

export function useStreamingBuffer(flush: (text: string) => void) {
  const buffer = ref('')
  let rafId: number | null = null
  let acc = ''

  const append = (chunk: string) => {
    acc += chunk
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      buffer.value = acc
      flush(acc)
      rafId = null
    })
  }

  const reset = () => {
    acc = ''
    buffer.value = ''
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = null
  }

  onBeforeUnmount(reset)

  return { buffer, append, reset }
}
```

对更长的流式内容，可以进一步做时间分片：每 50ms 或每累计 200 字符刷新一次，配合 `scheduler.postTask` 在长任务时让出主线程。

**方案四：CSS containment 与 content-visibility**

`contain: layout style paint` 告诉浏览器该子树的布局、样式、绘制不会影响外部，流式更新时 reflow 范围被限制在容器内部。对长对话中的历史消息，使用 `content-visibility: auto` 跳过屏外内容的渲染：

```css
.ai-message {
  contain: layout style paint;
}

.ai-message--archived {
  content-visibility: auto;
  /* 必须提供，否则屏外元素高度为 0，滚回来会跳动 */
  contain-intrinsic-size: 200px;
}
```

注意 `contain-intrinsic-size` 要给一个贴近真实的预估值，否则滚动条长度仍会跳。

**方案五：代码块与 Markdown 专项优化**

- 代码块：流式开始前就根据预估行数渲染行号槽位；语法高亮只对已完成的代码块做，当前正在输出的代码块使用纯文本，等流结束再高亮。
- Markdown：使用增量解析器（如 `markdown-it` 在流式消息上配合"脏区"标记），避免整段重新 parse。或者采取"先纯文本流式、流结束一次性渲染 markdown"的折中方案，用 `white-space: pre-wrap` 保留换行。
- 代码块折叠：超长代码默认折叠，避免一次占据过高空间。

```ts
// 流式期间：纯文本；流结束：再渲染 markdown + shiki
const displayText = computed(() =>
  isStreaming.value ? rawText.value : renderMarkdown(rawText.value),
)
```

**方案六：滚动锚定**

只在"用户本来就在底部"时才自动跟随，否则保留用户当前位置：

```ts
const listRef = ref<HTMLElement | null>(null)
let stickToBottom = true

const onScroll = () => {
  const el = listRef.value
  if (!el) return
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight
  stickToBottom = distance < 80
}

const scrollToBottomIfNeeded = () => {
  if (!stickToBottom) return
  const el = listRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: 'auto' })
}

watch(
  () => messages.value.length,
  () => requestAnimationFrame(scrollToBottomIfNeeded),
)
```

浏览器原生的 CSS `overflow-anchor: auto` 默认开启，但在复杂虚拟列表中会与手动滚动冲突，必要时显式管理。

**方案七：长列表虚拟化**

对话历史超过一定数量后，使用 `vue-virtual-scroller`、`@tanstack/vue-virtual` 或自研 windowing，只渲染可视区消息，从根本上降低流式更新波及的 DOM 规模。

**验证手段**

- Lighthouse / Web Vitals 实测 CLS，目标小于 0.1。
- Performance 面板录制流式过程，确认每次 commit 只对应一帧、无长任务。
- 在低端机或 CPU 4x slowdown 下复测滚动跟随与输入响应。

#### 27-4. 回答要点

- 根因：逐 token 更新导致容器高度持续变化、无预留空间、全量重渲染、粗暴滚动跟随。
- CSS：min-height、aspect-ratio、固定轨道 grid、contain、content-visibility + contain-intrinsic-size。
- 渲染：rAF 合批 token，必要时按时间/字符数分片，避免逐 token setState。
- 内容：代码块预估高度、流式期用纯文本、结束后再高亮和 markdown 渲染。
- 滚动：仅在用户处于底部时跟随，上滚查看历史时不打断。
- 长列表：虚拟化 + 屏外内容 content-visibility。
- 验证：Lighthouse CLS、Performance 面板、低端机降速测试。

#### 27-5. 回答模板

::: tip 回答模板

流式输出抖动的根因是 token 逐字到达、容器高度不断增长、后续节点被反复 reflow，再加上逐 token setState 造成全量重渲染。我会从五个方向解决。第一是预留空间，给流式容器设置 min-height，骨架屏尺寸贴近最终内容，图片用 aspect-ratio，代码块按预估行数给高度。第二是稳定布局，用显式 grid 轨道、固定宽高的头像和按钮，流式期间禁用尺寸过渡动画。第三是渲染合批，用 requestAnimationFrame 缓冲 token，一帧只 flush 一次；长内容再按 50ms 或 200 字符分片，必要时用 postTask 让出主线程。第四是 CSS 隔离，给消息容器加 contain: layout style paint，把 reflow 限制在子树内部；历史消息用 content-visibility: auto 并配 contain-intrinsic-size。第五是内容与滚动的专项处理：代码块先显示行号槽位、流式中用纯文本、流结束再做 shiki 高亮和 markdown 渲染；滚动只在用户原本就在底部时跟随，上滚查看历史时不打断；对话长了以后上虚拟列表。最后用 Lighthouse 看 CLS、Performance 面板看每帧 commit 情况，并在 CPU 降速下复测。

:::

### 28. 如何降低 AI 应用的 Token 消耗和成本？

#### 28-1. 关键词

> - **Token 成本**、**提示词压缩**、**模型路由**、**上下文管理**、**缓存与语义缓存**、**RAG**、**结构化输出**、**批量 API**、**用量监控**、**微调**

#### 28-2. 考察点

::: info 考察点

- **全链路成本意识**：能否从输入、模型、上下文、输出、调用方式、监控多个环节识别成本来源
- **工程化手段**：是否掌握模型路由、滑动窗口、摘要、RAG、缓存（普通缓存 + 语义缓存）、批量 API 等具体方案
- **取舍判断**：能否在成本、延迟、质量之间做权衡，而不是一味换小模型
- **前端职责边界**：是否清楚前端在消息裁剪、缓存命中、结果复用上能做什么
- **治理能力**：是否建立按功能/用户/模型维度的 token 统计与预算告警

:::

#### 28-3. 知识点详解

Token 成本由"输入 token + 输出 token"乘以单价决定，优化要同时压两端，并结合调用方式与缓存。下面按链路展开。

**一、提示词优化**

输入 token 往往是大头，尤其是带长上下文、多示例、工具描述的系统提示：

- 精简系统提示，去掉重复的指令、空洞的形容词（"请尽可能详细、专业、全面地……"）。
- few-shot 只在必要时使用，示例用最短的表达；能通过指令说清的就不要塞示例。
- 用结构化格式（YAML/JSON 字段）替代大段自然语言描述工具和约束。
- 对长对话做摘要：把超过 N 轮的历史压缩成一段摘要，而不是全量回传。
- 工具描述、JSON Schema 复用，避免每次重复定义。

```ts
// 反例：冗长且重复
const SYSTEM_PROMPT = `你是一个专业的、经验丰富的、乐于助人的前端代码助手，请你仔细分析用户的问题，
尽可能详细地给出答案，并且要保证代码质量，注意代码要符合 TypeScript 严格模式，同时……`

// 正例：结构化、精简
const SYSTEM_PROMPT = [
  '角色：资深前端工程师。',
  '输出：仅输出 TS 代码 + 简要说明。',
  '约束：严格 TS、无 any、使用 `<script setup lang="ts">`。',
].join('\n')
```

**二、模型选择与路由**

不是所有请求都需要旗舰模型：

- 简单任务（改写、分类、关键词抽取、格式转换）走小模型，如 Haiku、mini 系列、开源 7B/14B。
- 复杂推理、长文生成、代码架构设计才走旗舰模型。
- 用一个轻量分类器先判断请求复杂度，再路由到对应模型（router model）。分类器可以是规则、小模型，甚至基于输入长度/关键词的启发式。

```ts
async function routeModel(messages: Message[]) {
  const complexity = await classifyComplexity(messages) // 小模型
  if (complexity === 'simple') return 'haiku-4'
  if (complexity === 'normal') return 'sonnet-4'
  return 'opus-4'
}
```

混合使用自有部署的开源模型处理高并发低难度请求，闭源旗舰模型处理高价值请求，是常见的成本结构。

**三、上下文管理**

- 滑动窗口：只保留最近 N 轮或最近 K 个 token，超出部分截断。
- 分层记忆：短期记忆保留原文，长期记忆做摘要或抽取实体/关键决策。
- RAG：不要把整个文档库塞进 prompt，而是先做检索（embedding + 向量库），只取回最相关的若干 chunk。chunk 大小、overlap、topK 都会影响 token 与召回质量，需要调参。
- 去重：相同的系统提示、工具定义在多轮间不要重复发送，使用支持 prompt caching 的接口。
- 前端裁剪：在前端发送前就按规则裁剪历史，避免把无意义的本地状态、UI 事件日志带进 prompt。

```ts
function trimHistory(messages: Message[], maxTokens: number): Message[] {
  let total = 0
  const result: Message[] = []
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content)
    if (total + tokens > maxTokens) break
    total += tokens
    result.unshift(messages[i])
  }
  return result
}
```

**四、缓存**

- 精确缓存：对完全相同的 prompt + model + 参数，直接缓存 LLM 响应（Redis、CDN、边缘 KV）。适合模板化任务（翻译固定文案、分类固定标签）。
- 语义缓存：对语义相近的查询，用 embedding 相似度命中缓存，例如"怎么用 Vue 写防抖"和"Vue 中实现 debounce"可以命中同一条答案。
- Prompt Caching：Anthropic、OpenAI 等厂商提供的"前缀缓存"，对重复出现的系统提示、工具定义、长文档只计费一次。把稳定前缀放在前面、变动内容放在后面可最大化命中。

```ts
// 语义缓存简化实现
async function semanticCacheGet(query: string) {
  const emb = await embed(query)
  const hits = await vectorDb.search(emb, { topK: 1, threshold: 0.95 })
  return hits[0]?.metadata?.answer ?? null
}
```

**五、输出控制**

- 设置合理的 `max_tokens`，避免模型"刹不住"输出大量冗余内容。
- 使用 stop sequences。
- 强制结构化输出（JSON Schema、function calling），减少自然语言啰嗦与解析重试。
- 让模型在不必要时输出空字段而不是解释性段落。

**六、调用方式**

- 非实时任务使用 Batch API，价格通常比在线 API 低 50% 左右，适合离线评测、批量生成、数据标注。
- 流式本身不省 token，但能显著降低首字延迟、改善 UX，用户也更容易在模型跑题时手动中断，从而截断后续输出 token。
- 对重复任务（每天对相似工单做分类），考虑微调小模型，用"短 prompt + 小模型"替代"长 prompt + 大模型"。

**七、监控与治理**

如果看不见成本，就无法优化。建议：

- 每次调用记录 model、prompt_tokens、completion_tokens、user_id、feature、latency、成本。
- 使用 Langfuse、LangSmith、Helicone 等可观测平台，或自建埋点入库。
- 按功能、用户、模型维度出报表，识别异常消耗（某个用户循环调用、某个 prompt 突然暴涨）。
- 设置预算告警：日/月预算阈值、单用户限流、单请求 token 上限。
- 对高成本功能做 A/B：比较不同模型/提示词在同任务上的质量与成本，找到性价比拐点。

**八、前端侧优化**

- 避免"全量重发"：多轮对话只发必要历史，不把已被摘要的旧消息再传一次。
- 结果复用：同一组件内对同一问题的回答做内存缓存，组件重挂载不重新请求。
- 中断机制：用户切换会话或关闭面板时通过 AbortController 中止流式请求，避免浪费后续 token。
- 乐观更新 + 取消：在用户主动编辑 AI 回答时停止后续生成。

```ts
const controller = new AbortController()

async function ask(payload: unknown) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
  // ...
}

function cancel() {
  controller.abort()
}
```

#### 28-4. 回答要点

- 输入侧：精简系统提示、少用 few-shot、结构化描述、历史摘要与滑动窗口、RAG 精确召回、prompt caching。
- 模型侧：按复杂度路由，小模型处理简单任务，旗舰模型处理复杂推理，必要时上开源/微调。
- 输出侧：max_tokens、stop sequences、结构化输出，避免啰嗦和重试。
- 调用侧：批量 API 处理离线任务，流式改善体验并允许中断，微调替代长 prompt。
- 缓存：精确缓存 + 语义缓存 + 厂商前缀缓存。
- 治理：按功能/用户/模型统计 token、预算告警、限流、A/B 选性价比。
- 前端：裁剪历史、复用结果、AbortController 中断、避免重复发送。

#### 28-5. 回答模板

::: tip 回答模板

降低 token 成本要按链路来。输入侧，精简系统提示、去掉冗余 few-shot、把工具和约束写成结构化格式，长对话用摘要 + 滑动窗口，配合 RAG 只取回相关 chunk，并利用厂商的 prompt caching 缓存稳定前缀。模型侧，用一个轻量分类器做路由，简单任务走 Haiku/mini 或开源小模型，复杂推理才走旗舰模型；高重复任务可以微调小模型，替代"长 prompt + 大模型"。输出侧，设置合理的 max_tokens 和 stop sequences，用 JSON Schema/function calling 强制结构化输出，减少啰嗦和解析重试。调用侧，离线任务走 Batch API，在线用流式改善首字延迟并允许用户中断，从而截断无效输出。缓存方面，对相同 prompt 做精确缓存，对语义相近查询做 embedding 语义缓存，命中率可以做到很高。治理上，每次调用都记录 model、token、user、feature、延迟和成本，用 Langfuse 之类平台做按功能/用户/模型的报表与预算告警，对异常用户限流。前端也有责任：发送前裁剪历史、在内存中复用回答、用 AbortController 在用户切走或关闭面板时中止请求，避免浪费后续 token。

:::

### 29. 如何评估和保证 AI 生成内容的质量（评估体系）？

#### 29-1. 关键词

> - **评估体系**、**正确性**、**相关性**、**一致性**、**安全性**、**LLM-as-judge**、**Golden Dataset**、**A/B 测试**、**在线指标**、**Guardrails**、**Langfuse**、**Promptfoo**

#### 29-2. 考察点

::: info 考察点

- **评估维度完整性**：能否覆盖正确性、相关性、连贯性、安全性、有用性、格式合规，而非只看"读起来顺"
- **离线与在线方法结合**：是否同时掌握自动化指标、LLM-as-judge、人工评测、A/B 测试、线上行为指标
- **工程化落地**：是否知道如何构建 Golden Dataset、做回归评估、接入可观测平台
- **质量保障闭环**：能否建立从线上 bad case 到 prompt/模型/检索改进的反馈回路
- **工具链认知**：是否了解 Langfuse、LangSmith、Braintrust、Promptfoo、OpenAI Evals 等常用工具

:::

#### 29-3. 知识点详解

AI 内容的质量无法靠"看着像对的"来保证，需要一套离线 + 在线、自动 + 人工的评估体系。

**一、评估维度**

在定义指标前，先明确要评估什么。常见维度：

- 正确性 / 事实准确性：陈述是否与事实或检索到的上下文一致。
- 相关性：是否回答了用户的问题，有无跑题。
- 连贯性 / 可读性：结构是否清晰、逻辑是否自洽。
- 完整性：是否覆盖了问题的关键子点。
- 安全性 / 合规：是否包含有害、歧视、违法、越权内容，是否泄露隐私。
- 有用性：是否给出可执行、可落地的答案。
- 格式合规：是否符合要求的 JSON Schema、代码可运行、引用规范。
- 风格一致：是否符合品牌语气、术语一致。

不同业务对各维度权重不同，例如代码助手看重正确性和可运行性，客服场景更看重合规与同理心。

**二、离线评估**

离线评估在每次 prompt、模型、检索参数变更时跑，作为回归门禁。

1. 自动化指标
   - 文本：exact match、BLEU、ROUGE、BERTScore、embedding 余弦相似度，适合有参考答案的分类/摘要任务。
   - 代码：编译通过率、单元测试通过率、Lint 通过率、执行结果比对。
   - 结构化输出：JSON Schema 校验、字段枚举校验、类型检查。
   - RAG：Context Precision/Recall、Answer Relevancy、Groundedness（可借助 RAGAS、TruLens）。

2. LLM-as-judge
   用更强的模型（或同一模型但更强配置）按评分 rubric 给输出打分，支持：
   - 单点评分：每个维度 1-5 分，给出理由。
   - 成对比较：A/B 两个模型或两个 prompt 的输出，让裁判选优，减少绝对打分偏差。
   - 多裁判投票：多次采样取多数，降低方差。

   提示词需要明确评分标准、输出 JSON、要求引用原文证据，避免"拍马屁"偏差（位置偏好、冗长偏好、自我偏好）。

```json
{
  "criteria": [
    { "name": "correctness", "rubric": "1=与事实矛盾, 3=部分正确, 5=完全正确且有依据" },
    { "name": "relevance", "rubric": "1=跑题, 5=直击问题" },
    { "name": "format", "rubric": "1=不符合 JSON Schema, 5=完全合规" }
  ],
  "output": { "scores": { "correctness": 0, "relevance": 0, "format": 0 }, "reason": "" }
}
```

3. Golden Dataset
   维护一组"金标准"用例，覆盖典型场景、边界场景、历史 bad case。每条用例包括：输入、期望输出或关键断言、适用维度、标签（如"多语言""长文档""拒答"）。
   每次改动跑全量，分数下降即阻塞发布。随着线上问题持续沉淀，数据集不断扩充。

4. 人工评测
   对自动指标无法覆盖的维度（创意、语气、同理心），由领域专家按盲评规则打分。可采用"双评 + 仲裁"机制降低主观偏差。

**三、在线评估**

离线指标再好，最终要看真实用户行为。

- 接受率：AI 生成内容被直接采纳的比例。GitHub Copilot 公开的整体接受率约 30% 左右，是关键基线。
- 编辑距离 / 修改率：用户在 AI 草稿基础上改了多少，改得越多说明质量越差。
- 重新生成率：用户点"重新生成"的比例，高说明首次输出不达标。
- 复制率 / 引用率：代码或文案被复制使用的比例。
- 任务完成时间 / 提交时间：AI 辅助下用户完成任务是否更快。
- 显式反馈：赞/踩、评分、文字反馈，尤其是"踩"要能关联到具体输出。
- 业务指标：客服场景的转人工率、转化率；写作场景的发布率、留存。

通过 A/B 测试比较不同模型、prompt、RAG 策略在上述指标上的差异，注意做显著性检验和分层分析（新老用户、不同任务类型）。

**四、Guardrails（护栏）**

评估不只是事后打分，还要在运行时拦截低质量输出：

- 输出校验：JSON Schema、PII 脱敏、敏感词过滤。
- 事实核验：对照检索到的上下文检查声明，要求引用来源；无法在上下文中找到依据的声明标记为"未验证"或直接拒答。
- 内容安全：接入内容审核 API（OpenAI Moderation、自研敏感词/分类器），拦截违规输出。
- 拒答策略：置信度低或越界问题走兜底话术或转人工。
- 速率与配额：防止滥用和异常调用。

**五、持续改进闭环**

评估体系的价值在于驱动改进：

1. 线上收集"踩"、低评分、重新生成、人工修改距离高的样本。
2. 聚类分析，找出高频失败模式（幻觉、跑题、格式错、知识过期）。
3. 根据失败模式：
   - 调整 prompt（补约束、加示例、要求引用）；
   - 优化 RAG（chunk 策略、embedding 模型、重排序）；
   - 增加工具调用；
   - 微调或更换模型；
   - 加 guardrails。
4. 把典型 bad case 加入 Golden Dataset，回归验证。
5. 灰度上线，观察在线指标是否改善。

**六、工具链**

- 评估框架：Promptfoo（CLI 驱动，适合 prompt/model 回归）、OpenAI Evals、DeepEval、RAGAS。
- LLM 可观测：Langfuse、LangSmith、Braintrust、Helicone、Phoenix。
- 实验跟踪：Weights & Biases、MLflow，或自建评测看板。
- 自建评测通常包含：数据集管理、评测 runner、裁判 prompt 版本管理、结果对比与可视化、与 CI/CD 集成。

CI 中可以跑"快速子集"（50 条关键用例 + LLM-as-judge），夜间跑全量，输出报告并在分数低于阈值时阻塞合并。

#### 29-4. 回答要点

- 维度：正确性、相关性、连贯、完整、安全、有用、格式、风格，按业务加权。
- 离线：自动指标（测试通过率、JSON Schema、embedding 相似度、RAGAS）、LLM-as-judge（单点评分 + 成对比较 + 多裁判）、Golden Dataset 回归、人工盲评。
- 在线：接受率、编辑距离、重新生成率、复制率、完成时间、显式反馈、业务指标，配合 A/B。
- Guardrails：输出校验、事实核验与引用、内容审核、拒答兜底。
- 闭环：bad case 收集、聚类、改 prompt/RAG/模型/护栏、加入金标、灰度验证。
- 工具：Promptfoo、OpenAI Evals、RAGAS、Langfuse、LangSmith、Braintrust。

#### 29-5. 回答模板

::: tip 回答模板

我会从离线、在线、护栏、闭环四个部分搭一套评估体系。首先明确维度：正确性、相关性、连贯性、完整性、安全性、有用性、格式合规和风格一致性，并按业务加权，代码场景看可运行性，客服场景看合规和同理心。离线侧维护 Golden Dataset，覆盖典型、边界和历史 bad case，每次改 prompt 或模型都跑回归：能客观判断的用自动化指标，比如代码的编译/测试通过率、JSON Schema 校验、embedding 相似度、RAG 的 groundedness；主观维度用 LLM-as-judge，按 rubric 打分或 A/B 成对比较，用强模型做裁判并多次采样降低方差；必要时加专家盲评。在线侧看真实行为指标：接受率（Copilot 这类基线大约 30%）、编辑距离、重新生成率、复制率、任务完成时间、显式赞踩和业务转化，并通过 A/B 验证改动效果。护栏方面，输出做 Schema 校验和 PII 脱敏，对照 RAG 上下文做事实核验并要求引用，接入内容审核 API，置信度低就拒答或转人工。最后形成闭环：线上 bad case 聚类出失败模式，反哺 prompt、RAG（chunk/embedding/rerank）、工具调用、模型微调或新增护栏，再把 case 加入金标回归验证。工具上，我会组合 Promptfoo 做 prompt 回归，RAGAS 评估 RAG，Langfuse 或 LangSmith 做在线 trace 与指标，CI 里跑快速子集、夜间跑全量，分数低于阈值就阻塞发布。

:::

### 30. AI 对话中长消息导致内存泄漏/卡顿，如何排查和优化？

#### 30-1. 关键词

> - **内存泄漏**、**长任务**、**堆快照**、**Detached DOM**、**虚拟列表**、**rAF 合批**、**组件隔离**、**AbortController**、**增量 Markdown**、**PerformanceObserver**

#### 30-2. 考察点

::: info 考察点

- **根因定位能力**：能否列出长对话场景下的常见内存与性能问题，包括无界列表、流式大字符串、全量 markdown 重解析、未清理监听器与流
- **排查方法论**：是否熟悉 Memory/Performance 面板、堆快照对比、Detached DOM 树、Performance 录制
- **渲染优化**：是否掌握虚拟列表、组件隔离与 memo、rAF 合批、增量解析、懒加载语法高亮
- **资源生命周期管理**：是否清楚事件监听、定时器、fetch stream、AbortController、WeakMap 的正确用法
- **框架差异**：是否了解 React/Vue 在大数组响应式、整列表重渲染上的差异与对应优化

:::

#### 30-3. 知识点详解

AI 对话的卡顿和内存泄漏，常常不是单点问题，而是"消息不断累积 + 流式高频更新 + 重型渲染（markdown/代码高亮）"三者叠加的结果。

**一、典型根因**

1. 消息列表无界增长：DOM 节点、Vue/React 内部 vnode/fiber、消息对象、引用的图片/文件 blob 全部常驻。
2. 流式 token 累积成超大字符串，且每来一个 token 都触发响应式更新和 markdown 重新解析。
3. 代码高亮（Shiki/Prism）、markdown-it、KaTeX 对整个消息列表重新执行，即使只有最后一条消息在变化。
4. 事件监听器、ResizeObserver、IntersectionObserver、定时器、WebSocket、fetch stream 在组件卸载时未清理。
5. 闭包持有大对象（例如把整条消息列表捕获在某个长生命周期回调里）。
6. 没有虚拟化，渲染上千条消息的 DOM。
7. 框架层面：React 中流式消息更新导致整棵消息树 reconcile；Vue 中对超大数组做深度响应式带来的代理开销。

**二、排查方法**

先用 Chrome DevTools 定位，不要凭感觉优化：

- Performance 面板：录制一段流式输出 + 滚动过程，看主线程是否出现长任务（Long Task > 50ms）、Scripting/Rendering 时间分布、每次 commit 的 DOM 数量。
- Memory 面板：
  - 堆快照（Heap Snapshot）在"进入页面—滚动/对话—手动 GC—再快照"后做对比，按 Retained Size 排序，找异常大的对象和 Detached DOM tree。
  - Allocation instrumentation on timeline 观察增量分配，定位持续分配但未释放的对象。
- Performance Monitor（Ctrl+Shift+P 调出）实时观察 DOM Nodes、JS heap size、事件监听器数量，在切换会话后这些数字应该回落。
- `PerformanceObserver` 在线上采集长任务：

```ts
if (typeof PerformanceObserver !== 'undefined') {
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 100) {
        reportLongTask({ duration: entry.duration, name: entry.name })
      }
    }
  }).observe({ entryTypes: ['longtask'] })
}
```

常见信号：DOM 节点数只增不减 → 消息列表未清理或虚拟化失效；Detached HTMLDivElement 很多 → 事件监听器/闭包未释放；heap 中字符串持续增长 → 流式 buffer 未释放或全量历史留在内存。

**三、优化手段**

1. 虚拟列表

   只渲染可视区 + 缓冲带的消息，从根上限制 DOM 数量。Vue 可用 `vue-virtual-scroller`、`@tanstack/vue-virtual`，React 可用 `react-window`、`@tanstack/react-virtual`。注意流式消息高度变化时，需要动态测量并通知虚拟列表更新尺寸。

```vue
<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import MessageItem from './MessageItem.vue'

defineProps<{ items: Message[] }>()
</script>

<template>
  <RecycleScroller
    :items="items"
    :item-size="80"
    key-field="id"
    v-slot="{ item }"
  >
    <MessageItem :message="item" />
  </RecycleScroller>
</template>
```

2. 流式更新合批与组件隔离

   用 rAF 把 token 合批到一帧更新一次。把每条消息拆成独立组件，并配合 memo（React）或仅依赖 props（Vue），使得流式更新只重渲染当前消息，不波及整棵列表。稳定且唯一的 `key` 很重要，避免使用数组下标。

```tsx
// React
const MessageItem = memo(function MessageItem({ message }: { message: Message }) {
  return <div>{/* ... */}</div>
})

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages.map(m => (
        <MessageItem key={m.id} message={m} />
      ))}
    </>
  )
}
```

   在 Vue 中，`<MessageItem :message="m" />` 本身就有组件边界，只要不在子组件内引用整个 list，重渲染天然隔离；对超大数组可用 `shallowRef` 避免深度响应式。

3. 历史消息截断与摘要

   客户端只保留最近 N 条；更早的消息由服务端摘要或分页加载，切换会话时释放当前消息数据与图片 blob。对超长输出做折叠（"展开全部"），减少一次性渲染压力。

4. 重型渲染懒执行

   - 代码高亮：只高亮可视区代码块，滚出视口回收；流式中的代码块先用纯文本，流结束再高亮。
   - Markdown：只重新解析正在流式输出的那条消息；已完成的消息缓存渲染结果。可使用增量 markdown 解析或"流结束一次性渲染"策略。
   - KaTeX、Mermaid 等异步渲染走 `requestIdleCallback` 或 IntersectionObserver 触发。

```ts
import { shallowRef } from 'vue'

const renderedHtml = shallowRef('')
let rafId: number | null = null
let pending = ''

function scheduleRender(raw: string) {
  pending = raw
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    renderedHtml.value = renderMarkdown(pending)
    rafId = null
  })
}
```

5. 资源生命周期清理

   - fetch stream 用 AbortController 在组件卸载或切换会话时中止。
   - 移除所有手动 addEventListener 的监听、清空 setInterval/setTimeout。
   - disconnect ResizeObserver/IntersectionObserver/MutationObserver。
   - 闭包不要捕获整个消息列表，只传必要字段；长生命周期对象（全局 store、event bus）持有短期组件引用时用 WeakMap/WeakRef。

```ts
onBeforeUnmount(() => {
  controller.abort()
  rafId && cancelAnimationFrame(rafId)
  observer.disconnect()
  window.removeEventListener('resize', onResize)
})
```

6. 降低响应式开销

   - Vue：大数组用 `shallowRef`/`markRaw`，避免对每条消息深度 reactive；只在必要节点触发更新。
   - React：把流式中的消息状态下沉到 MessageItem 内部，父级列表不持有逐 token 状态；使用 `useSyncExternalStore` 或订阅式 store 避免顶层 setState。
   - 避免在 watch/computed 中对整个列表做 filter/map/sort，必要时缓存结果。

7. 容量上限与归档

   - 客户端硬上限（例如最近 200 条），超出走"加载更多"分页。
   - 切换会话时清空当前列表、释放 blob URL、终止在跑的流。
   - 老对话支持归档/搜索，而非一次性加载。

8. 线上监控

   采集 Long Task、INP、内存（`performance.memory` 仅 Chromium）、错误率、流式取消率，按会话长度分层，发现长会话下的性能劣化。

**四、验证**

修复后回到 DevTools：在持续对话 30 分钟、上滚历史、切换会话等场景下，确认 DOM 节点数稳定、堆快照对比中 Detached DOM 消失、Performance 中无 > 100ms 长任务、滚动帧率保持 60fps。

#### 30-4. 回答要点

- 根因：无界消息、流式大字符串、全量 markdown/高亮、未清理监听与流、闭包、无虚拟化、框架级整列表重渲染。
- 排查：Performance 录制找长任务，Memory 堆快照对比看 Retained Size 和 Detached DOM，Performance Monitor 看节点/监听器，PerformanceObserver 上报。
- 渲染优化：虚拟列表、rAF 合批、消息组件隔离 + key/memo、shallowRef、只重解析流式消息、懒高亮可视代码块。
- 生命周期：AbortController 中止流、清理监听器/定时器/Observer、WeakMap、切会话释放资源。
- 容量：客户端上限、分页/摘要、超长折叠、blob URL 回收。
- 框架差异：React 状态下沉 + memo，Vue shallowRef/markRaw 避免深度响应式。
- 验证：DevTools 复测 + 线上 longtask/INP 监控。

#### 30-5. 回答模板

::: tip 回答模板

长对话卡顿通常是无界消息列表、流式高频更新和重型渲染（markdown/代码高亮）叠加造成的。排查我会先用 Chrome DevTools：Performance 面板录一段流式和滚动，找长任务和 Scripting/Rendering 热点；Memory 做"进入—使用—手动 GC—快照"对比，按 Retained Size 排序看大对象和 Detached DOM；Performance Monitor 实时观察 DOM 节点、堆和监听器数量，切会话后应该回落；线上用 PerformanceObserver 采集 longtask 和 INP，按会话长度分层。优化方向：第一，消息列表上虚拟滚动（vue-virtual-scroller 或 @tanstack/vue-virtual），只渲染可视区；第二，流式用 rAF 合批，一帧 flush 一次，把每条消息拆成独立组件并给稳定 key，React 配 memo、Vue 依赖天然的组件边界，避免一条消息在流导致整棵列表重渲染；第三，重型渲染懒执行——markdown 只重新解析正在流式的那条并缓存结果，代码块只高亮可视区，流式中的代码先纯文本，流结束再用 shiki 高亮；第四，资源生命周期必须清理，AbortController 中止 fetch stream，移除监听、disconnect Observer、清定时器，闭包不要持有整个列表，长生命周期引用用 WeakMap/WeakRef；第五，控制容量，客户端只保留最近 N 条或做分页/服务端摘要，超长回答折叠，切换会话时释放 blob URL 并取消在跑的流；第六，框架层面，Vue 对大数组用 shallowRef/markRaw 避免深度响应式，React 把流式状态下沉到 MessageItem 内部避免顶层 setState。最后复测：DOM 节点稳定、堆快照里 Detached DOM 消失、无 100ms 以上长任务、滚动 60fps，线上看长会话下的 INP 和 longtask 不再随消息数线性增长。

:::

### 31. 如何处理 AI 的幻觉（Hallucination）问题？有哪些兜底方案？

#### 31-1. 关键词

> - **幻觉（Hallucination）**、**RAG**、**引用与溯源**、**提示词约束**、**事实核验**、**Guardrails**、**Function Calling**、**置信度**、**Human-in-the-loop**、**UI 透明化**

#### 31-2. 考察点

::: info 考察点

- **概念理解**：能否准确描述幻觉——模型以高置信度生成看似合理但与事实不符或捏造的内容
- **分层缓解策略**：是否覆盖源头（RAG、微调）、生成中（prompt、模型选择、结构化输出）、生成后（核验、护栏、置信度）、产品层（UI 透明、人审、兜底）
- **工程化能力**：能否落地引用校验、第二模型核验、function calling 替代自由文本、低置信度拒答
- **产品与体验判断**：是否懂得在 UI 上标注来源、置信度、AI 可能出错，提供用户纠错入口
- **闭环意识**：是否把用户反馈的幻觉 case 反哺到检索、prompt、评估集

:::

#### 31-3. 知识点详解

**一、什么是幻觉**

幻觉指模型生成了语法流畅、语气自信，但实际上错误、无依据或完全捏造的内容，包括：

- 虚构事实：编造不存在的 API、法律条文、数据、事件。
- 错误引用：给出真实的出处但内容与出处不符，或伪造 URL/论文名。
- 过度推断：在证据不足时给出确定性结论。
- 指令矛盾：在多轮对话中被带偏，输出与系统约束冲突的内容。

幻觉无法被彻底消除，但可以通过多层策略把它压缩到可接受范围，并在发生时兜底。

**二、源头：让模型有依据**

1. RAG（Retrieval-Augmented Generation）

   把"答案从参数记忆里来"变成"答案从检索到的权威资料里来"。流程：用户提问 → 检索相关文档 chunk → 把 chunk 作为上下文喂给模型 → 要求模型仅基于上下文回答并标注引用。

```ts
async function answerWithRag(question: string) {
  const docs = await retrieve(question, { topK: 5 })
  const context = docs
    .map((d, i) => `[${i + 1}] ${d.title}\n${d.content}`)
    .join('\n\n')

  const prompt = [
    '你只能基于下面给出的资料回答问题。',
    '若资料不足以回答，请直接说"根据现有资料无法回答"。',
    '每个事实性陈述后用 [n] 标注引用编号。',
    `资料：\n${context}`,
    `问题：${question}`,
  ].join('\n\n')

  return callLlm(prompt)
}
```

2. 高质量知识库与检索

   幻觉概率和检索质量强相关：做好文档清洗、chunk 粒度、embedding 模型选择、混合检索（向量 + 关键词）、重排序（reranker），并保证知识及时更新。检索不到就不要硬答。

3. 微调与领域模型

   对专有领域，用高质量领域数据微调小模型，比"通用大模型 + 超长 prompt"更稳；或选择在事实性上表现更好的模型（公开 benchmark 如 SimpleQA、TruthfulQA、HaluEval 可参考）。

**三、生成中：约束与自证**

1. 提示词工程

   - 明确"不知道就说不知道"，禁止编造。
   - 要求每个事实性陈述附引用。
   - 让模型先列证据、再给结论（chain-of-thought / cite-then-answer），便于事后校验。
   - 限定回答范围，必要时让模型先输出"我能回答/不能回答"的判断。

```text
你是一个严格的问答助手。回答规则：
1. 只使用 <context> 中的信息，不得使用任何外部知识。
2. 回答前先判断 context 是否足以支撑结论，不足则回答"根据现有资料无法回答"。
3. 每个事实陈述后用 [编号] 标注来源。
4. 不要给出编号之外的来源，不要编造 URL、API、人名、日期。
```

2. 结构化输出与 Function Calling

   能用工具就不要让模型"自由发挥"。例如查订单、查天气、查文档，全部走 function calling 由确定性代码返回结果，模型只负责调度和转述；输出固定 JSON 字段，避免自然语言中夹带错误细节。

3. 自我核验

   让模型在给出答案后，反向检查：每个声明是否能在上下文中找到？引用是否真的支持该声明？部分模型支持"生成—批判—修订"多轮自洽。

**四、生成后：核验与护栏**

1. 事实核验层

   - 对模型输出中的关键陈述（实体、数字、日期、API 名）做 NLI/蕴含判断：是否被引用的上下文真正支持。
   - 校验引用：来源是否真实存在？是否可访问？引用的段落是否真的支持该断言？不支持则降级（去掉声明或标注"未验证"）。
   - 对代码，真实执行或调用类型检查/测试，是最硬的核验。

2. 第二模型/强模型裁判

   用更强或不同家族的模型做独立 fact-check，给出"支持/矛盾/证据不足"的判定，多裁判投票。

3. 置信度评分

   - 利用 logprobs 或模型自评得到置信度。
   - 低置信度输出标记为"不确定"，触发人工或澄清式追问，而不是直接展示为定论。

4. Guardrails

   - 输出 Schema 校验、敏感与越权内容过滤。
   - 拒答策略：对知识库未覆盖的问题、越权问题、高风险问题直接走兜底话术或转人工。

```ts
async function guardedAnswer(question: string) {
  const docs = await retrieve(question, { topK: 5 })
  if (docs.length === 0 || maxRelevance(docs) < 0.5) {
    return {
      type: 'fallback',
      text: '我没有在知识库中找到足够可靠的信息，是否为你转接人工或搜索外部资料？',
    }
  }

  const raw = await generate(question, docs)
  const verdict = await verifyClaims(raw, docs)
  if (verdict.unsupported.length > 0) {
    return {
      type: 'uncertain',
      text: removeUnsupported(raw, verdict.unsupported),
      warnings: verdict.unsupported,
    }
  }
  return { type: 'answer', text: raw, citations: docs }
}
```

**五、产品层：透明与兜底**

UI/UX 不能把 AI 输出包装成绝对事实：

- 展示引用来源（标题、链接、片段），用户可点击核对。
- 对低置信度或自动核验未通过的内容打"未验证/可能不准确"标签。
- 提供"反馈"入口：赞、踩、"这条信息有误"、纠错文案。
- 高风险场景（医疗、法律、金融、代码线上执行）显式声明"仅供参考，请人工复核"，并引入 human-in-the-loop：AI 产出草稿，由专家审核后再发布。
- 兜底路径：检索不到 → 转人工或引导外部搜索；置信度低 → 主动提问澄清；连续失败 → 切换模型或提示稍后重试。

**六、闭环：持续降低幻觉率**

- 把用户标记为幻觉的 case、核验失败的 case 沉淀进评估集（Golden Dataset）。
- 按失败模式分类：知识缺失 → 补知识库并调整 chunk；检索不到 → 改 embedding/rerank/topK；prompt 漏洞 → 补约束和示例；模型能力不足 → 换模型或微调。
- 在 CI 中跑回归，保证新改动不引入新的幻觉。
- 上线后监控：引用点击率、踩率、人工驳回率、核验失败率、转人工率，作为幻觉的代理指标。

**七、工具与生态**

- RAG/框架：LangChain、LlamaIndex、Haystack、Vercel AI SDK。
- 核验：RAGAS（groundedness/faithfulness）、TruLens、DeepEval、Patronus、LlamaIndex 的 evaluation 模块。
- 应用层 guardrails：NeMo Guardrails、Guardrails AI、自研规则引擎。
- 评测：Promptfoo、OpenAI Evals、Langfuse/LangSmith 做 trace 与样本收集。

#### 31-4. 回答要点

- 定义：自信但错误/捏造的内容，包括虚构事实、伪造引用、证据不足下定论。
- 源头：RAG + 高质量检索（chunk、embedding、rerank）、领域微调、选事实性更强的模型。
- 生成中：提示词明确"不知道就说不知道"、强制引用、先证据后结论、function calling 替代自由文本、自核验。
- 生成后：claim 级事实核验、引用真伪校验、第二模型裁判、logprobs/自评置信度、Schema/安全护栏。
- 兜底：检索无结果拒答/转人工，低置信度标注或澄清，高风险场景 human-in-the-loop。
- UI：展示来源、未验证标签、反馈入口、风险免责声明。
- 闭环：bad case 进入评估集，按模式反哺知识、检索、prompt、模型，线上监控踩率/驳回率/核验失败率。

#### 31-5. 回答模板

::: tip 回答模板

幻觉无法彻底消除，要靠分层策略把概率压到可接受，并在发生时兜底。第一层是源头，用 RAG 把回答锚定在检索到的权威资料上，只让模型基于上下文回答并强制引用，同时把 chunk 策略、embedding、混合检索和 reranker 调好，保证检索质量；专业领域用领域数据微调或选事实性更强的模型。第二层是生成中，提示词明确"不知道就说不知道"，禁止编造 URL、API 和数据，要求先列证据再下结论，能走 function calling 的确定性查询（订单、天气、文档）就不要让模型自由发挥，输出用 JSON Schema 约束，还可以让模型做一轮自批判。第三层是生成后核验：把答案拆成 claim，用 NLI 或第二模型判断每个 claim 是否被引用上下文真正支持，校验引用是否真实存在且段落匹配，对代码直接跑类型检查和测试；用 logprobs 或自评得到置信度，低置信度标"未验证"。第四层是产品兜底，检索不到就拒答或转人工/引导搜索，低置信度主动澄清，医疗法律金融这类高风险场景走 human-in-the-loop 人工复核；UI 上展示引用来源、未验证标签、反馈纠错入口，并提示"AI 可能出错"。最后形成闭环：用户标记和核验失败的 case 进入 Golden Dataset，按失败模式反哺知识库、检索、prompt 或模型，CI 里跑回归，线上持续监控踩率、人工驳回率和核验失败率。工具上我会用 LangChain/LlamaIndex 或 Vercel AI SDK 搭 RAG，RAGAS/DeepEval 评估 groundedness，Langfuse 做 trace 和样本收集，必要时加 NeMo Guardrails 这类应用层护栏。

:::
