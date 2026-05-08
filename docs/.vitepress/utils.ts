const menuList = [
  {
    text: "知识库",
    link: "/knowledge/",
    items: [
      {
        text: "💻 前端",
        link: "/knowledge/frontend/",
        items: [
          {
            text: "前端基础",
            collapsed: true,
            items: [
              {
                text: "HTML 标签：从基础到语义化布局",
                link: "/knowledge/frontend/base/HTML-semantic",
              },
              {
                text: "JavaScript - API 特性与实用技巧",
                link: "/knowledge/frontend/base/JS-API",
              },
              {
                text: "四种Web实时通信方案解析",
                link: "/knowledge/frontend/base/web-realtime-communication",
              },
              {
                text: "前端常用设计模式",
                link: "/knowledge/frontend/base/designPattern",
              },
              {
                text: "前端 debugger 技巧",
                link: "/knowledge/frontend/base/debugger",
              },
              {
                text: "TypeScript入门及实践",
                link: "/knowledge/frontend/base/TypeScript",
              },
              {
                text: "前端面试题解析",
                link: "/knowledge/frontend/base/frontend-interview-questions",
              },
              {
                text: "首屏白屏优化",
                link: "/knowledge/frontend/base/first-screen-optimization",
              },
            ],
          },
          {
            text: "前端工程化",
            collapsed: true,
            items: [
              {
                text: "前端项目规范化",
                link: "/knowledge/frontend/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "🌐 后端",
        link: "/knowledge/backend/",
        items: [
          {
            text: "后端基础",
            collapsed: true,
            items: [
              {
                text: "Next.js 全栈 + 数据库部署指南",
                link: "/knowledge/backend/base/nextjs-fullstack-deploy",
              },
            ],
          },
          {
            text: "Node.js",
            collapsed: true,
            items: [
              {
                text: "Node.js 性能优化",
                link: "/knowledge/backend/nodejs/performance",
              },
            ],
          },
          {
            text: "数据库",
            collapsed: true,
            items: [
              {
                text: "数据库设计原则",
                link: "/knowledge/backend/database/database",
              },
            ],
          },
          {
            text: "架构与系统设计",
            collapsed: true,
            items: [
              {
                text: "RESTful API 设计",
                link: "/knowledge/backend/architecture/restful",
              },
              {
                text: "微服务架构入门",
                link: "/knowledge/backend/architecture/microservice",
              },
            ],
          },
        ],
      },
      {
        text: "🧩 更多",
        link: "/knowledge/misc/",
        items: [
          {
            text: "Docker 容器化部署",
            link: "/knowledge/misc/docker",
          },
          {
            text: "Git 版本控制进阶",
            link: "/knowledge/misc/git",
          },
          {
            text: "Linux 命令行技巧",
            link: "/knowledge/misc/linux",
          },
          {
            text: "CI/CD 持续集成",
            link: "/knowledge/misc/cicd",
          },
        ],
      },
    ],
  },
  {
    text: "精神食粮",
    link: "/spiritual-food/",
    items: [
      {
        text: "📚 书山拾叶",
        link: "/spiritual-food/book/",
      },
      {
        text: "🎧 听海观澜",
        link: "/spiritual-food/music/",
      },
      {
        text: "🎥 浮光掠影",
        link: "/spiritual-food/movie/",
      },
      {
        text: "🌌 绘梦织霞",
        link: "/spiritual-food/anime/",
      },
      {
        text: "✒️ 墨池云篆",
        link: "/spiritual-food/novel/",
      },
      {
        text: "🎮 游心太玄",
        link: "/spiritual-food/game/",
      },
      {
        text: "🍵 闲窗絮语",
        link: "/spiritual-food/note/",
        collapsed: false,
        items: [
          {
            text: "追逐",
            collapsed: false,
            link: "/spiritual-food/note/zhuizhu",
          },
        ],
      },
    ],
  },
];

const menuList_en = [
  {
    text: "Knowledge",
    link: "/en/knowledge/",
    items: [
      {
        text: "Front-end",
        link: "/en/knowledge/frontend/",
        items: [
          {
            text: "Front-end Basics",
            collapsed: false,
            items: [
              {
                text: "Common Front-end Design Patterns",
                link: "/en/knowledge/frontend/base/designPattern",
              },
            ],
          },
          {
            text: "Front-end Engineering",
            collapsed: false,
            items: [
              {
                text: "Project Standardization",
                link: "/en/knowledge/frontend/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "Back-end",
        link: "/en/knowledge/backend/",
      },
      {
        text: "Miscellaneous",
        link: "/en/knowledge/misc/",
      },
    ],
  },
  {
    text: "Spiritual-food",
    link: "/en/spiritual-food/",
    items: [
      {
        text: "Book",
        link: "/en/spiritual-food/book/",
      },
      {
        text: "Music",
        link: "/en/spiritual-food/music/",
      },
      {
        text: "Movie",
        link: "/en/spiritual-food/movie/",
      },
      {
        text: "Anime",
        link: "/en/spiritual-food/anime/",
      },
      {
        text: "Novel",
        link: "/en/spiritual-food/novel/",
      },
      {
        text: "Game",
        link: "/en/spiritual-food/game/",
      },
      {
        text: "Note",
        link: "/en/spiritual-food/note/",
      },
    ],
  },
];

export default {
  getSideBar(path: string | undefined, lang: string = "zh-CN") {
    if (!path) {
      return menuList;
    }

    if (lang === "en") {
      return [menuList_en.filter((list) => list.text === path)[0]];
    }
    return [menuList.filter((list) => list.text === path)[0]];
  },

};
