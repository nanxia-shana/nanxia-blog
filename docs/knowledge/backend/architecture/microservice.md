---
layout: doc

lastUpdated: false

---

# 微服务架构入门

微服务架构是一种将应用程序构建为一组小型、独立部署的服务的架构风格。每个服务运行在自己的进程中，通过轻量级机制（通常是 HTTP API）进行通信。本文将介绍微服务的核心概念和实践要点。

## 1. 微服务 vs 单体架构

### 1.1 单体架构（Monolithic）

<img src="/markdown/backend/architecture/Monolithic.png" alt="加载失败" />

**优点：**
- 开发简单，集中式管理
- 部署方便，单一应用包
- 测试直接，无需跨服务调用

**缺点：**
- 代码库膨胀，难以维护
- 技术栈固化，难以升级
- 扩展受限，只能整体扩展
- 部署风险高，一个 bug 影响全局

### 1.2 微服务架构（Microservices）

<img src="/markdown/backend/architecture/Microservices.png" alt="加载失败" />

**优点：**
- 服务独立，技术选型灵活
- 独立部署，发布风险低
- 按需扩展，资源利用率高
- 故障隔离，单一服务故障不影响全局

**缺点：**
- 系统复杂度高
- 分布式事务难题
- 运维成本增加
- 调用链追踪复杂

## 2. 服务拆分原则

### 2.1 按业务能力拆分

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

```
核心域（Core Domain）：
  └── 交易域 → 订单服务、支付服务

支撑域（Supporting Domain）：
  ├── 用户域 → 用户服务、认证服务
  └── 商品域 → 商品服务、搜索服务

通用域（Generic Domain）：
  ├── 通知域 → 消息服务、邮件服务
  └── 日志域 → 日志服务、监控服务
```

### 2.3 拆分粒度考量

✅ **服务粒度适中：**
- 单一职责：一个服务只做一件事
- 高内聚：相关功能放在同一个服务
- 低耦合：服务间依赖少

❌ **避免过度拆分：**
- 服务过小导致调用链过长
- 网络开销增加
- 事务处理复杂

## 3. 关键设计模式

### 3.1 API 网关

<img src="/markdown/backend/architecture/API-Gateway.png" alt="加载失败" />

**网关职责：**

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
    timeout: 10000
  }
];

// 网关中间件
const middleware = [
  authenticate,       // JWT 认证
  rateLimiter,        // 限流
  circuitBreaker,     // 熔断
  logger,             // 日志
  metrics             // 监控
];
```

### 3.2 服务注册与发现

```
服务启动 → 注册到注册中心 → 健康检查 → 服务发现
```
<img src="/markdown/backend/architecture/Consul-Eureka.png" alt="加载失败" />

```javascript
// 服务注册示例（Consul）
const consul = require('consul')();

// 注册服务
consul.agent.service.register({
  name: 'user-service',
  id: 'user-service-1',
  address: '192.168.1.100',
  port: 3000,
  tags: ['api', 'users'],
  check: {
    http: 'http://192.168.1.100:3000/health',
    interval: '10s',
    timeout: '5s'
  }
});

// 服务发现
async function getService(serviceName) {
  const services = await consul.health.service(serviceName);
  const healthy = services.filter(s => 
    s.Checks.every(c => c.Status === 'passing')
  );
  return healthy[Math.floor(Math.random() * healthy.length)];
}
```

### 3.3 断路器模式（Circuit Breaker）

<img src="/markdown/backend/architecture/Circuit-Breaker.png" alt="加载失败" />

```javascript
// 断路器实现
class CircuitBreaker {
  constructor(options) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.lastFailureTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
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
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

## 4. 数据一致性

### 4.1 分布式事务挑战

<img src="/markdown/backend/architecture/4-1.png" alt="加载失败" />

### 4.2 Saga 模式

```javascript
// 订单创建 Saga
class CreateOrderSaga {
  async execute(orderData) {
    try {
      // 1. 创建订单（PENDING 状态）
      const order = await orderService.create({ ...orderData, status: 'PENDING' });
      
      // 2. 扣减库存
      await inventoryService.deduct(order.productId, order.quantity);
      
      // 3. 处理支付
      await paymentService.charge(order.userId, order.amount);
      
      // 4. 确认订单
      await orderService.update(order.id, { status: 'CONFIRMED' });
      
      return order;
    } catch (error) {
      // 补偿操作
      await this.compensate(order, error);
      throw error;
    }
  }

  async compensate(order, error) {
    // 按相反顺序回滚
    await paymentService.refund(order.id);
    await inventoryService.restore(order.productId, order.quantity);
    await orderService.update(order.id, { status: 'CANCELLED' });
  }
}
```

### 4.3 最终一致性

```javascript
// 事件驱动的最终一致性
class OrderService {
  async createOrder(data) {
    // 1. 本地事务创建订单
    const order = await db.transaction(async trx => {
      return await Order.create(data, { transaction: trx });
    });
    
    // 2. 发送领域事件
    await eventBus.publish('OrderCreated', {
      orderId: order.id,
      productId: order.productId,
      quantity: order.quantity
    });
    
    return order;
  }
}

// 库存服务订阅事件
eventBus.subscribe('OrderCreated', async (event) => {
  try {
    await inventoryService.deduct(event.productId, event.quantity);
  } catch (error) {
    // 重试或进入死信队列人工处理
    await deadLetterQueue.enqueue(event, error);
  }
});
```

## 5. 服务通信

### 5.1 同步通信（REST/gRPC）

```javascript
// REST 调用
const axios = require('axios');

class UserServiceClient {
  async getUser(userId) {
    try {
      const response = await axios.get(
        `http://user-service/api/users/${userId}`,
        { timeout: 3000 }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('Service unavailable');
    }
  }
}
```

### 5.2 异步消息队列

```javascript
// 消息队列示例
const amqp = require('amqplib');

class MessageQueue {
  async publish(exchange, routingKey, message) {
    const channel = await this.getChannel();
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async subscribe(queue, handler) {
    const channel = await this.getChannel();
    channel.consume(queue, async (msg) => {
      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, false); // 不重入队列
      }
    });
  }
}
```

## 6. 可观测性

### 6.1 日志（Logging）

```javascript
// 结构化日志
const logger = require('winston');

logger.info('Order created', {
  service: 'order-service',
  traceId: req.headers['x-trace-id'],
  spanId: generateSpanId(),
  orderId: order.id,
  userId: order.userId,
  duration: Date.now() - startTime
});
```

### 6.2 指标（Metrics）

```javascript
// Prometheus 指标
const client = require('prom-client');

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['service', 'route', 'status']
});

// 中间件收集指标
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ 
      service: 'order-service',
      route: req.route.path,
      status: res.statusCode
    });
  });
  next();
});
```

### 6.3 追踪（Tracing）

```javascript
// OpenTelemetry 分布式追踪
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const provider = new NodeTracerProvider();
provider.register();

// 创建 Span
async function createOrder(userId, productId) {
  const span = tracer.startSpan('createOrder');
  span.setAttribute('userId', userId);
  span.setAttribute('productId', productId);
  
  try {
    // 业务逻辑
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

## 7. 部署与运维

### 7.1 容器化部署（Docker）

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
```

### 7.2 Kubernetes 编排

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
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
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```