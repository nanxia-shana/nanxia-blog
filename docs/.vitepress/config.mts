import { defineConfig } from 'vitepress'
import utils from "./utils";
import store from "./store/index";

const { getSideBar } = utils;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    define: {
      __MUSIC_LIST__: store.musicList,
      __PLAYBACK_STATE__: store.playbackState,
    },
  },
  base: "/nanxia-blog/",
  lang: "zh-CN",
  title: "南夏的博客",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/nanxia-blog/websiteLogo.png",
      },
    ],
  ],
  description:
    "南夏的博客，专注于Node.js、Vue、React、Vite、Nginx等前端技术。不断学习新技术，记录日常开发问题，共同进步。生命不息，奋斗不止...",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/websiteLogo.svg",
    nav: [
      { text: "主页", link: "/" },
      {
        text: "知识库",
        activeMatch: "/knowledge/",
        items: [
          { text: "🌐 前端", link: "/knowledge/front/" },
          { text: "🖥️ 后端", link: "/knowledge/back/" },
          { text: "🧩 其它", link: "/knowledge/others/" },
        ],
      },
      {
        text: "精神食粮",
        activeMatch: "/spiritual-food/",
        items: [
          { text: "📚 书山拾叶", link: "/spiritual-food/books/" }, // 书籍小说
          { text: "🎧 听海观澜", link: "/spiritual-food/music/" }, // 音乐音频
          { text: "🎥 浮光掠影", link: "/spiritual-food/movies/" }, // 影视作品
          { text: "🌌 绘梦织霞", link: "/spiritual-food/anime/" }, // 番剧动画
          { text: "🎮 游心太玄", link: "/spiritual-food/games/" }, // 游戏娱乐
          { text: "✒️ 墨池云篆", link: "/spiritual-food/novels/" }, // 网络文学
          { text: "🍵 闲窗絮语", link: "/spiritual-food/others/" }, // 其他杂项
        ],
      },
    ],
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                displayDetails: "显示详细列表",
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/nanxia-shana" }],
    sidebar: {
      "/knowledge/": getSideBar("知识库"),
      "/spiritual-food/": getSideBar("精神食粮"),
    },
    outline: {
      level: "deep",
      label: "大纲",
    },
  },
  // locales: {
  //   root: {
  //     lang: "zh-CN",
  //     label: "简体中文",
  //   },
  //   en: {
  //     lang: "en",
  //     label: "English",
  //     link: "/en",
  //     title: "Nanxia's Blog",
  //     head: [
  //       [
  //         "link",
  //         {
  //           rel: "icon",
  //           type: "image/svg+xml",
  //           href: "../websiteLogo.svg",
  //         },
  //       ],
  //     ],
  //     description:
  //       "Nanxia's Blog, focusing on front-end technologies such as Node.js, Vue, React, Vite, and Nginx. Continuously learning new technologies, documenting daily development issues, and making progress together. Life is endless, and so is the struggle...",
  //     themeConfig: {
  //       nav: [
  //         { text: "Home", link: "/en" },
  //         {
  //           text: "Knowledge",
  //           activeMatch: "/knowledge/",
  //           items: [
  //             { text: "🌐 Front-end", link: "/knowledge/front/" },
  //             { text: "🖥️ Back-end", link: "/knowledge/back/" },
  //             { text: "🧩 Others", link: "/knowledge/others/" },
  //           ],
  //         },
  //         {
  //           text: "Spiritual-food",
  //           activeMatch: "/spiritual-food/",
  //           items: [
  //             { text: "📚 Books", link: "/spiritual-food/books/" }, // 书籍小说
  //             { text: "🎧 Music", link: "/spiritual-food/music/" }, // 音乐音频
  //             { text: "🌌 Anime", link: "/spiritual-food/anime/" }, // 影视作品
  //             { text: "🎞 Movies", link: "/spiritual-food/movies/" }, // 番剧动画
  //             { text: "🖋 Novels", link: "/spiritual-food/novels/" }, // 网络文学
  //             { text: "🎮 Games", link: "/spiritual-food/games/" }, // 游戏娱乐
  //             { text: "🍵 Others", link: "/spiritual-food/others/" }, // 其他杂项
  //           ],
  //         },
  //       ],
  //       sidebar: {
  //         "/en/knowledge/": getSideBar("Knowledge", "en"),
  //         "/en/spiritual-food/": getSideBar("Spiritual-food", "en"),
  //       },
  //       outline: {
  //         level: "deep",
  //         label: "Outline",
  //       },
  //     },
  //   },
  // },
});
