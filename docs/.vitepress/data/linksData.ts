export interface LinkItem {
  name: string;
  url: string;
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
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/zh-CN/', type: 'hot' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', type: 'hot' },
      { name: '菜鸟教程', url: 'https://www.runoob.com/', type: 'normal' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com/', type: 'hot' },
      { name: 'JavaScript.info', url: 'https://javascript.info/', type: 'normal' },
      { name: 'Codecademy', url: 'https://www.codecademy.com/', type: 'normal' },
    ]
  },
  {
    title: '官方文档',
    icon: '📘',
    links: [
      { name: 'MDN（前端标准）', url: 'https://developer.mozilla.org/zh-CN/docs/Web', type: 'hot' },
      { name: 'Vue.js 官方', url: 'https://vuejs.org/', type: 'hot' },
      { name: 'React 官方', url: 'https://react.dev/', type: 'normal' },
      { name: 'Angular 官方', url: 'https://angular.io/', type: 'normal' },
      { name: 'Sass 中文文档', url: 'https://www.sass.hk/docs/', type: 'normal' },
      { name: 'Webpack 官方', url: 'https://webpack.js.org/', type: 'personal' },
    ]
  },
  {
    title: 'UI 组件库',
    icon: '🧩',
    links: [
      { name: 'Element Plus（Vue 3）', url: 'https://element-plus.org/', type: 'hot' },
      { name: 'Ant Design（React）', url: 'https://ant.design/', type: 'hot' },
      { name: 'Vuetify（Material Vue）', url: 'https://vuetifyjs.com/', type: 'normal' },
      { name: 'MUI (Material UI for React)', url: 'https://mui.com/', type: 'normal' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', type: 'hot' },
      { name: 'Bootstrap 模板', url: 'https://bootstrapmade.com/', type: 'normal' },
    ]
  },
  {
    title: '在线工具',
    icon: '🔧',
    links: [
      { name: 'CodePen', url: 'https://codepen.io/', type: 'hot' },
      { name: 'JSFiddle', url: 'https://jsfiddle.net/', type: 'normal' },
      { name: 'CodeSandbox', url: 'https://codesandbox.io/', type: 'hot' },
      { name: 'JSON 格式化', url: 'https://jsonformatter.curiousconcept.com/', type: 'personal' },
      { name: 'CSS/JS 压缩', url: 'https://www.toptal.com/developers/cssminifier/', type: 'normal' },
      { name: 'Can I Use（兼容性查询）', url: 'https://caniuse.com/', type: 'hot' },
    ]
  },
  {
    title: '设计与灵感',
    icon: '🎨',
    links: [
      { name: 'Figma', url: 'https://www.figma.com/', type: 'hot' },
      { name: 'Dribbble（设计作品）', url: 'https://dribbble.com/', type: 'normal' },
      { name: 'Behance', url: 'https://www.behance.net/', type: 'normal' },
      { name: 'Undraw（插图素材）', url: 'https://undraw.co/illustrations', type: 'normal' },
      { name: 'Google Fonts', url: 'https://fonts.google.com/', type: 'normal' },
      { name: '阿里巴巴图标库', url: 'https://www.iconfont.cn/', type: 'hot' },
    ]
  },
];
