---
layout: doc

lastUpdated: false
title: 从 JS 到 TS：终于搞懂了让人头大的泛型
description: 写给刚从 JavaScript 转 TypeScript 的开发者，用最直白的方式讲清楚泛型是什么，以及日常开发中怎么用
category: TypeScript
date: 2026-04-29
---

# 从 JS 到 TS：终于搞懂了让人头大的泛型

## 1. 开篇引入

说出来你可能不信，我刚从 JS 转 TS 的头一个月，看到 `<T>` 这种语法直接跳过。心里想：这玩意儿写了跟没写有啥区别？我用 `any` 不香吗？

结果就是，项目里的 `any` 越写越多，TS 写成了 `AnyScript`。直到有一次，一个接口返回的数据类型不对，我排查了整整一下午，最后发现就是因为我图省事写了个 `any`，把类型检查给绕过去了。

那天晚上我痛定思痛，决定把泛型这玩意儿啃下来。搞懂之后才发现：原来泛型一点都不难，之前觉得难，是没人用大白话给我讲明白。

这篇文章就是给刚从 JS 转过来的朋友写的，我会尽量用最直白的话，不讲那些听起来就头大的术语。你看完至少能做到：
- 看到 `<T>` 不再发怵
- 知道什么时候该用泛型，什么时候用 `any` 也没事
- 日常开发中 80% 的泛型场景能搞定

## 2. 先搞懂：泛型到底是个什么东西？

先不说定义，我给你举个生活中的例子。

你去取快递，快递柜就是个"泛型"。它不管你放进去的是衣服、电子产品还是零食，只要是个包裹就能放。但你放进去的时候是什么，取出来的时候还是什么——快递柜不会把你的手机变成零食。

泛型就是这么个东西：**它不关心你具体用什么类型，但它会保证类型的一致性。**

再换个技术点的说法，但还是人话：
> 泛型就是"类型的参数"。就像函数可以接收不同的参数值一样，泛型可以让你的代码接收不同的类型，同时还能保证类型安全。

::: tip 小提示
记住这个关键词：**类型的参数**。以后看到泛型，就把它当成是给类型传参就行。
:::

## 3. 第一个坑：为什么不能用 any 代替泛型？

我知道你肯定跟我一样，第一反应是：这玩意儿这么麻烦，我用 `any` 不行吗？

行，但是有代价。我们看个例子：

```typescript
// 用 any 的版本
function echo(arg: any): any {
  return arg;
}

const str = echo("hello"); // str 的类型是 any
const num = echo(123);     // num 的类型是 any
```

看起来没问题对吧？但问题在于，你传进去是字符串，出来的时候类型信息丢了。TS 不知道你返回的还是字符串，后续调用字符串方法的时候，它不会给你提示，写错了也不会报错。

我们再看看用泛型的版本：

```typescript
// 用泛型的版本
function echo<T>(arg: T): T {
  return arg;
}

const str = echo("hello"); // str 的类型是 "hello"（字面量类型）
const num = echo(123);     // num 的类型是 123（字面量类型）
```

看到区别了吗？泛型会"记住"你传进去的类型，并且保证返回的是同一个类型。类型信息没有丢失，TS 的类型检查系统还能正常工作。

::: danger 踩坑提醒
我当时在这里卡了好久，总觉得"反正代码能跑就行"。后来项目大了才发现，满屏的 `any` 等于把 TS 最有价值的类型检查给废掉了，那还不如直接写 JS。
:::

那什么时候可以用 `any` 呢？我的经验是：
- 你真的完全不关心那个类型是什么（比如真正的动态数据）
- 快速原型开发，后面打算再补类型
- 第三方库的类型实在太复杂，硬写泛型得不偿失

除此之外，能不用 `any` 就尽量不用。

## 4. 上手试试：最简单的泛型函数

我们来写第一个真正的泛型函数。就从数组开始吧，这是最容易理解的场景。

假设我们要写一个函数，把传入的数组包装成一个新数组返回：

```typescript
// 不用泛型的话，你可能得这样写...
function wrapInArray(arg: string): string[] {
  return [arg];
}

// 那如果要支持数字呢？再写一个？
function wrapInArrayNumber(arg: number): number[] {
  return [arg];
}

// 那要支持对象呢？再写一个？
// 这样没完没了了...
```

这时候泛型就派上用场了：

```typescript
// 用泛型，一个函数搞定所有类型
function wrapInArray<T>(arg: T): T[] {
  return [arg];
}

// 字符串进去，字符串数组出来
const strArray = wrapInArray("hello"); // 类型是 string[]

// 数字进去，数字数组出来
const numArray = wrapInArray(123);     // 类型是 number[]

// 对象进去，对象数组出来
const objArray = wrapInArray({ name: "南夏" }); // 类型是 { name: string; }[]
```

就这么简单！我们来拆解一下语法：
- `<T>`：这就是"类型参数"的声明，告诉 TS"接下来我要用一个叫 T 的类型变量"
- `arg: T`：参数的类型是 T（具体是什么，调用的时候由传入的值决定）
- `: T[]`：返回值是 T 类型的数组

::: tip 小提示
那个 `T` 只是个约定俗成的名字，你写成 `<X>`、`<MyType>` 都可以。只不过大家习惯用 `T`（Type 的首字母）而已。
:::

你甚至可以显式指定类型，不让 TS 自动推断：

```typescript
// 显式告诉 TS：我要用 string 类型
const result = wrapInArray<string>("hello");
```

这种写法在 TS 推断不出来的时候会用到，不用急，遇到了自然就会了。

## 5. 常用场景：这几种情况直接用泛型就对了

讲完基础语法，我们来看看日常开发中最常用的几个泛型场景。这些你搞懂了，日常开发基本够用。

