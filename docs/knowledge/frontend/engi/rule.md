---
layout: doc

lastUpdated: false
title: 前端项目规范化指南
description: 从目录结构到代码提交，打造可维护的大型前端项目
category: 前端基础
date: 2025-07-11
---

# 前端项目规范化

## 1. 为什么需要规范化

多人协作开发时，如果没有统一规范，项目规模越大，维护成本就越高：

- git 提交历史根本没法看，想追溯一个 bug 的引入难如登天
- 代码风格五花八门，读别人的代码像在做翻译
- 新人入职没有统一指引，全靠自己摸索
- 每次合并代码全是冲突，改冲突的时间比写代码还长

规范就是团队的"交通规则"，每个人都遵守，大家才能跑得又快又稳。

通常我们说的项目规范，主要包括这几块：
- 项目结构规范
- 分支管理规范
- 编辑器格式化规范
- 代码风格规范
- 代码提交规范

下面我们一项项来说。

## 2. 项目结构规范

一个清晰的目录结构，能让接手的人第一眼就知道什么文件该放哪。下面是一个通用的单仓单包项目结构：

```
.
├── README.md           # 项目介绍，怎么启动、怎么部署、注意事项都写在这
├── package.json        # 项目命令和依赖管理
├── pnpm-lock.yaml      # 依赖版本锁定（npm 就是 package-lock.json）
├── .gitignore          # git 提交时忽略的文件
├── .editorconfig       # 编辑器风格统一配置
├── .eslintrc.js        # ESLint 配置
├── .prettierrc.js      # Prettier 格式化配置
├── commitlint.config.js # 提交信息校验配置
├── .cz-config.js       # Commitizen 可视化提交配置
├── public/             # 静态资源
│   ├── index.html      # SPA 入口页
│   └── static/         # 其他静态资源
└── src/                # 源码目录
    ├── main.js         # 项目入口文件
    ├── vite.config.js  # 打包工具配置
    ├── components/     # 项目级公共组件
    ├── utils/          # 公共工具函数
    ├── router/         # 路由管理
    ├── store/          # 状态管理（Pinia/Vuex/Redux）
    └── pages/          # 业务页面
        └── home/       # 示例页面
            ├── index.vue
            └── components/  # 这个页面才用到的组件
```

::: tip 个人建议
我特别推荐页面级组件单独放在 pages/xxx/components 下，而不是全部堆到根 components 里。全局复用的组件放外面，某个页面单独用的就放页面目录内，组件多了之后找起来特别方便。
:::

## 3. 分支管理规范

一个完整的迭代周期包含：评审 → 开发 → 测试 → 预发 → 上线，对应的分支也应该按这个流程划分：

| 分支名 | 作用 |
|--------|------|
| dev | 开发分支，作为开发环境的部署分支。多人开发时可以拆成 dev-xxx（按功能或按人拆分），开发完提 MR 合并回 dev |
| test | 测试分支，一个迭代开发完成提测前，将 dev 合并到 test，部署测试环境 |
| stage | 预发分支，测试通过后合并到这里，给产品做验收 |
| master/main | 主分支，验收通过后合并到这里，部署生产环境。上线后打 tag 作为版本记录 |

这是一套比较通用的分支管理方案，中小团队照着用不会出大问题，实际项目中可以根据团队规模灵活增减。

::: danger 踩坑提醒
千万不要图省事直接往 master 上推代码！我之前就见过有人改了一行代码直接 push master，结果正好赶上 CI 自动部署，线上直接崩了。生产环境的代码一定要走合并流程，多一层 code review 总没错。
:::

## 4. 编辑器格式化规范

这是最基础也是最重要的一步——如果每个人编辑器配置不一样，你保存一下格式化，我保存一下又格式化回去，git diff 会全是格式改动，根本看不出真正改了什么。

### 4.1 统一编辑器配置

