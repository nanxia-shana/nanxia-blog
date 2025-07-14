export default {
  getSideBar(path: string | undefined, lang: string = "zh-CN") {
    const wholeList = [
      {
        text: "前端", // 显示文本
        // 下钻子项
        items: [
          {
            text: "前端基础",
            items: [
              {
                text: "前端常用设计模式",
                link: "/front/base/designPattern",
              },
            ],
          },
          {
            text: "前端工程化",
            items: [
              {
                text: "前端项目规范化",
                link: "/front/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "后端",
        items: [
          {
            text: "Framework",
            items: [
              {
                text: "Nest.js",
                link: "/back/nest/",
              },
            ],
          },
        ],
      },
      {
        text: "其它",
        items: [
          {
            text: "常用操作指令",
            items: [
              {
                text: "MarkDown",
                link: "/others/operation/",
              },
            ],
          },
        ],
      },
    ];

    const wholeList_en = [
      {
        text: "Front-end", // 显示文本
        // 下钻子项
        items: [
          {
            text: "Front-end Basics",
            items: [
              {
                text: "Common Front-end Design Patterns",
                link: "/en/front/base/designPattern",
              },
            ],
          },
          {
            text: "Front-end Engineering",
            items: [
              {
                text: "Common Frontend Design Patterns",
                link: "/en/front/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "Back-end",
        items: [
          {
            text: "Framework",
            items: [
              {
                text: "Nest.js",
                link: "/en/back/nest/",
              },
            ],
          },
        ],
      },
      {
        text: "Others",
        items: [
          {
            text: "常用操作指令",
            items: [
              {
                text: "MarkDown",
                link: "/en/others/operation/",
              },
            ],
          },
        ],
      },
    ];

    if (!path) {
      return wholeList;
    }

    if (lang === "en") {
      return [wholeList_en.filter((list) => list.text === path)[0]];
    }
    return [wholeList.filter((list) => list.text === path)[0]];
  },
};
