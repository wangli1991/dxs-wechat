/*
 * @Author: WangLi
 * @Date: 2021-05-23 10:49:08
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-26 16:29:41
 */
const App = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    search: String,
  },
  lifetimes: {
    attached() {
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop,
        navRight: App.globalData.navRight,
        menuButtonHeight: App.globalData.menuButtonHeight,
      });
    },
  },
  methods: {
    searchTap() {
      this.triggerEvent("clear");
    },
    navBack: function () {
      wx.navigateBack({
        delta: 1,
      });
    },
  },
});