如果团队大部分人都用 VS Code，那就好办了，直接在项目根目录建个 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true, // 保存自动格式化，这个一定要开
  "editor.tabSize": 2,
  "editor.insertSpaces": false,
  "editor.detectIndentation": false,
  "search.exclude": {
    "**/dist": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

这个配置的优先级高于用户本地的 VS Code 设置，确保团队成员打开项目时用的是同一套规则。

### 4.2 跨编辑器统一用 EditorConfig

团队里有人用 VS Code，有人用 WebStorm，还有人用 sublime？没关系，EditorConfig 来搞定。

EditorConfig 几乎所有主流编辑器都支持（WebStorm 内置，VS Code 需要装插件），在项目根目录建 `.editorconfig`：

```ini
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

::: tip 关于换行符
end_of_line 一定要统一成 lf。Windows 默认是 crlf，Mac 和 Linux 是 lf，不统一的话每次 checkout 文件都会被 git 改换行符，巨烦。
:::

## 5. 代码风格规范

每个人写代码都有自己的习惯，有人喜欢分号有人不喜欢，有人爱单引号有人爱双引号。这些东西没有对错，但团队里必须统一。

业界主流方案是：**ESLint + Prettier** 双剑合璧。

- Prettier 只管格式化，管你代码长啥样
- ESLint 管代码质量，检查有没有语法问题、潜在 bug

### 5.1 ESLint 接入

**第一步：安装依赖**

```bash
npm i eslint -D
```

**第二步：初始化配置**

```bash
npx eslint --init
```

或者直接在根目录建 `.eslintrc.js`：

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended", // Vue 项目用这个
    "prettier", // 解决 ESLint 和 Prettier 的冲突
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // 这里可以自定义规则覆盖默认配置
    "no-unused-vars": "warn",  // 未使用变量警告
    "no-console": "off",       // 允许 console
  },
  globals: {
    // 定义一些全局变量，避免未定义报错
    uni: true,
    wx: true,
  },
};
```

### 5.2 Prettier 接入

**第一步：安装依赖**

```bash
npm i prettier -D
```

**第二步：创建配置文件 `.prettierrc.js`**

```js
module.exports = {
  printWidth: 100,     // 一行多少字符换行
  tabWidth: 2,         // 缩进几个空格
  useTabs: false,      // 用空格不用 tab
  semi: true,          // 行尾加分号
  singleQuote: true,   // 用单引号
  bracketSpacing: true, // 对象大括号前后加空格 { foo: bar }
  arrowParens: "avoid", // 箭头函数单个参数不加括号 x => x
  trailingComma: "none", // 末尾不加逗号
  bracketSameLine: true, // 组件闭合标签和最后一个属性同行
};
```

### 5.3 解决 ESLint 和 Prettier 的冲突

这俩有时候规则会打架，需要装个适配器：

```bash
npm install eslint-config-prettier eslint-plugin-prettier -D
```

然后在 ESLint 配置里加上：

```js
{
  extends: [
    // ...其他配置
    "plugin:prettier/recommended"
  ]
}
```

### 5.4 样式文件也不能放过

CSS/SCSS 可以用 Stylelint 来规范：

```bash
npm install --save-dev stylelint stylelint-config-standard stylelint-scss
```

根目录创建 `.stylelintrc`：

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss"
  ],
  "plugins": ["stylelint-scss"],
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "color-hex-length": "short"
  }
}
```

## 6. 代码提交规范

就算你把所有配置都写好了，总有人不装插件，或者临时把 lint 关了提交代码。这时候就需要在 git 提交环节加一道关卡——没人能绕过 git hooks。

我们用这套组合：**Husky + Lint-staged + Commitlint + Commitizen**

### 6.1 Husky 管理 git 钩子

Husky 能让你很方便地使用 git 的各种钩子。

**安装初始化：**

```bash
npm i husky -D
npx husky install  # 会创建 .husky/ 文件夹
```

**添加 pre-commit 钩子（提交前跑 lint）：**

在 `.husky/pre-commit` 里写：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**添加 commit-msg 钩子（校验提交信息格式）：**

在 `.husky/commit-msg` 里写：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

### 6.2 Lint-staged 只检查改动的文件

每次提交全量跑 lint 太慢了，lint-staged 只检查 staging 区的文件：

在 package.json 里加：

```json
{
  "lint-staged": {
    "*.{js,vue,ts,tsx}": ["npm run lint"]
  }
}
```

### 6.3 Commitlint 校验提交信息

统一 git commit 的格式，确保提交信息有意义。

根目录创建 `commitlint.config.js`：

```js
module.exports = {
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",      // 新功能
        "fix",       // 修复 bug
        "conflict",  // 解决冲突
        "document",  // 文档/注释
        "style",     // 样式修改，不影响逻辑
        "config",    // 配置文件变更
        "refactor",  // 代码重构
        "revert",    // 回退版本
        "build",     // 打包相关
      ],
    ],
    "subject-case": [0], // 描述内容不校验大小写
  },
};
```

### 6.4 Commitizen 可视化提交

让大家不用记那么多 type，选选就能提交规范的 commit message。

**安装：**

```bash
npm i commitizen -g
npm i cz-customizable -D
```

**根目录创建 `.cz-config.js`：**

```js
module.exports = {
  types: [
    { value: "feat", name: "feat: 新功能" },
    { value: "fix", name: "fix: 修复 bug" },
    { value: "style", name: "style: 样式修改" },
    { value: "document", name: "document: 文档/注释" },
    { value: "refactor", name: "refactor: 代码重构" },
    { value: "conflict", name: "conflict: 解决冲突" },
    { value: "config", name: "config: 配置文件变更" },
    { value: "build", name: "build: 打包相关" },
    { value: "revert", name: "revert: 回退版本" },
  ],
  messages: {
    type: "请选择提交类型:",
    subject: "请简要描述提交（必填）:",
    confirmCommit: "确认使用以上信息提交？（y/n）",
  },
  skipQuestions: ["body", "footer"],
  subjectLimit: 100,
};
```

配置完成后，用 `git cz` 命令提交代码，效果如下：

<img src="/markdown/frontend/engi/cz.nqCw_TZy.png" alt="加载失败" />

## 最后

规范这东西，说起来重要，做起来次要，忙起来就不要了。很多团队开头信誓旦旦要搞规范，后来执行着执行着就没人管了。

我的建议是：
1. 规范要简单，太复杂的没人愿意遵守
2. 能用工具约束的就不要靠人自觉，人是最不靠谱的
3. 新人入职第一天就把规范讲清楚，别等坏习惯养成了再改
4. 团队 leader 要以身作则，自己先做好榜样

好的规范不是束缚，而是让我们不用在无意义的事情上耗精力，把时间真正花在写代码上。

希望这篇文章能帮大家把团队的规范搭建起来，早日告别"屎山"项目~
