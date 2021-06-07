/*
 * @Author: WangLi
 * @Date: 2021-05-09 06:16:04
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-18 16:19:59
 */
const App = getApp();
Component({
  properties: {
    linkPage: {
      type: [String, Number],
      value: 0,
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
        App.router.pushTab("main", { pageIndex: linkPage });
      }
      if (linkType === "switchTab") {
        this.triggerEvent("change", { pageIndex: linkPage });
      }
    },
  },
});
