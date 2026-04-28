---
layout: doc

lastUpdated: false
title: RESTful API 设计
description: 从 URL 设计到错误处理，一套实用的 API 设计规范
category: 后端架构
date: 2025-07-01
---

# RESTful API 设计

在工作的这些年里，我见过的 API 设计可以说是五花八门。

有把所有接口都写成 POST 的"省事派"，有 URL 里全是动词的"动词狂魔派"，还有返回格式随心所欲、每个接口都不一样的"自由派"。最离谱的一次是调用接口连字段名格式都不统一，成功的时候返回 `{ code: 200, data: {...} }`，失败的时候返回 `{ status: 'error', message: '...' }`。

API 设计这东西，说重要也重要，说不重要好像也能跑。但一个设计糟糕的 API，能把前端和客户端的同学逼疯。今天就跟大家聊聊怎么设计一套让人舒服的 RESTful API。

## 1. REST 核心原则

### 1.1 一切皆资源

REST 最核心的思想：API 里的所有东西都是资源。每个资源有唯一的标识符（URI）。

```
/users          # 用户集合资源
/users/123      # 单个用户资源
/users/123/orders  # 用户 123 的所有订单
```

### 1.2 用 HTTP 方法表达操作

用标准的 HTTP 方法来表示对资源做什么事，别在 URL 里写动词了。

| 方法 | 作用 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 获取资源 | ✅ 调用多少次结果都一样 | ✅ 不会修改数据 |
| POST | 创建资源 | ❌ 调用两次会产生两条 | ❌ 会修改数据 |
| PUT | 全量更新资源 | ✅ 提交多少次最终状态相同 | ❌ 会修改数据 |
| PATCH | 部分更新资源 | ❌ | ❌ |
| DELETE | 删除资源 | ✅ 删除一次和多次结果一样 | ❌ 会修改数据 |

::: tip 什么是幂等性？
很多人搞不清 PUT 和 POST 到底啥区别。简单说，幂等就是同一个请求执行一次和执行 N 次，最终效果是一样的。

比如用户 id 是 123，你 `PUT /users/123` 多少次，这个用户最终还是你提交的那个状态。但 `POST /users` 执行多次，就会创建好几个用户。
:::

### 1.3 无状态（Stateless）

每个请求都应该包含所有必要信息，服务端不保存客户端的会话状态。

```http
# ❌ 不好：服务端靠 session 识别当前用户
GET /api/user/current
Cookie: session=abc123

# ✅ 好：请求本身就包含了所有信息
GET /api/users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

无状态的好处是扩展性好，你的服务可以随意扩缩容，不需要考虑 session 共享的问题。

## 2. URL 设计规范

URL 是 API 的脸面，设计得好不好，一眼就能看出来。

### 2.1 资源命名原则

- **用名词复数**表示集合资源
- **全小写字母**，用**连字符（-）**分隔单词（别用下划线）
- **层级关系清晰**，从属关系用路径表示

```http
# ✅ 正确示范
GET    /api/users                    # 获取用户列表
GET    /api/users/123                # 获取单个用户
POST   /api/users                    # 创建用户
PUT    /api/users/123                # 更新用户
DELETE /api/users/123                # 删除用户

GET    /api/users/123/orders         # 获取用户 123 的所有订单
GET    /api/orders/456/items         # 获取订单 456 的所有商品

# ❌ 反面教材
GET    /api/getUser                  # URL 里带动词
GET    /api/userList                 # 不用复数
POST   /api/createUser               # 把动作写在 URL 里
GET    /api/user/123/order_list      # 命名风格不统一
```

### 2.2 资源嵌套层级

资源之间有从属关系的话，可以用嵌套路径：

```http
# 一级资源
/api/users
/api/orders
/api/products

# 二级资源（从属关系）
/api/users/123/orders            # 用户 123 的订单
/api/orders/456/payments         # 订单 456 的支付记录
```

::: warning 别嵌套太深
超过 3 层的嵌套就不推荐了，比如 `/api/users/123/orders/456/payments/789/refund`。

其实大部分情况可以改成：`/api/orders/456/payments`，因为订单 id 本身就是唯一的，不需要把用户 id 也带上。
:::

## 3. HTTP 状态码要用对

别什么请求都返回 200，HTTP 协议给我们准备了丰富的状态码，好好利用。

### 3.1 成功响应（2xx）

```http
200 OK                    # GET/PUT/PATCH 成功
201 Created               # POST 创建资源成功
202 Accepted              # 异步任务已接受，还在处理
204 No Content            # DELETE 成功，不需要返回响应体
```

201 状态码记得在响应头里加 Location，告诉客户端新创建的资源在哪：

```http
HTTP/1.1 201 Created
Location: /api/users/123

