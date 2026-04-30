---
layout: doc

lastUpdated: false
title: 数据库设计原则
description: 从范式理论到索引优化，系统讲解关系型数据库的设计规范与性能最佳实践 
category: 数据库
date: 2026-04-22
---

# 数据库设计原则

刚入行的时候，我对数据库设计的理解就是"能用就行"。只要能把数据存进去、取出来，就觉得设计得没问题。

结果后来踩了不少坑：一张表 80 多个字段，查询要 JOIN 七八张表；索引建了一堆，一个都没用上；一个慢查询把整个数据库拖死，线上故障查了半天才发现是有人写了 `SELECT *` 不加 WHERE。

这些坑踩多了，才慢慢明白：数据库设计真的不是随便建几张表就行了。前期设计不好，后面代码写得再优雅也没用。这篇文章就把我这些年踩过的坑和总结的经验整理出来，分享给大家。

## 1. 范式理论

### 1.1 第一范式（1NF）

**原子性原则**：每一列都是不可分割的原子数据项。

```sql
-- 错误示例：一列存储多个值
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  phones VARCHAR(200) -- 存储 "13800138000,13900139000"
);

-- 正确示例：拆分到独立表
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE user_phones (
  user_id INT REFERENCES users(id),
  phone VARCHAR(20),
  is_primary BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, phone)
);
```

### 1.2 第二范式（2NF）

**消除部分依赖**：在满足 1NF 的基础上，非主键列必须完全依赖于整个主键。

```sql
-- 错误示例：部分依赖
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  product_name VARCHAR(100), -- 只依赖 product_id
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- 正确示例：分离产品信息
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE order_items (
  order_id INT,
  product_id INT REFERENCES products(id),
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);
```

### 1.3 第三范式（3NF）

**消除传递依赖**：非主键列必须直接依赖于主键，不能存在传递依赖。

```sql
-- 错误示例：传递依赖
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  department_name VARCHAR(100) -- 依赖 department_id，而非主键
);

-- 正确示例：分离部门信息
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT REFERENCES departments(id)
);
```

### 1.4 反范式设计

::: danger 踩坑提醒
我以前做报表统计的时候，为了算订单总数和金额合计，每次都要 JOIN 好几张表，数据多了查一次要十几秒。后来把常用统计字段冗余到订单主表里，查询速度直接提升了 10 倍。
:::

在某些场景下，适当的冗余可以提升查询性能：

```sql
-- 统计频繁查询时，可以适当冗余
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2),
  item_count INT, -- 冗余：订单项数量，避免每次 COUNT
  created_at TIMESTAMP
);

CREATE TABLE order_items (
  order_id INT REFERENCES orders(id),
  product_id INT,
  price DECIMAL(10, 2),
  quantity INT
);
```

## 2. 数据类型选择

### 2.1 整数类型

| 类型 | 字节 | 最小值（有符号） | 最大值（有符号） | 场景 |
|------|------|------------------|------------------|------|
| TINYINT | 1 | -128 | 127 | 状态、类型枚举 |
| SMALLINT | 2 | -32768 | 32767 | 小数量计数 |
| INT | 4 | -2147483648 | 2147483647 | 主键、外键 |
| BIGINT | 8 | -9223372036854775808 | 9223372036854775807 | 大数量 ID |

### 2.2 字符串类型

```sql
-- 固定长度：适合长度固定的字段
CHAR(36)    -- UUID
CHAR(1)     -- 性别标识

-- 可变长度：适合长度变化的字段
VARCHAR(100)    -- 用户名、邮箱
VARCHAR(1000)   -- 简介、备注
TEXT            -- 长文本
```

### 2.3 时间类型

```sql
-- 日期时间类型
DATE          -- 日期 '2024-01-01'
TIME          -- 时间 '10:30:00'
DATETIME      -- 日期时间 '2024-01-01 10:30:00'
TIMESTAMP     -- 时间戳，时区敏感

-- 建议：统一使用 TIMESTAMP WITH TIME ZONE
CREATE TABLE events (
  id INT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## 3. 索引优化

### 3.1 索引类型

```sql
-- 主键索引（自动创建）
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

-- 唯一索引
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 普通索引
CREATE INDEX idx_users_name ON users(name);

-- 复合索引（注意列的顺序！）
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- 前缀索引（字符串索引优化）
CREATE INDEX idx_users_email_prefix ON users(email(10));

-- 函数索引
CREATE INDEX idx_users_lower_name ON users(LOWER(name));
```

### 3.2 索引设计原则

::: tip 小建议
别上来就给每个列都建索引。索引不是越多越好——每个 INSERT/UPDATE/DELETE 操作都要更新所有相关索引，索引多了写入性能会直线下降。一般单表索引建议控制在 5 个以内。
:::

1. **选择性高的列优先**：区分度高的列放前面
2. **最左前缀原则**：复合索引遵循最左匹配
3. **避免过度索引**：索引会降低写入性能
4. **更新频繁的列少建索引**：每次更新都要更新索引

```sql
-- 好的复合索引：选择性高的列在前
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- 避免：低选择性的单列索引
CREATE INDEX idx_orders_status ON orders(status); -- 可能没用，status 只有几个值
```

### 3.3 避免索引失效

```sql
-- 索引失效场景

-- 1. 对索引列使用函数
WHERE YEAR(created_at) = 2024  -- ❌
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'  -- ✅

