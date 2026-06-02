---
layout: doc

lastUpdated: false
title: React 开发中的常见误区
description: 总结 React 开发中关于 State、Hooks、Effect、派生状态和性能优化的常见错误与注意事项。
category: 前端
date: 2026-05-27
---

## 1. State

React 里最容易被误用的东西之一就是 state。很多时候我们只是想临时存一个值，但下意识就写了 `useState`。这样代码能跑，但状态一多，组件的数据来源就会变得不清晰。

### state 不是普通变量

`state` 的作用是让组件在重新渲染之间保存信息，并且在它变化时触发视图更新。它不是普通变量的替代品。

如果一个值只在一次事件处理函数里使用，用普通变量就够了：

```tsx
function SearchBox() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    const trimmed = keyword.trim();

    if (!trimmed) return;

    console.log('search:', trimmed);
  };

  return (
    <>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <button onClick={handleSearch}>搜索</button>
    </>
  );
}
```

这里的 `trimmed` 只是一次点击事件里的临时计算结果，不需要单独变成 state。

不太推荐这样写：

```tsx
const [trimmedKeyword, setTrimmedKeyword] = useState('');
```

除非它真的会影响渲染，或者需要跨多次渲染保存，否则多一个 state 就意味着多一个同步关系。

::: tip 小提示
判断一个值要不要放进 state，可以先问自己两个问题：它是否会影响 UI？它是否需要在组件重新渲染后仍然保留？如果答案都是否，普通变量通常就够了。
:::

### 不要存派生状态

派生状态是 React 里很常见的误区。所谓派生状态，就是某个值本来可以从已有的 props 或 state 计算出来，但我们又单独存了一份 state。

不推荐：

```tsx
const [firstName, setFirstName] = useState('Nan');
const [lastName, setLastName] = useState('Xia');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

更推荐：

```tsx
const fullName = `${firstName} ${lastName}`;
```

如果计算过程比较重，再考虑 `useMemo`：

```tsx
const result = useMemo(() => {
  return expensiveCompute(list);
}, [list]);
```

核心原则是：能在渲染时直接算出来的值，就不要再多存一份 state。多存一份，就多一个需要同步的地方。

### 更新 state 时不要直接修改原对象

不推荐：

```tsx
user.name = 'new name';
setUser(user);
```

推荐：

```tsx
setUser({
  ...user,
  name: 'new name'
});
```

React 更容易通过引用变化判断状态是否更新。直接修改原对象，可能导致视图不更新，也会让数据变化变得不透明。

### setState 后不要马上读取新值

```tsx
setCount(count + 1);
console.log(count);
```

这里打印出来的通常还是旧值。因为 state 更新会触发下一次渲染，而不是立刻修改当前闭包里的 `count`。

如果新值依赖旧值，推荐使用函数式更新：

```tsx
setCount(prev => prev + 1);
```

原因是当前函数里的 `count` 来自这一次渲染形成的闭包，它不会因为你调用了 `setCount` 就立刻变成新值。如果在同一个事件里连续更新多次，直接使用 `count + 1` 很容易得到不符合预期的结果：

```tsx
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```

这三次更新里读取到的 `count` 都是同一个旧值，所以结果通常只会加 1，而不是加 3。

函数式更新拿到的是 React 计算更新队列时传入的最新状态：

```tsx
const handleClick = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
};
```

这样每一次更新都会基于上一次更新后的结果继续计算，最终就能得到连续加 3 的效果。简单来说，只要新状态依赖旧状态，就优先使用函数式更新，这样更不容易受到闭包旧值和批量更新的影响。

## 2. Hooks

Hooks 虽然长得像普通函数，但它的使用规则和普通函数不一样。很多 React 问题，本质上都是没有理解 Hooks 的调用时机和调用顺序。

### 在顶层调用

Hooks，也就是以 `use` 开头的函数，只能在组件或自定义 Hook 的最顶层调用。不能放在条件语句、循环语句或嵌套函数里面。

错误写法：

```tsx
function UserPanel({ enabled }: { enabled: boolean }) {
  if (enabled) {
    const [user, setUser] = useState(null);
  }

  return null;
}
```

正确写法：

```tsx
function UserPanel({ enabled }: { enabled: boolean }) {
  const [user, setUser] = useState(null);

  if (!enabled) {
    return null;
  }

  return <div>{user?.name}</div>;
}
```

React 依赖 Hooks 的调用顺序来对应内部状态。如果某次渲染调用了一个 Hook，下一次渲染因为条件变化没有调用它，React 就无法正确对应这些状态。

可以把 Hook 理解成组件能力的声明，而不是普通函数调用。就像文件顶部写 `import` 一样，组件顶部写 Hook，表达这个组件需要哪些 React 能力。

### 分清普通变量、ref 和 state

React 里经常会遇到三种保存数据的方式：普通变量、`useRef` 和 `useState`。它们看起来都能“存东西”，但适用场景完全不同。

| 类型 | 是否触发渲染 | 是否跨渲染保留 | 适合场景 |
| :--- | :--- | :--- | :--- |
| 普通变量 | 否 | 否 | 单次函数内部临时计算 |
| `useRef` | 否 | 是 | 保存 DOM、定时器、上一次值 |
| `useState` | 是 | 是 | 影响 UI 的数据 |

比如保存定时器 ID，通常不需要 state：

```tsx
function TimerButton() {
  const timerRef = useRef<number | null>(null);

  const start = () => {
    timerRef.current = window.setTimeout(() => {
      console.log('done');
    }, 1000);
  };

  const stop = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
  };

  return <button onClick={start}>开始</button>;
}
```

`timerRef.current` 改变时不会触发渲染，这正好符合定时器 ID 的特点：它需要跨渲染保存，但不影响 UI。

## 3. Effect

`useEffect` 很容易被误用。它适合用来同步组件和外部系统，比如订阅、定时器、DOM、网络请求等，但它不应该变成所有逻辑的中转站。

### 不要把事件逻辑绕到 Effect 里

不推荐：

```tsx
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  if (submitted) {
    sendForm();
  }
}, [submitted]);
```

更直接的写法是：

```tsx
const handleSubmit = () => {
  sendForm();
};
```

提交表单本来就是用户事件触发的，没必要先设置一个 state，再通过 Effect 监听这个 state。

### 依赖数组要写完整

很多人为了让 Effect “只执行一次”，会直接写空数组：

```tsx
useEffect(() => {
  fetchUser(userId);
}, []);
```

如果 `userId` 后续会变化，这里就会拿到旧值。更合理的写法是把依赖写完整：

```tsx
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

