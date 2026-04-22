---
layout: doc

lastUpdated: false

---

# RESTful API 设计

REST（Representational State Transfer）是一种架构风格，RESTful API 是基于 REST 风格设计的接口。良好的 API 设计能够提升开发效率、降低维护成本、增强系统的可扩展性。

## 1. REST 核心原则

### 1.1 资源（Resources）

**一切皆资源**：API 的核心是资源，每个资源有唯一的标识符（URI）。

```
# 资源示例
/users          # 用户集合资源
/users/123      # 单个用户资源
/users/123/orders  # 用户的订单
```

### 1.2 统一接口（Uniform Interface）

使用标准的 HTTP 方法表示操作：

| 方法 | 作用 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 获取资源 | ✅ | ✅ |
| POST | 创建资源 | ❌ | ❌ |
| PUT | 全量更新资源 | ✅ | ❌ |
| PATCH | 部分更新资源 | ❌ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |

### 1.3 无状态（Stateless）

每个请求都应包含所有必要信息，服务器不保存客户端状态。

```http
# 错误：服务端维护会话状态
GET /api/user/current
Cookie: session=xxx

# 正确：请求包含所有信息
GET /api/users/123
Authorization: Bearer xxx
```

## 2. URL 设计规范

### 2.1 资源命名

- 使用**名词复数**表示集合
- 使用**小写字母**和**连字符（-）**
- 层级关系清晰

```http
# ✅ 正确
GET /api/users                    # 获取用户列表
GET /api/users/123                # 获取单个用户
POST /api/users                   # 创建用户
PUT /api/users/123                # 更新用户
DELETE /api/users/123             # 删除用户

GET /api/users/123/orders         # 获取用户的订单列表
GET /api/orders/456/items         # 获取订单项

# ❌ 错误
GET /api/getUser                  # 包含动词
GET /api/userList                 # 非复数
GET /api/user/123/orderList       # 不一致
POST /api/createUser              # 包含动作
```

### 2.2 资源嵌套

```http
# 一级资源
/api/users
/api/orders
/api/products

# 二级资源（从属关系）
/api/users/123/orders            # 用户 123 的订单
/api/orders/456/payments         # 订单 456 的支付记录

# 避免过深嵌套（超过 3 层）
/api/users/123/orders/456/payments  # 可以，但建议拆分为
/api/orders/456/payments            # 更好
```

## 3. HTTP 状态码

### 3.1 成功响应（2xx）

```http
200 OK                    # GET/PUT/PATCH 成功
201 Created               # POST 成功
202 Accepted              # 异步任务已接受
204 No Content            # DELETE 成功，无响应体

# 示例
HTTP/1.1 201 Created
Location: /api/users/123

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 3.2 客户端错误（4xx）

```http
400 Bad Request           # 请求参数错误
401 Unauthorized          # 未认证
403 Forbidden             # 已认证但无权限
404 Not Found             # 资源不存在
405 Method Not Allowed    # 方法不支持
409 Conflict              # 资源冲突
410 Gone                  # 资源已永久删除
422 Unprocessable Entity  # 验证失败
429 Too Many Requests     # 请求过多
```

### 3.3 服务端错误（5xx）

```http
500 Internal Server Error   # 服务器内部错误
502 Bad Gateway             # 网关错误
503 Service Unavailable     # 服务不可用
504 Gateway Timeout         # 网关超时
```

## 4. 请求/响应设计

### 4.1 统一响应格式

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req-abc123"
  }
}
```

### 4.2 错误响应格式

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

### 4.3 分页设计

```http
# 请求
GET /api/users?page=1&per_page=20&sort=-created_at,name

# 响应
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

```http
# 简单过滤
GET /api/users?status=active&country=CN

# 范围过滤
GET /api/users?age[gte]=18&age[lt]=60
GET /api/orders?created_at[between]=2024-01-01,2024-02-01

# 多值过滤
GET /api/users?status[in]=active,pending
```

### 5.2 排序

```http
# 单字段排序
GET /api/users?sort=created_at        # 升序
GET /api/users?sort=-created_at       # 降序（前缀 -）

# 多字段排序
GET /api/users?sort=-created_at,name  # 先按时间降序，再按名称升序
```

### 5.3 字段选择

```http
# 只返回需要的字段
GET /api/users?fields=id,name,email

# 排除不需要的字段
GET /api/users?exclude=password,token
```

### 5.4 搜索

```http
# 简单搜索
GET /api/users?q=john

# 指定字段搜索
GET /api/users?q=name:john,email:john
```

## 6. 版本控制

### 6.1 URL 版本（推荐）

```http
/api/v1/users
/api/v2/users
```

### 6.2 请求头版本

```http
GET /api/users
Accept: application/vnd.myapp.v1+json
```

### 6.3 查询参数版本

```http
/api/users?version=1
```

## 7. 认证与授权

### 7.1 JWT 认证

```http
# 请求头
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.2 API Key

```http
GET /api/users
X-API-Key: abc123def456
```

### 7.3 权限设计

```json
// 角色权限
{
  "admin": ["users:read", "users:write", "users:delete"],
  "user": ["users:read", "profile:write"]
}
```

## 8. API 最佳实践

### 8.1 使用名词复数

```http
# ✅ 推荐
/api/users
/api/orders
/api/products

# ❌ 避免
/api/user
/api/getOrders
/api/productList
```

### 8.2 一致性

```http
# 所有资源使用相同的命名风格
GET    /api/users              # 列表
GET    /api/users/:id          # 单个
POST   /api/users              # 创建
PUT    /api/users/:id          # 更新
DELETE /api/users/:id          # 删除

# 特殊操作使用子资源
POST /api/users/:id/activate   # 激活用户
POST /api/users/:id/deactivate # 禁用用户
```

### 8.3 HATEOAS（超媒体驱动）

```json
{
  "id": 123,
  "name": "John Doe",
  "_links": {
    "self": "/api/users/123",
    "orders": "/api/users/123/orders",
    "avatar": "/api/users/123/avatar"
  }
}
```

### 8.4 限流

```http
# 响应头包含限流信息
X-RateLimit-Limit: 1000      # 每小时限制
X-RateLimit-Remaining: 965   # 剩余次数
X-RateLimit-Reset: 3600      # 重置时间（秒）
```

## 9. 完整示例

### 9.1 用户 API 设计

```http
# 获取用户列表
GET /api/v1/users?page=1&per_page=20&status=active
Authorization: Bearer token

# 响应
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    { "id": 1, "name": "John", "email": "john@example.com" },
    { "id": 2, "name": "Jane", "email": "jane@example.com" }
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
Authorization: Bearer token

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}

# 响应
HTTP/1.1 201 Created
Location: /api/v1/users/123

{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}

# 更新用户
PUT /api/v1/users/123
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}

# 删除用户
DELETE /api/v1/users/123

# 响应
HTTP/1.1 204 No Content
```

## 10. API 文档

推荐使用 OpenAPI (Swagger) 规范：

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

## 总结

RESTful API 设计的核心原则：

1. **资源为中心**：使用名词表示资源，通过 HTTP 方法表示操作
2. **统一接口**：遵循 HTTP 语义，正确使用状态码
3. **无状态**：请求包含所有信息，不依赖服务器状态
4. **可缓存**：利用 HTTP 缓存机制提升性能
5. **一致性**：命名、格式、结构保持统一
6. **可演化**：版本控制，向前兼容

良好的 API 设计不仅能提升开发效率，还能降低团队协作成本，提升系统的可维护性和扩展性。
