export default {
  getSideBar(path: string | undefined) {
    const wholeList = [
      {
        text: "front", // 显示文本
        // 下钻子项
        items: [
          {
            text: "前端工程化",
            items: [
              {
                text: "前端规范搭建",
                link: "/front/engi/rule",
              },
              {
                text: "前端规范搭建",
                link: "/front/engi/rule",
              },
            ],
          },
        ],
      },
      {
        text: "back",
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
        text: "others",
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

    return [wholeList.filter((list) => list.text === path)[0]];
  },
};
