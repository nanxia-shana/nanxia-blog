---
layout: doc

lastUpdated: false
title: Docker 容器化部署
description: 从零到一掌握 Docker 核心概念、镜像构建优化、容器编排与生产环境部署最佳实践 
category: 
date: 2026-04-28
---

# Docker 容器化部署

Docker 是目前最流行的容器化技术，能够将应用及其依赖打包成一个可移植的容器，实现"构建一次，到处运行"。本文将全面介绍 Docker 的核心概念和实践技巧。

## 1. Docker 基础

### 1.1 核心概念

```
镜像（Image）：只读模板，包含应用和运行环境
容器（Container）：镜像的运行实例，独立的进程
仓库（Registry）：存储镜像的仓库（Docker Hub、私有仓库）
```

### 1.2 基本命令

```bash
# 查看版本
docker --version

# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:alpine

# 查看本地镜像
docker images

# 运行容器
docker run -d -p 80:80 --name web nginx:alpine

# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop web

# 启动容器
docker start web

# 删除容器
docker rm -f web

# 删除镜像
docker rmi nginx:alpine
```

## 2. Dockerfile 编写

### 2.1 基础结构

```dockerfile
# 1. 基础镜像
FROM node:18-alpine AS base

# 2. 设置工作目录
WORKDIR /app

# 3. 复制依赖文件（利用缓存）
COPY package*.json ./

# 4. 安装依赖
RUN npm ci --only=production

# 5. 复制源码
COPY . .

# 6. 暴露端口
EXPOSE 3000

# 7. 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

# 8. 启动命令
CMD ["node", "server.js"]
```

### 2.2 多阶段构建

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # 编译 TypeScript、打包前端等

# 运行阶段（只包含运行时依赖）
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 只复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 2.3 优化技巧

```dockerfile
# 使用 Alpine 减小镜像体积
FROM node:18-alpine

# 合并 RUN 命令减少层数
RUN apt-get update && apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# 使用非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 利用 .dockerignore 排除不必要文件
# node_modules, .git, npm-debug.log 等
```

## 3. 容器操作

### 3.1 进入容器

```bash
# 交互式进入运行中的容器
docker exec -it web sh

# 执行单次命令
docker exec web ls -la

# 查看容器日志
docker logs web
docker logs -f web  # 实时跟随
docker logs --tail 100 web  # 最后100行
```

### 3.2 容器资源限制

```bash
# 限制内存和 CPU
docker run -d \
  --name web \
  --memory="512m" \
  --memory-swap="1g" \
  --cpus="0.5" \
  -p 80:80 \
  nginx:alpine

# 查看资源使用
docker stats
```

### 3.3 数据持久化

```bash
# 方式1：Bind Mount（绑定主机目录）
docker run -d \
  -v /host/path:/container/path \
  nginx

# 方式2：Volume（Docker 管理的卷）
docker volume create mydata
docker run -d -v mydata:/data nginx

# 方式3：匿名卷（临时数据）
docker run -d -v /data nginx

# 查看卷
docker volume ls

# 数据备份
docker run --rm -v mydata:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .
```

## 4. 网络配置

### 4.1 网络类型

```bash
# 查看网络
docker network ls

# 创建自定义网络
docker network create mynetwork

# 连接容器到网络
docker run -d --name web --network mynetwork nginx
docker run -d --name db --network mynetwork mysql

# 同一网络内可通过容器名通信
docker exec -it web ping db
```

### 4.2 端口映射

```bash
# 映射主机端口到容器端口
docker run -d -p 8080:80 nginx
          # 主机端口:容器端口

# 指定绑定地址
docker run -d -p 127.0.0.1:8080:80 nginx

# 随机端口
docker run -d -P nginx
```

## 5. Docker Compose

### 5.1 基础配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Web 应用
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=secret
    depends_on:
      - db
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  # 数据库
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=appdb
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

### 5.2 Compose 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs
docker-compose logs -f web

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器、卷
docker-compose down -v

# 重新构建镜像
docker-compose build

# 扩展服务实例
docker-compose up -d --scale web=3
```

## 6. 实战：Node.js 应用部署

### 6.1 项目结构

```
myapp/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
├── src/
│   └── server.js
└── .env
```

### 6.2 Dockerfile

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# 构建阶段
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM base AS production

# 安全：使用非 root 用户
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# 只安装生产依赖
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 设置权限
RUN chown -R nodeuser:nodegroup /app

# 切换用户
USER nodeuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1))"

CMD ["node", "dist/server.js"]
```

### 6.3 .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
dist
.dockerignore
Dockerfile
docker-compose.yml
```

## 7. 镜像仓库

### 7.1 Docker Hub

```bash
# 登录
docker login

# 打标签
docker tag myapp username/myapp:v1.0.0

# 推送
docker push username/myapp:v1.0.0

# 拉取
docker pull username/myapp:v1.0.0
```

### 7.2 私有仓库（Harbor）

```bash
# 登录私有仓库
docker login harbor.example.com

# 打标签
docker tag myapp harbor.example.com/myproject/myapp:v1.0.0

# 推送
docker push harbor.example.com/myproject/myapp:v1.0.0
```

## 8. 多环境部署

### 8.1 环境变量配置

```yaml
# docker-compose.override.yml（开发环境）
version: '3.8'
services:
  web:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    environment:
      - NODE_ENV=development
```

```yaml
# docker-compose.prod.yml（生产环境）
version: '3.8'
services:
  web:
    image: myapp:${VERSION}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

```bash
# 启动开发环境
docker-compose up

# 启动生产环境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 9. 安全最佳实践

### 9.1 容器安全

```dockerfile
# 1. 使用官方镜像
FROM node:18-alpine  # ✅
# FROM randomuser/node  # ❌ 不安全

# 2. 指定具体版本标签
FROM node:18.17.0-alpine3.18  # ✅
# FROM node:latest  # ❌ 不固定版本

# 3. 使用非 root 用户
RUN adduser -D appuser
USER appuser  # ✅

# 4. 不要在镜像中存储敏感信息
# ENV API_KEY=secret  # ❌ 不要这样
# 使用运行时环境变量注入
```

### 9.2 镜像扫描

```bash
# 使用 trivy 扫描漏洞
trivy image myapp:latest

# 检查 Dockerfile 最佳实践
docker run --rm -i hadolint/hadolint < Dockerfile
```

## 10. 故障排查

### 10.1 常用诊断命令

```bash
# 查看容器详细信息
docker inspect web

# 查看容器进程
docker top web

# 查看资源使用
docker stats

# 复制文件到/从容器
docker cp web:/app/logs/app.log ./app.log
docker cp ./localfile web:/app/

# 查看网络信息
docker network inspect mynetwork

# 实时事件
docker events
```

### 10.2 清理资源

```bash
# 清理停止的容器
docker container prune

# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune

# 清理所有未使用资源
docker system prune -a --volumes
```