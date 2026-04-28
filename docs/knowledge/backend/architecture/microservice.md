---
layout: doc

lastUpdated: false
title: 微服务架构入门
description: 从单体到微服务，聊聊服务拆分、分布式事务和可观测性的实践经验
category: 后端架构
date: 2025-06-15
---

# 微服务架构入门

微服务架构是一种将应用程序构建为一组小型、独立部署的服务的架构风格。每个服务运行在自己的进程中，通过轻量级机制（通常是 HTTP API）进行通信。本文将介绍微服务的核心概念和实践要点。

## 1. 微服务 vs 单体架构

先说说这两种架构最直观的区别。

### 1.1 单体架构（Monolithic）

<img src="/markdown/backend/architecture/Monolithic.png" alt="加载失败" />

**优点：**
- 开发简单，代码都在一个仓库
- 部署方便，丢一个应用包就行
- 测试直接，不用考虑跨服务调用

**缺点：**
- 代码库越来越大，新人上手要好久
- 技术栈被锁死，想升级个框架都费劲
- 扩展受限，只能整个应用加机器
- 部署风险高，一个模块出问题，整个应用都挂

::: tip 什么情况用单体？
团队不大（10人以内）、业务初期、追求快速验证的时候，单体绝对是最优选择。别一上来就搞微服务，那叫过度设计。
:::

### 1.2 微服务架构（Microservices）

<img src="/markdown/backend/architecture/Microservices.png" alt="加载失败" />

**优点：**
- 服务独立，各用各的技术栈，A 服务用 Node，B 服务用 Go 都没问题
- 独立部署，改了订单服务就只发布订单，不用整个应用重启
- 按需扩展，用户服务压力大就给它加机器，别的服务不受影响
- 故障隔离，支付服务挂了，用户还能浏览商品，只是不能下单

**缺点：**
- 系统复杂度爆炸上升，分布式系统的坑一个都跑不掉
- 分布式事务是老大难问题，没有完美解
- 运维成本增加，以前管一台机器，现在管几十台
- 调用链追踪复杂，一个请求过七八个服务，排查问题头大

::: danger 踩坑提醒
我见过最离谱的团队，5个开发人员拆了20多个微服务，结果天天在那解决服务间调用问题，业务代码都没时间写。微服务不是拆得越细越好，一定要匹配团队规模和能力。
:::

## 2. 服务拆分原则

服务怎么拆？这是入门微服务遇到的第一个问题。拆粗了等于白拆，拆细了自己受罪。

### 2.1 按业务能力拆分

最直观的方式，看业务有哪些模块：

```
电商业务 → 按能力拆分：
├── 用户服务（用户信息、认证、权限）
├── 商品服务（商品管理、类目、库存）
├── 订单服务（订单创建、支付、发货）
├── 支付服务（支付渠道、对账、退款）
├── 物流服务（配送、轨迹、运费）
└── 营销服务（优惠券、活动、积分）
```

### 2.2 按子域拆分（DDD）

如果团队对领域驱动设计有了解，可以按子域来拆，拆分的颗粒度会更合理：

```
核心域（Core Domain）：最值钱的业务，重点投入
  └── 交易域 → 订单服务、支付服务

支撑域（Supporting Domain）：辅助核心业务
  ├── 用户域 → 用户服务、认证服务
  └── 商品域 → 商品服务、搜索服务

通用域（Generic Domain）：通用功能，可以买第三方
  ├── 通知域 → 消息服务、邮件服务
  └── 日志域 → 日志服务、监控服务
```

### 2.3 拆分粒度考量

拆服务没有标准答案，但有几个原则：

✅ **服务粒度适中：**
- 单一职责：一个服务只做一件事
- 高内聚：相关功能尽量放一个服务
- 低耦合：服务间依赖越少越好，最好单向依赖

❌ **避免过度拆分：**
- 服务太小导致调用链太长，性能上不去
- 网络开销增加，本来一个本地调用变成跨机器
- 事务处理变得极其复杂

## 3. 关键设计模式

### 3.1 API 网关

<img src="/markdown/backend/architecture/API-Gateway.png" alt="加载失败" />

网关就像是整个系统的"大门"，所有请求先进网关，再由网关分发到各个服务。网关不只是转发请求，它还能干很多事：

```javascript
// 网关路由配置示例
const routes = [
  {
    path: '/api/users/**',
    target: 'http://user-service:3000',
    timeout: 5000,
    retry: 2
  },
  {
    path: '/api/orders/**',
    target: 'http://order-service:3001',
    timeout: 10000  // 订单接口超时时间设长一点
  }
];

// 网关中间件职责
const middleware = [
  authenticate,       // JWT 认证，不用每个服务自己写了
  rateLimiter,        // 限流防刷
  circuitBreaker,     // 熔断，某服务挂了直接返回降级
  logger,             // 统一日志
  metrics             // 监控打点
];
```

