const menuList = [
  {
    text: "知识库",
    link: "/knowledge/",
    items: [
      {
        text: "前端",
        link: "/knowledge/front/",
        items: [
          {
            text: "前端基础",
            collapsed: false,
            items: [
              {
                text: "前端常用设计模式",
                link: "/knowledge/front/base/designPattern",
              },
            ],
          },
          {
            text: "前端工程化",
            collapsed: false,
            items: [
              {
                text: "前端项目规范化",
                link: "/knowledge/front/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "后端",
        link: "/knowledge/back/",
      },
      {
        text: "其它",
        link: "/knowledge/others/",
      },
    ],
  },
  {
    text: "精神食粮",
    link: "/spiritual-food/",
    items: [
      {
        text: "书山拾叶",
        link: "/spiritual-food/books/",
      },
      {
        text: "听海观澜",
        link: "/spiritual-food/music/",
      },
      {
        text: "浮光掠影",
        link: "/spiritual-food/movies/",
      },
      {
        text: "绘梦织霞",
        link: "/spiritual-food/anime/",
      },
      {
        text: "墨池云篆",
        link: "/spiritual-food/novels/",
      },
      {
        text: "游心太玄",
        link: "/spiritual-food/games/",
      },
      {
        text: "闲窗絮语",
        link: "/spiritual-food/others/",
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
        link: "/en/knowledge/front/",
        items: [
          {
            text: "Front-end Basics",
            collapsed: false,
            items: [
              {
                text: "Common Front-end Design Patterns",
                link: "/en/knowledge/front/base/designPattern",
              },
            ],
          },
          {
            text: "Front-end Engineering",
            collapsed: false,
            items: [
              {
                text: "Project Standardization",
                link: "/en/knowledge/front/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "Back-end",
        link: "/en/knowledge/back/",
      },
      {
        text: "Others",
        link: "/en/knowledge/others/",
      },
    ],
  },
  {
    text: "Spiritual-food",
    link: "/en/spiritual-food/",
    items: [
      {
        text: "Books",
        link: "/en/spiritual-food/books/",
      },
      {
        text: "Music",
        link: "/en/spiritual-food/music/",
      },
      {
        text: "Movies",
        link: "/en/spiritual-food/movies/",
      },
      {
        text: "Anime",
        link: "/en/spiritual-food/anime/",
      },
      {
        text: "Novels",
        link: "/en/spiritual-food/novels/",
      },
      {
        text: "Games",
        link: "/en/spiritual-food/games/",
      },
      {
        text: "Others",
        link: "/en/spiritual-food/others/",
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