-- 2. 隐式类型转换
WHERE id = '123'  -- ❌ id 是 INT 类型
WHERE id = 123    -- ✅

-- 3. 使用 LIKE '%xxx' 前缀模糊
WHERE name LIKE '%john'  -- ❌ 无法使用索引
WHERE name LIKE 'john%'  -- ✅ 可以使用索引

-- 4. 使用 OR 连接非索引列
WHERE status = 'active' OR phone = '13800138000'  -- phone 无索引时失效
```

## 4. 查询性能优化

### 4.1 EXPLAIN 分析

```sql
EXPLAIN ANALYZE
SELECT u.name, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';
```

重点关注：
- **type**：访问类型，ALL（全表扫描）→ index → range → ref → eq_ref → const
- **key**：实际使用的索引
- **rows**：预估扫描行数
- **Extra**：Using index（覆盖索引）、Using where、Using filesort（需要优化）

### 4.2 分页优化

```sql
-- 慢查询：偏移量大时性能差
SELECT * FROM orders ORDER BY id LIMIT 1000000, 20;

-- 优化 1：使用书签式分页
SELECT * FROM orders 
WHERE id > last_seen_id 
ORDER BY id LIMIT 20;

-- 优化 2：延迟关联
SELECT o.* FROM orders o
INNER JOIN (
  SELECT id FROM orders ORDER BY id LIMIT 1000000, 20
) t ON o.id = t.id;
```

### 4.3 避免 SELECT *

```sql
-- 错误：读取不必要的列，浪费 IO 和内存
SELECT * FROM users WHERE id = 1;

-- 正确：只查询需要的列
SELECT id, name, email FROM users WHERE id = 1;
```

## 5. 表设计最佳实践

### 5.1 命名规范

```sql
-- 表名：小写 + 下划线，复数形式
CREATE TABLE user_profiles ( ... );  -- ✅
CREATE TABLE UserProfile ( ... );    -- ❌

-- 字段名：见名知意
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,           -- 外键：表名_id
  total_amount DECIMAL,  -- 描述性名称
  created_at TIMESTAMP,  -- 创建时间
  updated_at TIMESTAMP   -- 更新时间
);
```

### 5.2 通用字段

```sql
-- 建议每张表包含以下字段
CREATE TABLE example (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,  -- 自增主键
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
  created_by INT REFERENCES users(id),               -- 创建人
  updated_by INT REFERENCES users(id),               -- 更新人
  is_deleted BOOLEAN DEFAULT FALSE                   -- 软删除标记
);

-- 更新时间自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_example_updated_at
  BEFORE UPDATE ON example
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 5.3 软删除 vs 硬删除

```sql
-- 软删除：标记删除，保留历史
SELECT * FROM users WHERE is_deleted = FALSE;

-- 硬删除：直接删除，不可恢复
DELETE FROM users WHERE id = 1;

-- 归档策略：定期归档历史数据
CREATE TABLE users_archive (LIKE users INCLUDING ALL);

INSERT INTO users_archive
SELECT * FROM users WHERE is_deleted = TRUE AND updated_at < '2023-01-01';

DELETE FROM users WHERE is_deleted = TRUE AND updated_at < '2023-01-01';
```

## 6. 关系设计

### 6.1 一对一关系

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

-- 用户详情：不常用的大字段拆分出去
CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(255),
  address JSONB
);
```

### 6.2 一对多关系

```sql
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE employees (
  id INT PRIMARY KEY,
  department_id INT REFERENCES departments(id),
  name VARCHAR(100)
);
```

### 6.3 多对多关系

```sql
-- 连接表（Junction Table）
CREATE TABLE student_courses (
  student_id INT REFERENCES students(id),
  course_id INT REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grade CHAR(1),
  PRIMARY KEY (student_id, course_id)
);

CREATE INDEX idx_student_courses_course ON student_courses(course_id);
```

## 7. 事务与并发

### 7.1 事务隔离级别

```sql
-- 读已提交（PostgreSQL 默认）
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 可重复读（MySQL 默认）
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 串行化
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

### 7.2 乐观锁 vs 悲观锁

```sql
-- 乐观锁：使用版本号
UPDATE inventory 
SET quantity = quantity - 1, version = version + 1
WHERE id = $1 AND version = $2;

-- 悲观锁：FOR UPDATE
BEGIN;
SELECT * FROM inventory WHERE id = 1 FOR UPDATE;
-- 执行业务逻辑
UPDATE inventory SET quantity = quantity - 1 WHERE id = 1;
COMMIT;
```

## 总结

感觉数据库设计就像盖房子打地基，地基打得好，上面盖几层都稳；地基没打好，越往上越容易塌。

总结一下核心原则：

1. **范式优先，反范式为辅**：先用范式设计保证数据一致性，必要时考虑反范式优化性能
2. **选择合适的数据类型**：小而美的数据类型是性能的基础，能省空间还能提速
3. **索引设计要有策略**：不是越多越好，理解索引的工作原理才能用好它
4. **查询优化是持续的**：学会使用 EXPLAIN，监控慢查询，别等到线上出问题才临时抱佛脚
5. **考虑扩展性**：预留字段、分库分表策略提前规划，数据量上来了再改就难了

最后想说一句，数据库设计没有"标准答案"，适合业务的就是最好的。别为了追求"规范"而过度设计，也别图省事随便建表。多想想一年后数据量会变成什么样，这个表能不能撑住。