网关能把所有服务通用的功能抽出来统一做，别把网关写得太重，加太多业务逻辑就变 ESB 了。

### 3.2 服务注册与发现

服务多了，A 服务怎么知道 B 服务部署在哪台机器？这时候就需要注册中心。

```
服务启动 → 注册自己的地址到注册中心 → 定期上报心跳（健康检查）
服务调用方 → 去注册中心找目标服务地址 → 本地缓存 → 发起调用
```

<img src="/markdown/backend/architecture/Consul-Eureka.png" alt="加载失败" />

```javascript
// 服务注册示例（Consul）
const consul = require('consul')();

// 服务启动时注册自己
consul.agent.service.register({
  name: 'user-service',
  id: `user-service-${process.pid}`,
  address: getLocalIP(),
  port: 3000,
  tags: ['api', 'users'],
  check: {
    http: `http://${getLocalIP()}:3000/health`,
    interval: '10s',
    timeout: '5s'
  }
});

// 调用时发现服务
async function getService(serviceName) {
  const services = await consul.health.service(serviceName);
  const healthy = services.filter(s => 
    s.Checks.every(c => c.Status === 'passing')
  );
  return healthy[Math.floor(Math.random() * healthy.length)];
}
```

常见注册中心选型：Eureka（Spring Cloud 亲儿子）、Consul（功能全面）、Nacos（阿里开源，国内用得多）。

### 3.3 断路器模式（Circuit Breaker）

分布式系统最怕什么？雪崩！

用户服务挂了，订单服务还在不停发请求，请求超时产生大量积压，把订单服务也拖挂了，然后购物车服务也挂了，像多米诺骨牌一样。

断路器就是来解决这个问题的：

<img src="/markdown/backend/architecture/Circuit-Breaker.png" alt="加载失败" />

```javascript
// 简单的断路器实现
class CircuitBreaker {
  constructor(options) {
    this.failureThreshold = options.failureThreshold || 5; // 失败5次就熔断
    this.resetTimeout = options.resetTimeout || 30000;      // 30秒后尝试半开
    this.state = 'CLOSED';  // CLOSED 闭合 → 正常请求
    this.failures = 0;
    this.lastFailureTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN'; // 时间到了，放几个请求试试水
      } else {
        throw new Error('服务暂时不可用，已熔断');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED'; // 成功了，恢复正常
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN'; // 失败次数到了，熔断
    }
  }
}
```

这个模式非常重要，每个调用远程服务的地方都应该有熔断机制，这是系统高可用的基础保障。

## 4. 数据一致性

这是微服务最头疼的问题，没有之一。

### 4.1 分布式事务的挑战

<img src="/markdown/backend/architecture/4-1.png" alt="加载失败" />

单体应用的时候，一个事务就能搞定订单、库存、支付。现在拆成三个服务，每个服务有自己的数据库，本地事务不管用了。

一个常见的失败场景：订单创建成功 → 库存扣减成功 → 支付服务超时 → 用户那边显示失败，但订单和库存都变了，数据就不一致了。

### 4.2 Saga 模式

Saga 是解决长事务的常用方案，核心思想是：把大事务拆成多个本地小事务，每个小事务有对应的补偿操作。如果某个步骤失败了，就按相反顺序回滚。

```javascript
// 订单创建 Saga 流程
class CreateOrderSaga {
  async execute(orderData) {
    try {
      // 1. 创建订单，状态设为 PENDING（待确认）
      const order = await orderService.create({ ...orderData, status: 'PENDING' });
      
      // 2. 扣减库存
      await inventoryService.deduct(order.productId, order.quantity);
      
      // 3. 处理支付
      await paymentService.charge(order.userId, order.amount);
      
      // 4. 都成功了，确认订单
      await orderService.update(order.id, { status: 'CONFIRMED' });
      
      return order;
    } catch (error) {
      // 哪个步骤失败了，就按相反顺序回滚
      await this.compensate(order, error);
      throw error;
    }
  }

  async compensate(order, error) {
    await paymentService.refund(order.id);  // 退款
    await inventoryService.restore(order.productId, order.quantity);  // 恢复库存
    await orderService.update(order.id, { status: 'CANCELLED' });  // 取消订单
  }
}
```

Saga 有两种实现方式：
- **编排式（Orchestration）**：有个中心协调器来指挥各服务执行，像管弦乐队的指挥
- ** choreography（编舞式）**：各服务订阅事件，自己决定什么时候执行，像跳舞大家配合

### 4.3 最终一致性

不是所有场景都需要强一致性，很多场景接受"最终一致"就够了。

```javascript
// 事件驱动的最终一致性
class OrderService {
  async createOrder(data) {
    // 1. 先保证本地事务成功
    const order = await db.transaction(async trx => {
      return await Order.create(data, { transaction: trx });
    });
    
    // 2. 发事件通知大家"我创建订单了"
    await eventBus.publish('OrderCreated', {
      orderId: order.id,
      productId: order.productId,
      quantity: order.quantity
    });
    
    return order;
  }
}

