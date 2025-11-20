# TypeScript 入门及实践

## 1. TypeScript 简介
TypeScript 是由 Microsoft 开发和维护的开源编程语言，它是 JavaScript 的超集，为 JavaScript 添加了可选的静态类型和基于类的面向对象编程特性。TypeScript 代码最终会被编译成 JavaScript 代码，可以在任何支持 JavaScript 运行环境中执行。

### 1-1. 为什么需要 TypeScript ？
在大型项目开发中，JavaScript 存在以下问题：

- 无法在编译阶段发现类型错误
- 对开发工具的支持不够友好
- 代码重构困难
- 对 ES6+ 特性支持有限：
  - 装饰器（Decorators）：JavaScript 目前仍处于 Stage 3 阶段，而 TypeScript 已经支持
  - 私有字段（Private Fields）：在旧版 JavaScript 中无法真正实现私有属性
  - 枚举（Enums）：JavaScript 不支持枚举类型
  - 命名空间（Namespace）：JavaScript 缺乏内置的命名空间支持
  - 泛型（Generics）：JavaScript 没有泛型的概念
  - 接口（Interface）：JavaScript 不支持接口定义
  - 类型模块（Type Modules）：JavaScript 无法定义和导入类型定义
TypeScript 很好地解决了这些问题。

## 2. TypeScript 的优势
### 2-1. 静态类型检查
  - 在编译阶段就能发现类型错误
  - 减少运行时错误
  - 提高代码质量

### 2-2. 更好的 IDE 支持

  - 智能提示更加准确
  - 代码重构更加方便
  - 查找引用和定义更加便捷

### 2-3. 更好的团队协作

  - 类型系统作为代码文档
  - 接口定义清晰
  - 代码可维护性更强

### 2-4. JavaScript 的超集

  - 完全兼容 JavaScript
  - 可以逐步迁移
  - 拥有最新的 ECMAScript 特性

## 3. TypeScript 基础语法
### 3-1. 基本使用
```TypeScript
// 基本类型
// js 也有的
let isDone: boolean = false; // 布尔值
isDone = true ; // 正确
isDone = 2; // 编译报错，不能将 number 类型赋值给布尔类型

let decimal: number = 6; // 数字

let color: string = "blue"; // 字符串

let sym: symbol = Symbol("key");  // symbol

let big1: bigint = BigInt(9007199254740991); // bigint

let a:undefined = undefined; // undefined

let b:null = null; // null

// 声明为 undefined 或 null 的变量，后续任意类型的数据均不能为该变量赋值
// 所以如果要初始化为 undefined 或 null 的值，我们需要使用联合类型
let number1:number|undefined = undefined;
let arr1:number[]|null = null;

// ts 特有
// 任意值，等同于 js 不声明,后续可任意更改类型
let data1:any = []; 
// 不确定值，可任意更改类型，和 any 区别为调用该值的方法或属性时，
// 需要通过 if 判断明确类型，或者使用断言语法
let data2:unknown= []; 

// any和unknown区别的案例
data1.push(2); // 正确
data2.push(2); // 报错 'data2' is of type 'unknown'
(data2 as number[]).push(2); // 正确
if(Array.isArray(data2)) data2.push(2); // 正确

const list: number[] = [1, 2, 3]; // 数组写法1
const list:Array<number> = [1,2]; // 数组写法2
const tuple: [string, number] = ["hello", 10]; // 元组

// 默认枚举,默认 Red 为 0,后序依次递增，如 green 为 1，blue 为 2 ...
enum Color {Red, Green, Blue}

// 数字枚举
enum Direction {
    Up = 1,        // 可以设置起始值
    Down,          // 自动递增为 2
    Left,          // 3
    Right          // 4
}

// 字符串枚举
enum HttpStatus {
    OK = "OK",
    NOT_FOUND = "NOT_FOUND",
    BAD_REQUEST = "BAD_REQUEST",
    SERVER_ERROR = "SERVER_ERROR"
}

// 异构枚举（混合型）
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
// 枚举使用
let c: Color = Color.Green;

// Any 和 Unknown
let notSure: any = 4;
let uncertain: unknown = 4;

// 类型不匹配示例
let num: number = 42;
// 以下赋值会导致编译错误
// num = "42"; // 错误：不能将类型"string"分配给类型"number"
// num = true; // 错误：不能将类型"boolean"分配给类型"number"

let str: string = "hello";
// str = 42; // 错误：不能将类型"number"分配给类型"string"

// 使用类型断言可以绕过类型检查，但要谨慎使用
let value: any = "hello";
let strLength: number = (value as string).length; // 正确
let numValue: number = 42;
// let strValue: string = numValue as string; // 错误：不能直接断言不相关的类型

// Void , Null 和 Undefined
function warnUser(): void {
    console.log("This is a warning message");
}

// 类型推导示例
let inferredNumber = 42; // 自动推断为 number 类型
let inferredString = "hello"; // 自动推断为 string 类型
let inferredArray = [1, 2, 3]; // 自动推断为 number[] 类型
let inferredObject = { name: "Alice", age: 25 }; // 自动推断为{ name: string; age: number }类型

// Never 类型
function error(message: string): never {
    throw new Error(message);
}
 
// Symbol 类型
const sym = Symbol('me');
const obj = {
    [sym]: 'value'
};

// BigInt 类型
const max = BigInt(Number.MAX_SAFE_INTEGER);
```
### 3-2. 类型别名（Type）
类型别名用来给一个类型起个新名字，使用 `type` 关键字。

