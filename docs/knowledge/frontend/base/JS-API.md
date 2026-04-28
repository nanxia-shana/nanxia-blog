---
layout: doc

lastUpdated: false
title: JavaScript - API 特性与实用技巧
description: 盘点 JS 中那些强大但容易被忽略的 API，结合实战案例讲解如何优雅地解决开发难题 
category: 前端基础
date: 2026-04-23
---

# JavaScript - API 特性与实用技巧

> [!TIP]
> 未标注说明的API均为静态方法。

## 1. 数据类型与结构操作

### 1-1. 对象

  | API               | 类别 | 核心功能                | 一句记忆         |
  | ----------------- | :--: | :--------------------: | --------------: |
  | Object.assign     | 静态 | 合并/拷贝对象（浅）      | 分配属性         |
  | Object.keys       | 静态 | 获取所有键的数组         | 键的集合         |
  | Object.values     | 静态 | 获取所有值的数组         | 值的集合         |
  | Object.entries    | 静态 | 获取所有[键, 值]对的数组 | 条目列表         |
  | Object.fromEntries| 静态 | 从[键, 值]对数组创建对象 | 从条目创建对象    |
  | Object.freeze     | 静态 | 冻结对象，使其不可变     | 冻结住           |
  | Object.hasOwn     | 静态 | 安全地检查自身属性       | 拥有自己的属性吗？|
  | hasOwnProperty    | 原型 | 检查自身属性（可能被覆盖）| 同上，但不安全   |

---

- #### <span class="Fira-Code-Font">Object.assign(target, ...sources)</span>

> `Object.assign()` 方法用于将所有可枚举的自身属性从一个或多个源对象复制到目标对象，并返回修改后的目标对象。
> [!IMPORTANT]
> - ***target：*** 目标对象，接收源对象的属性。会被修改。
> - ***...sources：*** 一个或多个源对象，它们的属性将被复制到目标对象。
> - ***返回值：*** 经过修改的 target 对象。

::: details 特性 1：浅拷贝 (Shallow Copy)
这是最重要也是最容易踩坑的特性。`Object.assign()` 只复制属性的值。如果属性值是引用类型（如对象、数组），则复制的是内存地址的引用，而非对象本身。
```JavaScript
// 示例：浅拷贝的陷阱
const source = {
  name: 'Original',
  details: { age: 25, city: 'London' } // 引用类型属性
};

const target = Object.assign({}, source); // 创建 source 的浅拷贝

// 修改拷贝对象的基本类型属性
target.name = 'Copy';
console.log(source.name); // 'Original' (未受影响)

// 修改拷贝对象的引用类型属性的内部值
target.details.age = 30;
console.log(source.details.age); // 30 (源对象也被改变了！)
```
:::

::: details 特性 2：属性覆盖 (Property Overwriting)
当多个源对象具有相同的属性时，后面的源对象会覆盖前面的。
```JavaScript
// 示例：属性覆盖规则
const target = { a: 1, b: 1 };
const source1 = { b: 2, c: 2 };
const source2 = { c: 3, d: 3 };

const result = Object.assign(target, source1, source2);
console.log(result); // { a: 1, b: 2, c: 3, d: 3 }
// b: 被 source1 覆盖
// c: 被 source2 覆盖
// d: 来自 source2
```
:::

::: details 特性 3：只复制可枚举的自身属性
- **自身属性**：不包括从原型链继承的属性。
- **可枚举属性**：enumerable: true 的属性（通常是我们自己定义的属性）。
```JavaScript
// 示例：忽略不可枚举和继承属性
// 创建一个父对象，并定义一个可枚举属性和一个不可枚举属性
const parent = {};
Object.defineProperty(parent, 'inheritedEnumerable', {
  value: 'I am inherited and enumerable',
  enumerable: true
});
Object.defineProperty(parent, 'inheritedNonEnum', {
  value: 'I am inherited but NOT enumerable',
  enumerable: false
});

// child 继承自 parent
const child = Object.create(parent);
// 给 child 自身添加一个可枚举属性
child.ownEnumerable = 'I am own and enumerable';

// 使用 Object.assign 拷贝
const assignedObj = Object.assign({}, child);

console.log(assignedObj);
// 输出: { ownEnumerable: 'I am own and enumerable' }
// 注意：inheritedEnumerable 和 inheritedNonEnum 都没有被拷贝进来！
```
:::

::: details 特性 4：目标对象会被修改
Object.assign() 直接修改第一个参数 target。如果不想修改现有对象，通常需要传入一个空对象 {} 作为目标。
```JavaScript
// 示例：避免修改原对象
const original = { a: 1 };

// ❌ 错误：修改了 original
Object.assign(original, { b: 2 });
console.log(original); // { a: 1, b: 2 }

// ✅ 正确：创建一个新对象
const newObject = Object.assign({}, original, { b: 2 });
console.log(original);  // { a: 1 } (未被修改)
console.log(newObject); // { a: 1, b: 2 }

// 创建新对象时使用 { ...obj } 展开语法更简洁
const newObject = { ...original, ...{ b: 2 } }
console.log(original);  // { a: 1 } (未被修改)
console.log(newObject); // { a: 1, b: 2 }

```
**为什么展开语法有时更优？**
- 语法更简洁、直观。
- 不会修改任何现有对象，因为它总是创建一个新的字面量。
- 可读性更好。

**何时仍需要 Object.assign()？**
- 需要兼容不支持 ES2018 的旧环境（展开语法用于对象是在 ES2018 中标准化的）。
- 需要显式地将属性赋值到一个已存在的目标对象上（而不是总是创建新对象）。
:::

---

- #### <span class="Fira-Code-Font">Object.keys(obj) 和 Object.values(obj)</span>
> - `object.keys()` 是一个静态方法，它返回一个由一个给定对象的自身可枚举属性名组成的数组，其顺序与通过 `for...in` 循环遍历该对象时返回的顺序一致（对于字符串键，现代 JS 引擎保证了插入顺序）。
> - `Object.values()` 是一个静态方法，它返回一个由一个给定对象的自身可枚举属性值组成的数组，其顺序与 `Object.keys()` 返回的键名数组的顺序一一对应。
>
> 它们是一对“孪生兄弟”，一个拿“键”（key），一个拿“值”（value）。

> [!IMPORTANT]
> - ***obj：*** 要返回其可枚举自身属性的对象。非对象类型（如原始值）会被强制转换为对象。
> - ***返回值：*** 一个由字符串组成的数组，每个字符串是该对象的一个自身可枚举属性的名称/值。

::: details 特性 1：传入的参数会被强制转换为对象
如果传入的参数不是对象，它会被强制转换为对象。例如，Object.keys("abc")会将字符串 "abc"转换为 String 对象，然后返回其索引 ["0", "1", "2"]。
```JavaScript
const text = "abc";

console(object.keys(text));   //输出：["0", "1", "2"]
console(object.value(text));   //输出：["a", "b", "c"]
```
:::

::: details 特性 2：只返回“自身”属性 (Own Properties)
它不会返回从原型链继承来的属性的键/值。
```JavaScript
function MyConstructor() {
this.instanceProp = 'I am an instance property';
}
MyConstructor.prototype.prototypeProp = 'I am a prototype property';

const myObj = new MyConstructor();

console.log(Object.keys(myObj)); // 输出: ['instanceProp']
console.log(Object.values(myObj)); // 输出: ['I am an instance property']
// 'prototypeProp' 没有被包含在内
```
:::

::: details 特性 3：只返回“可枚举”属性 (Enumerable Properties)
使用 Object.defineProperty定义的 enumerable: false的属性会被忽略。
```JavaScript
const book = {};

// 可枚举属性 (默认)
book.title = 'The Great Gatsby';

// 不可枚举属性
Object.defineProperty(book, 'isbn', {
  value: '9780743273565',
  enumerable: false
});

console.log(Object.keys(book)); // 输出: ['title']
console.log(Object.values(book)); // 输出: ['The Great Gatsby']
// 'isbn' 没有被包含在内
```
:::

::: details 特性 4：属性顺序
对于 ES6 及以后，属性顺序遵循以下规则：
- 所有**数字键**按升序排列。
- 所有**字符串键**（包括 Symbols 除外）按插入顺序排列。
- 所有 **Symbol 键**按插入顺序排列。
- Object.keys()返回的数组只包含字符串键，并按上述规则排序。
```JavaScript
const obj = {
  z: 1,
  2: 'a',
  b: 2,
  1: 'b',
  a: 3
};

// 顺序解释: 数字键 '1', '2' 最先，按数值排序。然后是字符串键 'z', 'b', 'a'，按插入顺序。
console.log(Object.keys(obj)); // 输出: ['1', '2', 'z', 'b', 'a']\
// Object.values()返回的数组顺序严格依赖于 Object.keys()返回的键的顺序。
console.log(Object.values(obj)); // 输出: ['b', 'a', 1, 2, 3]
```
:::

---

- #### <span class="Fira-Code-Font">Object.entries(obj)</span>
> `Object.entries()` 是一个静态方法，它返回一个由一个给定对象的自身可枚举属性的键值对组成的数组。这个数组中的每个元素都是一个 [key, value] 形式的子数组。

> [!IMPORTANT]
> - ***obj：*** 要返回其可枚举自身属性键值对的对象。
> - ***返回值：*** 一个由 [key, value]子数组组成的新数组。

::: details 特性 1：只返回“自身”属性 (Own Properties)
它**不会**返回从原型链继承来的属性的键值对。
```JavaScript
function MyConstructor() {
  this.instanceData = 'Instance Value';
}
MyConstructor.prototype.prototypeData = 'Prototype Value';

const myObj = new MyConstructor();

console.log(Object.entries(myObj)); // 输出: [ ['instanceData', 'Instance Value'] ]
// 原型链上的 'prototypeData' 没有被包含在内
```
:::

::: details 特性 2：只返回“可枚举”属性 (Enumerable Properties)
使用 `Object.defineProperty` 定义的 `enumerable: false` 的属性的键值对会被忽略。
```JavaScript
const config = {};

config.apiUrl = 'https://api.example.com'; // 可枚举

Object.defineProperty(config, 'secretToken', {
  value: 'xyz-123-abc',
  enumerable: false
});

console.log(Object.entries(config)); // 输出: [ ['apiUrl', 'https://api.example.com'] ]
// 'secretToken' 没有被包含在内
```
:::

::: details 特性 3：顺序保证
返回的二维数组中，子数组的顺序与 `Object.keys()` 返回的键名数组的顺序完全一致。
```JavaScript
const data = {
  z: 1,
  2: 'a',
  b: 2,
  1: 'b',
};

const entries = Object.entries(data);
const keys = Object.keys(data);

console.log('Keys:', keys);     // Keys: ['1', '2', 'z', 'b']
console.log('Entries:', entries);
// Entries: [ ['1', 'b'], ['2', 'a'], ['z', 1], ['b', 2] ]
```
:::

---

- #### <span class="Fira-Code-Font">Object.fromEntries()</span>
> `Object.fromEntries()`是一个静态方法，它接收一个**键值对列表**（如数组或其他实现了可迭代协议的对象），并将其转换回一个**新的对象**。

> [!IMPORTANT]
> - ***iterable：*** 一个可迭代的对象（如 Array, Map, Set等），其每个元素本身也必须是一个可迭代的**长度为 2**​ 的序列（最常见的是 [key, value] 形式的数组）。
> - ***返回值：*** 一个由 iterable 中的键值对构成的新对象。

::: details 特性 1：基本转换逻辑
它将一个 `[[k1, v1], [k2, v2], ...]` 结构的数组，转换为 `{ k1: v1, k2: v2, ... }` 结构的对象。
```JavaScript
const entries = [ ['name', 'Alice'], ['age', 30], ['city', 'Paris'] ];

const obj = Object.fromEntries(entries);
console.log(obj);
// 输出: { name: 'Alice', age: 30, city: 'Paris' }
```
:::

::: details 特性 2：键的唯一性：后出现者覆盖先出现者
如果输入的键值对列表中有重复的键，最终对象中只会保留最后一个该键对应的值。
```JavaScript
const entriesWithDuplicateKeys = [
  ['id', 101],
  ['role', 'user'],
  ['id', 202] // 重复的键 'id'
];

const obj = Object.fromEntries(entriesWithDuplicateKeys);
console.log(obj);
// 输出: { id: 202, role: 'user' } // 只有最后一个 'id' 生效
```
:::

::: details 特性 3：与 `Object.entries()` 的互逆关系
这是它最核心的特性。对一个对象使用 `Object.entries()` 再用 `Object.fromEntries()` 转换回去，可以得到一个**浅拷贝**的新对象（键的顺序可能会根据 ES6+ 规范被规范化）。
```JavaScript
const originalObj = { a: 1, b: 2, c: 3 };

const roundTrip = Object.fromEntries(Object.entries(originalObj));

console.log(roundTrip); // 输出: { a: 1, b: 2, c: 3 }
console.log(roundTrip === originalObj); // 输出: false (是不同的对象)
```
:::

::: details 特性 4：接受任何可迭代对象
只要传入的对象是可迭代的，并且其元素是长度为 2 的可迭代对象，就可以被正确转换。
```JavaScript
// 1. 使用 Map
const map = new Map([ ['x', 10], ['y', 20] ]);
console.log(Object.fromEntries(map)); // 输出: { x: 10, y: 20 }

// 2. 使用 Set (Set 的元素必须是 [key, value] 数组)
const set = new Set([ ['p', 'apple'], ['q', 'banana'] ]);
console.log(Object.fromEntries(set)); // 输出: { p: 'apple', q: 'banana' }

// 3. 使用 Generator (高级用法)
function* entryGenerator() {
  yield ['key1', 'value1'];
  yield ['key2', 'value2'];
}
console.log(Object.fromEntries(entryGenerator())); // 输出: { key1: 'value1', key2: 'value2' }
```
:::

- #### <span class="Fira-Code-Font">Object.freeze()</span>
> `Object.freeze()` 是一个静态方法，用于冻结一个对象，使其不可被修改。冻结后，不能添加新属性、删除现有属性、修改属性枚举性/可写性/配置性，也不能修改属性的值。

> [!IMPORTANT]
> - ***obj：*** 要冻结的对象。
> - ***返回值：*** 被冻结的对象（不是副本，就是原对象本身）。

::: details 特性 1：浅冻结 (Shallow Freeze)
与 `Object.assign()` 类似，`Object.freeze()` 只冻结对象的直接属性。如果属性值是引用类型（如嵌套对象），这些内部对象仍然可以被修改。
```JavaScript
const user = {
  name: 'Alice',
  profile: {
    age: 25,
    city: 'London'
  }
};

Object.freeze(user);

// 无法修改直接属性
user.name = 'Bob';
console.log(user.name); // 'Alice'

// 嵌套对象仍然可以修改
user.profile.age = 30;
console.log(user.profile.age); // 30
```

**实现深冻结：**
```JavaScript
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Object.isFrozen(obj[key])) {
      deepFreeze(obj[key]);
    }
  });
  return obj;
}

const frozenUser = deepFreeze({
  name: 'Alice',
  profile: { age: 25 }
});
frozenUser.profile.age = 30;
console.log(frozenUser.profile.age); // 25
```
:::

::: details 特性 2：检查对象是否被冻结
使用 `Object.isFrozen()` 可以检测一个对象是否被冻结。
```JavaScript
const obj1 = { a: 1 };
const obj2 = { b: 2 };
Object.freeze(obj2);

console.log(Object.isFrozen(obj1)); // false
console.log(Object.isFrozen(obj2)); // true
```
:::

---

- #### <span class="Fira-Code-Font">Object.hasOwn() 和 hasOwnProperty</span>
> 这两个方法都用于检查一个对象是否自身拥有指定的属性（不包括原型链继承的属性）。`Object.hasOwn()` 是 ES2022 新增的，推荐作为 `hasOwnProperty` 的安全替代方案。

> [!IMPORTANT]
> - **`Object.hasOwn(obj, prop)`**：静态方法，`obj` 是目标对象，`prop` 是属性名
> - **`obj.hasOwnProperty(prop)`**：原型方法，直接在对象上调用
> - ***返回值：*** 布尔值，表示属性是否是对象自身拥有的

