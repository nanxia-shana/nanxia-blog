import { defineConfig } from 'vitepress'
import utils from "./utils";
const { getSideBar } = utils;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/nanxia-blog/",
  title: "南夏的博客",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "./websiteLogo.svg",
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
      { text: "前端", link: "/front", activeMatch: "/front/" },
      { text: "后端", link: "/back", activeMatch: "/back/" },
      { text: "其他", link: "/others", activeMatch: "/others/" },
    ],
    search: {
      provider: "local",
    },
    sidebar: {
      "/front/": getSideBar("front"),
      "/back/": getSideBar("back"),
      "/others/": getSideBar("others"),
    },
    outline: {
      level: "deep",
      label: "大纲",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/nanxia-shana" }],
  },
  locales: {
    root: {
      lang: "zh-CN",
      label: "简体中文",
    },
    en: {
      lang: "en",
      label: "English",
      link: "/en",
      title: "Nanxia's Blog",
      head: [
        [
          "link",
          {
            rel: "icon",
            type: "image/svg+xml",
            href: "../websiteLogo.svg",
          },
        ],
      ],
      description:
        "Nanxia's Blog, focusing on front-end technologies such as Node.js, Vue, React, Vite, and Nginx. Continuously learning new technologies, documenting daily development issues, and making progress together. Life is endless, and so is the struggle...",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "Front-end", link: "/front", activeMatch: "/front/" },
          { text: "Back-end", link: "/back", activeMatch: "/back/" },
          { text: "Others", link: "/others", activeMatch: "/others/" },
        ],

        sidebar: [
          {
            text: "Examples",
            items: [
              { text: "Markdown Examples", link: "/markdown-examples" },
              { text: "Runtime API Examples", link: "/api-examples" },
            ],
          },
        ],
        outline: {
          level: "deep",
          label: "Outline",
        },
        socialLinks: [{ icon: "github", link: "https://github.com/nanxia-shana" }],
      },
    },
  },
});
