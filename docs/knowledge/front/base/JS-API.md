---
layout: doc

lastUpdated: false

---

# JavaScript - 每日 API 笔记
## 
> [!TIP]
> 未标注说明的API均为静态方法。
## 1. 数据类型与结构操作
### 1-1. 对象：
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

  - #### <span class="Fira-Code-Font">Object.entries()</span>
  - #### <span class="Fira-Code-Font">Object.fromEntries()</span>
  - #### <span class="Fira-Code-Font">Object.freeze()</span>
### 1-2. 数组：
- #### <span class="Fira-Code-Font">Array.map()</span>
- #### <span class="Fira-Code-Font">Array.filter()</span>
- #### <span class="Fira-Code-Font">Array.reduce()</span>
- #### <span class="Fira-Code-Font">Array.find()</span>
- #### <span class="Fira-Code-Font">Array.sort()</span>
- #### <span class="Fira-Code-Font">Array.from()</span>
### 1-3. 字符串：
- #### <span class="Fira-Code-Font">String.split()</span>
- #### <span class="Fira-Code-Font">String.substring()</span>
- #### <span class="Fira-Code-Font">String.replace()</span>
- #### <span class="Fira-Code-Font">String.startsWith()</span>
- #### <span class="Fira-Code-Font">String.endsWith()</span>
### 1-4.集合：
- #### <span class="Fira-Code-Font">Map</span>
- #### <span class="Fira-Code-Font">Set</span>
- #### <span class="Fira-Code-Font">WeakMap</span>
- #### <span class="Fira-Code-Font">WeakSet及其方法 (get, set, has, delete)</span>
## 2. 异步编程与控制流
### 2-1. 基础
- #### <span class="Fira-Code-Font">Promise</span>
- #### <span class="Fira-Code-Font">Promise.all()</span>
- #### <span class="Fira-Code-Font">Promise.race()</span>
- #### <span class="Fira-Code-Font">Promise.finally()</span>
### 2-2. 语法糖
- #### <span class="Fira-Code-Font">async/await</span>
### 2-3. 传统与现代
- #### <span class="Fira-Code-Font">XMLHttpRequest(传统)</span>
- #### <span class="Fira-Code-Font">fetch(现代)</span>
### 2-4. 并发控制
- #### <span class="Fira-Code-Font">Promise.allSettled()</span>
- #### <span class="Fira-Code-Font">Promise.any()(ES2021)</span>
## 3. 函数式编程与元编程
### 3-1. 高阶函数
- #### <span class="Fira-Code-Font">Function.prototype.bind()</span>
- #### <span class="Fira-Code-Font">Function.prototype.call()</span>
- #### <span class="Fira-Code-Font">Function.prototype.apply()</span>
### 3-2. 柯里化与组合：需要自行实现，但语言提供了基础 (bind)
### 3-3. 反射与代理
- #### <span class="Fira-Code-Font">ReflectAPI (如 Reflect.get(), Reflect.set())</span>
- #### <span class="Fira-Code-Font">Proxy(用于创建对象的代理)</span>
## 4. 模块化与依赖管理
### 4-1. ES Modules
- #### <span class="Fira-Code-Font">import</span>
- #### <span class="Fira-Code-Font">export</span>
- #### <span class="Fira-Code-Font">import()(动态导入)</span>
### 4-2. CommonJS (Node.js)
- #### <span class="Fira-Code-Font">require()</span>
- #### <span class="Fira-Code-Font">module.exports(注意：这是 Node.js 的机制，非语言标准)</span>
## 5. 错误处理与调试
### 5-1. 错误对象
- #### <span class="Fira-Code-Font">Error</span>
- #### <span class="Fira-Code-Font">TypeError</span>
- #### <span class="Fira-Code-Font">SyntaxError</span>
- #### <span class="Fira-Code-Font">RangeError及其子类。</span>
### 5-2. 调试
- #### <span class="Fira-Code-Font">console对象 (log, warn, error, table, time)</span>
- #### <span class="Fira-Code-Font">debugger语句。</span>
## 6. 数学与日期时间
### 6-1. 数学运算：Math.random(), Math.max(), Math.min(), Math.floor(), Math.PI
### 6-2. 日期处理：Date.now(), new Date(), Date.prototype.getFullYear(), Date.prototype.toISOString()
## 7. 数据存储与持久化
### 7-1. 客户端存储：localStorage, sessionStorage, IndexedDB
### 7-2. Cookies：通过 document.cookie操作 (浏览器环境)
### 7-3. 服务器存储：Node.js 的文件系统 (fs) 或数据库驱动
## 8. 网络通信
### 8-1. HTTP/HTTPS：fetch, XMLHttpRequest
### 8-2. 实时通信：WebSocket, Socket.IO(第三方库，但基于 Web API)
### 8-6. 服务器发送事件：EventSource
## 9. 浏览器特定功能
### 9-1. DOM 操作：document.querySelector(), element.appendChild(), element.addEventListener()
### 9-2. 样式与类：element.classList.add(), element.style.color
### 9-3. 表单处理：FormData, input.value, form.submit()
### 9-4. 历史记录：history.pushState(), history.replaceState()
## 10. 性能与内存管理
### 10-1. 内存：WeakMap, WeakSet(允许垃圾回收)
### 10-2. 性能测量：performance.now(), console.time()
### 10-3. 防抖与节流：需要自行实现，但语言提供了 setTimeout等基础工具。