::: details 特性 1：只检查自身属性，不包括原型链
两者都只会检查对象自身的属性，不会检查从原型链继承来的属性。
```JavaScript
const person = { name: 'Alice' };

console.log(Object.hasOwn(person, 'name')); // true
console.log(person.hasOwnProperty('name')); // true

console.log(Object.hasOwn(person, 'toString')); // false
console.log(person.hasOwnProperty('toString')); // false
```
:::

::: details 特性 2：为什么 Object.hasOwn() 更安全
`hasOwnProperty` 存在两个安全隐患：对象可能覆盖了 `hasOwnProperty` 方法，或者对象是 `Object.create(null)` 创建的，没有原型链。

```JavaScript
// 问题 1：方法被覆盖
const badObj = {
  hasOwnProperty: () => true,
  secret: 'data'
};
console.log(badObj.hasOwnProperty('secret')); // 总是返回 true

// 问题 2：无原型对象
const nullProtoObj = Object.create(null);
nullProtoObj.key = 'value';
// nullProtoObj.hasOwnProperty('key'); // 报错：hasOwnProperty 不存在

// 使用 Object.hasOwn() 两者都能正常工作
console.log(Object.hasOwn(badObj, 'secret')); // true
console.log(Object.hasOwn(nullProtoObj, 'key')); // true
```
:::

---

### 1-2. 数组

| API               | 类别  | 核心功能                  | 一句记忆             |
| ----------------- | :---: | :-----------------------: | -----------------: |
| Array.map     | 原型 | 转换每个元素，返回新数组     | 一一映射，不变原数组 |
| Array.filter  | 原型 | 筛选符合条件的元素           | 过滤保留，返回新数组 |
| Array.reduce  | 原型 | 累计聚合为单一值           | 化整为一，万能转换   |
| Array.find    | 原型 | 找到第一个符合条件的元素     | 找到即停，找不到返回 undefined |
| Array.sort    | 原型 | 原地排序（默认字典序）       | 排序，会改变原数组   |
| Array.from              | 静态 | 类数组/可迭代对象转真数组     | 转正数组，支持映射   |

---

- #### <span class="Fira-Code-Font">Array.map()</span>
> `map()` 方法创建一个新数组，其结果是该数组中的每个元素都调用一次提供的函数后的返回值。

> [!IMPORTANT]
> - ***callback(currentValue, index, array)：*** 生成新数组元素的函数
> - ***thisArg：*** 执行 callback 时用作 this 的值（可选）
> - ***返回值：*** 一个由原数组每个元素执行回调的结果组成的新数组

::: details 特性 1：不修改原数组，返回新数组
`map` 是纯函数，不会改变原数组，总是返回一个全新的数组。
```JavaScript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);

console.log(numbers); // [1, 2, 3, 4] 原数组不变
console.log(doubled); // [2, 4, 6, 8] 新数组
```
:::

::: details 特性 2：callback 的三个参数
回调函数接收三个参数：当前元素、当前索引、原数组。
```JavaScript
const fruits = ['apple', 'banana', 'cherry'];

const result = fruits.map((fruit, index, array) => {
  return {
    index,
    fruit,
    arrayLength: array.length
  };
});
```
:::

---

- #### <span class="Fira-Code-Font">Array.filter()</span>
> `filter()` 方法创建一个新数组，包含所有通过测试函数的元素。

> [!IMPORTANT]
> - ***callback(element, index, array)：*** 测试函数，返回 true 表示保留该元素
> - ***返回值：*** 一个由通过测试的元素组成的新数组，如果没有通过的返回空数组

::: details 特性 1：只保留符合条件的元素
```JavaScript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]
```
:::

::: details 特性 2：数组去重技巧
结合 `indexOf` 实现去重：
```JavaScript
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = arr.filter((item, index, self) => self.indexOf(item) === index);
console.log(unique); // [1, 2, 3, 4, 5]
```
:::

---

- #### <span class="Fira-Code-Font">Array.reduce()</span>
> `reduce()` 方法对数组中的每个元素执行一个 reducer 函数（升序执行），将其结果汇总为单个返回值。它是数组方法中最强大、最灵活的一个。

> [!IMPORTANT]
> - ***callback(accumulator, currentValue, currentIndex, array)：*** reducer 函数
> - ***initialValue：*** 作为第一次调用 callback 时第一个参数的值（强烈建议总是提供）
> - ***返回值：*** 累计后的结果

::: details 特性 1：基础用法 - 数值求和、求积
```JavaScript
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

const product = numbers.reduce((acc, curr) => acc * curr, 1);
console.log(product); // 120
```
:::

::: details 特性 2：可以模拟所有其他数组方法
`reduce` 是一个万能转换器，可以用它实现 `map`、`filter`、`groupBy` 等功能。
```JavaScript
const numbers = [1, 2, 3, 4];

// 用 reduce 实现 map
const mapResult = numbers.reduce((acc, curr) => {
  acc.push(curr * 2);
  return acc;
}, []);
console.log(mapResult); // [2, 4, 6, 8]

// 用 reduce 实现 filter
const filterResult = numbers.reduce((acc, curr) => {
  if (curr % 2 === 0) acc.push(curr);
  return acc;
}, []);
console.log(filterResult); // [2, 4]
```
:::

::: details 特性 3：实际场景 - 对象数组分组
这是开发中最常用的场景。
```JavaScript
const people = [
  { name: 'Alice', city: 'London' },
  { name: 'Bob', city: 'Paris' },
  { name: 'Charlie', city: 'London' }
];

const groupByCity = people.reduce((acc, person) => {
  const city = person.city;
  if (!acc[city]) acc[city] = [];
  acc[city].push(person);
  return acc;
}, {});
```
:::

---

- #### <span class="Fira-Code-Font">Array.find()</span>
> `find()` 方法返回数组中第一个满足提供的测试函数的元素值。如果没有找到对应元素则返回 `undefined`。

> [!IMPORTANT]
> - ***callback(element, index, array)：*** 测试函数，返回 true 表示找到匹配
> - ***返回值：*** 第一个满足条件的元素，否则返回 `undefined`

::: details 特性 1：找到即停止，性能优秀
与 `filter` 不同，`find` 找到第一个匹配项后就会立即停止遍历，不会继续查找。
```JavaScript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const bob = users.find(user => user.name === 'Bob');
console.log(bob); // { id: 2, name: 'Bob' }
```
:::

::: details 特性 2：相关方法 findIndex
`findIndex()` 返回索引而不是元素，找不到返回 `-1`。
```JavaScript
const numbers = [5, 12, 8, 130, 44];
const index = numbers.findIndex(n => n > 100);
console.log(index); // 3
```
:::

---

- #### <span class="Fira-Code-Font">Array.sort()</span>
> `sort()` 方法对数组的元素进行原地排序，并返回排序后的数组。默认排序顺序是将元素转换为字符串，然后比较它们的 UTF-16 代码单元值序列。

> [!IMPORTANT]
> - ***compareFunction(a, b)：*** 用来指定按某种顺序进行排列的函数（可选，但数字排序必须提供）
>   - 返回值 < 0：a 排在 b 前面
>   - 返回值 = 0：a 和 b 相对位置不变
>   - 返回值 > 0：a 排在 b 后面
> - ***返回值：*** 排序后的原数组（不是新数组）

::: details 特性 1：默认是字典序，不是数字大小
这是新手最容易踩坑的点。
```JavaScript
const numbers = [10, 5, 20, 3, 1];

// 错误：默认字典序排序
numbers.sort();
console.log(numbers); // [1, 10, 20, 3, 5]
```
:::

::: details 特性 2：正确的数字排序方式
必须提供比较函数。
```JavaScript
const numbers = [10, 5, 20, 3, 1];

// 升序
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 3, 5, 10, 20]

// 降序
numbers.sort((a, b) => b - a);
console.log(numbers); // [20, 10, 5, 3, 1]
```
:::

::: details 特性 3：sort 是原地排序，会修改原数组
这是 sort 与其他多数数组方法最大的不同。
```JavaScript
const original = [3, 1, 2];
const sorted = original.sort();

console.log(original); // [1, 2, 3] 原数组被改变了

// 不想修改原数组？先拷贝一份
const original2 = [3, 1, 2];
const sorted2 = [...original2].sort();
console.log(original2); // [3, 1, 2] 原数组不变
```
:::

---

- #### <span class="Fira-Code-Font">Array.from()</span>
> `Array.from()` 方法从一个类数组对象或可迭代对象创建一个新的、浅拷贝的数组实例。

> [!IMPORTANT]
> - ***arrayLike：*** 想要转换成数组的类数组对象或可迭代对象
> - ***mapFn (v, i)：*** 如果指定了，新数组中的每个元素都会执行该回调函数（可选）
> - ***返回值：*** 一个新的数组实例

::: details 特性 1：转换类数组对象
最常见的场景：将 NodeList、arguments 等转为真数组。
```JavaScript
// NodeList (DOM 查询结果)
const divs = document.querySelectorAll('div');
const divTexts = Array.from(divs, div => div.textContent);

// arguments 对象
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
```
:::

::: details 特性 2：快速生成数字序列
第二个参数 mapFn 让我们可以轻松创建范围数组。
```JavaScript
// 生成 [0, 1, 2, 3, 4]
const range5 = Array.from({ length: 5 }, (_, i) => i);
console.log(range5); // [0, 1, 2, 3, 4]

// 生成 [1, 2, 3, 4, 5]
const oneToFive = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(oneToFive); // [1, 2, 3, 4, 5]
```
:::

---

### 1-3. 字符串

| API               | 类别  | 核心功能                  | 一句记忆             |
| ----------------- | :---: | :-----------------------: | -----------------: |
| String.split   | 原型 | 按分隔符切割字符串为数组    | 切开，变数组       |
| String.substring | 原型 | 提取两个索引之间的子串     | 按索引截取，不接受负数 |
| String.replace  | 原型 | 替换匹配的子串            | 查找替换，支持正则  |
| String.startsWith | 原型 | 检查是否以指定前缀开头     | 前缀检查           |
| String.endsWith  | 原型 | 检查是否以指定后缀结尾     | 后缀检查           |

---

- #### <span class="Fira-Code-Font">String.split()</span>
> `split()` 方法使用指定的分隔符字符串将一个 String 对象分割成子字符串数组，以指定的分隔符来决定每个拆分的位置。

> [!IMPORTANT]
> - ***separator：*** 指定表示每个拆分应发生的点的字符串，可以是字符串或正则表达式
> - ***limit：*** 一个整数，限定返回的分割片段数量（可选）
> - ***返回值：*** 分割后的子字符串组成的数组

::: details 特性 1：基础拆分
```JavaScript
const str = 'apple,banana,cherry';
console.log(str.split(',')); // ['apple', 'banana', 'cherry']

// 空字符串作为分隔符，每个字符被拆分
console.log('hello'.split('')); // ['h', 'e', 'l', 'l', 'o']
```
:::

::: details 特性 2：使用 limit 限制返回数量
```JavaScript
const longStr = 'a,b,c,d,e';
console.log(longStr.split(',', 3)); // ['a', 'b', 'c']
```
:::

---

- #### <span class="Fira-Code-Font">String.substring()</span>
> `substring()` 方法返回一个字符串在开始索引到结束索引之间的一个子集，或从开始索引直到字符串的末尾的一个子集。

> [!IMPORTANT]
> - ***indexStart：*** 一个整数，指定子字符串的第一个字符的位置
> - ***indexEnd：*** 可选，一个整数，指定子字符串的结束位置（不包含）
> - ***返回值：*** 包含给定字符串的指定部分的新字符串

::: details 特性 1：参数的特殊处理 - 自动交换、负数转为 0
`substring` 会自动处理参数，这是它与 `slice` 最大的区别。
```JavaScript
const str = 'JavaScript';

// 如果 start > end，自动交换
console.log(str.substring(6, 1)); // 'avaScr'

// 负数当作 0 处理
console.log(str.substring(-3, 4)); // 'Java'

// 省略第二个参数，提取到末尾
console.log(str.substring(4)); // 'Script'
```
:::

---

- #### <span class="Fira-Code-Font">String.replace()</span>
> `replace()` 方法返回一个由替换值替换部分或所有的模式匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。

> [!IMPORTANT]
> - ***pattern：*** 可以是字符串或 RegExp 对象
> - ***replacement：*** 替换值，可以是字符串或函数
> - ***返回值：*** 一个部分或全部匹配由替代模式所取代的新的字符串

::: details 特性 1：字符串模式只替换第一个匹配
这是最容易踩坑的点。
```JavaScript
const str = 'apple banana apple cherry';

// 只替换第一个 'apple'
console.log(str.replace('apple', 'orange'));
// 'orange banana apple cherry'

// 替换所有：使用正则 + g 标志
console.log(str.replace(/apple/g, 'orange'));
// 'orange banana orange cherry'
```
:::

::: details 特性 2：使用函数作为替换值
当替换逻辑复杂时，使用函数可以实现任何替换规则。
```JavaScript
const text = 'hello world';

// 每个单词首字母大写
const capitalized = text.replace(/\b\w/g, match => match.toUpperCase());
console.log(capitalized); // 'Hello World'

// 下划线命名转驼峰命名
const snakeCase = 'user_first_name';
const camelCase = snakeCase.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
console.log(camelCase); // 'userFirstName'
```
:::

---

- #### <span class="Fira-Code-Font">String.startsWith() 和 endsWith()</span>
> `startsWith()` 方法用来判断当前字符串是否以另外一个给定的子字符串开头，`endsWith()` 判断是否以给定的子字符串结尾，两者都返回布尔值。

> [!IMPORTANT]
> **startsWith(searchString, position)**
> - `searchString`：要搜索的子字符串
> - `position`：可选，在 str 中开始搜索 searchString 的位置，默认是 0
> 
> **endsWith(searchString, length)**
> - `searchString`：要搜索的子字符串
> - `length`：可选，作为 str 的长度，默认是 str.length
> - ***返回值：*** 布尔值，表示是否匹配开头/结尾

::: details 特性 1：基础用法
```JavaScript
const url = 'https://api.example.com';

console.log(url.startsWith('https')); // true
console.log(url.startsWith('http')); // true

const filename = 'document.pdf';
console.log(filename.endsWith('.pdf')); // true
```
:::

::: details 特性 2：指定搜索范围
```JavaScript
const str = 'Hello World';

// startsWith 的第二个参数：从哪个位置开始算开头
console.log(str.startsWith('World', 6)); // true

// endsWith 的第二个参数：将前 n 个字符作为搜索范围
console.log(str.endsWith('llo', 5)); // true
```
:::

---

### 1-4. 集合

| 构造函数 | 核心特性 | 键类型 | 遍历 | 垃圾回收 | 主要方法 |
|---------|---------|-------|------|---------|---------|
| `Map` | 键值对集合，记住插入顺序 | 任意类型 | 可遍历 | 强引用阻止 GC | get, set, has, delete, size |
| `Set` | 值的集合，值唯一不重复 | - | 可遍历 | 强引用阻止 GC | add, has, delete, size |
| `WeakMap` | 键必须是对象，值任意 | 只能是对象 | 不可遍历 | 键是弱引用 | get, set, has, delete |
| `WeakSet` | 只能存放对象，对象唯一 | - | 不可遍历 | 元素是弱引用 | add, has, delete |

---

- #### <span class="Fira-Code-Font">Map</span>
> `Map` 对象保存键值对，并且能够记住键的原始插入顺序。任何值（对象或者基本类型）都可以作为一个键或一个值。与 Object 不同，Map 的键可以是任意类型，且 Map 是可迭代的。

> [!IMPORTANT]
> 主要属性和方法：
> - `new Map([iterable])`：创建 Map，可传入二维数组初始化
> - `map.size`：返回键值对数量
> - `map.set(key, value)`：设置键值对，返回 Map 本身
> - `map.get(key)`：获取键对应的值，不存在返回 undefined
> - `map.has(key)`：检查是否存在键
> - `map.delete(key)`：删除键值对
> - `map.clear()`：清空所有内容

::: details 特性 1：键可以是任意类型
这是 Map 相比普通对象最大的优势。
```JavaScript
const map = new Map();

const objKey = { id: 1 };
const funcKey = () => {};
const symbolKey = Symbol('key');

map.set(objKey, '对象作为键');
map.set(funcKey, '函数作为键');
map.set(symbolKey, 'Symbol 作为键');
map.set(123, '数字作为键');

console.log(map.get(objKey)); // '对象作为键'
console.log(map.size); // 5
```
:::

