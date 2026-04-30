---
layout: doc

lastUpdated: false
title: Node.js 性能优化
description: 从内存管理、事件循环优化到集群部署，全方位讲解 Node.js 服务端应用性能调优实战指南 
category: Node.js
date: 2026-04-23
---

# Node.js 性能优化

刚用 Node.js 写后端的时候，我觉得这东西性能挺好的，随便写写也能扛住不少 QPS。

直到有一次，上线了一个报表导出功能，结果把整个服务搞挂了。查了半天才发现，我用同步方式读大文件，把事件循环给堵死了，所有请求都超时。那天半夜折腾到两点，才把问题解决。

从那之后我就明白，Node.js 虽然好用，但真的不能"瞎写"。它的单线程模型既是优点也是缺点，写得好性能爆表，写得不好分分钟给你颜色看。这篇文章就把我这些年踩过的坑和调优经验整理出来。

## 1. 内存管理

### 1.1 内存结构

Node.js 的内存主要分为：

- **堆内存（Heap）**：对象和闭包存储的地方
- **栈内存（Stack）**：函数调用栈和原始类型存储
- **外部内存（External）**：Buffer 等 C++ 层面分配的内存

### 1.2 内存泄漏常见场景

::: danger 踩坑提醒
我曾经遇到过一个内存泄漏问题，服务每天内存涨 100M，一周就得重启一次。查了好几天才发现是某个缓存对象忘记加过期策略，数据只增不减。加了个 LRU 缓存之后，问题立刻解决了。
:::

#### 全局变量泄漏

```javascript
// 错误示例：全局缓存无限增长
const cache = {};

function addToCache(key, value) {
  cache[key] = value; // 没有清理机制，内存持续增长
}

// 正确示例：使用 LRU 缓存
import LRU from 'lru-cache';

const cache = new LRU({ max: 500, ttl: 1000 * 60 * 60 });
```

#### 闭包引用未释放

```javascript
// 错误示例
function createClosure() {
  const largeData = new Array(1000000).fill('*');
  return function() {
    return largeData.length;
  };
}

// 正确示例：及时释放引用
function createClosure() {
  let largeData = new Array(1000000).fill('*');
  return function() {
    const length = largeData.length;
    largeData = null; // 使用后释放引用
    return length;
  };
}
```

#### 事件监听器未移除

```javascript
// 错误示例
const EventEmitter = require('events');
const emitter = new EventEmitter();

function setup() {
  emitter.on('data', () => {
    // 处理数据
  });
}

// 正确示例
function setup() {
  const handler = () => { /* 处理数据 */ };
  emitter.on('data', handler);
  
  return function cleanup() {
    emitter.off('data', handler);
  };
}
```

### 1.3 内存监控工具

- **Chrome DevTools**：通过 `--inspect` 模式连接调试
- **clinic.js**：NearForm 出品的性能诊断工具
- **0x**：火焰图生成工具

```bash
# 使用 clinic 诊断内存问题
npm install -g clinic
clinic doctor -- node app.js
```

## 2. 事件循环优化

### 2.1 事件循环阶段

Node.js 事件循环包含 6 个阶段：

1. **Timers**：执行 `setTimeout` 和 `setInterval` 回调
2. **Pending callbacks**：执行延迟到下一轮的 I/O 回调
3. **Idle, prepare**：内部使用
4. **Poll**：获取新的 I/O 事件
5. **Check**：执行 `setImmediate` 回调
6. **Close callbacks**：执行关闭回调

### 2.2 避免阻塞事件循环

```javascript
// 错误示例：同步 CPU 密集操作阻塞事件循环
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 正确示例 1：使用 Worker Threads
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.postMessage(40);
  worker.on('message', result => console.log('Result:', result));
} else {
  parentPort.postMessage(fibonacci(40));
}

// 正确示例 2：分批处理
function processArrayAsync(arr, batchSize = 100) {
  return new Promise((resolve) => {
    let index = 0;
    const results = [];
    
    function processBatch() {
      const end = Math.min(index + batchSize, arr.length);
      for (; index < end; index++) {
        results.push(arr[index] * 2); // 处理逻辑
      }
      
      if (index < arr.length) {
        setImmediate(processBatch); // 让出事件循环
      } else {
        resolve(results);
      }
    }
    
    processBatch();
  });
}
```

## 3. 异步操作优化

### 3.1 避免回调地狱

```javascript
// 错误示例：回调嵌套
fs.readFile('a.txt', (err, a) => {
  fs.readFile('b.txt', (err, b) => {
    fs.readFile('c.txt', (err, c) => {
      // 深度嵌套...
    });
  });
});

// 正确示例：Promise + async/await
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function readFiles() {
  const [a, b, c] = await Promise.all([
    readFile('a.txt'),
    readFile('b.txt'),
    readFile('c.txt')
  ]);
  return { a, b, c };
}
```

