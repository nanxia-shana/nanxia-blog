export interface LinkItem {
  name: string;
  url: string;
  description: string;
  type: 'normal' | 'personal' | 'hot'; // 普通、自用、好用热门
}

export interface LinkCategory {
  title: string;
  icon: string;
  links: LinkItem[];
}

export const linksData: LinkCategory[] = [
  {
    title: '学习资源',
    icon: '📚',
    links: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/zh-CN/', description: 'Web 技术权威文档，前端开发者必备参考', type: 'hot' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: '免费编程学习平台，实战项目驱动学习', type: 'hot' },
      { name: 'CSS Masterclass', url: 'https://cssmasterclass.io/', description: 'CSS 进阶学习课程，深入掌握现代 CSS 技巧', type: 'hot' },
      { name: '菜鸟教程', url: 'https://www.runoob.com/', description: '中文编程入门教程，涵盖前后端各种技术', type: 'normal' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com/', description: 'CSS 技巧分享网站，大量实用代码示例', type: 'hot' },
      { name: 'JavaScript.info', url: 'https://javascript.info/', description: '现代 JavaScript 教程，从入门到进阶', type: 'normal' },
      { name: 'Codecademy', url: 'https://www.codecademy.com/', description: '交互式在线编程学习平台', type: 'normal' },
    ]
  },
  {
    title: '官方文档',
    icon: '📘',
    links: [
      { name: 'MDN（前端标准）', url: 'https://developer.mozilla.org/zh-CN/docs/Web', description: 'Web 标准官方文档，HTML/CSS/JS 权威参考', type: 'hot' },
      { name: 'Vue.js 官方', url: 'https://vuejs.org/', description: '渐进式 JavaScript 框架官方文档', type: 'hot' },
      { name: 'React 官方', url: 'https://react.dev/', description: '用户界面构建库官方文档', type: 'normal' },
      { name: 'Next.js（React 框架）', url: 'https://nextjs.org/', description: 'React 全栈开发框架，支持 SSR/SSG', type: 'hot' },
      { name: 'Nuxt.js（Vue 框架）', url: 'https://nuxt.com/', description: 'Vue 全栈开发框架，直观、强大、高性能', type: 'hot' },
      { name: 'Angular 官方', url: 'https://angular.io/', description: 'Google 开发的前端框架官方文档', type: 'normal' },
      { name: 'Sass 中文文档', url: 'https://www.sass.hk/docs/', description: 'CSS 预处理器 Sass 中文学习文档', type: 'normal' },
      { name: 'Webpack 官方', url: 'https://webpack.js.org/', description: '模块打包工具官方文档', type: 'personal' },
      { name: 'Vite 官方文档', url: 'https://cn.vitejs.dev/', description: '下一代前端构建工具，极速冷启动', type: 'hot' },
      { name: 'Pinia（Vue 状态管理）', url: 'https://pinia.vuejs.org/', description: 'Vue 3 官方推荐状态管理库', type: 'hot' },
      { name: 'UniApp（跨端框架）', url: 'https://uniapp.dcloud.net.cn/', description: '一套代码编译到多端的跨端开发框架', type: 'hot' },
      { name: '微信小程序文档', url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', description: '微信小程序官方开发指南', type: 'normal' },
      { name: 'UniJS', url: 'https://unijs.org/', description: '跨端 JavaScript 框架', type: 'normal' },
      { name: 'Lit（Web Components）', url: 'https://lit.dev/', description: '轻量级 Web Components 开发库', type: 'normal' },
      { name: 'Three.js（3D 图形）', url: 'https://threejs.org/', description: 'WebGL 3D 图形渲染库官方文档', type: 'hot' },
      { name: 'D3.js（数据可视化）', url: 'https://d3js.org/', description: '数据驱动的文档可视化库', type: 'normal' },
      { name: 'DataV（数据大屏）', url: 'http://datav.jiaminghi.com/', description: '数据可视化大屏组件库', type: 'normal' },
    ]
  },
  {
    title: 'UI 组件库',
    icon: '🧩',
    links: [
      { name: 'Element Plus（Vue 3）', url: 'https://element-plus.org/', description: 'Vue 3 企业级 UI 组件库', type: 'hot' },
      { name: 'Ant Design（React）', url: 'https://ant.design/', description: 'React 企业级设计语言与组件库', type: 'hot' },
      { name: 'Vuetify（Material Vue）', url: 'https://vuetifyjs.com/', description: 'Material Design 风格的 Vue UI 框架', type: 'normal' },
      { name: 'MUI (Material UI for React)', url: 'https://mui.com/', description: 'React Material Design 组件库', type: 'normal' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', description: '原子化 CSS 框架，快速构建现代界面', type: 'hot' },
      { name: 'UnoCSS（原子化 CSS）', url: 'https://www.unocss.cn/', description: '高性能原子化 CSS 引擎，按需生成', type: 'hot' },
      { name: 'Bulma（CSS 框架）', url: 'https://bulma.io/', description: '基于 Flexbox 的现代 CSS 框架', type: 'normal' },
      { name: 'Bootstrap 模板', url: 'https://bootstrapmade.com/', description: 'Bootstrap 响应式网站模板集合', type: 'normal' },
      { name: 'Swiper（轮播组件）', url: 'https://swiperjs.com/', description: '功能强大的移动端/PC 端轮播滑动组件', type: 'hot' },
      { name: 'Quill（富文本编辑器）', url: 'https://quilljs.com/', description: 'API 驱动的现代富文本编辑器', type: 'normal' },
    ]
  },
  {
    title: '动画特效',
    icon: '✨',
    links: [
      { name: 'Animate.css', url: 'https://animate.style/', description: '开箱即用的 CSS 动画库，40+ 种预设动画', type: 'hot' },
      { name: 'Animista（CSS 动画生成）', url: 'https://animista.net/', description: '在线可视化 CSS 动画代码生成工具', type: 'hot' },
      { name: 'Hammer.js（手势库）', url: 'https://hammerjs.github.io/', description: '轻量级手势识别库，支持触屏交互', type: 'normal' },
    ]
  },
  {
    title: '工具函数库',
    icon: '🛠️',
    links: [
      { name: 'Lodash', url: 'https://lodash.com/', description: 'JavaScript 工具函数库，提供一致性、模块化、高性能', type: 'hot' },
      { name: 'Axios（HTTP 客户端）', url: 'https://axios-http.com/', description: '基于 Promise 的 HTTP 网络请求客户端', type: 'hot' },
      { name: 'Moment.js（时间处理）', url: 'https://momentjs.com/', description: 'JavaScript 日期时间处理解析格式化库', type: 'normal' },
      { name: 'Mock.js（数据模拟）', url: 'http://mockjs.com/', description: '前端数据模拟工具，拦截 Ajax 请求', type: 'normal' },
    ]
  },
  {
    title: '在线工具',
    icon: '🔧',
    links: [
      { name: 'CodePen', url: 'https://codepen.io/', description: '前端代码在线编辑分享社区', type: 'hot' },
      { name: 'JSFiddle', url: 'https://jsfiddle.net/', description: '前端代码在线调试工具', type: 'normal' },
      { name: 'CodeSandbox', url: 'https://codesandbox.io/', description: '在线 IDE，支持 React/Vue 等框架', type: 'hot' },
      { name: 'JSON 格式化', url: 'https://jsonformatter.curiousconcept.com/', description: 'JSON 格式化、校验、可视化工具', type: 'personal' },
      { name: 'TinyPNG（图片压缩）', url: 'https://tinypng.com/', description: '智能 PNG/JPEG/WebP 图片压缩工具，无损画质', type: 'hot' },
      { name: 'CSS/JS 压缩', url: 'https://www.toptal.com/developers/cssminifier/', description: 'CSS/JS 代码压缩混淆工具', type: 'normal' },
      { name: 'Can I Use（兼容性查询）', url: 'https://caniuse.com/', description: '浏览器特性兼容性查询数据库', type: 'hot' },
    ]
  },
  {
    title: '设计与灵感',
    icon: '🎨',
    links: [
      { name: 'Figma', url: 'https://www.figma.com/', description: '基于云的界面设计协作工具', type: 'hot' },
      { name: 'Dribbble（设计作品）', url: 'https://dribbble.com/', description: '设计师作品分享社区，寻找设计灵感', type: 'normal' },
      { name: 'Behance', url: 'https://www.behance.net/', description: '创意设计作品集展示平台', type: 'normal' },
      { name: 'Undraw（插图素材）', url: 'https://undraw.co/illustrations', description: '免费开源 SVG 插画素材库', type: 'normal' },
      { name: 'Google Fonts', url: 'https://fonts.google.com/', description: 'Google 开源字体库，免费商用', type: 'normal' },
      { name: '阿里巴巴图标库', url: 'https://www.iconfont.cn/', description: '国内最大的矢量图标资源库', type: 'hot' },
    ]
  },
];