::: details 特性 2：记住插入顺序，可直接遍历
Map 是可迭代对象，可以直接用 for...of、forEach 等遍历。
```JavaScript
const userRoles = new Map([
  ['admin', '管理员'],
  ['editor', '编辑'],
  ['viewer', '访客']
]);

// for...of 遍历 [key, value]
for (const [key, value] of userRoles) {
  console.log(`${key}: ${value}`);
}

// 获取所有键/值
console.log([...userRoles.keys()]); // ['admin', 'editor', 'viewer']
console.log([...userRoles.values()]); // ['管理员', '编辑', '访客']
```
:::

---

- #### <span class="Fira-Code-Font">Set</span>
> `Set` 对象允许你存储任何类型的唯一值，无论是基本类型值还是对象引用。Set 中的值只会出现一次，它是不重复的。

> [!IMPORTANT]
> 主要属性和方法：
> - `new Set([iterable])`：创建 Set，可传入数组等初始化
> - `set.size`：返回元素数量
> - `set.add(value)`：添加元素，返回 Set 本身
> - `set.has(value)`：检查是否存在该值
> - `set.delete(value)`：删除元素
> - `set.clear()`：清空所有元素

::: details 特性 1：值的唯一性，自动去重
Set 最常用的场景就是数组去重。
```JavaScript
const numbers = [1, 2, 2, 3, 3, 3, 4, 5];
const uniqueNumbers = [...new Set(numbers)];
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]

// 字符串去重
const str = 'aabbccddee';
console.log([...new Set(str)].join('')); // 'abcde'
```
:::

::: details 特性 2：Set 的集合运算
Set 非常适合做数学集合运算。
```JavaScript
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 并集
const union = new Set([...setA, ...setB]);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// 交集
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log([...intersection]); // [3, 4]

// 差集
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log([...difference]); // [1, 2]
```
:::

---

- #### <span class="Fira-Code-Font">WeakMap 和 WeakSet</span>
> `WeakMap` 和 `WeakSet` 是 Map 和 Set 的弱引用版本，它们的键或元素必须是对象，并且这些对象引用是弱持有，不会阻止垃圾回收。

> [!IMPORTANT]
> **WeakMap 核心特性：**
> - 键必须是对象，不能是基本类型
> - 键是弱引用，当键对象没有其他引用时，可以被 GC 回收
> - 不可遍历，没有 size 属性
> - 只有 4 个方法：`get`, `set`, `has`, `delete`
>
> **WeakSet 核心特性：**
> - 元素必须是对象
> - 对象是弱引用，没有其他引用时可被 GC 回收
> - 不可遍历，没有 size 属性
> - 只有 3 个方法：`add`, `has`, `delete`

::: details 特性 1：WeakMap 典型场景 - 附加私有数据
```JavaScript
const privateData = new WeakMap();

class User {
  constructor(name) {
    this.name = name;
    privateData.set(this, { secret: '真正的私有数据' });
  }
  
  getSecret() {
    return privateData.get(this).secret;
  }
}

const alice = new User('Alice');
console.log(alice.getSecret()); // '真正的私有数据'
// 外部无法直接访问 privateData 中的内容
// 当 alice 对象被回收时，对应的私有数据也自动被回收
```
:::

::: details 特性 2：WeakSet 典型场景 - 标记对象
```JavaScript
const processedNodes = new WeakSet();

function processNode(node) {
  if (processedNodes.has(node)) {
    return; // 已经处理过，跳过
  }
  // 处理逻辑
  processedNodes.add(node); // 标记为已处理
}

// DOM 节点被移除时，WeakSet 中的引用也会被自动 GC 清理
// 如果用普通 Set，需要手动删除，否则内存泄漏
```
:::

## 2. 异步编程与控制流

| API | 核心功能 | 成功条件 | 失败条件 |
|-----|---------|-----------|---------|
| `Promise` | 表示异步操作的最终完成（成功/失败） | - | - |
| `Promise.all()` | 并行执行所有 Promise，返回结果数组 | 所有都成功 | 任一失败则整体失败 |
| `Promise.race()` | 返回第一个完成的 Promise（竞速） | 第一个成功 | 第一个失败 |
| `Promise.allSettled()` | 等待所有完成，返回各自状态 | 总是成功，无失败 | 永不失败 |
| `Promise.any()` | 返回第一个成功的 Promise | 第一个成功 | 所有都失败才失败 |
| `Promise.finally()` | 无论成功失败都会执行的回调 | - | - |

---

### 2-1. 基础

- #### <span class="Fira-Code-Font">Promise</span>
> Promise 是 JavaScript 异步编程的基础构建块，代表一个异步操作的最终完成（或失败）及其结果值。Promise 有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。

> [!IMPORTANT]
> **创建 Promise：**
> - `new Promise((resolve, reject) => { ... })`
>   - `resolve(value)`：操作成功时调用，将 Promise 状态改为 fulfilled
>   - `reject(error)`：操作失败时调用，将 Promise 状态改为 rejected
>
> **使用 Promise：**
> - `.then(onFulfilled, onRejected)`：添加成功/失败回调
> - `.catch(onRejected)`：添加失败回调（捕获前面所有的错误）
> - `.finally(onFinally)`：无论成功失败都会执行

::: details 特性 1：基础用法 - 封装异步操作
```JavaScript
// 封装一个延迟函数
function delay(ms, value, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('操作失败'));
      } else {
        resolve(value);
      }
    }, ms);
  });
}

// Promise 链式调用
delay(1000, 'Hello')
  .then(result => {
    console.log(result); // 'Hello'
    return delay(500, result + ' World'); // 返回新 Promise
  })
  .then(result => {
    console.log(result); // 'Hello World'
  })
  .catch(error => {
    console.error(error); // 捕获前面所有错误
  })
  .finally(() => {
    console.log('操作完成（无论成功失败）');
  });
```
:::

::: details 特性 2：Promise 状态一旦改变就不会再变
这是 Promise 最重要的特性——状态是不可逆的。
```JavaScript
const promise = new Promise((resolve, reject) => {
  resolve('成功');
  reject('失败'); // 这行不会生效！状态已经变为 fulfilled
  resolve('又成功了'); // 这行也不会生效
});

promise.then(console.log); // 只会输出 '成功'
```
:::

::: details 特性 3：三种快捷创建方式
```JavaScript
// 1. Promise.resolve() - 直接创建一个成功的 Promise
Promise.resolve('立即成功').then(console.log);

// 2. Promise.reject() - 直接创建一个失败的 Promise
Promise.reject(new Error('立即失败')).catch(console.error);

// 3. .then 返回的总是新的 Promise
const p1 = Promise.resolve(1);
const p2 = p1.then(x => x * 2);
console.log(p1 === p2); // false - 是不同的 Promise 对象
```
:::

---

- #### <span class="Fira-Code-Font">Promise.all()</span>
> `Promise.all()` 方法接收一个 Promise 可迭代对象，返回一个新的 Promise。只有当所有输入的 Promise 都成功时，返回的 Promise 才会成功，结果是一个包含所有成功值的数组，顺序与输入顺序一致。

> [!IMPORTANT]
> - ***iterable：*** 一个可迭代对象，如 Array
> - ***返回值：***
>   - 所有成功 → Promise&lt;[...values]，值的顺序与输入顺序一一对应
>   - 任一失败 → Promise&lt;reason&gt;，第一个失败的原因

::: details 特性 1：所有成功才成功，一失败就全失败
```JavaScript
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
const p3 = Promise.resolve(30);

Promise.all([p1, p2, p3])
  .then(results => {
    console.log(results); // [10, 20, 30] - 顺序与输入一致
    const sum = results.reduce((a, b) => a + b, 0);
    console.log('总和:', sum); // 60
  });

// 失败场景：任何一个 reject 就立即 reject
const promises = [
  Promise.resolve('OK'),
  Promise.reject(new Error('第二个失败了')),
  new Promise(resolve => setTimeout(() => resolve('晚到的'), 1000))
];

Promise.all(promises)
  .then(console.log)
  .catch(error => console.error('失败:', error.message)); // 立即输出 '失败: 第二个失败了'
```
:::

::: details 特性 2：典型使用场景 - 并行请求多个接口
```JavaScript
async function fetchUserAndOrders(userId) {
  try {
    // 两个请求并行发送，而不是等待第一个完成再发第二个
    const [user, orders] = await Promise.all([
      fetch(`/api/users/${userId}`).then(res => res.json()),
      fetch(`/api/users/${userId}/orders`).then(res => res.json())
    ]);
    
    return { user, orders };
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
}
```
:::

---

- #### <span class="Fira-Code-Font">Promise.race()</span>
> `Promise.race()` 方法同样接收一个 Promise 可迭代对象，返回一个 Promise。哪个 Promise 最先完成（无论成功失败），就采用那个 Promise 的结果。就像"竞速比赛"，只取第一名。

> [!IMPORTANT]
> - ***iterable：*** 一个可迭代对象
> - ***返回值：*** 返回第一个完成的 Promise 的结果（成功或失败）

::: details 特性 1：谁快用谁
```JavaScript
const fast = new Promise(resolve => setTimeout(() => resolve('快的'), 100));
const slow = new Promise(resolve => setTimeout(() => resolve('慢的'), 1000));

Promise.race([fast, slow])
  .then(console.log); // 输出 '快的'
```
:::

::: details 特性 2：典型场景 - 请求超时控制
这是 race 最常用的场景。
```JavaScript
// 超时工具函数
function withTimeout(promise, timeoutMs, timeoutMessage = '请求超时') {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });
  
  return Promise.race([promise, timeout]);
}

// 使用：如果 5 秒内没完成，就超时
async function fetchData() {
  try {
    const data = await withTimeout(
      fetch('/api/slow-endpoint').then(res => res.json()),
      5000,
      '数据获取超时'
    );
    return data;
  } catch (error) {
    console.error(error.message); // 超时或网络错误
  }
}
```
:::

---

- #### <span class="Fira-Code-Font">Promise.finally()</span>
> `finally()` 方法返回一个 Promise。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。这为无论 Promise 是否成功都需要执行的代码提供了一种途径。

> [!IMPORTANT]
> - ***onFinally：*** 一个无参数的回调函数
> - ***返回值：*** 返回一个等效的 Promise，不会改变原来的结果值

::: details 特性 1：无论成功失败都会执行，不改变结果
```JavaScript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => console.error('错误:', error))
  .finally(() => {
    // 总是执行！
    console.log('请求结束，隐藏 loading...');
    // 这里不能访问成功值或错误原因
  });
```
:::

---

### 2-2. 语法糖

- #### <span class="Fira-Code-Font">async/await</span>
> `async/await` 是 ES2017 引入的 Promise 语法糖，让异步代码看起来、写起来都更像同步代码，极大地改善了异步代码的可读性和可维护性。

> [!IMPORTANT]
> - `async function`：声明一个异步函数，函数内部可以使用 `await`
>   - 异步函数总是返回一个 Promise
> - `await promise`：暂停执行，等待 Promise 完成
>   - 只能在 async 函数内部使用
>   - Promise 成功 → 返回成功值
>   - Promise 失败 → 抛出错误（可用 try/catch 捕获）

::: details 特性 1：告别 .then 链式调用，代码线性可读
```JavaScript
// Promise 链式调用（嵌套层级多时可读性差）
function fetchUserDataPromise() {
  return fetch('/api/user')
    .then(res => res.json())
    .then(user => fetch(`/api/orders/${user.id}`))
    .then(res => res.json())
    .then(orders => console.log(orders));
}

// async/await 写法（像同步代码一样线性阅读）
async function fetchUserDataAsync() {
  const userRes = await fetch('/api/user');
  const user = await userRes.json();
  
  const ordersRes = await fetch(`/api/orders/${user.id}`);
  const orders = await ordersRes.json();
  
  return orders;
}
```
:::

::: details 特性 2：错误处理 - 用标准 try/catch
```JavaScript
async function safeFetch() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    // 捕获前面所有 await 的错误
    console.error('获取数据失败:', error.message);
    
    // 可以选择返回默认值或者继续抛出
    throw error;
  } finally {
    // 无论成功失败都执行
    console.log('请求尝试完成');
  }
}
```
:::

::: details 特性 3：结合 Promise 并发方法使用
```JavaScript
async function fetchAllData() {
  // ❌ 这样写是串行的，慢！
  // const a = await fetchA();
  // const b = await fetchB();
  
  // ✅ 这样写是并行的，快！
  const promiseA = fetchA(); // 先启动第一个
  const promiseB = fetchB(); // 立即启动第二个
  const a = await promiseA;
  const b = await promiseB;
  
  // 或者更清晰的写法
  const [user, orders, products] = await Promise.all([
    fetchUser(),
    fetchOrders(),
    fetchProducts()
  ]);
}
```
:::

::: details 特性 4：async 函数总是返回 Promise
不管函数体内返回什么，async 函数都会包装成 Promise 返回。
```JavaScript
async function example() {
  return 42; // 即使直接返回普通值
}

console.log(example()); // Promise { 42 } - 已经被包装成 Promise 了
example().then(console.log); // 42

// 等价于：
function example2() {
  return Promise.resolve(42);
}
```
:::

---

### 2-3. 传统与现代

- #### <span class="Fira-Code-Font">fetch(现代)</span>
> Fetch API 是现代浏览器提供的基于 Promise 的网络请求 API，设计更简洁、更强大，是 AJAX 的现代替代方案。

> [!IMPORTANT]
> - `fetch(resource, options)`：发起请求，返回 Promise&lt;Response&gt;
>   - `resource`：URL 字符串或 Request 对象
>   - `options`：配置对象（method, headers, body, credentials 等）
> - `response.json()`：解析响应体为 JSON（返回 Promise）
> - `response.text()`：解析响应体为文本
> - `response.ok`：HTTP 状态码在 200-299 之间为 true
> - `response.status`：HTTP 状态码

::: details 特性 1：基础 GET 请求
```JavaScript
async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    
    // ⚠️ 重要：fetch 只有在网络错误时才 reject！
    // HTTP 404/500 等状态码不会 reject！
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('获取用户失败:', error);
    throw error;
  }
}
```
:::

::: details 特性 2：POST 请求发送 JSON
```JavaScript
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    // 请求体必须序列化为 JSON 字符串
    body: JSON.stringify(userData),
    // 跨域请求是否携带 Cookie
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`创建失败: ${response.status}`);
  }
  
  return response.json();
}
```
:::

::: details 特性 3：取消请求 - AbortController
fetch 原生支持取消，这是 XMLHttpRequest 很难做到的。
```JavaScript
// 创建控制器
const controller = new AbortController();
const signal = controller.signal;

// 发起请求时传入 signal
fetch('/api/slow-request', { signal })
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求已被取消');
    }
  });

// 3 秒后取消请求
setTimeout(() => {
  controller.abort();
}, 3000);
```
:::

---

- #### <span class="Fira-Code-Font">XMLHttpRequest(传统)</span>
> XMLHttpRequest 是早期浏览器最早的异步请求 API，现在基本被 fetch 替代。了解即可，新项目不推荐使用。主要是回调风格，代码嵌套问题多，容易写出"回调地狱"。

```JavaScript
// 简单了解一下写法，现在几乎不会写新的了
const xhr = new XMLHttpRequest();

xhr.open('GET', '/api/data');

xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error('请求失败');
  }
};

xhr.onerror = function() {
  console.error('网络错误');
};

xhr.send();
```

---

### 2-4. 并发控制

- #### <span class="Fira-Code-Font">Promise.allSettled()</span>
> `Promise.allSettled()` 方法等待所有 Promise 都完成（无论成功或失败），然后返回一个包含每个 Promise 结果描述的对象数组。它永远不会 reject！

> [!IMPORTANT]
> - ***iterable：*** 一个可迭代对象
> - ***返回值：*** Promise&lt;Array&lt;SettlementObject&gt;&gt;
>   - 成功结果：`{ status: 'fulfilled', value: ... }`
>   - 失败结果：`{ status: 'rejected', reason: ... }`

