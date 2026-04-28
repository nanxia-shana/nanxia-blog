---
layout: doc

lastUpdated: false
title: TypeScript 入门及实践
description: 从基础语法到高级特性，结合 Vue/React 实战，系统学习 TypeScript
category: 前端基础
date: 2025-11-24
---

# TypeScript 入门及实践

## 1. TypeScript 简介

TypeScript 是微软开发的开源编程语言，它是 JavaScript 的超集。简单说就是：JS 有的它都有，还额外加了一套类型系统。最终 TS 代码会编译成 JS，在任何支持 JS 的环境都能运行。

### 1.1 为什么需要 TypeScript？

在大型项目中，纯 JS 确实有不少痛点：

- 类型错误只有运行时才暴露，经常是"线上崩了才发现传了个 undefined"
- 没有类型提示，看别人的代码全靠猜
- 重构就是噩梦，改个函数名要搜整个项目
- 对新特性支持滞后：枚举、装饰器这些 JS 还没有或者不成熟的特性，TS 早就支持了

TS 就是来解决这些问题的。

## 2. TypeScript 的优势

### 2.1 静态类型检查

写代码的时候就能发现类型错误，而不是等到上线才崩。比如你把 number 类型的变量赋值成 string，TS 直接就给你标红。

### 2.2 更好的 IDE 支持

智能提示更加准确，光标放到变量上就能看到完整的类型信息。重构的时候也特别爽，改个方法名所有引用的地方自动更新。

### 2.3 团队协作更顺畅

类型就是最好的文档。接手别人的代码，看接口定义就知道传什么参数、返回什么结构，不用一个个去翻实现。

### 2.4 JavaScript 的超集

完全兼容 JS，已有项目可以渐进式迁移，不用一次性全改。同时还能提前用上最新的 ECMAScript 特性。

## 3. TypeScript 基础语法

### 3.1 基本使用

```typescript
// 基本类型
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";

// undefined 和 null 比较特殊，单独声明的话就只能赋值自身
let a: undefined = undefined;
let b: null = null;

// 实际项目中一般配合联合类型用
let number1: number | undefined = undefined;
let arr1: number[] | null = null;
```

::: tip any 和 unknown 的区别
新手最容易犯的错就是上来就写 `any`，那跟写 JS 没啥区别。建议尽量用 `unknown`，它也能存任意类型，但调用属性方法的时候必须先做类型判断，更安全。
:::

```typescript
let data1: any = [];
let data2: unknown = [];

data1.push(2);  // 没问题，any 跳过所有检查
data2.push(2);  // 报错，类型不确定
(data2 as number[]).push(2);  // 类型断言后可以
if (Array.isArray(data2)) data2.push(2);  // 类型收窄后也可以
```

**数组和元组：**

```typescript
const list: number[] = [1, 2, 3];  // 写法1
const list2: Array<number> = [1, 2];  // 写法2

// 元组：固定长度、每个位置类型已知
const tuple: [string, number] = ["hello", 10]; // 元组
```

**枚举：**

```typescript
// 默认从0开始
enum Color { Red, Green, Blue }

// 数字枚举，可以指定起始值
enum Direction {
    Up = 1,
    Down,  // 自动变成2
    Left,  // 3
    Right  // 4
}

// 字符串枚举
enum HttpStatus {
    OK = "OK",
    NOT_FOUND = "NOT_FOUND",
    BAD_REQUEST = "BAD_REQUEST"
}
```

**类型推断：**

很多时候你不用写类型注解，TS 会自动推断：

```typescript
let inferredNumber = 42;  // 自动推断为 number
let inferredString = "hello";  // 自动推断为 string
let inferredArray = [1, 2, 3];  // 自动推断为 number[]
```

### 3.2 类型别名（Type）

类型别名用来给一个类型起个新名字，用 `type` 关键字。

**基础用法：**

```typescript
// 基本类型别名
type Name = string;
type Age = number;

// 联合类型，非常常用
type Status = "pending" | "fulfilled" | "rejected";
type ID = string | number;

// 交叉类型，合并多个类型
type Employee = Person & { employeeId: number };
```

**对象类型：**

```typescript
type Point = {
    x: number;
    y: number;
};

// 可选属性
type Config = {
    color?: string;
    width?: number;
};

// 只读属性
type Coordinates = {
    readonly lat: number;
    readonly long: number;
};
```

**函数类型：**

```typescript
// 普通函数类型
type GreetFunction = (name: string) => string;

// 元组类型
type Point2D = [number, number];
type Vector2D = [number, number?];  // 第二个元素可选
```

