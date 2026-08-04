## 3. 副作用处理

::: danger 💣 踩坑分享：我被 useEffect 依赖数组坑了一下午

上周写一个用户信息编辑页面，就因为漏写了一个依赖，调试了整整一下午，差点怀疑人生。

**场景还原：**

我想实现一个功能：当用户ID变化时，自动拉取用户信息：

```tsx
const [userId, setUserId] = useState(1);
const [userInfo, setUserInfo] = useState(null);

useEffect(() => {
  fetchUser(userId).then(data => {
    setUserInfo(data);
  });
}, []); // 👈 这里漏写了 userId 依赖！
```

看起来没问题对吧？结果发现：
- 第一次加载能正常拉取用户1的信息
- 但点击切换用户（`setUserId(2)`）后，页面完全没反应！
- 控制台也不报错，Network面板也没有新请求
- 我甚至怀疑是接口出问题了，反复测试了接口十几次

**心路历程：**
1. 😕 奇怪，第一次能请求，说明接口没问题
2. 🤔 打印了 `userId`，确实变成2了啊
3. 😤 难道是React的bug？（开始怀疑框架）
4. 🤯 把整个组件重写了一遍，还是不行
5. 😭 准备下班了，突然瞟到一眼依赖数组...空的！！

**问题根源：**

因为依赖数组是空的，这个effect只会在组件挂载时执行**一次**。后续`userId`再怎么变，这个effect都不会再触发了。

**正确写法：**

```tsx
useEffect(() => {
  fetchUser(userId).then(data => {
    setUserInfo(data);
  });
}, [userId]); // ✅ 把 userId 加上！
```

**总结教训：**

1. **永远不要对依赖数组撒谎** — useEffect 用到了什么变量，就老老实实写上
2. **开 ESLint 规则** — `react-hooks/exhaustive-deps` 真的能救你一命
3. **依赖项变化时effect会重新执行** — 这不是bug，这是feature！
4. **遇到问题先看依赖数组** — 90%的useEffect问题都出在这里

那天下午的经历告诉我：不要和React Hooks的规则作对，老老实实遵守它，不然痛苦的是自己。
:::
