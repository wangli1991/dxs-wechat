/*
 * @Author: WangLi
 * @Date: 2021-05-13 15:17:55
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 13:17:04
 */
const App = getApp();
Page({
  data: {
    selected: 0,
    cartChange: null,
    classify: null,
  },
  onLoad(options) {
    if (JSON.stringify(options) !== "{}") {
      const { page } = App.router.extract(options);
      if (!!page && page.classify) {
        this.setData({
          classify: page.classify,
        });
      }
    }

    const storagePageIndex = wx.getStorageSync("tabbar");
    this.setData({
      selected: Number(storagePageIndex),
      cartChange: new Date().getTime(),
    });
  },
  onShow() {
    this.updateCartHandle();
  },
  updateCartHandle() {
    this.setData({
      cartChange: new Date().getTime(),
    });
  },
  onChange(e) {
    this.setData({ selected: e.detail });
  },
  tabChangeHandle(e) {
    wx.setStorageSync("tabbar", e.detail.pageIndex);
    this.setData({ selected: e.detail.pageIndex });
  },
});
