/*
 * @Author: WangLi
 * @Date: 2021-05-13 10:33:58
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-27 06:07:21
 */
const App = getApp();
Component({
  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        navHeight: App.globalData.navHeight,
      });
    },
  },
});