### 3.2 并发控制

```javascript
// 错误示例：无限制并发导致内存耗尽
async function processAll(items) {
  return Promise.all(items.map(item => processItem(item)));
}

// 正确示例：使用 p-limit 控制并发
import pLimit from 'p-limit';

const limit = pLimit(10); // 最多 10 个并发

async function processAll(items) {
  return Promise.all(items.map(item => limit(() => processItem(item))));
}
```

## 4. 集群模式

### 4.1 使用 cluster 模块

```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  // Workers 共享 TCP 连接
  require('./app'); // 启动应用
  console.log(`Worker ${process.pid} started`);
}
```

### 4.2 PM2 进程管理

```bash
# 安装 PM2
npm install -g pm2

# 集群模式启动
pm2 start app.js -i max  # 使用所有 CPU 核心
pm2 start app.js -i 4    # 启动 4 个实例

# 常用命令
pm2 list              # 查看进程列表
pm2 monit             # 监控面板
pm2 logs              # 查看日志
pm2 reload app.js     # 零停机重载
```

## 5. 代码优化技巧

### 5.1 使用 Stream 处理大文件

```javascript
// 错误示例：一次性读取大文件
const data = fs.readFileSync('large-file.txt');

// 正确示例：使用 Stream
const readStream = fs.createReadStream('large-file.txt', { highWaterMark: 64 * 1024 });
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(transformStream).pipe(writeStream);
```

### 5.2 避免不必要的对象创建

```javascript
// 错误示例：循环中重复创建对象
for (let i = 0; i < 1000000; i++) {
  const obj = { a: i, b: i * 2 }; // 每次都创建新对象
  process(obj);
}

// 正确示例：复用对象
const obj = { a: 0, b: 0 };
for (let i = 0; i < 1000000; i++) {
  obj.a = i;
  obj.b = i * 2;
  process(obj);
}
```

### 5.3 使用 fast 系列库

- **fast-json-stringify**：比 JSON.stringify 更快
- **fastify**：高性能 Web 框架
- **fast-redact**：快速数据脱敏

```javascript
const fastJson = require('fast-json-stringify');

const stringify = fastJson({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' }
  }
});

console.log(stringify({ name: 'John', age: 30 }));
```

## 6. 数据库连接优化

### 6.1 连接池配置

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  max: 20,              // 最大连接数
  min: 5,               // 最小连接数
  idleTimeoutMillis: 30000,  // 空闲连接超时
  connectionTimeoutMillis: 2000, // 连接超时
});

// 使用连接池
async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release(); // 释放连接回池中
  }
}
```

### 6.2 缓存热点数据

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 带缓存的数据查询
async function getUserWithCache(userId) {
  const cacheKey = `user:${userId}`;
  
  // 先查缓存
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 缓存未命中，查数据库
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  
  // 写入缓存（TTL: 1小时）
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}
```

## 7. 性能监控指标

关键性能指标监控：

- **响应时间（Response Time）**：p50, p95, p99 分位值
- **吞吐量（Throughput）**：每秒请求数（QPS/RPS）
- **错误率（Error Rate）**：5xx / 4xx 错误比例
- **内存使用率（Memory Usage）**：RSS / HeapUsed
- **事件循环延迟（Event Loop Lag）**

```javascript
// 监控事件循环延迟
const { monitorEventLoopDelay } = require('perf_hooks');
const histogram = monitorEventLoopDelay();

setInterval(() => {
  console.log('Event Loop Delay Percentiles:');
  console.log('p50:', histogram.percentile(50));
  console.log('p95:', histogram.percentile(95));
  console.log('p99:', histogram.percentile(99));
  histogram.reset();
}, 5000);
```

## 总结

做了 Node.js 开发我才知道，性能优化其实没有什么"银弹"。它不是靠加一两行配置就能解决的问题，而是需要你真正理解它的运行机制。

总结一下几个核心要点：

1. **内存管理**：警惕泄漏，合理使用缓存，别让对象"长生不老"
2. **事件循环**：千万别堵它，CPU 密集任务丢给 Worker 去处理
3. **并发控制**：异步操作不是越多越好，要有度，防止把下游服务也拖垮
4. **集群部署**：单线程再强也打不过多核，PM2 + Cluster 是标配
5. **代码优化**：大文件用 Stream，减少不必要的对象创建
6. **数据库优化**：连接池、缓存、索引，这三个是老生常谈但真的很重要

最后想说的是，不要过早优化，但也不要完全不优化。写完代码多想想：这个地方如果数据量翻 10 倍会怎么样？有压力才有动力去优化。

