/*
 * @Author: WangLi
 * @Date: 2021-05-09 06:16:04
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-09 06:27:50
 */
const App = getApp();
Component({
  properties: {
    linkPage: {
      type: String,
      value: "home",
    },
    linkText: {
      type: String,
      value: "去首页逛逛",
    },
    linkType: {
      type: String,
      value: "pushTab",
    },
    text: {
      type: String,
      value: "暂无数据",
    },
  },
  data: {},
  methods: {
    goLinkPage() {
      const { linkPage, linkType } = this.data;
      if (linkType === "push") {
        App.router.push(linkPage);
      }
      if (linkType === "pushTab") {
        App.router.pushTab(linkPage);
      }
    },
  },
});
