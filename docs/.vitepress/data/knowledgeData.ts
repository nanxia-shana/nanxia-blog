// 知识文章类型
export interface ArticleItem {
  title: string;
  description: string;
  category: string;
  link: string;
}

// 前端文章数据
export const frontendArticles: ArticleItem[] = [
  {
    title: "TypeScript 入门及实践",
    description: "全面讲解 TypeScript 基础语法、泛型、装饰器等高级特性，以及在 Vue 和 React 项目中的实践应用。",
    category: "基础",
    link: "/nanxia-blog/knowledge/frontend/base/TypeScript",
  },
  {
    title: "前端 debugger 技巧",
    description: "深入讲解浏览器开发者工具的使用，包括 Elements、Console、Sources、Network 等面板的调试技巧。",
    category: "调试",
    link: "/nanxia-blog/knowledge/frontend/base/debugger",
  },
  {
    title: "设计模式详解",
    description: "常用前端设计模式的实战应用，包括单例模式、工厂模式、观察者模式等。",
    category: "架构",
    link: "/nanxia-blog/knowledge/frontend/base/designPattern",
  },
  {
    title: "前端编码规范",
    description: "团队协作必备的代码规范，包括命名约定、代码风格、注释规范等。",
    category: "工程",
    link: "/nanxia-blog/knowledge/frontend/engi/rule",
  },
  {
    title: "HTML 语义化",
    description: "深入理解 HTML5 语义化标签，提升页面可访问性和 SEO 表现。",
    category: "基础",
    link: "/nanxia-blog/knowledge/frontend/base/HTML-semantic",
  },
  {
    title: "前端面试题汇总",
    description: "精选高频前端面试题目，涵盖 JS、CSS、框架、算法等各个方面。",
    category: "面试",
    link: "/nanxia-blog/knowledge/frontend/base/frontend-interview-questions",
  },
  {
    title: "JS API 详解",
    description: "深入解析 JavaScript 内置 API，包括数组、字符串、Promise 等常用方法。",
    category: "基础",
    link: "/nanxia-blog/knowledge/frontend/base/JS-API",
  },
  {
    title: "四种Web实时通信方案解析",
    description: "短轮询、长轮询、SSE、WebSocket 原理解析、优缺点对比与选型指南。",
    category: "基础",
    link: "/nanxia-blog/knowledge/frontend/base/web-realtime-communication",
  },
];

// 后端文章数据
export const backendArticles: ArticleItem[] = [
  {
    title: "Node.js 性能优化",
    description: "深入讲解 Node.js 性能调优，包括内存管理、事件循环、集群部署等。",
    category: "性能",
    link: "/nanxia-blog/knowledge/backend/nodejs/performance",
  },
  {
    title: "数据库设计原则",
    description: "关系型数据库设计规范，范式理论、索引优化、查询性能调优。",
    category: "数据库",
    link: "/nanxia-blog/knowledge/backend/database/database",
  },
  {
    title: "RESTful API 设计",
    description: "RESTful 架构风格最佳实践，包括资源命名、状态码、版本控制等。",
    category: "架构",
    link: "/nanxia-blog/knowledge/backend/architecture/restful",
  },
  {
    title: "微服务架构入门",
    description: "微服务架构设计理念，服务拆分、注册发现、网关路由等核心概念。",
    category: "架构",
    link: "/nanxia-blog/knowledge/backend/architecture/microservice",
  },
  {
    title: "Next.js 全栈 + 数据库部署指南",
    description: "纯前端视角的 Next.js 全栈入门，从写接口到数据库部署完整流程。",
    category: "后端基础",
    link: "/nanxia-blog/knowledge/backend/base/nextjs-fullstack-deploy",
  },
];

// 其他技术文章数据
export const miscArticles: ArticleItem[] = [
  {
    title: "Docker 容器化部署",
    description: "Docker 基础命令、镜像构建、容器编排、Docker Compose 实战指南。",
    category: "DevOps",
    link: "/nanxia-blog/knowledge/misc/docker",
  },
  {
    title: "Git 版本控制进阶",
    description: "Git 高级技巧，包括分支策略、变基操作、冲突解决、提交规范等。",
    category: "工具",
    link: "/nanxia-blog/knowledge/misc/git",
  },
  {
    title: "Linux 命令行技巧",
    description: "常用 Linux 命令汇总，shell 脚本编写，系统管理实用技巧。",
    category: "系统",
    link: "/nanxia-blog/knowledge/misc/linux",
  },
  {
    title: "CI/CD 持续集成",
    description: "GitHub Actions、Jenkins 等 CI/CD 工具的配置和实战应用。",
    category: "DevOps",
    link: "/nanxia-blog/knowledge/misc/cicd",
  },
];