**工具类型：**

TS 内置了很多实用的工具类型，这个后面会单独讲，先看两个简单的：

```typescript
// Partial 让所有属性变可选
type PartialUser = Partial<User>;

// Pick 提取部分属性
type UserNameOnly = Pick<User, 'name' | 'id'>;
```

### 3.3 接口（Interface）

接口用来定义对象的结构，约束类的实现。跟 type 很像，但也有区别。

**基本接口：**

```typescript
interface User {
    name: string;
    age?: number;        // 可选属性
    readonly id: number; // 只读属性，初始化后不能改
}

const user: User = {
    name: "Tom",
    id: 1
};
```

**函数接口：**

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(src: string, sub: string): boolean {
    return src.search(sub) > -1;
};
```

**接口继承：**

```typescript
// 单继承
interface Dog extends Animal {
    breed: string;
}

// 多继承
interface Square extends Shape, PenStroke {
    sideLength: number;
}
```

**可索引类型：**

```typescript
// 数组结构
interface StringArray {
    [index: number]: string;
}

// 字典结构
interface Dictionary {
    [key: string]: string;
}
```

### 3.4 Interface vs Type

很多新手会纠结用哪个，其实记住原则就行：

| 特性 | Interface | Type |
|------|-----------|------|
| 声明合并 | ✅ 支持，多次声明会自动合并 | ❌ 不支持 |
| 联合类型 | ❌ | ✅ 支持 |
| 映射类型 | ❌ | ✅ 支持 |
| 继承 | 用 extends | 用 & |

::: tip 最佳实践
- 定义对象结构、类的契约、公共 API 用 interface
- 定义联合类型、工具类型、函数类型、元组用 type
- 保持项目风格一致就行
:::

## 4. TypeScript 高级语法

### 4.1 泛型

泛型可以说是 TS 最强大的特性之一，让你的类型也能"传参"。

**基础泛型：**

```typescript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 使用
let output1 = identity<string>("myString");  // 显式指定
let output2 = identity("myString");  // 类型推断，自动推导出 string
```

**泛型约束：**

```typescript
// 约束 T 必须有 length 属性
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // ✅ 知道有 length 属性了
    return arg;
}
```

**keyof 操作符：**

```typescript
// 确保第二个参数是对象的有效属性
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3 };
getProperty(x, "a");  // ✅
getProperty(x, "d");  // ❌ 报错，d 不是 x 的属性
```

**实用泛型工具类型：**

```typescript
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

// 所有属性变可选
type PartialTodo = Partial<Todo>;

// 提取部分属性
type TodoPreview = Pick<Todo, 'title' | 'completed'>;

// 排除部分属性
type TodoWithoutDescription = Omit<Todo, 'description'>;

// 所有属性只读
type ReadonlyTodo = Readonly<Todo>;
```

**条件类型 + infer：**

这个比较高级，但非常强大：

```typescript
// 推断函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 开箱即用，TS 内置了
type Fn = () => string;
type Result = ReturnType<Fn>;  // string
```

### 4.2 装饰器

装饰器是 TS 一个非常优雅的特性，可以用来给类、方法、属性附加额外的逻辑。

::: info 注意
装饰器目前还是实验性特性，需要在 tsconfig.json 中开启：
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```
:::

**类装饰器：**

```typescript
// 给类的原型添加属性
function reportable(isReportable: boolean) {
    return function (constructor: Function) {
        constructor.prototype.isReportable = isReportable;
    }
}

@reportable(true)
class BugReport {
    type = "report";
}
```

**方法装饰器：**

这个用得最多，比如做日志、性能监控：

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`调用 ${propertyKey}，参数：`, args);
        const result = originalMethod.apply(this, args);
        console.log(`结果：`, result);
        return result;
    }
}

class Calculator {
    @log
    add(x: number, y: number) {
        return x + y;
    }
}
```

### 4.3 类型断言

有时候你比 TS 更了解类型，这时候可以用类型断言：

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 尖括号写法（JSX 中不能用）
let strLength2: number = (<string>someValue).length;
```

::: danger 注意
类型断言不是类型转换，它只是告诉 TS"相信我，我知道我在做什么"，运行时不会真的做类型检查。别滥用，实在确定类型再用。
:::

## 5. 在 Vue 项目中使用 TypeScript

现在 Vue 对 TS 的支持已经非常好了，推荐直接用 Vite 的 vue-ts 模板。