::: details 特性 1：永不失败，总是等待所有完成
与 `Promise.all()` 最大的区别。
```JavaScript
const promises = [
  Promise.resolve('成功 1'),
  Promise.reject(new Error('失败 1')),
  Promise.resolve('成功 2'),
  Promise.reject(new Error('失败 2'))
];

Promise.allSettled(promises)
  .then(results => {
    console.log('所有都完成了，结果如下：');
    console.log(results);
    // [
    //   { status: 'fulfilled', value: '成功 1' },
    //   { status: 'rejected', reason: Error('失败 1') },
    //   { status: 'fulfilled', value: '成功 2' },
    //   { status: 'rejected', reason: Error('失败 2') }
    // ]
    
    // 分别处理成功和失败
    const successes = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    
    const failures = results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason);
    
    console.log('成功的:', successes);
    console.log('失败的:', failures);
  });
```
:::

::: details 特性 2：典型场景 - 批量上传/批量操作
当你有多个独立任务，希望全部完成后再处理结果（不管单个是否失败）。
```JavaScript
async function batchUpload(files) {
  const uploadPromises = files.map(file => 
    uploadFile(file)
      .then(url => ({ status: 'success', file, url }))
      .catch(error => ({ status: 'failed', file, error }))
  );
  
  // 或者直接用 allSettled
  const results = await Promise.allSettled(files.map(uploadFile));
  
  // 生成报告
  const report = {
    total: files.length,
    successful: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length
  };
  
  return report;
}
```
:::

---

- #### <span class="Fira-Code-Font">Promise.any()(ES2021)</span>
> `Promise.any()` 方法接收一个 Promise 可迭代对象，返回第一个成功的 Promise。只有当所有 Promise 都失败时，返回的 Promise 才会失败。它是 `Promise.all()` 的反向版本。

> [!IMPORTANT]
> - ***iterable：*** 一个可迭代对象
> - ***返回值：***
>   - 任一成功 → Promise&lt;value&gt;，第一个成功的值
>   - 所有失败 → Promise&lt;AggregateError&gt;，包含所有错误

::: details 特性 1：一成功就成功，全失败才失败
```JavaScript
const promises = [
  Promise.reject(new Error('第一个失败')),
  Promise.resolve('第二个成功'),
  Promise.reject(new Error('第三个失败'))
];

Promise.any(promises)
  .then(console.log) // 输出 '第二个成功' - 只要有一个成功就行
  .catch(error => console.error('全失败了', error.errors));
```
:::

::: details 特性 2：典型场景 - 从多个源获取数据
```JavaScript
// 尝试从多个 CDN 获取资源，哪个快用哪个
async function fetchFromFastestCDN(path) {
  const cdns = [
    'https://cdn1.example.com',
    'https://cdn2.example.com',
    'https://cdn3.example.com'
  ];
  
  try {
    return await Promise.any(
      cdns.map(cdn => fetch(`${cdn}${path}`))
    );
  } catch (error) {
    // 所有 CDN 都挂了
    throw new Error('所有服务都不可用');
  }
}
```
:::

> [!TIP]
> **四个并发方法总结对比：**
>
> | 方法 | 成功条件 | 失败条件 | 结果 | 适用场景 |
> |------|---------|---------|------|---------|
> | `Promise.all` | 全成功 | 任一失败 | 成功值数组 | 所有结果都需要，缺一不可 |
> | `Promise.race` | 第一个成功 | 第一个失败 | 第一个结果 | 超时控制、竞速 |
> | `Promise.allSettled` | 总是成功 | 永不失败 | 每个结果的状态数组 | 批量任务，需要完整报告 |
> | `Promise.any` | 任一成功 | 全失败 | 第一个成功值 | 多源尝试，只要一个就行 |
>
> **记忆口诀：**
> - `all`：求全责备 → 全成功才成功，一败涂地
> - `race`：竞速赛跑 → 先到先得，不管好坏
> - `allSettled`：坐下来都解决 → 都完事儿，大家都有结果
> - `any`：任何一个都行 → 一个成功就成功，全死了才死

## 3. 函数式编程与元编程

| API | 类别 | 核心功能 | 一句记忆 |
|-----|------|---------|---------|
| Function.bind | 原型 | 创建新函数并绑定 this 和预置参数 | 绑定上下文 |
| Function.call | 原型 | 立即调用函数，指定 this，逐个传参 | 逐个调用 |
| Function.apply | 原型 | 立即调用函数，指定 this，数组传参 | 数组调用 |
| Reflect | 内置对象 | 将 Object 操作函数化，统一调用方式 | 反射操作 |
| Proxy | 构造函数 | 创建对象代理，拦截自定义操作 | 代理拦截 |

---

### 3-1. 高阶函数

> 高阶函数是指接收函数作为参数，或者返回函数的函数。JavaScript 中函数是一等公民，支持高阶函数特性。

- #### <span class="Fira-Code-Font">Function.bind()</span>
> `bind()` 方法创建一个新函数，在调用时将其 `this` 关键字设置为提供的值，并在调用新函数时，将给定参数列表放在原函数的参数列表之前。

> [!IMPORTANT]
> - ***thisArg：*** 当绑定函数被调用时，该参数会作为原函数运行时的 this 指向
> - ***arg1, arg2, ...：*** 当绑定函数被调用时，这些参数将置于实参之前传递给原函数
> - ***返回值：*** 返回由指定 this 值和初始参数的原函数拷贝

::: details 特性 1：绑定 this 上下文
这是 bind 最常用的场景——解决函数独立调用时 this 丢失的问题。
```JavaScript
const person = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`;
  }
};

// 直接提取方法调用，this 丢失
const greet = person.greet;
console.log(greet()); // 'Hello, undefined' ❌

// 使用 bind 绑定 this
const boundGreet = person.greet.bind(person);
console.log(boundGreet()); // 'Hello, Alice' ✅
```
:::

::: details 特性 2：预置参数（柯里化）
bind 除了绑定 this，还可以预置部分参数，实现函数柯里化。
```JavaScript
function add(a, b) {
  return a + b;
}

// 预置第一个参数为 5
const add5 = add.bind(null, 5);
console.log(add5(3)); // 8 → 相当于 add(5, 3)
console.log(add5(10)); // 15 → 相当于 add(5, 10)

// 可以多层预置
function multiply(a, b, c) {
  return a * b * c;
}
const double = multiply.bind(null, 2);
const tripleOfFour = double.bind(null, 4);
console.log(tripleOfFour(5)); // 40 → 2 * 4 * 5
```
:::

---

- #### <span class="Fira-Code-Font">Function.call()</span>
> `call()` 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。

> [!IMPORTANT]
> - ***thisArg：*** 在函数运行时使用的 this 值
> - ***arg1, arg2, ...：*** 指定的参数列表
> - ***返回值：*** 使用调用者提供的 this 值和参数调用该函数的返回值

::: details 特性 1：借用其他对象的方法
call 最经典的应用就是借用方法，比如类数组对象借用数组方法。
```JavaScript
// 类数组对象借用数组方法
function sum() {
  // arguments 是类数组，本身没有 reduce 方法
  return Array.prototype.reduce.call(arguments, (a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// 借用 toString 精确判断类型
const toString = Object.prototype.toString;
console.log(toString.call([])); // '[object Array]'
console.log(toString.call({})); // '[object Object]'
console.log(toString.call(new Date)); // '[object Date]'
```
:::

::: details 特性 2：实现继承
在构造函数中使用 call 可以实现继承。
```JavaScript
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  // 调用父构造函数，绑定 this 到 Dog 实例
  Animal.call(this, name);
  this.breed = breed;
}

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name); // 'Buddy'
console.log(dog.breed); // 'Golden Retriever'
```
:::

---

- #### <span class="Fira-Code-Font">Function.apply()</span>
> `apply()` 方法调用一个具有给定 this 值的函数，以及以一个数组（或类数组对象）的形式提供参数。与 call 功能完全一样，唯一区别是传参形式。

> [!IMPORTANT]
> - ***thisArg：*** 在函数运行时使用的 this 值
> - ***argsArray：*** 一个数组或者类数组对象
> - ***返回值：*** 使用调用者提供的 this 值和参数调用该函数的返回值

::: details 特性 1：数组传参，适合参数动态可变的场景
当参数数量不确定或者已经在数组中时，apply 比 call 更方便。
```JavaScript
const numbers = [5, 6, 2, 8, 1];

// Math.max 不接受数组，只接受逐个参数
// 使用 apply 把数组拆解为逐个参数
const max = Math.max.apply(null, numbers);
console.log(max); // 8

// 等价于现代写法（展开运算符）
const max2 = Math.max(...numbers);
console.log(max2); // 8

// 参数动态变化时很有用
function dynamicFunction(...args) {
  anotherFunction.apply(null, args);
}
```
:::

> [!TIP]
> **call vs apply 选择指南：**
> - 参数已知且数量固定 → 用 `call`，性能稍好
> - 参数在数组中或数量不确定 → 用 `apply`
> - 现代代码中多数场景可以用展开运算符 `...` 替代 apply

---

### 3-2. 柯里化与函数组合

> 柯里化（Currying）是将一个多参数函数转换成一系列单参数函数的技术。函数组合（Composition）是将多个函数组合成一个新函数，数据流从右到左或从内到外。JavaScript 语言本身不提供内置的柯里化和组合函数，但可以通过 bind、闭包和高阶函数自行实现。

::: details 柯里化实现与应用
```JavaScript
// 简单的柯里化实现
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // 参数收集完成，执行原函数
      return fn.apply(this, args);
    } else {
      // 参数不足，返回新函数继续收集
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6

// 实际应用：创建可复用的专用函数
const request = curry((method, url, data) => {
  return fetch(url, { method, body: JSON.stringify(data) });
});

const get = request('GET');
const post = request('POST');
const postUser = post('/api/users');
// postUser({ name: 'Alice' }); // 只需传数据
```
:::

::: details 函数组合：实现管道操作
```JavaScript
// 函数组合：从右到左执行
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 管道函数：从左到右执行（更符合直觉）
function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

// 使用示例
const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

// 组合：先加 1，再乘 2，再平方
const transform = pipe(addOne, double, square);
console.log(transform(2)); // ((2+1)*2)² = 36

// 实际应用：数据处理管道
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const getActiveUserNames = pipe(
  users => users.filter(u => u.active),
  users => users.map(u => u.name),
  names => names.join(', ')
);

console.log(getActiveUserNames(users)); // 'Alice, Charlie'
```
:::

---

### 3-3. 反射与代理

- #### <span class="Fira-Code-Font">Reflect API</span>
> Reflect 是一个内置对象，提供拦截 JavaScript 操作的方法。这些方法与 Proxy handler 的方法一一对应。Reflect 不是一个函数对象，不可构造，所有属性和方法都是静态的。

> [!IMPORTANT]
> **核心设计目的：**
> 1. 将 Object 对象的一些明显属于语言内部的方法放到 Reflect 对象上
> 2. 修改某些 Object 方法的返回结果，让其变得更合理
> 3. 让 Object 操作都变成函数行为，统一 API 形式

::: details 常用 Reflect 方法
```JavaScript
const obj = { name: 'Alice', age: 25 };

// 1. Reflect.get - 获取属性
console.log(Reflect.get(obj, 'name')); // 'Alice'
// 相比直接 obj.name，Reflect.get 可以指定 receiver
const withReceiver = { name: 'Bob' };
const user = {
  name: 'Alice',
  get alias() { return this.name; }
};
console.log(Reflect.get(user, 'alias', withReceiver)); // 'Bob' - this 指向 receiver

// 2. Reflect.set - 设置属性
Reflect.set(obj, 'age', 26);
console.log(obj.age); // 26

// 3. Reflect.has - 检查属性存在
console.log(Reflect.has(obj, 'name')); // true
console.log(Reflect.has(obj, 'email')); // false

// 4. Reflect.deleteProperty - 删除属性
Reflect.deleteProperty(obj, 'age');
console.log(obj.age); // undefined

// 5. Reflect.construct - 等同于 new
function Person(name) {
  this.name = name;
}
const person = Reflect.construct(Person, ['Bob']);
console.log(person.name); // 'Bob'

// 6. Reflect.defineProperty - 定义属性
Reflect.defineProperty(obj, 'email', {
  value: 'alice@example.com',
  writable: false
});
```
:::

::: details Reflect 相比传统 Object 方法的优势
```JavaScript
// 优势 1：统一的函数式风格，返回值更合理
// Object.defineProperty 失败时抛出错误，Reflect.defineProperty 返回布尔值
const result = Reflect.defineProperty({}, 'a', { value: 1 });
console.log(result); // true - 成功

// 优势 2：避免 name 冲突
const badObj = {
  hasOwnProperty: () => false, // 覆盖了原型方法
  name: 'Alice'
};
// console.log(badObj.hasOwnProperty('name')); // false ❌ 错误
console.log(Reflect.has(badObj, 'name')); // true ✅ 正确

// 优势 3：配合 Proxy 一一对应，方便直接转发
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    // 可以直接用 Reflect 转发，不用手动实现
    return Reflect.get(target, prop, receiver);
  }
};
```
:::

---

- #### <span class="Fira-Code-Font">Proxy</span>
> Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。Proxy 可以理解为在目标对象之前架设一层"拦截"，外界对该对象的访问都必须先通过这层拦截。

> [!IMPORTANT]
> - `new Proxy(target, handler)`
>   - `target`：要代理的目标对象（可以是任何类型的对象，包括原生数组、函数，甚至另一个代理）
>   - `handler`：一个对象，其属性是当执行一个操作时定义代理行为的函数
> - ***返回值：*** 返回包含目标对象的代理对象

::: details 特性 1：基础拦截 - get / set 陷阱
最常用的两个拦截器陷阱。
```JavaScript
const user = {
  name: 'Alice',
  age: 25
};

const proxy = new Proxy(user, {
  // 拦截属性读取
  get(target, prop, receiver) {
    console.log(`读取属性: ${prop}`);
    // 不存在的属性返回默认值
    if (!(prop in target)) {
      return `[${prop} 不存在]`;
    }
    return Reflect.get(target, prop, receiver);
  },
  
  // 拦截属性设置
  set(target, prop, value, receiver) {
    console.log(`设置属性: ${prop} = ${value}`);
    // 可以添加验证逻辑
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('年龄必须是数字');
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log(proxy.name); // 日志: 读取属性: name → 'Alice'
console.log(proxy.email); // 日志: 读取属性: email → '[email 不存在]'
proxy.age = 26; // 日志: 设置属性: age = 26
// proxy.age = '老了'; // 抛出错误
```
:::

::: details 特性 2：实际应用场景 - 响应式数据
Proxy 是 Vue 3 响应式系统的核心基础。
```JavaScript
// 简单的响应式实现
function reactive(obj) {
  const effectStack = []; // 存储当前运行的副作用函数
  
  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      // 收集依赖
      if (effectStack.length > 0) {
        console.log(`收集依赖: ${key}`);
      }
      return result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // 触发更新
      console.log(`触发更新: ${key} = ${value}`);
      return result;
    }
  });
  
  return proxy;
}

// 使用
const state = reactive({ count: 0 });
console.log(state.count); // 收集依赖: count → 0
state.count = 1; // 触发更新: count = 1
```
:::

::: details 特性 3：其他常用拦截器
Proxy 支持 13 种拦截操作，覆盖对象的所有基本行为。
```JavaScript
const handler = {
  // 拦截 in 操作符
  has(target, prop) {
    if (prop.startsWith('_')) return false; // 隐藏私有属性
    return prop in target;
  },
  
  // 拦截 for...in 循环
  ownKeys(target) {
    return Object.keys(target).filter(key => !key.startsWith('_'));
  },
  
  // 拦截 delete 操作符
  deleteProperty(target, prop) {
    if (prop.startsWith('_')) {
      throw new Error('不能删除私有属性');
    }
    delete target[prop];
    return true;
  },
  
  // 拦截函数调用
  apply(target, thisArg, args) {
    console.log('函数被调用');
    return target.apply(thisArg, args);
  },
  
  // 拦截 new 操作
  construct(target, args) {
    console.log('创建新实例');
    return new target(...args);
  }
};
```
:::

> [!TIP]
> **Reflect 与 Proxy 的关系：**
> - Proxy handler 提供的 13 种拦截器，Reflect 都有一一对应的静态方法
> - 在 Proxy handler 中，建议始终使用 Reflect 来转发操作，而不是直接操作 target
> - Reflect 保证了操作的语义正确性，并且正确处理 receiver（this 绑定）
> - 两者配合使用可以写出更健壮、更易维护的元编程代码
## 4. 模块化与依赖管理

| 模块系统 | 适用环境 | 加载方式 | 核心语法 | 一句话总结 |
|---------|---------|---------|---------|-----------|
| ES Modules | 浏览器 + Node.js | 静态分析 + 动态导入 | import / export | 官方标准，现代化首选 |
| CommonJS | Node.js 原生 | 运行时同步加载 | require / module.exports | Node.js 传统模块方案 |

---

### 4-1. ES Modules

> ES Modules（ESM）是 JavaScript 官方的模块化标准，从 ES6（ES2015）开始引入。它在语言层面实现了模块化，支持静态分析、Tree Shaking、循环依赖等特性，是现代前端工程的基石。

> [!IMPORTANT]
> **关键特性：**
> - 编译时静态分析， import/export 必须在顶层
> - 自动采用严格模式（use strict）
> - 每个模块有独立的作用域
> - 支持循环依赖
> - 浏览器中使用需要 `<script type="module">`

- #### <span class="Fira-Code-Font">export</span>
> `export` 用于从模块中导出函数、对象或原始值，使其他模块可以通过 import 引用。

::: details 四种主要导出方式
```JavaScript
// 1. 命名导出（可以有多个）
export const name = 'module';
export function hello() { return 'Hello'; }
export class User { constructor(name) { this.name = name; } }