#### 3-2-1. 基本类型别名
```TypeScript
// 基本类型
type Name = string;
type Age = number;
type Married = boolean;

// 字面量类型
type Greeting = "Hello";
type Count = 1 | 2 | 3;

// 联合类型
type Status = "pending" | "fulfilled" | "rejected";
type ID = string | number;

// 交叉类型
type Employee = Person & { employeeId: number };
```
#### 3-2-2. 对象类型
```TypeScript
// 简单对象类型
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

// 索引签名
type Dictionary = {
    [key: string]: string;
};
```
#### 3-2-3. 函数类型
```TypeScript
// 普通函数类型
type GreetFunction = (name: string) => string;

// 带有属性的函数类型
type ValidatorWithMessage = {
    (value: string): boolean;
    message: string;
};

// 函数重载
type Overloaded = {
    (x: string): number;
    (x: number): string;
};
```
```TypeScript
// 带有属性的函数类型使用示例
// 实现一个符合 ValidatorWithMessage 的对象
const myValidator: ValidatorWithMessage = (value: string): boolean => {
  return value.length > 0;
};

// 注意：下面这行是必须的，因为类型定义中要求有 `message` 属性！
myValidator.message = "输入不能为空";

// 使用
console.log(myValidator("Hello"));  // true
console.log(myValidator(""));       // false
console.log(myValidator.message);   // "输入不能为空"
```
#### 3-2-4. 元组类型
```TypeScript
// 基本元组
type Point2D = [number, number];
type Point3D = [number, number, number];

// 可选元素的元组
type Vector2D = [number, number?];

// 带有剩余元素的元组
type StringNumberBooleans = [string, number, ...boolean[]];
// 第 1 个元素​必须是 string 类型
// 第 2 个元素​必须是 number 类型
// 第 3 个及之后的元素​可以有任意多个（包括零个），但必须是 boolean 类型
```
#### 3-2-5. 工具类型
```TypeScript
// 提取属性类型
// 从对象类型中提取某个属性的类型
type Person = {
    name: string;
    age: number;
};
type AgeType = Person['age']; // number

// 映射类型
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
// 它遍历某个泛型类型 T 的所有属性名（P）
// 然后为每个属性重新定义类型为：原类型 T[P] 或 null
// 使用示例
type NullablePerson = Nullable<Person>;
/* 等价于：
{
  name: string | null;
  age: number | null;
}
*/

// 条件类型
// 语法：T extends SomeType ? TrueType : FalseType
// 含义：如果 T 是 null 或 undefined，返回 never（表示剔除）；否则返回 T 本身
type NonNullable<T> = T extends null | undefined ? never : T;
// 使用示例
type Foo = string | number | null | undefined;
type Bar = NonNullable<Foo>; // string | number

// 模板字面量类型
type EventName<T extends string> = `${T}Changed`;
type UserEvents = EventName<'name' | 'age'>; // 'nameChanged' | 'ageChanged'
```
#### 3-2-6. 递归类型
```TypeScript
// JSON值类型
type JSONValue = 
    | string
    | number
    | boolean
    | null
    | JSONValue[]       // JSON 数组，其中的每一项也可以是任意 JSON 值
    | { [key: string]: JSONValue };     // 	JSON 对象，其每个属性的值也可以是任意 JSON 值

// 嵌套对象类型
// 这是一个递归联合类型，表示一个值可以是一个 number（数字）
// 或者一个数组，数组中的每个元素也可以是 NestedNumbers（即数字或嵌套数组）
// ✅ 它支持无限嵌套的数字数组结构
type NestedNumbers = number | NestedNumbers[];

// 文件系统结构
type FileSystemObject = {
    name: string;
    size: number;
    type: 'file' | 'directory';
    children?: FileSystemObject[];
};
```
#### 3-2-7. 实用工具类型
```TypeScript
// 部分属性可选
// 使类型 T 的所有属性变为可选
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// 所有属性必选
// ​使类型 T 的所有属性变为必选，使用 -?移除可选标记（也就是强制让属性变为必选）
type Required<T> = {
    [P in keyof T]-?: T[P];
};

// 所有属性只读
// 使类型 T 的所有属性变为只读
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 从T中选择部分属性
// 从类型 T 中选取部分属性 K​ 组成新类型
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// 排除部分属性
// 从类型 T 中排除某些属性 K，保留其余
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
#### 3-2-8. 实际应用示例
```TypeScript
// API响应类型
type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
    timestamp: number;
};

// 用户接口
interface User {
    id: number;
    username: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

// 用户服务接口
interface UserService {
    getUser(id: number): Promise<ApiResponse<User>>;
    updateUser(id: number, data: Partial<User>): Promise<ApiResponse<void>>;
    deleteUser(id: number): Promise<ApiResponse<void>>;
}
```

### 3-3. 接口（Interface）
接口是TypeScript中一个非常强大的特性，它可以定义对象的类型、约束类的实现、定义函数类型等。接口的作用是为这些类型命名和为你的代码或第三方代码定义契约。

#### 3-3-1. 基本接口
```TypeScript
// 基本对象接口
interface User {
    name: string;
    age?: number;        // 可选属性
    readonly id: number; // 只读属性
}

const user: User = {
    name: "Tom",
    id: 1
};

// 函数接口
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(src: string, sub: string): boolean {
    return src.search(sub) > -1;
};

// 可索引的接口
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];
```