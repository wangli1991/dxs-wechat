/*
 * @Author: WangLi
 * @Date: 2021-05-23 10:49:08
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-28 06:38:07
 */
import { getHotSearchList } from "../../http/api";
const App = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: String,
    color: {
      type: String,
      value: "#333",
    },
    image: String,
    searchColor: {
      type: String,
      value: "#fff",
    },
  },
  data: {
    list: [],
    currentSwiper: 0,
  },
  lifetimes: {
    attached() {
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop,
        navRight: App.globalData.navRight,
        menuButtonHeight: App.globalData.menuButtonHeight,
      });
      this.getList();
    },
  },
  methods: {
    async getList() {
      const { data, code } = await getHotSearchList();
      this.setData({
        list: data.list,
      });
    },
    changeHandle(e) {
      const { current } = e.detail;
      this.setData({
        currentSwiper: current,
      });
    },
    swiperTap() {
      const { currentSwiper, list } = this.data;
      const { name } = list[currentSwiper];
      App.router.push("search", { search: name });
    },
    navBack: function () {
      wx.navigateBack({
        delta: 1,
      });
    },
  },
});