// 2. 导出列表（推荐）
const version = '1.0.0';
function init() { console.log('Init'); }
export { version, init };

// 3. 重命名导出
export { version as moduleVersion, init as initialize };

// 4. 默认导出（每个模块只能有一个）
export default function() {
  console.log('This is the default export');
}
// 或者导出对象
export default {
  name: 'MyModule',
  version: '1.0.0'
};

// 5. 重新导出（转发）
export { foo, bar } from './other-module.js';
// 重新导出并重命名
export { foo as newFoo } from './other-module.js';
// 重新导出所有命名导出（不包括 default）
export * from './other-module.js';
```
:::

---

- #### <span class="Fira-Code-Font">import</span>
> `import` 用于导入其他模块导出的内容。

::: details 五种主要导入方式
```JavaScript
// 1. 导入命名导出
import { name, hello, User } from './module.js';
console.log(name);
hello();

// 2. 导入时重命名
import { name as moduleName, hello as sayHello } from './module.js';

// 3. 导入默认导出
import myDefault from './module.js';
myDefault(); // 调用默认导出的函数

// 4. 命名导出 + 默认导出同时导入
import defaultExport, { name, hello } from './module.js';

// 5. 导入整个模块为命名空间对象
import * as MyModule from './module.js';
console.log(MyModule.name);
MyModule.hello();

// 6. 仅执行模块副作用，不导入任何值
import './side-effects.js';
```
:::

::: details 导入提升特性
```JavaScript
// import 声明会被提升到模块顶部，在所有代码执行之前加载
console.log('This runs first');
// 但实际上 importedFunc 已经可以用了
import { importedFunc } from './module.js';

// 所以 import 不能放在条件语句中（会报错）
// ❌ 错误写法
// if (condition) {
//   import something from './something.js'; // SyntaxError
// }

// ✅ 需要动态加载时用 import() 函数
```
:::

---

- #### <span class="Fira-Code-Font">import() (动态导入)</span>
> 动态导入 `import()` 是一个函数式的导入语法，它返回一个 Promise，允许在运行时按需加载模块。支持条件加载、按需加载、动态路径等场景。

> [!IMPORTANT]
> - ***specifier：*** 模块路径，可以是动态生成的字符串
> - ***返回值：*** Promise&lt;Module&gt;，resolve 为模块命名空间对象

::: details 特性 1：按需延迟加载
```JavaScript
// 点击按钮时才加载模块
document.getElementById('btn').addEventListener('click', async () => {
  // 只有点击时才真正下载和执行模块
  const { heavyFunction } = await import('./heavy-module.js');
  heavyFunction();
});

// 条件加载
async function loadPolyfill() {
  if (!('IntersectionObserver' in window)) {
    await import('./polyfills/intersection-observer.js');
    console.log('Polyfill loaded');
  }
}
```
:::

::: details 特性 2：动态路径和错误处理
```JavaScript
// 根据环境动态决定加载哪个模块
const env = process.env.NODE_ENV; // 'development' or 'production'
const config = await import(`./config/${env}.js`);

// 错误处理
try {
  const module = await import('./optional-module.js');
  module.doSomething();
} catch (error) {
  console.log('模块加载失败，使用备用方案');
  fallbackImplementation();
}
```
:::

> [!TIP]
> **import vs import() 对比：**
>
> | 特性 | import 声明 | import() 函数 |
> |------|-----------|--------------|
> | 加载时机 | 编译时静态加载，提升到顶部 | 运行时动态加载，按需执行 |
> | 位置限制 | 必须在模块顶层 | 可以在任何地方调用 |
> | 路径 | 只能是字符串字面量 | 支持动态表达式、变量 |
> | 返回值 | 同步导入绑定 | 返回 Promise |
> | 适用场景 | 核心依赖、常驻模块 | 条件加载、懒加载、路由级拆分 |

---

### 4-2. CommonJS (Node.js)

> CommonJS 是 Node.js 最初使用的模块化规范，在 Node.js 生态中广泛使用。它采用同步加载方式，主要用于服务器端，但通过打包工具（webpack、Rollup）也可以在浏览器中使用。

> [!IMPORTANT]
> **关键特性：**
> - 运行时同步加载，支持条件 require
> - 每个文件就是一个模块
> - module.exports 是真正的导出对象，exports 只是引用
> - 模块加载后会被缓存，多次 require 返回同一实例

- #### <span class="Fira-Code-Font">module.exports 和 exports</span>
> `module.exports` 是模块真正的导出对象，`exports` 只是指向 `module.exports` 的引用变量。

::: details 导出的各种方式
```JavaScript
// 1. 导出对象（最常用）
module.exports = {
  name: 'myModule',
  version: '1.0.0',
  greet() { return 'Hello'; }
};

// 2. 导出单个函数
module.exports = function() {
  console.log('This is a function module');
};

// 3. 导出类
module.exports = class User {
  constructor(name) {
    this.name = name;
  }
};

// 4. 使用 exports 添加属性（注意：不能直接赋值 exports = ...）
exports.name = 'myModule';
exports.greet = function() { return 'Hello'; };

// ⚠️ 常见错误：直接赋值 exports 会丢失引用
// ❌ 错误：这样写不会生效
// exports = { name: 'module' }; // exports 指向了新对象，与 module.exports 断开

// ✅ 正确：给 module.exports 赋值，或者给 exports 加属性
module.exports = { name: 'module' };
// 或者
exports.name = 'module';
```
:::

---

- #### <span class="Fira-Code-Font">require()</span>
> `require()` 函数用于加载和导入其他模块。它同步执行，返回模块的导出值。

> [!IMPORTANT]
> - ***id：*** 模块标识符，可以是核心模块名、相对路径或绝对路径
> - ***返回值：*** 模块导出的内容（module.exports 的值）

::: details 特性 1：基本用法和搜索规则
```JavaScript
// 1. 导入核心模块（Node.js 内置）
const fs = require('fs');
const path = require('path');
const http = require('http');

// 2. 导入本地模块（相对路径）
const myModule = require('./my-module.js'); // .js 后缀可以省略
const myModule = require('./my-module'); // 自动查找 .js, .json, .node

// 3. 导入 node_modules 中的第三方包
const express = require('express');
const lodash = require('lodash');

// 4. 导入 JSON 文件（直接解析为对象）
const config = require('./config.json');
console.log(config.port);

// 5. 只执行模块，不接收导出值
require('./initialize-db.js');
```
:::

::: details 特性 2：模块缓存和循环依赖
```JavaScript
// 模块加载后会被缓存，多次 require 返回同一对象
const a1 = require('./module-a.js');
const a2 = require('./module-a.js');
console.log(a1 === a2); // true - 是同一个对象

// 可以手动清除缓存（一般用于测试场景）
delete require.cache[require.resolve('./module-a.js')];

// 循环依赖支持
// a.js:
exports.name = 'A';
const b = require('./b.js');
console.log('in a, b.name =', b.name); // 'B'

// b.js:
exports.name = 'B';
const a = require('./a.js');
console.log('in b, a.name =', a.name); // 'A'

// Node.js 循环依赖时返回已导出的部分，不会死锁
```
:::

> [!TIP]
> **ESM vs CommonJS 主要区别：**
> | 特性 | ES Modules | CommonJS |
> |------|-----------|----------|
> | 加载方式 | 静态分析 + 异步加载 | 运行时同步加载 |
> | 顶层 this | undefined | 指向 module.exports |
> | 关键字 | import / export | require / module.exports |
> | 循环依赖 | 原生支持（通过 live binding） | 支持（返回部分导出） |
> | 适用环境 | 浏览器 + Node.js 14+ | Node.js 全版本支持 |
> | Tree Shaking | 原生支持（无副作用可移除） | 不支持（需要打包工具处理） |
> | 动态导入 | 支持 import() | 原生支持（require 可以在任何地方调用） |

---

## 5. 错误处理与调试

| 错误类型 | 触发场景 | 常见原因 |
|---------|---------|---------|
| Error | 所有错误的基类 | 自定义错误、通用错误 |
| TypeError | 类型错误 | 调用非函数、访问 null/undefined 的属性 |
| SyntaxError | 语法解析错误 | 代码语法不符合规范、JSON 解析失败 |
| ReferenceError | 引用错误 | 访问未声明的变量 |
| RangeError | 范围错误 | 数组长度超出、调用栈溢出、数字参数越界 |

---

### 5-1. 错误对象

- #### <span class="Fira-Code-Font">Error</span>
> `Error` 是所有错误对象的基类，其他内置错误类型都是继承自它。每个错误对象包含错误消息、堆栈跟踪等信息，是 JavaScript 错误处理的基础。

> [!IMPORTANT]
> **主要属性：**
> - `message`：错误描述消息
> - `name`：错误类型名称（默认为 "Error"）
> - `stack`：错误堆栈跟踪（非标准，但所有现代浏览器都支持）

::: details 创建和抛出错误
```JavaScript
// 1. 创建错误对象
const error = new Error('Something went wrong');
console.log(error.message); // 'Something went wrong'
console.log(error.name); // 'Error'
console.log(error.stack); // 堆栈跟踪信息

// 2. 抛出错误
throw new Error('Something went wrong');

// 3. 自定义错误信息
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); // 'Division by zero is not allowed'
}
```
:::

::: details 自定义错误子类
```JavaScript
// 创建自定义错误类型
class ValidationError extends Error {
  constructor(message, field) {
    super(message); // 调用父类构造函数
    this.name = 'ValidationError'; // 自定义错误名称
    this.field = field; // 自定义属性
  }
}

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

// 使用自定义错误
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