{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3.2 客户端错误（4xx）

客户端出错的情况，要告诉用户哪错了：

```http
400 Bad Request           # 请求参数格式错了
401 Unauthorized          # 没登录/Token 无效
403 Forbidden             # 登录了，但这个资源你没权限
404 Not Found             # 资源不存在
405 Method Not Allowed    # 请求方法不支持，比如资源是 GET 你用 DELETE
409 Conflict              # 资源冲突，比如用户名已存在
410 Gone                  # 资源已永久删除（比 404 语义更强）
422 Unprocessable Entity  # 参数格式对了，但验证失败（密码太短之类）
429 Too Many Requests     # 请求太频繁，限流了
```

::: tip 401 vs 403，别搞混
- 401：你是谁？我认不出你（未登录/Token 无效）
- 403：我知道你是谁，但你就是不能看这个（没权限）
:::

### 3.3 服务端错误（5xx）

服务器这边出问题了：

```http
500 Internal Server Error   # 服务器内部错误（代码崩了）
502 Bad Gateway             # 网关错误，上游服务挂了
503 Service Unavailable     # 服务暂时不可用（可能在发布）
504 Gateway Timeout         # 上游服务超时没响应
```

## 4. 请求/响应设计

### 4.1 统一响应格式

一定要统一！不管成功还是失败，结构都要一样，前端处理起来才省心：

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req-abc123xyz"
  }
}
```

建议加上 `request_id` ，排查线上问题的时候，前端把这个 id 给后端，后端直接搜日志就能定位到这次请求，非常方便。

### 4.2 错误响应格式

错误信息不要只返回一个字符串，要结构化，方便前端处理：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      },
      {
        "field": "password",
        "message": "密码长度不能少于 8 位"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

`error.code` 用字符串枚举，别用数字，前端代码里可以直接写：

```javascript
if (error.code === 'USER_NOT_FOUND') {
  // 处理用户不存在的情况
}
```

比魔法数字好维护一万倍。

### 4.3 分页设计

列表接口一定要做分页，不然数据量大了直接把服务搞挂：

```http
# 请求示例
GET /api/users?page=1&per_page=20&sort=-created_at,name
```

响应里带上完整的分页信息，前端做分页组件很方便：

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "links": {
    "self": "/api/users?page=1&per_page=20",
    "next": "/api/users?page=2&per_page=20",
    "last": "/api/users?page=8&per_page=20"
  }
}
```

## 5. 过滤、排序和搜索

### 5.1 过滤

查询参数做过滤，简单直接：

```http
# 简单等于过滤
GET /api/users?status=active&country=CN

# 范围过滤，用中括号语法
GET /api/users?age[gte]=18&age[lt]=60
GET /api/orders?created_at[between]=2024-01-01,2024-02-01

# 多值 IN 查询
GET /api/users?status[in]=active,pending,banned
```

### 5.2 排序

用负号表示降序，很直观：

```http
# 单字段排序
GET /api/users?sort=created_at        # 升序
GET /api/users?sort=-created_at       # 降序（前缀 -）

# 多字段排序，逗号分隔
GET /api/users?sort=-created_at,name  # 先按创建时间降序，再按名称升序
```

### 5.3 字段选择

有时候客户端不需要那么多字段，支持按需选择能减少传输量：

```http
# 只返回需要的字段
GET /api/users?fields=id,name,email

# 排除不需要的字段
GET /api/users?exclude=password,secret_token
```

### 5.4 搜索

简单搜索用 q 参数就行：

```http
# 全文搜索
GET /api/users?q=张三

# 指定字段搜索
GET /api/users?q=name:张三,email:zhangsan
```

## 6. 版本控制

API 不可能一成不变，版本控制是必须的。

### 6.1 URL 版本（推荐）

最简单直接，一眼就能看出是哪个版本：

```http
/api/v1/users
/api/v2/users
```

### 6.2 请求头版本

更 RESTful，资源地址不变，通过请求头区分：

```http
GET /api/users
Accept: application/vnd.myapp.v1+json
```

这个方式更"标准"，但实际用起来不如 URL 版本方便，调试、网关路由都要麻烦一点。

### 6.3 查询参数版本