依赖数组不是性能优化开关，而是告诉 React：这个 Effect 依赖哪些外部值。

### 需要清理的副作用要清理

比如定时器、事件监听、订阅，都需要在组件卸载或依赖变化时清理。

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => {
    window.clearInterval(timer);
  };
}, []);
```

::: danger Tips
如果 Effect 里注册了事件监听或定时器，却没有清理，页面切换几次之后就可能出现重复执行、内存占用增加等问题。这个问题刚开始不明显，但很容易在复杂页面里变成隐性 bug。
:::

## 4. 渲染

React 的渲染阶段应该尽量保持纯粹。组件函数会随着 state 和 props 的变化重新执行，所以不要把它当成只运行一次的初始化函数。

### 组件函数不是只执行一次

```tsx
function Counter() {
  console.log('render');

  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

每次点击按钮，`Counter` 都会重新执行一次。这也是为什么不要在组件函数体里直接写有副作用的逻辑。

不推荐：

```tsx
function UserCard({ userId }: { userId: string }) {
  fetch(`/api/user/${userId}`);

  return <div>{userId}</div>;
}
```

这样写的问题是：只要组件重新渲染，就会重新发请求。渲染阶段应该尽量保持纯粹，不要直接修改外部状态、发请求、操作 DOM 或注册事件。

如果确实需要和外部系统同步，应该放到合适的位置，比如 `useEffect`，或者交给 React Query、SWR 这类数据请求库处理。

### 列表 key 不要使用 index

如果列表只是静态展示，用 index 问题不大。但如果列表会新增、删除、排序，用 index 作为 key 很容易导致组件状态错位。

不推荐：

```tsx
items.map((item, index) => (
  <Item key={index} item={item} />
));
```

更推荐：

```tsx
items.map(item => (
  <Item key={item.id} item={item} />
));
```

key 的作用不是消除警告，而是帮助 React 判断哪个元素对应哪个组件实例。

## 5. 性能

React 性能优化最容易出现两个极端：要么完全不管，要么到处加缓存。我的理解是，优化应该来自具体问题，而不是默认习惯。

### 不要默认加 useMemo 和 useCallback

`useMemo` 和 `useCallback` 是 React 提供的两个缓存相关 Hook。

`useMemo` 用来缓存一个计算结果。只有依赖变化时，才会重新执行里面的计算：

```tsx
const visibleList = useMemo(() => {
  return list.filter(item => item.visible);
}, [list]);
```

`useCallback` 用来缓存一个函数引用。只有依赖变化时，才会返回新的函数：

```tsx
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);
```

简单理解，`useMemo` 缓存的是“值”，`useCallback` 缓存的是“函数”。它们都是优化工具，但不是所有地方都应该默认加。

有时候我们会看到这样的代码：

```tsx
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

这段代码不一定有问题，但也不一定有收益。因为 `useCallback` 本身也需要比较依赖，如果子组件没有使用 `React.memo`，或者这个函数没有传给依赖引用稳定性的地方，那它可能只是让代码变复杂。

可以考虑使用它们的场景：

- 某个计算确实比较重；
- 子组件用了 `React.memo`，并且函数引用变化导致重复渲染；
- 某个第三方库或 Hook 对引用稳定性有要求；
- 依赖数组中需要稳定引用，避免 Effect 反复执行。

不要给每个函数都套一层 `useCallback`。

## 6. 组件设计

组件设计不是单纯把页面拆小，也不是看到重复就立刻抽象。拆分和抽象的目标应该是让代码更容易理解和修改。

### 不要过早抽象

组件拆分不是越早越好，也不是看到重复就立刻抽象。

有些重复只是表面相似，背后的业务含义并不一样。如果太早抽成一个通用组件，后面需求一变，props 就会越来越多，最后组件变成一个谁都不敢改的“万能组件”。

我比较建议的做法是：

- 先允许少量重复；
- 等模式稳定后再抽象；
- 按业务含义拆组件，而不是只看 UI 长得像不像；
- props 变得很多时，要重新思考组件边界。

组件抽象的目标不是减少所有重复代码，而是让代码更容易理解和修改。

---

我觉得写 React 遇到的很多问题并不是语法难，而是思维方式容易混在一起：把 state 当普通变量用，把 Effect 当生命周期入口用，把 `useMemo` 和 `useCallback` 当默认优化手段用。

不如在写代码时记住以下几个原则：

- state 只保存真正影响 UI、需要跨渲染保留的数据；
- 渲染阶段保持纯粹，不要在组件函数体里做副作用；
- Hooks 在组件顶部稳定调用；
- Effect 只用来同步外部系统，不要承载所有业务逻辑；
- 能计算出来的值不要再存一份 state；
- 性能优化要有依据，不要默认加缓存。