// 库存服务订阅这个事件，自己处理扣减
eventBus.subscribe('OrderCreated', async (event) => {
  try {
    await inventoryService.deduct(event.productId, event.quantity);
  } catch (error) {
    // 失败了就重试，重试次数到了就进入死信队列人工处理
    await deadLetterQueue.enqueue(event, error);
  }
});
```

最终一致性的好处是系统耦合度低、性能好，但要接受数据有短暂的不一致窗口，适合下单、通知这种场景。像转账这种强一致性场景还是老老实实分布式事务。

## 5. 服务通信

### 5.1 同步通信（REST/gRPC）

最常见的方式，A 服务直接调 B 服务的接口：

```javascript
// REST 调用示例
const axios = require('axios');

class UserServiceClient {
  async getUser(userId) {
    try {
      const response = await axios.get(
        `http://user-service/api/users/${userId}`,
        { timeout: 3000 }  // 超时一定要设！别让请求挂死
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('用户不存在');
      }
      throw new Error('服务暂时不可用');
    }
  }
}
```

同步调用简单直接，但要注意：
- 一定要设超时时间
- 考虑重试机制（但别重试风暴）
- 调用链不要太长，3层以内比较合适

### 5.2 异步消息队列

解耦神器！A 服务不用等 B 服务处理完，发个消息就完事了。

```javascript
// RabbitMQ 示例
const amqp = require('amqplib');

class MessageQueue {
  async publish(exchange, routingKey, message) {
    const channel = await this.getChannel();
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }  // 消息持久化，防止 RabbitMQ 挂了丢消息
    );
  }

  async subscribe(queue, handler) {
    const channel = await this.getChannel();
    channel.consume(queue, async (msg) => {
      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        channel.ack(msg); // 处理成功才确认
      } catch (error) {
        channel.nack(msg, false, false); // 处理失败不重入队列，或者进死信
      }
    });
  }
}
```

主流消息队列选型：
- RabbitMQ：功能全面，适合业务消息
- Kafka：高吞吐，适合日志、大数据场景
- RocketMQ：阿里开源，国内用得多，事务消息做得好

## 6. 可观测性

微服务没有可观测性，就像开夜车不开灯，出问题根本不知道在哪。

可观测性三支柱：**日志（Logging）、指标（Metrics）、追踪（Tracing）**

### 6.1 日志（Logging）

日志别只写个字符串，一定要结构化，方便后续检索分析：

```javascript
const logger = require('winston');

logger.info('订单创建成功', {
  service: 'order-service',
  traceId: req.headers['x-trace-id'],  // 全链路追踪 ID，一定要传
  spanId: generateSpanId(),
  orderId: order.id,
  userId: order.userId,
  duration: Date.now() - startTime
});
```

### 6.2 指标（Metrics）

指标是系统的"血压计"，能提前发现问题：

```javascript
// Prometheus 指标收集
const client = require('prom-client');

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP 请求耗时',
  labelNames: ['service', 'route', 'status']
});

// 中间件自动收集
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ 
      service: 'order-service',
      route: req.route?.path || 'unknown',
      status: res.statusCode
    });
  });
  next();
});
```

核心指标一定要有：QPS、响应时间 P95/P99、错误率、服务实例数。

### 6.3 追踪（Tracing）

一个请求经过了 8 个服务，到底在哪慢的？没有追踪根本查不出来。

```javascript
// OpenTelemetry 分布式追踪
async function createOrder(userId, productId) {
  const span = tracer.startSpan('createOrder');
  span.setAttribute('userId', userId);
  span.setAttribute('productId', productId);
  
  try {
    const order = await doCreateOrder(userId, productId);
    span.setStatus({ code: 1 }); // OK
    return order;
  } catch (error) {
    span.setStatus({ code: 2, message: error.message });
    throw error;
  } finally {
    span.end();
  }
}
```

常见追踪方案：Jaeger、Zipkin、SkyWalking。

## 7. 部署与运维

### 7.1 容器化部署（Docker）

现在没人直接把 Jar 包丢服务器上跑了，都上容器：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production  # 只装生产依赖，减小镜像体积

COPY . .

EXPOSE 3000

# 健康检查很重要，K8s 靠这个决定要不要重启容器
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
```

### 7.2 Kubernetes 编排

服务多了之后，手动管理容器是不可能的，必须上 K8s：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3  # 3 个实例，高可用
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: myrepo/user-service:v1.0.0
        ports:
        - containerPort: 3000
        resources:  # 资源限制，防止某个服务把机器吃光
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:  # 存活检查，挂了自动重启
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe: # 就绪检查，没好之前不接收流量
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

K8s 确实有学习成本，但对于微服务来说是真的香，服务发现、负载均衡、滚动发布、自动扩缩容，该有的都给你弄好了。