### 5.1 场景一：数组

其实数组本身就是个泛型：

```typescript
// 这两种写法是等价的
const arr1: string[] = ["a", "b", "c"];
const arr2: Array<string> = ["a", "b", "c"];
```

没错，`Array` 就是个内置的泛型类型，你给它传什么类型参数，它就是什么类型的数组。

### 5.2 场景二：Promise

这个绝对是天天用的。只要你写异步代码，就会碰到 Promise 的泛型：

```typescript
// 一个返回用户数据的异步函数
async function fetchUser(): Promise<{ id: number; name: string }> {
  const res = await fetch("/api/user");
  return res.json();
}

// 调用的时候，user 的类型就正确推断出来了
const user = await fetchUser();
// user.id 会有补全，user.age 写错了会报错
```

::: danger 踩坑提醒
我之前这里踩过一个大坑：一开始写 `fetchUser()` 的时候，返回值直接写了个 `Promise<any>`，结果后面调用的时候，字段名写错了完全没提示，排查了好久。
:::

### 5.3 场景三：多个类型参数

泛型不止可以传一个，你想传几个传几个：

```typescript
// 一个简单的键值对函数
function makePair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

const pair = makePair("age", 25);
// pair.key 的类型是 string
// pair.value 的类型是 number
```

这里我们用了两个类型参数 `K` 和 `V`，分别代表 key 和 value 的类型。也是约定俗成的名字，你换别的也行。

### 5.4 场景四：泛型接口

接口也可以用泛型，这个在定义 API 返回格式的时候特别有用：

```typescript
// 统一的 API 响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T; // data 的类型由使用者决定
}

// 用户数据的响应
interface User {
  id: number;
  name: string;
}

// 使用的时候传入具体类型
const userRes: ApiResponse<User> = {
  code: 0,
  message: "success",
  data: { id: 1, name: "南夏" }
};

// 列表数据的响应
const listRes: ApiResponse<User[]> = {
  code: 0,
  message: "success",
  data: [{ id: 1, name: "南夏" }]
};
```

这种写法在实际项目中真的太常用了！后端的接口格式一般都是统一的，只有 `data` 字段不一样，用泛型完美解决这个问题。

## 6. 进阶一点：泛型约束和默认值

学到这里你可能会发现一个问题：泛型太"自由"了，什么类型都能传，但有时候我们想限制一下。

比如我们想写一个函数，获取参数的 `length` 属性：

```typescript
// 这样写会报错！因为不是所有类型都有 length 属性
function getLength<T>(arg: T): number {
  return arg.length; // ❌ 报错：T 类型上不存在 length
}
```

这时候就需要**泛型约束**了。用 `extends` 关键字来限制 T 必须包含哪些属性：

```typescript
// 约束 T 必须有 length 属性
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength("hello");  // ✅ 字符串有 length
getLength([1, 2, 3]); // ✅ 数组有 length
getLength(123);      // ❌ 报错：数字没有 length
```

完美！这样既保留了泛型的灵活性，又保证了类型安全。

还有一个常用的是**泛型默认值**。就像函数参数可以有默认值一样，类型参数也可以：

```typescript
// 默认 T 是 string 类型
interface ApiResponse<T = string> {
  code: number;
  message: string;
  data: T;
}

// 不指定类型的时候，data 默认是 string
const res: ApiResponse = {
  code: 0,
  message: "success",
  data: "ok"
};
```

这个小技巧在写组件或者工具库的时候特别实用，能省不少事。

## 7. 踩坑记录：那些年我犯过的泛型错误

讲了这么多，分享两个我真实踩过的坑，大家引以为戒。

### 7.1 坑一：过度泛型化

我刚学会泛型那会，看什么都想用泛型。一个简单的函数也要硬加个泛型，搞得代码特别复杂。

比如这种：

```typescript
// 完全没必要的泛型
function add<T extends number>(a: T, b: T): number {
  return a + b;
}

// 其实直接这样写就够了
function add(a: number, b: number): number {
  return a + b;
}
```

::: tip 经验总结
泛型不是越多越好。当你的函数/接口需要跟多种类型打交道，并且要保持类型一致性的时候，再用泛型。否则就是过度设计。
:::

### 7.2 坑二：泛型嵌套地狱

项目复杂了之后，很容易写出这种代码：

```typescript
const data: Promise<Array<ApiResponse<User[]>>>;
```

这种一层套一层的泛型，读起来特别费劲。我的解决办法是：**给中间类型起个好名字**。

```typescript
type UserList = User[];
type UserListResponse = ApiResponse<UserList>;
type UserListResult = Promise<UserListResponse[]>;

const data: UserListResult;
```

虽然多写了几行，但可读性提升了不止一个档次。

## 8. 写在最后

其实泛型这东西，说难也难，说简单也简单。

难的是一开始看到那些奇怪的符号，本能地会觉得"这肯定很深奥"。但只要你跨过那个心理门槛，动手写几个例子，就会发现：哦，原来就是这么回事。

我给初学者的建议是：
1. 先从 `Promise<T>` 和 `Array<T>` 这种现成的泛型用起，感受一下
2. 写工具函数的时候，试着用泛型代替 `any`
3. 不要追求一步到位，先写出来，再慢慢优化
4. 遇到搞不懂的泛型，先把它当成一个普通的参数来看

TS 是工具，不是目的。泛型能让你的代码更安全、更有自描述性，但也不要为了用而用。适合的才是最好的。

好了，以上就是我对 TypeScript 泛型的一些理解和踩坑记录。如果你刚转 TS 也在被泛型折磨，希望这篇文章能帮到你。

你在学 TS 的过程中遇到过什么让人头大的问题？欢迎在评论区聊聊~
