---
layout: doc

lastUpdated: false
title: TypeScript 泛型入门
description: 从 JavaScript 转 TypeScript 必看的泛型入门指南，帮你弄明白最让人困惑的泛型概念
category: TypeScript
date: 2026-04-29
---

# TypeScript 泛型入门

刚从 JS 转到 TS 的时候，我看到 `<T>` 这样的语法都是直接跳过的，心想这东西也太复杂了，先不管它再说。结果写着写着就发现，到处都是类型报错，尤其是在写一些通用函数的时候，要么就是写一堆重复的类型定义，要么就是直接用 `any` 掩耳盗铃。

后来花了点时间把泛型这个东西弄明白之后，才发现其实它没那么难，反而能帮我们写出更灵活、更安全的代码。这篇文章就从一个 JS 开发者的视角出发，讲讲泛型到底是什么，以及怎么用。

## 1. 先从 JS 的角度想问题

在写 JS 的时候，我们经常会写一些通用的函数。比如一个函数可以接收数组，然后返回数组的第一个元素：

```javascript
function getFirstItem(arr) {
  return arr[0];
}
```

这个函数很好用，不管传什么数组进去都能工作。但是到了 TS 里，问题就来了：如果我们给数组标类型，那这个函数就只能接收特定类型的数组了。

```typescript
function getFirstItem(arr: number[]) {
  return arr[0];
}

getFirstItem([1, 2, 3]); // 没问题
getFirstItem(['a', 'b', 'c']); // 报错！类型不匹配
```

总不能为每个类型都写一个函数吧？那也太蠢了。

::: tip 小提示
泛型要解决的，就是这种"代码逻辑相同，但数据类型不同"的场景。
:::

## 2. 泛型到底是什么

你可以把泛型理解成"类型的变量"。就像函数的参数可以接收不同的值一样，泛型的参数可以接收不同的类型。

还是刚才那个例子，用泛型改写一下：

```typescript
// 这里的 T 就是一个类型变量，调用函数的时候才确定具体是什么类型
function getFirstItem<T>(arr: T[]): T {
  return arr[0];
}

// 传数字数组，T 就变成 number
const num = getFirstItem([1, 2, 3]); // num 的类型是 number

// 传字符串数组，T 就变成 string
const str = getFirstItem(['a', 'b', 'c']); // str 的类型是 string
```

看到了吗？代码逻辑一点没变，只是多了个 `<T>`，这个函数就变成"通用"的了，而且类型信息还能正确地传递下去。

::: info
很多人看到 `<T>` 就害怕，其实 `T` 只是个变量名而已，你想用 `<X>`、`<MyType>` 都行。只是大家习惯用 `T`（Type 的首字母）而已。
:::

## 3. 最常见的使用场景

### 场景一：通用函数

这是泛型用得最多的地方。比如写一个可以交换数组两项位置的函数：

```typescript
function swap<T>(arr: T[], index1: number, index2: number): T[] {
  const result = [...arr];
  [result[index1], result[index2]] = [result[index2], result[index1]];
  return result;
}

// 数字数组也能用
const numbers = swap([1, 2, 3], 0, 2); // [3, 2, 1]

// 字符串数组也能用
const strings = swap(['a', 'b', 'c'], 0, 1); // ['b', 'a', 'c']
```

### 场景二：通用接口

定义接口的时候，也可以用泛型。比如一个通用的响应数据结构：

```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T; // data 的类型由调用时传入的泛型决定
}

// 用户数据响应
const userRes: ApiResponse<{ id: number; name: string }> = {
  code: 200,
  message: 'success',
  data: { id: 1, name: '南夏' }
};

// 列表数据响应
const listRes: ApiResponse<string[]> = {
  code: 200,
  message: 'success',
  data: ['a', 'b', 'c']
};
```

::: danger 踩坑提醒
我刚开始写的时候，经常忘了给泛型传具体类型，直接写 `ApiResponse`，然后 TS 就报错说"需要 1 个类型参数"。这个问题新手很容易碰到，记住定义了泛型参数，用的时候就要传进去。
:::

### 场景三：泛型类

写类的时候也可以用泛型，比如一个简单的栈数据结构：

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

// 数字栈
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);

// 字符串栈
const stringStack = new Stack<string>();
stringStack.push('hello');
```

## 4. 给泛型加点约束

有时候我们不希望泛型真的是"任意类型"，而是希望它至少有某些属性。这时候就可以用泛型约束。

比如我们想写一个函数，获取任何东西的 `length` 属性：

```typescript
// 这样写会报错，因为不是所有类型都有 length 属性
function getLength<T>(thing: T): number {
  return thing.length; // ❌ 类型 T 上不存在 length 属性
}
```

这时候就可以用 `extends` 来约束泛型：

```typescript
// 约束 T 必须有 length 属性
function getLength<T extends { length: number }>(thing: T): number {
  return thing.length;
}

getLength('hello'); // ✅ 字符串有 length
getLength([1, 2, 3]); // ✅ 数组有 length
getLength(123); // ❌ 报错！数字没有 length
```

这个特性非常有用，能让你的泛型函数既灵活又安全。

## 5. 多个泛型参数

泛型可以不止一个，比如一个函数可以接收两个不同类型的参数：

```typescript
function makePair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair = makePair(1, 'hello'); // 类型是 [number, string]
```

需要几个就写几个，用逗号分隔就行。

## 写在最后

其实泛型这个东西，说难也难，说简单也简单，关键是要换个角度去理解。不要把它想得太高大上，它就是个"类型参数"而已——跟函数的参数是一个道理，只不过一个传值，一个传类型。

刚学的时候不用追求一下子把所有用法都弄明白，先从最常用的场景入手：写通用函数的时候想想是不是可以用泛型代替 `any`，定义接口的时候看看哪些类型是可以抽出来的。写多了自然就熟练了。

我自己也是一路从各种类型报错里摸爬滚打过来的，如果你还有什么弄不明白的地方，欢迎在评论区留言交流。
