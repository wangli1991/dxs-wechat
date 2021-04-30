/*
 * @Author: WangLi
 * @Date: 2021-04-07 20:35:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 15:51:20
 */
// components/navbar/index.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true,
    },
    showHome: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop,
        titleHeight: App.globalData.navHeight - App.globalData.navTop,
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      wx.navigateBack({
        delta: 1,
      });
    },
    //回主页
    toIndex: function () {
      wx.navigateTo({
        url: "/pages/admin/home/index/index",
      });
    },
  },
});