try {
  validateEmail('invalid-email');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Field ${error.field}: ${error.message}`);
    // 'Field email: Invalid email format'
  }
}
```
:::

---

- #### <span class="Fira-Code-Font">TypeError</span>
> `TypeError` 在值的类型不符合预期时抛出，是最常见的运行时错误之一。

::: details 典型场景
```JavaScript
// 1. 调用非函数
const notAFunction = 'hello';
// notAFunction(); // TypeError: notAFunction is not a function

// 2. 访问 null 或 undefined 的属性
const obj = null;
// obj.property; // TypeError: Cannot read property 'property' of null

// 3. 访问 undefined 的属性
// undefined.foo; // TypeError: Cannot read property 'foo' of undefined

// 4. 对非可迭代对象使用 for...of
// for (let x of 123) {} // TypeError: 123 is not iterable

// 5. 类型转换失败
// const num = BigInt('not a number'); // TypeError

// 防御性编程避免 TypeError
function safeAccess(obj, property) {
  return obj?.property; // 可选链，返回 undefined 而不是报错
}
```
:::

---

- #### <span class="Fira-Code-Font">SyntaxError</span>
> `SyntaxError` 在解析语法无效的代码时抛出，通常是代码编写不符合 JavaScript 语法规范。

::: details 典型场景
```JavaScript
// 1. 语法错误
// const 123invalid = 'test'; // SyntaxError

// 2. JSON 解析失败（最常见场景）
const invalidJson = '{ "name": "Alice", age: 30 }'; // age 没加引号
try {
  JSON.parse(invalidJson);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log('JSON parse failed:', error.message);
  }
}

// 3. 正则表达式语法错误
try {
  new RegExp('[a-z'); // 缺少右括号
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log('Invalid regex pattern');
  }
}
```
:::

---

- #### <span class="Fira-Code-Font">RangeError 及其子类</span>
> `RangeError` 在数值超出有效范围时抛出。

::: details 典型场景
```JavaScript
// 1. 数组长度超出
// const arr = new Array(-1); // RangeError: Invalid array length

// 2. 调用栈溢出（递归没有终止条件）
// function infiniteRecursion() {
//   infiniteRecursion();
// }
// infiniteRecursion(); // RangeError: Maximum call stack size exceeded

// 3. 数值方法参数越界
// const num = Number(10).toFixed(101); // RangeError: toFixed() digits argument must be between 0 and 100

// 4. 常见子类型
// - URIError: encodeURI / decodeURI 失败
// - InternalError: JS 引擎内部错误（通常是递归过深）

try {
  decodeURIComponent('%'); // 无效的 URI 编码
} catch (error) {
  if (error instanceof URIError) {
    console.log('Invalid URI encoding');
  }
}
```
:::

---

### 5-2. 调试

- #### <span class="Fira-Code-Font">console 对象 (log, warn, error, table, time)</span>
> `console` 对象提供了访问浏览器调试控制台的方法，可以输出不同类型的调试信息，是前端开发最常用的调试工具。

::: details 基础日志输出
```JavaScript
// 1. 普通日志
console.log('Hello World');
console.log('User:', { name: 'Alice', age: 25 });

// 2. 不同级别的日志
console.log('普通信息');      // 灰色/黑色
console.info('提示信息');     // 蓝色（某些浏览器）
console.warn('警告信息');     // 黄色
console.error('错误信息');    // 红色

// 3. 格式化输出（类似 C 的 printf）
console.log('User: %s, Age: %d, Score: %f', 'Alice', 25, 98.5);
console.log('Object: %O', { name: 'Alice' }); // 对象格式化

// 4. 样式化输出
console.log('%c 重要消息 ', 'color: red; font-size: 20px; background: yellow;');
```
:::

::: details 表格和分组输出
```JavaScript
// 1. 表格形式展示数据（数组/对象清晰可见）
const users = [
  { name: 'Alice', age: 25, city: 'London' },
  { name: 'Bob', age: 30, city: 'Paris' },
  { name: 'Charlie', age: 35, city: 'New York' }
];
console.table(users); // 美观的表格输出

// 2. 分组输出，避免日志混乱
console.group('用户模块');
console.log('加载用户数据...');
console.log('用户数量: 3');
console.groupEnd();

// 3. 折叠分组（默认收起）
console.groupCollapsed('网络请求');
console.log('GET /api/users');
console.log('Status: 200 OK');
console.groupEnd();
```
:::

::: details 计时和性能测量
```JavaScript
// 1. 简单计时
console.time('loop time');
for (let i = 0; i < 1000000; i++) {
  // 循环操作
}
console.timeEnd('loop time'); // 'loop time: 2.345ms'

// 2. 带标签的多个计时器
console.time('init');
console.time('render');
// ... 初始化
console.timeEnd('init');
// ... 渲染
console.timeEnd('render');
```
:::

---

- #### <span class="Fira-Code-Font">debugger 语句</span>
> `debugger` 语句会暂停 JavaScript 执行，并启动调试器（浏览器开发者工具或 Node.js 调试器）。相当于在代码中设置一个断点，是比 console.log 更强大的调试手段。

::: details 基本用法和高级技巧
```JavaScript
function calculateTotal(items) {
  let total = 0;
  
  for (const item of items) {
    // 在这里会暂停执行，可以检查变量值、单步执行
    debugger; // 打开浏览器开发者工具时会触发断点
    
    // 条件断点（只有满足条件时才暂停）
    if (item.price > 1000) {
      debugger; // 只有高价商品才暂停
    }
    
    total += item.price;
  }
  
  return total;
}

// 等效于在浏览器开发者工具的 Sources 面板手动点击行号设置断点

// 调试时可以使用的控制台命令：
// - watch('变量名'): 监视变量变化
// - monitorEvents(element, 'click'): 监视事件
// - copy(object): 复制对象到剪贴板
// - inspect(element): 检查 DOM 元素
```
:::

> [!TIP]
> **错误处理最佳实践：**
> 1. **精确捕获**：尽量捕获具体的错误类型，而不是空的 `catch {}` 吞掉所有错误
> 2. **尽早抛出**：函数参数无效时立即抛出错误，便于定位问题
> 3. **错误要有上下文**：错误消息应该包含足够的调试信息，比如哪个参数、什么值出错了
> 4. **Promoise 必须 catch**：async/await 一定要用 try/catch 包裹，Promise 链要有 .catch()
> 5. **全局兜底**：设置 `window.onerror` 或 `process.on('uncaughtException')` 处理未捕获的错误
> 6. **区分错误来源**：编程错误（bug）、操作错误（用户输入）、网络错误，分类处理
> 7. **生产环境不要暴露堆栈**：给用户看友好提示，把详细堆栈信息上报到日志系统
## 6. 数学与日期时间

| 类别 | API | 用途 | 返回值 |
|-----|-----|------|--------|
| 数学常量 | Math.PI | 圆周率 π | 约 3.14159 |
| 数学运算 | Math.random() | 生成 [0, 1) 随机数 | 伪随机数 |
| 数学运算 | Math.max(a, b, ...) | 取最大值 | 最大值或 -Infinity |
| 数学运算 | Math.min(a, b, ...) | 取最小值 | 最小值或 Infinity |
| 数学运算 | Math.floor(x) | 向下取整 | 小于等于 x 的最大整数 |
| 日期时间 | Date.now() | 当前时间戳 | 毫秒级时间戳 |
| 日期时间 | new Date() | 创建日期对象 | Date 实例 |
| 日期时间 | toISOString() | ISO 格式字符串 | 'YYYY-MM-DDTHH:mm:ss.sssZ' |

---

### 6-1. 数学运算

- #### <span class="Fira-Code-Font">Math.random()</span>
> `Math.random()` 返回一个介于 0（包含）和 1（不包含）之间的浮点数伪随机数。注意：**不能用于密码学场景**，需要安全随机请使用 `crypto.getRandomValues()`。

> [!IMPORTANT]
> - ***返回值：*** 范围在 [0, 1) 的浮点数
> - 不接受参数
> - 伪随机算法实现依赖浏览器/引擎，通常是 xorshift 或类似算法

::: details 特性 1：生成指定范围的随机数
```JavaScript
// 1. [0, max) 范围的整数
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
console.log(getRandomInt(10)); // 0-9 之间的整数

// 2. [min, max] 范围的整数（闭区间）
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(getRandomIntInclusive(1, 6)); // 掷骰子：1-6

// 3. [min, max) 范围的浮点数
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
```
:::

::: details 特性 2：常见随机场景应用
```JavaScript
// 1. 随机选择数组元素
const fruits = ['苹果', '香蕉', '橙子', '葡萄'];
const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];

// 2. 随机布尔值（50% 概率）
const randomBoolean = Math.random() > 0.5;

// 3. 指定概率的 true
function probability(percent) {
  return Math.random() < percent / 100;
}
if (probability(30)) { /* 30% 概率执行 */ }

// 4. 洗牌算法（Fisher-Yates）
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```
:::

---

- #### <span class="Fira-Code-Font">Math.max() / Math.min()</span>
> `Math.max()` 返回输入参数中的最大值，`Math.min()` 返回最小值。如果没有参数，分别返回 -Infinity 和 Infinity。

> [!IMPORTANT]
> - ***参数：*** 任意数量的数值参数
> - ***返回值：*** 最大值 / 最小值
> - 任一参数无法转为数值则返回 NaN
> - 不接受数组参数，需要用 `...` 展开运算符

::: details 特性 1：基础用法与数组展开
```JavaScript
// 1. 基本用法
console.log(Math.max(1, 3, 2));      // 3
console.log(Math.min(1, 3, 2));      // 1

// 2. 空参数返回极端值
console.log(Math.max());             // -Infinity
console.log(Math.min());             // Infinity

// 3. 与数组配合（展开运算符）
const numbers = [5, 2, 9, 1, 5, 6];
const max = Math.max(...numbers);    // 9
const min = Math.min(...numbers);    // 1

// 4. 兼容旧写法（apply）
const maxOld = Math.max.apply(null, numbers); // 9
```
:::

::: details 特性 2：对象数组按属性找最值
```JavaScript
const students = [
  { name: 'Alice', score: 85 },
  { name: 'Bob', score: 92 },
  { name: 'Charlie', score: 78 }
];

// 找出最高分
const highestScore = Math.max(...students.map(s => s.score));
console.log(highestScore); // 92

// 找出最高分的学生
const topStudent = students.reduce((prev, curr) => 
  Math.max(prev.score, curr.score) === prev.score ? prev : curr
);

// 安全处理空数组
function safeMax(arr) {
  if (arr.length === 0) return 0; // 或抛出错误
  return Math.max(...arr);
}
```
:::

---

- #### <span class="Fira-Code-Font">Math.floor() / Math.ceil() / Math.round()</span>
> 三个取整方法，分别是向下取整、向上取整、四舍五入。

::: details 三种取整对比
```JavaScript
// 正数场景
console.log(Math.floor(2.9));   // 2  ↓ 向下
console.log(Math.ceil(2.1));    // 3  ↑ 向上
console.log(Math.round(2.5));   // 3  ≈ 四舍五入

// 负数场景（注意！容易踩坑）
console.log(Math.floor(-2.1));  // -3 ↓ 更小的负数
console.log(Math.ceil(-2.9));   // -2 ↑ 更大的整数
console.log(Math.round(-2.5));  // -2（注意：.5 时往正方向舍入）

// 保留指定小数位（无原生方法，手动实现）
function roundToDecimal(num, decimals) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
console.log(roundToDecimal(3.14159, 2)); // 3.14

// 截断小数（向零取整）
console.log(Math.trunc(2.9));   // 2
console.log(Math.trunc(-2.9));  // -2（与 floor 不同）
```
:::

---

- #### <span class="Fira-Code-Font">Math.PI & 其他常量</span>
> Math 对象上的数学常量，都是只读属性。

```JavaScript
console.log(Math.PI);        // π ≈ 3.141592653589793
console.log(Math.E);         // 自然对数的底 ≈ 2.718
console.log(Math.LN2);       // ln2 ≈ 0.693
console.log(Math.LN10);      // ln10 ≈ 2.302
console.log(Math.SQRT2);     // √2 ≈ 1.414
console.log(Math.SQRT1_2);   // 1/√2 ≈ 0.707

// 圆面积
function circleArea(radius) {
  return Math.PI * radius * radius;
}

// 角度弧度转换
function degToRad(deg) { return deg * Math.PI / 180; }
function radToDeg(rad) { return rad * 180 / Math.PI; }
```

---

### 6-2. 日期处理

- #### <span class="Fira-Code-Font">Date.now()</span>
> `Date.now()` 返回自 1970 年 1 月 1 日 00:00:00 UTC 至今的毫秒数时间戳。**性能开销极小**，是获取当前时间的最快方式。

> [!IMPORTANT]
> - ***返回值：*** Number 类型的毫秒级时间戳
> - 静态方法，不需要 new Date()
> - 精度是毫秒，但实际精度取决于系统（部分浏览器有防指纹限制）

::: details 特性 1：计时与性能测量
```JavaScript
// 1. 简单计时
const start = Date.now();
for (let i = 0; i < 1000000; i++) {}
const duration = Date.now() - start;
console.log(`耗时: ${duration}ms`);

// 2. 生成唯一 ID（简单场景可用）
const uniqueId = Date.now().toString(36); // 转 36 进制更短

// 3. 节流判断（避免频繁执行）
let lastRun = 0;
function throttledFn() {
  const now = Date.now();
  if (now - lastRun < 1000) return; // 1 秒内不重复执行
  lastRun = now;
  // 执行逻辑
}
```
:::

::: details 特性 2：与其他时间戳格式的转换
```JavaScript
// 1. 秒级时间戳（后端常用）
const timestampSeconds = Math.floor(Date.now() / 1000);

// 2. Unix 时间戳转 Date 对象
const timestamp = 1700000000000;
const date = new Date(timestamp);

// 3. 获取当天零点时间戳
function getDayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

// 4. 获取当天 23:59:59 时间戳
function getDayEnd() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
                  23, 59, 59, 999).getTime();
}
```
:::

---

- #### <span class="Fira-Code-Font">new Date()</span>
> Date 构造函数创建日期时间对象，支持多种参数形式。

> [!IMPORTANT]
> **五种构造方式：**
> 1. `new Date()` - 当前时间
> 2. `new Date(timestamp)` - 毫秒时间戳
> 3. `new Date(dateString)` - 日期字符串解析
> 4. `new Date(year, month, day?, hours?, minutes?, seconds?, ms?)`
> 5. `new Date(anotherDate)` - 复制日期对象

::: details 特性 1：构造参数详解与陷阱
```JavaScript
// ✅ 推荐：用数值参数构造（最可靠，无时区歧义）
const goodDate = new Date(2024, 0, 15, 14, 30, 0);
// 注意：month 是 0 基！0=一月, 11=十二月

// ❌ 容易踩坑：字符串解析有时区问题
const badDate = new Date('2024-01-15'); // UTC 时间
const localDate = new Date('2024/01/15'); // 本地时间（不同浏览器可能不同）

// 获取各部分
const date = new Date();
console.log(date.getFullYear());   // 年份 (4 位数)
console.log(date.getMonth());      // 月份 0-11 ⚠️
console.log(date.getDate());       // 日期 1-31
console.log(date.getDay());        // 星期 0-6 (0=周日)
console.log(date.getHours());      // 小时 0-23
console.log(date.getMinutes());    // 分钟 0-59
console.log(date.getSeconds());    // 秒 0-59

// UTC 版本（不受本地时区影响）
console.log(date.getUTCFullYear());
console.log(date.getUTCMonth());
```
:::

::: details 特性 2：日期计算与运算
```JavaScript
// 1. 日期加减
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1); // +1 天

const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7); // +7 天

const oneHourLater = new Date(now);
oneHourLater.setHours(oneHourLater.getHours() + 1); // +1 小时

// 2. 计算两个日期相差天数
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs(date2 - date1) / oneDay);
}

// 3. 比较日期（直接用 > < >= <= 比较）
const isFuture = new Date('2025-01-01') > new Date();

// 4. 判断是否同一天
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
}
```
:::

---

- #### <span class="Fira-Code-Font">Date.prototype.toISOString()</span>
> 返回 ISO 8601 格式的字符串，总是 UTC 时区。格式：`YYYY-MM-DDTHH:mm:ss.sssZ`

::: details 特性与常见格式化需求
```JavaScript
const date = new Date();
console.log(date.toISOString()); // '2024-05-20T14:30:45.123Z'

// 1. 提取日期部分（YYYY-MM-DD）
const datePart = date.toISOString().split('T')[0];

// 2. 本地时间的 YYYY-MM-DD（注意时区）
function getLocalDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 3. 友好显示时间（刚刚、几分钟前等）
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} 天前`;
  return date.toLocaleDateString();
}
```
:::

> [!TIP]
> **日期处理最佳实践：**
> 1. **存储与传输用 ISO 字符串**：前后端交互统一用 `toISOString()`，避免时区混乱
> 2. **显示用本地化方法**：`toLocaleDateString()`、`toLocaleTimeString()` 处理用户时区
> 3. **复杂场景用库**：时区转换、历法计算等推荐用 `day.js` 或 `date-fns`
> 4. **避免字符串解析**：`new Date('YYYY-MM-DD')` 有时区陷阱，优先用数值参数构造

---

## 7. 数据存储与持久化

| 存储方案 | 容量限制 | 生命周期 | 访问范围 | 同步/异步 | 典型场景 |
|---------|---------|---------|---------|----------|---------|
| localStorage | ~5MB | 永久存储，除非手动删除 | 同源共享 | 同步 | 用户偏好设置、主题、非敏感缓存 |
| sessionStorage | ~5MB | 当前标签页会话期间 | 仅当前标签页 | 同步 | 表单暂存、会话级状态 |
| IndexedDB | 无硬限制（可用磁盘空间 50% 以内） | 永久存储 | 同源共享 | 异步 | 大量结构化数据、离线缓存 |
| Cookie | 每个 4KB，总数有限 | 可设置过期时间 | 同源 + path 限制 | 同步 | 会话标识、服务端需要读取的数据 |

---

### 7-1. 客户端存储

- #### <span class="Fira-Code-Font">localStorage</span>
> `localStorage` 是 Window 对象上的属性，提供同源的持久化键值对存储。数据不会过期，即使浏览器关闭重新打开也会保留。

> [!IMPORTANT]
> - 仅存储字符串，其他类型会被 `toString()` 隐式转换
> - 存储上限约 5MB（超出抛出 QuotaExceededError）
> - 同步 API，主线程执行，大量读写可能阻塞 UI
> - 同源策略限制：协议 + 域名 + 端口 必须完全一致

::: details 特性 1：基础 CRUD 操作
```JavaScript
// 1. 写入（字符串）
localStorage.setItem('theme', 'dark');
localStorage.setItem('fontSize', '16');

// 2. 读取
const theme = localStorage.getItem('theme'); // 'dark'
const notExist = localStorage.getItem('not-exist'); // null（不存在返回 null，不是 undefined）

// 3. 删除
localStorage.removeItem('fontSize');

// 4. 清空所有
// localStorage.clear();

// 5. 获取所有 key
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```
:::

::: details 特性 2：对象/数组存储与类型处理
```JavaScript
// ⚠️ 错误示例：直接存储对象会变成 "[object Object]"
const user = { name: 'Alice', age: 25 };
localStorage.setItem('user', user); // ❌ 存进去的是 "[object Object]"

// ✅ 正确：JSON 序列化
localStorage.setItem('user', JSON.stringify(user));

// 读取时解析
const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

// 数字类型读取后需要转换
const fontSize = parseInt(localStorage.getItem('fontSize') || '16', 10);

// 封装工具函数（推荐在项目中使用）
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
```
:::

::: details 特性 3：storage 事件跨标签页通信
```JavaScript
// 监听其他标签页的 localStorage 变化（当前页面修改不会触发）
window.addEventListener('storage', (e) => {
  console.log('存储变化:', e.key);
  console.log('旧值:', e.oldValue);
  console.log('新值:', e.newValue);
  console.log('来源 URL:', e.url);
  
  // 比如：主题变更时所有标签页同步更新
  if (e.key === 'theme') {
    document.documentElement.dataset.theme = e.newValue;
  }
});

// 页面 A 修改：localStorage.setItem('theme', 'dark')
// 页面 B 会收到 storage 事件并同步更新
```
:::

---

- #### <span class="Fira-Code-Font">sessionStorage</span>
> `sessionStorage` API 与 `localStorage` **完全相同**，唯一区别是生命周期和作用域范围。

::: details 与 localStorage 的关键区别
```JavaScript
// API 完全一样
sessionStorage.setItem('tempForm', JSON.stringify({ step: 2 }));

// ==============================================
// 不同点：
// ==============================================

// 1. 生命周期：
//    localStorage - 永久，除非手动删除
//    sessionStorage - 标签页关闭就消失（刷新不会丢）

// 2. 作用域：
//    localStorage - 同网站所有标签页共享
//    sessionStorage - 仅限当前标签页（即使同网站新开标签页也不共享）

// 典型使用场景：
// - 多步骤表单暂存（刷新页面不丢失，关闭自动清理）
// - 单页应用临时状态
// - 防止重复提交标记
function saveFormProgress(formId, data) {
  sessionStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

// 页面加载时恢复
window.addEventListener('load', () => {
  const draft = sessionStorage.getItem('form_draft');
  if (draft) {
    // 恢复表单数据
  }
});
```
:::

---

- #### <span class="Fira-Code-Font">IndexedDB</span>
> IndexedDB 是浏览器内置的事务型 NoSQL 数据库，支持大容量存储、索引查询和异步操作。适合存储 MB 级以上的结构化数据。

> [!IMPORTANT]
> - 容量：通常可用磁盘空间的 50%，单条记录无大小限制
> - 完全异步 API（基于事件回调，Promise 化后更易用）
> - 支持事务、索引、游标、版本控制
> - 同源限制，支持 Blob 和 File 类型存储

::: details 基础封装：Promise 化 CRUD
```JavaScript
// IndexedDB 原生 API 比较繁琐，通常封装后使用
class SimpleDB {
  constructor(dbName, storeName, version = 1) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this.db = null;
  }
  
  async init() {
    if (this.db) return this.db;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      // 数据库升级（首次打开或版本提升）
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          // 创建对象仓库，keyPath 是主键
          db.createObjectStore(this.storeName, { keyPath: 'id' });
          // 可以创建索引：store.createIndex('byName', 'name', { unique: false });
        }
      };
      
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  async add(item) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.add(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async get(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      store.get(id).onsuccess = (e) => resolve(e.target.result);
    });
  }
  
  async getAll() {
    await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      tx.objectStore(this.storeName).getAll().onsuccess = (e) => {
        resolve(e.target.result);
      };
    });
  }
}