### 5.1 项目初始化

```bash
npm create vite@latest my-project -- --template vue-ts
```

### 5.2 配置 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,  // 一定要开严格模式！
    "jsx": "preserve",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### 5.3 组件示例

```vue
<script lang="ts" setup>
import { ref } from 'vue'

// 定义接口
interface Todo {
  id: number
  title: string
  completed: boolean
}

// Props 类型
const props = defineProps<{
  initialTodos: Todo[]
}>()

const todos = ref<Todo[]>(props.initialTodos)
const newTodo = ref('')

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      title: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}
</script>

<template>
  <div>
    <input v-model="newTodo" @keyup.enter="addTodo" />
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" />
        {{ todo.title }}
      </li>
    </ul>
  </div>
</template>
```

## 6. 在 React 项目中使用 TypeScript

React 对 TS 的支持也非常成熟，官方脚手架都有专门的模板。

### 6.1 项目初始化

```bash
# Create React App
npx create-react-app my-app --template typescript

# Vite
npm create vite@latest my-app -- --template react-ts
```

### 6.2 组件示例

```tsx
import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface Props {
  initialTodos: Todo[];
}

const TodoList: React.FC<Props> = ({ initialTodos }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), title: newTodo, completed: false }
      ]);
      setNewTodo('');
    }
  };

  return (
    <div>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={addTodo}
      />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos(todos.map(t =>
                  t.id === todo.id ? { ...t, completed: !t.completed } : t
                ))
              }}
            />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

## 7. 全局声明

项目中经常会用到一些全局的东西，比如环境变量、window 上挂的对象，这时候需要写类型声明。

在 src/types 目录下建几个 .d.ts 文件：

**global.d.ts - 全局变量：**

```typescript
declare const API_BASE_URL: string;
declare const DEBUG_MODE: boolean;

// 扩展 window 对象
declare global {
    interface Window {
        config: {
            apiUrl: string;
            theme: 'light' | 'dark';
        };
    }
}

export {};  // 这个 export 不能少，不然不生效
```

**env.d.ts - 环境变量：**

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

**modules.d.ts - 模块声明：**

```typescript
// 给没有类型的第三方模块加声明
declare module 'some-untyped-module' {
    export function doSomething(): void;
}

// 样式文件声明
declare module '*.css' {
    const css: { [key: string]: string };
    export default css;
}

// 图片资源声明
declare module '*.png' {
    const value: string;
    export default value;
}
```

## 8. TypeScript 内置工具类型

TS 内置了十多种工具类型，不用自己实现，直接用就行。

### 8.1 部分类型工具

```typescript
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

// Partial - 所有属性变可选，更新接口特别好用
type PartialTodo = Partial<Todo>;

// Required - 所有属性变必选
type RequiredTodo = Required<PartialTodo>;

// Readonly - 所有属性只读
type ReadonlyTodo = Readonly<Todo>;
```

### 8.2 提取和排除类型

```typescript
// Pick - 提取部分属性
type TodoPreview = Pick<Todo, 'title' | 'completed'>;

// Omit - 排除部分属性
type TodoWithoutDescription = Omit<Todo, 'description'>;

// Extract - 提取联合类型中的成员
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>;  // 'a'

// Exclude - 排除联合类型中的成员
type T1 = Exclude<'a' | 'b' | 'c', 'a'>;  // 'b' | 'c'
```

### 8.3 类型推断工具

```typescript
// ReturnType - 获取函数返回值类型
function f1(): { a: number; b: string } {
    return { a: 1, b: 'hello' };
}
type F1Return = ReturnType<typeof f1>;  // { a: number; b: string }

// Parameters - 获取函数参数类型
function f2(arg1: number, arg2: string): void {}
type F2Params = Parameters<typeof f2>;  // [number, string]
```

## 9. 最佳实践

### 9.1 一定要开严格模式

```json
{
  "compilerOptions": {
    "strict": true  // 这个配置一定要开，否则 TS 类型检查很松
  }
}
```

### 9.2 不要滥用 any

any 是类型系统的逃生门，用多了跟写 JS 没区别。实在不确定类型先用 unknown。

### 9.3 善用类型推断

不是所有地方都要写类型注解。比如变量赋值，TS 能自动推断的就别写了，徒增代码量。

### 9.4 类型定义放哪里？

- 组件专属的 props/state 类型，直接写在组件文件顶部就行
- 多个组件共用的业务类型，抽到 src/types 目录下统一管理
- API 返回类型可以跟接口请求放一起