不推荐，但也有人这么用：

```http
/api/users?version=1
```

::: danger 踩坑提醒
做 API 版本升级的时候，老版本别着急删。一般至少要维护两个版本，给前端留出迁移时间。废弃的接口在响应头里加 `Deprecation` 和 `Sunset` 字段告诉调用方。
:::

## 7. 认证与授权

### 7.1 JWT 认证

现在最常用的方式：

```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

JWT 的好处是服务端不用存 session，天然适合分布式系统，但记得把过期时间设短一点。

### 7.2 API Key

服务与服务之间调用，或者给第三方开放接口的时候用：

```http
GET /api/users
X-API-Key: abc123def456ghi789
```

API Key 要记得到网关那里做限流和配额管理。

### 7.3 权限设计

简单的权限可以用字符串表示：

```json
{
  "admin": ["users:read", "users:write", "users:delete"],
  "user": ["users:read", "profile:write"]
}
```

复杂点的可以用 RBAC 模型，不过那个就超出 API 设计的范畴了。

## 8. 最佳实践

### 8.1 命名要一致

整个 API 系统要用统一的风格，别一个接口叫 `per_page`，另一个接口叫 `pageSize`，前端会骂人的。

```http
# ✅ 推荐：所有列表接口都用同样的参数名
GET    /api/users?page=1&per_page=20
GET    /api/orders?page=1&per_page=20
GET    /api/products?page=1&per_page=20

# ✅ CRUD 统一格式
GET    /api/users              # 列表
GET    /api/users/:id          # 单个
POST   /api/users              # 创建
PUT    /api/users/:id          # 全量更新
PATCH  /api/users/:id          # 部分更新
DELETE /api/users/:id          # 删除

# ✅ 特殊操作用子资源
POST /api/users/:id/activate   # 激活用户
POST /api/users/:id/deactivate # 禁用用户
```

### 8.2 HATEOAS（超媒体驱动）

高级玩法，返回结果里带上相关资源的链接，客户端就能"探索"整个 API：

```json
{
  "id": 123,
  "name": "张三",
  "_links": {
    "self": "/api/users/123",
    "orders": "/api/users/123/orders",
    "avatar": "/api/users/123/avatar"
  }
}
```

这个在实际项目中用得不多，但知道有这么个东西挺好。

### 8.3 限流信息

做了限流的话，把限流信息放在响应头里返回，客户端可以做相应处理：

```http
X-RateLimit-Limit: 1000      # 每小时限制 1000 次
X-RateLimit-Remaining: 965   # 还剩 965 次
X-RateLimit-Reset: 3600      # 3600 秒后重置
```

## 9. 完整示例

来一个完整的用户 API 设计，大家可以参考这个格式：

```http
# 获取用户列表
GET /api/v1/users?page=1&per_page=20&status=active
Authorization: Bearer your_token_here

# 响应
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    { "id": 1, "name": "张三", "email": "zhangsan@example.com" },
    { "id": 2, "name": "李四", "email": "lisi@example.com" }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "total_pages": 8
  }
}

# 创建用户
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer your_token_here

{
  "name": "王五",
  "email": "wangwu@example.com",
  "password": "secret123"
}

# 响应
HTTP/1.1 201 Created
Location: /api/v1/users/123

{
  "success": true,
  "data": {
    "id": 123,
    "name": "王五",
    "email": "wangwu@example.com"
  }
}

# 删除用户
DELETE /api/v1/users/123
Authorization: Bearer your_token_here

# 响应
HTTP/1.1 204 No Content
```

## 10. API 文档

写好文档太重要了，推荐用 OpenAPI (Swagger) 规范，机器能读人也能读：

```yaml
openapi: 3.0.0
info:
  title: 用户管理 API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
```

Swagger UI 可以把这份 YAML 变成可视化的文档，还能在线调试，前后端联调效率提升一大截。

---

API 设计是个"技术+品味"的活儿，没有绝对的标准答案。

REST 也只是一种风格，不是宗教。不用死抠 REST 纯粹性，比如登录接口就别纠结是 POST /api/sessions 还是 POST /api/login，好用、清晰、一致，比什么都重要。

记住三个原则：
1. **站在调用者的角度想问题**，怎么方便前端怎么来
2. **保持一致性**，全项目统一风格，别一个接口一个样
3. **为未来考虑**，留好版本扩展的余地

希望大家都能设计出优雅好用的 API，少跟联调的同事吵架~