// 使用示例
// const articleDB = new SimpleDB('MyBlog', 'articles');
// await articleDB.add({ id: '001', title: 'IndexedDB 入门', content: '...' });
// const articles = await articleDB.getAll();
```
:::

> [!TIP]
> **存储方案选择指南：**
> - **简单键值对，小于 100KB** → localStorage
> - **标签页会话数据，关闭即丢** → sessionStorage
> - **超过 1MB，结构化数据，需要查询** → IndexedDB
> - **需要服务端读取** → Cookie（SameSite + Secure）
> - **注意：敏感信息（密码、Token）不要存在客户端！**

---

### 7-2. Cookies

- #### <span class="Fira-Code-Font">document.cookie</span>
> Cookie 是最早的客户端存储机制，特点是**每次 HTTP 请求都会自动携带**到服务端。适合存储服务端需要知道的小数据。

> [!IMPORTANT]
> - 单条 Cookie 最大 4KB，每个域名约 50-150 条限制
> - 每次请求都会带上，过多 Cookie 会影响请求性能
> - 属性控制：`HttpOnly`（JS 无法读取）、`Secure`（仅 HTTPS）、`SameSite`（防 CSRF）

::: details Cookie 读写与工具封装
```JavaScript
// ==============================================
// 读取 Cookie
// ==============================================
// document.cookie 返回 "name=value; foo=bar; token=xxx" 格式的字符串

// 解析所有 Cookie 为对象
function getCookies() {
  return Object.fromEntries(
    document.cookie.split('; ')
      .map(cookie => cookie.split('='))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

// 读取单个 Cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

// ==============================================
// 设置 Cookie
// ==============================================
function setCookie(name, value, options = {}) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  // 过期时间
  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookie += `; expires=${date.toUTCString()}`;
  }
  
  // 路径（默认 / 表示全站可用）
  cookie += `; path=${options.path || '/'}`;
  
  // 域名
  if (options.domain) cookie += `; domain=${options.domain}`;
  
  // 安全属性（生产环境必须设置）
  if (location.protocol === 'https:') {
    cookie += '; Secure'; // 仅 HTTPS 传输
  }
  cookie += '; SameSite=Lax'; // 防 CSRF 攻击必备
  
  document.cookie = cookie;
}

// ==============================================
// 删除 Cookie（设过期时间为过去）
// ==============================================
function deleteCookie(name, path = '/') {
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// 使用示例
// setCookie('theme', 'dark', { days: 365 });
// const theme = getCookie('theme');
```
:::

> [!WARNING]
> **Cookie 安全注意事项：**
> 1. **HttpOnly**：敏感 Cookie（如 Session ID、JWT）必须设置 HttpOnly，防止 XSS 窃取
> 2. **Secure**：HTTPS 网站必须设置 Secure
> 3. **SameSite**：Lax 或 Strict 防止 CSRF 攻击
> 4. 不要在 Cookie 中存储大量数据（每次请求都带，浪费带宽）
> 5. 不要存明文敏感信息

---

## 8. 网络通信

| 协议 | 连接方式 | 方向性 | 适用场景 | 浏览器兼容性 |
|-----|---------|-------|---------|-------------|
| fetch (HTTP) | 短连接，请求-响应 | 客户端主动拉取 | 常规 API 请求、资源加载 | 现代浏览器全覆盖 |
| WebSocket | 长连接，持久握手 | 全双工双向通信 | 实时聊天、协作编辑、游戏 | IE10+ 支持 |
| EventSource (SSE) | 长连接 | 服务端单向推送 | 实时通知、数据流、消息推送 | 除 IE 外都支持 |

---

### 8-1. HTTP/HTTPS（复习）

> `fetch` 和 `XMLHttpRequest` 在第 2 章异步编程中已经详细讲解，这里补充高级用法。

::: details Fetch 高级：取消请求、超时控制
```JavaScript
// 1. AbortController 取消请求
const controller = new AbortController();
const signal = controller.signal;

// 超时自动取消
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch('/api/data', { signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求已取消（超时）');
    }
  })
  .finally(() => clearTimeout(timeoutId));

// 2. 手动取消（比如用户点击取消按钮）
// cancelBtn.addEventListener('click', () => controller.abort());

// 3. 并发请求并支持单独取消
function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const promise = fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(id));
  
  return { promise, cancel: () => controller.abort() };
}
```
:::

---

### 8-2. 实时通信：WebSocket

- #### <span class="Fira-Code-Font">WebSocket</span>
> WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行**全双工通讯**的协议。建立连接后，客户端和服务端可以**随时互发数据**，不需要轮询。

> [!IMPORTANT]
> - 协议标识：`ws://`（明文）、`wss://`（加密，HTTPS 对应）
> - 握手基于 HTTP Upgrade 机制，端口复用 80/443
> - 没有同源限制，可以跨域连接
> - 支持发送文本和二进制数据（Blob、ArrayBuffer）
> - 心跳检测 + 断线重连是生产环境必备

::: details 特性 1：基础连接与消息收发
```JavaScript
// 1. 建立连接
const ws = new WebSocket('wss://api.example.com/realtime');

// 2. 事件监听
ws.onopen = () => {
  console.log('WebSocket 连接已建立');
  // 连接成功后可以发送消息
  ws.send(JSON.stringify({ type: 'join', room: 'chatroom-1' }));
};

// 3. 接收消息
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到消息:', data);
  // 根据消息类型处理
  switch (data.type) {
    case 'message': renderMessage(data.payload); break;
    case 'user_join': updateUserList(data.users); break;
  }
};

// 4. 错误处理
ws.onerror = (error) => {
  console.error('WebSocket 错误:', error);
};

// 5. 连接关闭
ws.onclose = (event) => {
  console.log('连接关闭:', event.code, event.reason);
  // 可以在这里触发重连逻辑
};

// 6. 发送消息
// ws.send(JSON.stringify({ type: 'message', content: 'Hello!' }));

// 7. 主动关闭
// ws.close(1000, '正常关闭');
```
:::

::: details 特性 2：生产环境必备 - 心跳检测与断线重连
```JavaScript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.ws = null;
    this.reconnectDelay = 1000; // 初始重连延迟
    this.maxDelay = 30000;      // 最大延迟
    this.heartbeatInterval = 30000;
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.isManualClose = false;
  }
  
  connect() {
    this.isManualClose = false;
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('连接成功');
      this.reconnectDelay = 1000; // 重置延迟
      this.startHeartbeat();      // 开始心跳
    };
    
    this.ws.onclose = (event) => {
      this.stopHeartbeat();
      if (!this.isManualClose) {
        console.log(`断线，${this.reconnectDelay}ms 后重连...`);
        this.reconnectTimer = setTimeout(() => {
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxDelay);
          this.connect();
        }, this.reconnectDelay);
      }
    };
    
    this.ws.onmessage = (event) => {
      // 收到任何消息说明连接正常，重置心跳计时器
      this.resetHeartbeat();
      if (event.data === 'pong') return; // 心跳响应，忽略
      // 业务消息处理...
    };
  }
  
  // 心跳：定期发 ping，服务端回 pong，超时认为断线
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, this.heartbeatInterval);
  }
  
  resetHeartbeat() {
    clearInterval(this.heartbeatTimer);
    this.startHeartbeat();
  }
  
  stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
  }
  
  close() {
    this.isManualClose = true;
    clearTimeout(this.reconnectTimer);
    this.stopHeartbeat();
    this.ws.close();
  }
}
```
:::

---

### 8-3. 服务器发送事件：EventSource

- #### <span class="Fira-Code-Font">EventSource</span>
> Server-Sent Events（SSE）是一种基于 HTTP 的**服务端单向推送**技术。客户端建立连接后，服务端可以持续向客户端推送数据，适合服务端主动发消息的场景。

> [!IMPORTANT]
> - 基于普通 HTTP 协议，没有 WebSocket 那么多网关限制
> - 只能服务端 → 客户端单向通信
> - 自动断线重连（浏览器内置）
> - 支持自定义事件类型和消息 ID
> - 文本协议，数据格式简单
> - IE/Edge 旧版本不支持（需 polyfill）

::: details 客户端基本用法
```JavaScript
// 1. 建立连接（自动用 GET 请求，带 stream header）
const eventSource = new EventSource('/api/stream');

// 2. 默认消息类型（message）
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到消息:', data);
};

// 3. 自定义事件类型（服务端可以指定 event: update 字段）
eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data);
  showNotification(notification);
});

eventSource.addEventListener('progress', (event) => {
  const { current, total } = JSON.parse(event.data);
  updateProgressBar(current / total * 100);
});

// 4. 连接状态
eventSource.onopen = () => {
  console.log('SSE 连接已建立');
  console.log('readyState:', eventSource.readyState); // 0=连接中, 1=已打开, 2=已关闭
};

// 5. 错误处理（断线会自动重连！这是内置特性）
eventSource.onerror = (err) => {
  console.error('SSE 错误:', err);
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('连接被关闭');
  }
};

// 6. 手动关闭连接
// eventSource.close();
```
:::

::: details 服务端 SSE 响应格式（Node.js 示例）
```JavaScript
// Node.js Express 服务端代码
app.get('/api/stream', (req, res) => {
  // 设置 SSE 响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // 发送消息格式：
  // data: 内容\n\n
  
  // 1. 简单消息
  res.write('data: Hello SSE\n\n');
  
  // 2. JSON 数据
  res.write(`data: ${JSON.stringify({ type: 'update', time: Date.now() })}\n\n`);
  
  // 3. 自定义事件类型
  res.write('event: notification\n');
  res.write(`data: ${JSON.stringify({ title: '新消息' })}\n\n`);
  
  // 4. 消息 ID（断线重连时会带上 Last-Event-ID header）
  res.write('id: 12345\n');
  res.write('data: 带 ID 的消息\n\n');
  
  // 5. 客户端关闭连接时
  req.on('close', () => {
    console.log('客户端断开连接');
    res.end();
  });
});
```
:::

> [!TIP]
> **WebSocket vs SSE 选择：**
> - **需要双向通信**（聊天、游戏）→ WebSocket
> - **仅服务端推送**（通知、实时数据、日志流）→ SSE
> - **网络环境复杂，可能有防火墙** → SSE 基于 HTTP，更稳妥
> - **需要二进制传输** → WebSocket（SSE 仅文本）

---

## 9. 浏览器特定功能

| 功能分类 | 核心 API | 用途 |
|---------|---------|------|
| DOM 选择 | querySelector / querySelectorAll | CSS 选择器查找元素 |
| DOM 修改 | appendChild / remove / innerHTML | 添加、删除、修改元素 |
| 事件处理 | addEventListener / removeEventListener | 绑定与移除事件监听 |
| 样式操作 | classList / style / getComputedStyle | 元素样式与类名操作 |
| 表单处理 | FormData / input.value / form.submit | 表单数据收集与提交 |
| 历史管理 | pushState / replaceState / popstate 事件 | SPA 路由与历史管理 |

---

### 9-1. DOM 操作

- #### <span class="Fira-Code-Font">document.querySelector() / querySelectorAll()</span>
> 现代浏览器标准元素选择 API，支持完整 CSS 选择器语法。

> [!IMPORTANT]
> - `querySelector` 返回第一个匹配元素或 `null`
> - `querySelectorAll` 返回 **NodeList**（注意：不是数组，但可 forEach 遍历）
> - 支持所有 CSS3 选择器：`#id`、`.class`、`[attr]`、`:nth-child`、`:has()` 等
> - 可以在元素上调用（相当于上下文查找）

::: details 特性 1：选择器详解与常见用法
```JavaScript
// 1. 各种选择器
const byId = document.querySelector('#header');                // ID
const byClass = document.querySelector('.card');               // 类名
const byTag = document.querySelector('div');                   // 标签
const byAttr = document.querySelector('[data-id="123"]');     // 属性
const nested = document.querySelector('.container .item');     // 后代
const firstChild = document.querySelector('li:first-child');   // 伪类

// 2. 查找多个元素（返回 NodeList）
const allCards = document.querySelectorAll('.card');

// NodeList 遍历
allCards.forEach(card => {
  card.classList.add('highlight');
});

// 转为数组（需要 filter/map 等数组方法时）
const cardsArray = [...allCards];
const visibleCards = cardsArray.filter(card => !card.hidden);

// 3. 在元素上下文中查找（不是从 document 开始）
const container = document.querySelector('.container');
const buttons = container.querySelectorAll('button'); // 只找 container 内的按钮

// 4. 判断元素是否匹配选择器
element.matches('.active'); // true/false

// 5. 向上查找最近的匹配祖先元素
element.closest('.card'); // 从当前元素向上找，直到找到 .card
```
:::

::: details 特性 2：性能优化与最佳实践
```JavaScript
// ⚠️ 避免：在循环中重复查询 DOM
for (let i = 0; i < 1000; i++) {
  // 每次都查询，非常慢！
  document.querySelector('#item-' + i);
}

// ✅ 推荐：缓存引用，批量操作
const items = document.querySelectorAll('[id^="item-"]');
items.forEach(item => { /* ... */ });

// ✅ 推荐：有 ID 用 getElementById（更快）
const header = document.getElementById('header'); // 比 querySelector('#header') 快

// ✅ 推荐：同级别大量元素时，使用事件委托
// 不在每个按钮上加监听，而是在父元素加一个
document.querySelector('.button-container').addEventListener('click', (e) => {
  if (e.target.matches('.action-btn')) {
    // 按钮点击处理
    const btn = e.target;
  }
});
```
:::

---

- #### <span class="Fira-Code-Font">appendChild() / DOM 操作方法</span>
> DOM 节点的创建、添加、删除、替换操作。

::: details 完整 DOM 操作 CRUD
```JavaScript
// ==============================================
// 1. 创建元素
// ==============================================
const div = document.createElement('div');
const text = document.createTextNode('Hello World');
const fragment = document.createDocumentFragment(); // 文档片段，批量插入用

// 设置内容
div.textContent = 'Hello World';        // ✅ 纯文本，安全（防 XSS）
div.innerHTML = '<strong>Hello</strong>'; // ⚠️ 解析 HTML，注意 XSS 风险

// ==============================================
// 2. 添加元素
// ==============================================
const parent = document.querySelector('.container');

parent.appendChild(div);          // 追加到末尾
parent.prepend(div);              // 插入到开头
parent.before(div);               // 插入到前面
parent.after(div);                // 插入到后面

// 插入到参考元素之前（旧方法，仍然常用）
const reference = document.querySelector('.reference');
parent.insertBefore(div, reference);

// 批量插入（用 DocumentFragment 避免多次重排）
const items = ['A', 'B', 'C'].map(text => {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
});

items.forEach(item => fragment.appendChild(item));
parent.appendChild(fragment); // 只触发一次重排！

// ==============================================
// 3. 删除元素
// ==============================================
element.remove(); // 现代方法（自删）

// 旧兼容写法：通过父元素删除
if (element.parentNode) {
  element.parentNode.removeChild(element);
}

// ==============================================
// 4. 替换元素
// ==============================================
parent.replaceChild(newElement, oldElement);

// ==============================================
// 5. 克隆元素
// ==============================================
const clone = element.cloneNode(true); // true = 深克隆（包含子元素）
```
:::

---

- #### <span class="Fira-Code-Font">addEventListener()</span>
> 事件监听是现代前端交互的基础，支持同一事件绑定多个处理函数。

> [!IMPORTANT]
> - 第三个参数：`true` 捕获阶段触发 / `{ passive: true }` 滚动优化 / `{ once: true }` 只触发一次
> - 事件对象 `e` 常用属性：`target`、`currentTarget`、`preventDefault()`、`stopPropagation()`

