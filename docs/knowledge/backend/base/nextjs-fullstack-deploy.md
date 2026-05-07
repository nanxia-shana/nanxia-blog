---
layout: doc

lastUpdated: false
title: Next.js 全栈 + 数据库部署指南
description: 纯前端视角的 Next.js 全栈入门，从写接口到数据库部署完整流程
category: 后端基础
date: 2026-04-30
cover: 
---

# Next.js 全栈 + 数据库部署指南

## 1. 先搞懂：Next.js 的后端部分到底是什么？

举个最简单的例子：

```typescript
// app/api/hello/route.ts
export function GET() {
  return Response.json({ message: '这是我写的接口！' })
}
```

然后前端调用：

```typescript
useEffect(() => {
  fetch('/api/hello')
    .then(res => res.json())
    .then(data => console.log(data))
}, [])
```

就是这么简单！你写的这个 `route.ts`，就是后端代码。部署的时候 Vercel 会自动把它变成真实的服务器接口，你不需要管任何运维的事情。

## 2. 数据库到底是个啥？和前端有啥关系？

继续用前端能理解的类比：

| 存储方式 | 生命周期 | 可见范围 |
|---------|---------|---------|
| `useState` | 页面刷新就没了 | 只有当前用户 |
| `localStorage` | 存在用户浏览器里 | 只有当前用户 |
| **数据库** | 永久存在，删库才会跑路 | 所有用户都能看到 |

就像你写的留言板：
- 如果存在 `useState` 里 → 刷新就没了
- 如果存在 `localStorage` 里 → 只有你自己能看到
- 如果存在数据库里 → 所有人都能看到别人的留言

这就是后端的意义。

## 3. 数据库怎么选？新手别纠结

现在市面上有很多 Serverless 数据库方案，对前端开发者特别友好，不需要你运维服务器。

### 今天我们重点讲：Vercel Postgres

选它的理由很简单：
- 和 Vercel 部署无缝衔接，点几下就好
- 免费额度够个人项目用
- 最少的心智负担，先跑起来再说

::: info 其他方案也可以了解
- **Supabase**：免费额度大，功能最全，不仅有数据库还有认证、存储等
- **PlanetScale**：MySQL 兼容，大厂出品，稳定性好
- **Neon**：Serverless Postgres，技术比较新，有分支功能

新手建议从 Vercel Postgres 开始，先把流程跑通，后面再换其他的也不迟。
:::

## 4. 手把手：从零开始搭建全栈项目

### 4.1 第一步：在 Vercel 创建数据库

1. 打开 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击你的项目 → 选择「Storage」标签
3. 点击「Create Database」
4. 选择「PostgreSQL」
5. 选择离你近的地区（建议选香港 `hkg1`）
6. 点击「Create」，几秒钟就建好了

就这么简单，你的第一个生产数据库已经有了。

### 4.2 第二步：配置环境变量

创建好之后，你会看到一个 `.env.local` 标签页，里面有 4 个环境变量：

```
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

把这些全部复制下来，粘贴到你项目根目录的 `.env` 文件里。

::: danger 重要提醒
**绝对不要把 `.env` 文件提交到 Git！** 里面包含你的数据库密码，泄露了会很危险。

确保你的 `.gitignore` 文件里包含 `.env*`。
:::

### 4.3 第三步：安装数据库驱动

```bash
npm install @vercel/postgres
```

### 4.4 第四步：写第一个接口，真的连上数据库

在你的项目里新建 `app/api/test/route.ts`：

```typescript
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    // 执行一个最简单的 SQL 查询，看看能不能连上
    const result = await sql`SELECT version()`
    return Response.json({ 
      success: true,
      message: '数据库连接成功！',
      data: result.rows[0]
    })
  } catch (error) {
    return Response.json({ 
      success: false,
      message: '数据库连接失败',
      error: String(error)
    }, { status: 500 })
  }
}
```

### 4.5 第五步：前端调用这个接口

在首页或者随便哪个页面里调用一下看看：

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        console.log('接口返回：', data)
        setData(data)
      })
  }, [])

  return (
    <div>
      <h1>测试数据库连接</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

然后 `npm run dev` 打开浏览器，能看到版本信息就算成功了！

## 5. 踩坑预警：新手最容易踩的 5 个坑

::: danger 坑 1：DATABASE_URL 写错了
很多新手会习惯性地写 `localhost:5432`，那是你本地数据库的地址。

生产环境一定要用 Vercel 给你的完整连接字符串，不要自己改任何一个字符。
:::

::: danger 坑 2：忘记加 SSL
生产环境必须走 SSL 加密连接，不然 Vercel 会直接拒绝连接。

`@vercel/postgres` 这个包已经帮你处理好了，你不用管。如果你用其他 ORM，记得加 `sslmode=require`。
:::

::: warning 坑 3：连接数超限
免费版数据库对连接数有限制，别每个请求都新建一个连接。

后面学 Prisma 的时候会讲到连接池的配置，刚开始用 `@vercel/postgres` 的话，它已经帮你处理好了。
:::

::: warning 坑 4：Edge Runtime 不兼容
如果你用边缘函数（Edge Runtime），有些 Node.js 的 API 用不了。

刚开始建议先在 Node.js 环境下写，后面熟悉了再去尝试边缘函数。
:::

::: danger 坑 5：环境变量没同步到 Vercel
你本地的 `.env` 文件不会自动同步到 Vercel！

部署之前一定要去 Vercel 控制台的「Settings」→「Environment Variables」里，把那 4 个数据库环境变量粘贴进去。
:::

## 6. 部署到 Vercel：就点一下

部署真的简单到离谱：

1. 把你的代码推到 GitHub
2. 回到 Vercel 控制台，导入项目
3. 确认 Environment Variables 已经填好了
4. 点击「Deploy」
5. 喝杯咖啡，等 2 分钟就好了

### 验证部署是否成功

部署完成后，打开你的域名加 `/api/test`：

```
https://你的域名.vercel.app/api/test
```

能看到数据库版本信息，说明成功了
