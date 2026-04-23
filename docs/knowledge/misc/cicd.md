---
layout: doc

lastUpdated: false

---

# CI/CD 持续集成与部署实践

CI/CD 是现代软件开发流程的核心，能够自动化构建、测试和部署过程，提升开发效率和交付质量。本文将深入讲解 CI/CD 的核心概念和实践方案。

## 1. CI/CD 基础概念

### 1.1 什么是 CI/CD

```
CI (Continuous Integration) 持续集成：
  开发者频繁将代码合并到主干 → 自动构建和测试 → 快速发现问题

CD (Continuous Delivery) 持续交付：
  CI 的延伸 → 自动化发布流程 → 随时可部署到生产环境

CD (Continuous Deployment) 持续部署：
  自动化生产部署 → 每一个变更自动发布 → 无需人工干预
```

### 1.2 典型流水线

<img src="/markdown/misc/CICD.png" alt="加载失败" />

## 2. GitHub Actions 实战

### 2.1 基本结构

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
```

### 2.2 多环境部署

```yaml
name: Deploy Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci && npm test

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # 实际部署脚本

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: |
          echo "Deploying to production..."
```

### 2.3 矩阵测试（多版本）

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 21]
        os: [ubuntu-latest, windows-latest, macos-latest]
      fail-fast: false  # 不因为一个失败就取消其他
    
    name: Test on Node ${{ matrix.node-version }} / ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci && npm test
```

### 2.4 缓存优化

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      
      - name: Cache build artifacts
        uses: actions/cache@v4
        with:
          path: dist
          key: ${{ runner.os }}-dist-${{ github.sha }}
```

### 2.5 示例
这以下是该博客在 Github Action 中配置的deploy.yml文件
```yaml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: nanxia-blog deploy workflow

on:
  # 在针对`Prod`分支的推送上运行。如果你
  # 使用`master`分支作为默认分支，请将其更改为`master`
  push:
    branches: [Prod]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v4 # 如果使用 pnpm，请取消此区域注释
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
## 3. Docker 构建优化

### 3.1 多阶段构建镜像

```yaml
jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            user/app:latest
            user/app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max  # 启用缓存加速
```

### 3.2 Dockerfile 最佳实践

```dockerfile
# 1. 使用官方基础镜像
FROM node:20-alpine AS base

# 2. 设置工作目录
WORKDIR /app

# 3. 先复制依赖文件（利用 Docker 层缓存）
COPY package*.json ./

# 4. 安装依赖
RUN npm ci --only=production

# 5. 再复制源码（源码变化不影响依赖层）
COPY . .

# 6. 多阶段构建：构建阶段
FROM base AS builder
RUN npm ci && npm run build

# 7. 运行阶段
FROM base AS production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 4. 质量门禁集成

### 4.1 代码质量扫描

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # 完整历史用于 SonarQube
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        with:
          args: >
            -Dsonar.projectKey=my-project
            -Dsonar.qualitygate.wait=true
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### 4.2 安全漏洞扫描

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

### 4.3 CodeQL 代码分析

```yaml
name: "CodeQL Analysis"

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 每周日运行

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

## 5. 自动化测试集成

### 5.1 测试报告

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Run tests with coverage
        run: npm test -- --coverage --coverageReporters=lcov
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()  # 即使测试失败也上传
        with:
          name: test-results
          path: test-results/
```

### 5.2 E2E 测试

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start application
        run: docker-compose up -d
      
      - name: Wait for services
        run: |
          until curl -s http://localhost:3000/health; do
            sleep 1
          done
      
      - name: Run Playwright tests
        uses: playwright-github-action@v4
        with:
          command: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 6. Kubernetes 部署

### 6.1 Helm 部署

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Kubeconfig
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
      
      - name: Helm upgrade
        run: |
          helm upgrade --install my-app ./helm/my-app \
            --namespace production \
            --create-namespace \
            --set image.tag=${{ github.sha }} \
            --set replicaCount=3 \
            --wait
```

### 6.2 蓝绿部署

```yaml
jobs:
  blue-green-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Green Environment
        run: |
          helm upgrade my-app-green ./helm \
            --set version=${GITHUB_SHA}
      
      - name: Run smoke tests on Green
        run: ./scripts/smoke-test.sh green
      
      - name: Switch traffic to Green
        run: |
          kubectl patch service my-app -p '
            {"spec":{"selector":{"version":"green"}}}'
      
      - name: Scale down Blue
        run: kubectl scale deployment my-app-blue --replicas=0
```

## 7. 通知与告警

### 7.1 Slack 通知

```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    if: always()
    needs: [build, test, deploy]
    
    steps:
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "CI/CD Pipeline ${{ job.status }}",
              "attachments": [
                {
                  "color": "${{ job.status == 'success' ? 'good' : 'danger' }}",
                  "fields": [
                    { "title": "Repo", "value": "${{ github.repository }}", "short": true },
                    { "title": "Branch", "value": "${{ github.ref_name }}", "short": true },
                    { "title": "Commit", "value": "${{ github.sha }}", "short": true }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 7.2 失败重试

```yaml
jobs:
  flaky-test:
    runs-on: ubuntu-latest
    steps:
      - name: Retry flaky tests
        uses: nick-fields/retry@v2
        with:
          timeout_minutes: 10
          max_attempts: 3
          command: npm run test:e2e
```

## 8. 性能优化策略

### 8.1 并行作业

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
  
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  
  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e

  deploy:
    needs: [lint, unit-test, e2e-test]  # 等待所有并行完成
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### 8.2 条件执行

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            src:
              - 'src/**/*.ts'
              - 'package*.json'
            docs:
              - 'docs/**/*.md'
      
      - name: Build application
        if: steps.changes.outputs.src == 'true'
        run: npm run build
      
      - name: Build docs
        if: steps.changes.outputs.docs == 'true'
        run: npm run build:docs
```

## 9. 企业级最佳实践

### 9.1 流水线设计原则

```
✅ 快速反馈：
  - 关键检查放在前面（lint → 单元测试 → 集成测试）
  - 失败立即终止，不浪费资源

✅ 可重现：
  - 指定所有依赖的确切版本
  - 使用锁定文件（package-lock.json, yarn.lock）
  - 避免 "latest" 标签

✅ 幂等性：
  - 同一提交多次运行结果一致
  - 部署脚本可重复执行

✅ 可调试：
  - 保留构建产物和日志
  - 支持本地复现流水线
```

### 9.2 安全注意事项

```yaml
# 1. 最小权限原则
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:        # 显式声明需要的权限
      contents: read
      packages: write
      id-token: write   # OIDC 需要

# 2. 使用 OIDC 代替长期密钥
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-role
    aws-region: us-east-1

# 3. 不要在日志中打印敏感信息
- name: Deploy
  run: ./deploy.sh
  env:
    API_KEY: ${{ secrets.API_KEY }}  # 通过环境变量传递
```

### 9.3 自托管 Runner

```yaml
jobs:
  heavy-job:
    runs-on: self-hosted    # 使用自托管 runner
    steps:
      - name: Heavy build
        run: ./heavy-build.sh

# 标签分组
jobs:
  gpu-job:
    runs-on: [self-hosted, gpu, linux]
```