::: details 事件处理最佳实践
```JavaScript
const button = document.querySelector('#submit');

// 1. 基础事件绑定
button.addEventListener('click', (e) => {
  console.log('按钮被点击');
  console.log('点击目标:', e.target);
  console.log('绑定元素:', e.currentTarget); // 总是 button
});

// 2. 只执行一次
button.addEventListener('click', () => {
  console.log('这个回调只执行一次');
}, { once: true });

// 3. 滚动/触摸事件优化（passive 让页面更流畅）
window.addEventListener('scroll', () => {
  // 滚动处理（不能调用 preventDefault）
}, { passive: true });

// 4. 移除事件监听（必须保存函数引用！）
function handleClick(e) { /* ... */ }
button.addEventListener('click', handleClick);
// 稍后移除
button.removeEventListener('click', handleClick);

// 5. 事件委托（动态元素必备）
// 场景：列表项是动态生成的，不能直接给每个 li 绑事件
document.querySelector('#list').addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) {
    console.log('点击了列表项:', li.dataset.id);
  }
});

// 6. 自定义事件
// 发送事件
const event = new CustomEvent('user-login', {
  detail: { userId: 123, username: 'Alice' },
  bubbles: true,      // 是否冒泡
  cancelable: true    // 是否可取消
});
element.dispatchEvent(event);

// 监听自定义事件
element.addEventListener('user-login', (e) => {
  console.log('用户登录:', e.detail);
});
```
:::

---

### 9-2. 样式与类

- #### <span class="Fira-Code-Font">element.classList</span>
> 元素类名操作的首选 API，比手动操作 `className` 字符串安全方便。

::: details classList 完整 API
```JavaScript
const element = document.querySelector('.box');

// 1. 添加类
element.classList.add('active');
element.classList.add('a', 'b', 'c'); // 同时加多个（ES6+）

// 2. 删除类
element.classList.remove('active');
element.classList.remove('a', 'b');

// 3. 切换类（有就删，没有就加）
element.classList.toggle('dark-mode');
// 带强制参数：第二个参数 true=加 false=删
element.classList.toggle('highlight', shouldHighlight);

// 4. 检查是否有类
if (element.classList.contains('active')) {
  console.log('元素有 active 类');
}

// 5. 替换类
element.classList.replace('old-class', 'new-class');

// 6. 遍历所有类
element.classList.forEach(className => {
  console.log(className);
});

// 7. 类名数组
const classNames = [...element.classList];

// 常见模式：条件性添加类
element.className = `card ${isActive ? 'active' : ''} ${disabled ? 'opacity-50' : ''}`;
```
:::

---

- #### <span class="Fira-Code-Font">element.style / getComputedStyle</span>
> 内联样式操作和计算样式读取。

::: details 样式操作
```JavaScript
const element = document.querySelector('.box');

// 1. 设置内联样式（优先级高）
element.style.color = 'red';
element.style.backgroundColor = '#f0f0f0'; // 驼峰命名
element.style.fontSize = '16px';           // 必须带单位（数字不行）

// 2. 批量设置 CSS 变量
element.style.setProperty('--primary-color', '#007bff');
element.style.setProperty('--gap', '1rem');
const color = element.style.getPropertyValue('--primary-color');

// 3. 移除样式
element.style.removeProperty('color');
// 或者设置为空字符串
element.style.color = '';

// 4. 读取计算样式（实际生效的样式，不是内联样式）
const computedStyle = window.getComputedStyle(element);
console.log(computedStyle.color);      // 实际颜色（rgba 格式）
console.log(computedStyle.fontSize);   // 实际字号
console.log(computedStyle.marginTop);  // 即使是 CSS 继承的也能拿到
console.log(computedStyle.getPropertyValue('--primary-color')); // 也能拿 CSS 变量

// 5. 元素尺寸（布局相关，会触发重排！）
const rect = element.getBoundingClientRect();
console.log(rect.width, rect.height);      // 渲染尺寸（含 padding border）
console.log(rect.top, rect.left);          // 相对于视口的位置
console.log(rect.x, rect.y);               // 同上
```
:::

---

### 9-3. 表单处理

- #### <span class="Fira-Code-Font">FormData</span>
> FormData 是专门处理表单数据的 API，支持文件上传，可直接传给 fetch。

::: details FormData 完整用法
```JavaScript
// 1. 从现有 form 元素创建
const form = document.querySelector('#my-form');
const formData = new FormData(form); // 自动收集所有带 name 的字段

// 2. 手动构建 FormData
const data = new FormData();
data.append('username', 'Alice');
data.append('email', 'alice@example.com');
data.append('age', 25); // 数字会自动转字符串

// 3. 文件上传（input type="file"）
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
data.append('avatar', file, 'user-avatar.jpg'); // 第三个参数是文件名

// 4. 读取值
console.log(formData.get('username')); // 'Alice'
console.log(formData.getAll('hobbies')); // 多选字段返回数组

// 5. 遍历所有字段
for (const [name, value] of formData.entries()) {
  console.log(name, value);
}

// 6. 转为普通对象（不含文件）
const formObject = Object.fromEntries(formData.entries());

// 7. 直接用于 fetch（自动设置 multipart/form-data）
fetch('/api/submit', {
  method: 'POST',
  body: formData // 不需要手动设置 Content-Type！浏览器会自动加
});

// 8. JSON 提交
fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(formData))
});
```
:::

---

### 9-4. 历史记录

- #### <span class="Fira-Code-Font">history.pushState() / replaceState()</span>
> History API 是单页应用（SPA）路由的基础，可以修改浏览器 URL 而不刷新页面。

::: details SPA 路由核心原理
```JavaScript
// ==============================================
// 修改历史而不刷新页面
// ==============================================

// 1. 新增一条历史记录（用户点击返回能回到上一页）
history.pushState(
  { page: 'user', id: 123 },  // state 对象：存在历史记录里的数据
  '',                          // 标题（大多数浏览器忽略）
  '/user/123'                  // 新的 URL
);

// 2. 替换当前历史（不新增，比如表单提交后重定向，不想让用户退回到表单页）
history.replaceState(
  { page: 'home' },
  '',
  '/home'
);

// 3. 读取当前 state
console.log(history.state);

// ==============================================
// 监听浏览器前进后退
// ==============================================
window.addEventListener('popstate', (e) => {
  // 用户点击浏览器前进/后退，或者调用 history.back() / forward()
  console.log('历史变化，新 state:', e.state);
  // 根据 state 或当前 URL 渲染对应页面
  renderPage(location.pathname, e.state);
});

// ==============================================
// 简单路由实现示例
// ==============================================
const routes = {
  '/': renderHome,
  '/about': renderAbout,
  '/user/:id': renderUser
};

function navigate(path, state = {}) {
  history.pushState(state, '', path);
  renderPage(path, state);
}

function renderPage(path, state) {
  // 路由匹配...
  const renderer = routes[path] || render404;
  renderer(state);
}

// 点击链接不刷新，用 pushState 导航
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="/"]');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});
```
:::

---

## 10. 性能与内存管理

| 优化方向 | 工具/API | 用途 |
|---------|---------|------|
| 性能测量 | performance.now() | 高精度微秒级计时 |
| 性能测量 | console.time/timeEnd | 开发调试计时 |
| 性能观察 | PerformanceObserver | 监听各项性能指标 |
| 内存优化 | WeakMap / WeakSet | 不阻止 GC 的弱引用集合 |
| 防抖节流 | setTimeout / clearTimeout | 控制高频事件执行频率 |

---

### 10-1. 内存优化：弱引用集合

- #### <span class="Fira-Code-Font">WeakMap</span>
> WeakMap 是键为**弱引用**的 Map，键必须是对象。当键对象没有其他引用时，会被垃圾回收器自动回收，对应的值也会被清理。不会造成内存泄漏！

> [!IMPORTANT]
> - 仅对象可作为键（Symbol、原始类型不行）
> - 弱引用：不阻止垃圾回收
> - 不可遍历（没有 keys()、values()、entries()、size）
> - 四个方法：`get()`、`set()`、`has()`、`delete()`

::: details 典型应用场景
```JavaScript
// ==============================================
// 场景 1：给 DOM 元素附加私有数据（元素删除数据自动清理）
// ==============================================
const elementData = new WeakMap();

const btn = document.querySelector('#submit');
elementData.set(btn, { clickCount: 0, lastClick: null });

// 使用时
btn.addEventListener('click', () => {
  const data = elementData.get(btn);
  data.clickCount++;
  data.lastClick = Date.now();
  console.log(`已点击 ${data.clickCount} 次`);
});

// 如果按钮从 DOM 中移除并且没有其他引用
// WeakMap 中的数据会自动被 GC 回收，不会内存泄漏


// ==============================================
// 场景 2：类的私有属性（真正的私有，外部无法访问）
// ==============================================
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    privateData.set(this, {
      password: password, // 真正的私有数据，外部拿不到
      loginAttempts: 0
    });
    this.name = name; // 公开属性
  }
  
  checkPassword(input) {
    const priv = privateData.get(this);
    return priv.password === input;
  }
}

// 外部只能访问公开属性，访问不到 password


// ==============================================
// 场景 3：缓存计算结果（Cache）
// ==============================================
const cache = new WeakMap();

function processObject(obj) {
  if (cache.has(obj)) {
    return cache.get(obj); // 有缓存直接返回
  }
  
  // 复杂计算...
  const result = heavyComputation(obj);
  
  cache.set(obj, result);
  return result;
}

// 当 obj 不再被引用时，缓存自动释放，不会内存泄漏
```
:::

---

- #### <span class="Fira-Code-Font">WeakSet</span>
> WeakSet 类似 Set，但成员必须是对象，且是弱引用。对象被 GC 回收时自动从 WeakSet 中移除。

::: details 应用场景
```JavaScript
// ==============================================
// 场景：标记对象是否处理过
// ==============================================
const processed = new WeakSet();

function process(obj) {
  if (processed.has(obj)) {
    return; // 已经处理过，跳过
  }
  
  // 处理逻辑...
  console.log('处理:', obj);
  
  processed.add(obj); // 标记为已处理
}

// 同样，对象销毁时标记自动消失，不会内存泄漏


// ==============================================
// 场景：防止循环引用（JSON 序列化）
// ==============================================
function safeStringify(obj) {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]'; // 循环引用，替换标记
      }
      seen.add(value);
    }
    return value;
  });
}

// 测试循环引用
const a = { name: 'A' };
const b = { name: 'B', ref: a };
a.ref = b; // a 和 b 互相引用

console.log(safeStringify(a)); // 不会报错！
```
:::

> [!TIP]
> **普通 vs 弱引用集合对比：**
> | 特性 | Map / Set | WeakMap / WeakSet |
> |-----|-----------|------------------|
> | 键/成员类型 | 任意类型 | 必须是对象 |
> | 引用类型 | 强引用 | 弱引用 |
> | 阻止 GC | ✅ 阻止 | ❌ 不阻止 |
> | 可遍历 | ✅ 可以 | ❌ 不可以 |
> | size 属性 | ✅ 有 | ❌ 没有 |
> | 适用场景 | 数据存储、集合运算 | 临时标记、附加数据、防泄漏缓存 |

---

### 10-2. 性能测量

- #### <span class="Fira-Code-Font">performance.now()</span>
> 高精度计时 API，返回页面加载以来的微秒级时间戳，精度可达 5 微秒（浏览器可能做防指纹降精度）。比 `Date.now()` 精度高得多，适合性能测量。

::: details 性能测量完整示例
```JavaScript
// ==============================================
// 基础计时
// ==============================================
const start = performance.now();

// 执行代码...
for (let i = 0; i < 1000000; i++) {}

const end = performance.now();
console.log(`耗时: ${end - start} 毫秒`); // 精度到小数点后多位


// ==============================================
// 性能标记与测量（可以在 DevTools Performance 面板看到）
// ==============================================
// 打标记
performance.mark('start-algorithm');
runAlgorithm();
performance.mark('end-algorithm');

// 测量间隔
performance.measure('算法耗时', 'start-algorithm', 'end-algorithm');

// 获取测量结果
const measure = performance.getEntriesByName('算法耗时')[0];
console.log(`${measure.name}: ${measure.duration}ms`);

// 清理标记
performance.clearMarks();
performance.clearMeasures();


// ==============================================
// 函数性能测试工具
// ==============================================
function benchmark(fn, iterations = 1000) {
  // 预热
  for (let i = 0; i < 100; i++) fn();
  
  // 正式测量
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  
  const total = end - start;
  const perCall = total / iterations;
  
  console.log(`总计: ${total.toFixed(2)}ms`);
  console.log(`单次: ${(perCall * 1000).toFixed(2)}μs`);
  console.log(`每秒: ${Math.round(1000 / perCall)} 次`);
}

// 对比两种实现
// benchmark(version1);
// benchmark(version2);
```
:::

::: details PerformanceObserver 监听 Web Vitals
```JavaScript
// 监听各项性能指标（Core Web Vitals）
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('性能指标:', entry.name, entry.value);
    
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        console.log('LCP 最大内容绘制:', entry.startTime);
        break;
      case 'first-input':
        console.log('FID 首次输入延迟:', entry.processingStart - entry.startTime);
        break;
      case 'layout-shift':
        if (!entry.hadRecentInput) {
          console.log('CLS 累积布局偏移:', entry.value);
        }
        break;
    }
  }
});

// 监听各种性能事件
observer.observe({ entryTypes: [
  'largest-contentful-paint',
  'first-input',
  'layout-shift',
  'paint', // FP, FCP
  'navigation' // 页面加载各阶段
] });
```
:::

---

### 10-3. 防抖与节流

> 防抖（Debounce）和节流（Throttle）是控制高频函数执行频率的两种经典方案，几乎是前端性能优化必备知识。

::: details 防抖（Debounce）：事件触发后延迟执行，期间再触发则重置计时器
```JavaScript
/**
 * 防抖：只有当事件停止触发 n 毫秒后，才真正执行一次
 * 适用场景：搜索输入联想、窗口 resize、输入框验证
 */
function debounce(fn, delay = 300) {
  let timer = null;
  
  return function(...args) {
    // 每次调用都清除之前的定时器，重新计时
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// 使用示例：搜索联想
// 用户停止输入 300ms 后才发请求，避免频繁调用接口
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((e) => {
  fetchSearchResults(e.target.value);
}, 300);

searchInput.addEventListener('input', debouncedSearch);


// 立即执行版本（前缘触发）
function debounceImmediate(fn, delay = 300) {
  let timer = null;
  
  return function(...args) {
    const callNow = !timer;
    
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    
    if (callNow) {
      fn.apply(this, args);
    }
  };
}
// 按钮防重复提交：点击立即执行，300ms 内再点不生效
```
:::

::: details 节流（Throttle）：保证 n 毫秒内最多执行一次
```JavaScript
/**
 * 节流：无论事件触发多频繁，保证单位时间内只执行一次
 * 适用场景：滚动事件、拖拽、鼠标移动、resize
 */
function throttle(fn, interval = 100) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    // 如果还没到时间，直接返回
    if (now - lastTime < interval) {
      return;
    }
    
    lastTime = now;
    fn.apply(this, args);
  };
}

// 使用示例：滚动事件
// 无论滚动多快，每 100ms 最多执行一次
const throttledScroll = throttle(() => {
  const scrollY = window.scrollY;
  updateHeader(scrollY);
  updateBackToTopButton(scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);


// 带尾调用版本（最后一次触发也会执行）
function throttleWithTrailing(fn, interval = 100) {
  let lastTime = 0;
  let timer = null;
  
  return function(...args) {
    const now = Date.now();
    const remaining = interval - (now - lastTime);
    
    if (timer) clearTimeout(timer);
    
    if (remaining <= 0) {
      lastTime = now;
      fn.apply(this, args);
    } else {
      // 最后一次触发，延迟补执行
      timer = setTimeout(() => {
        lastTime = Date.now();
        fn.apply(this, args);
        timer = null;
      }, remaining);
    }
  };
}
```
:::

> [!TIP]
> **防抖 vs 节流怎么选？**
> - **想等用户操作完再执行** → 防抖（比如搜索输入，等用户停止输入再发请求）
> - **想保证执行频率，不要太频繁但也要有响应** → 节流（比如滚动更新位置，16ms 一次 60fps 流畅）
> - 简单记忆：**防抖是"停止后才执行"，节流是"匀速执行"**
