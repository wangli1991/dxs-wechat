/*
 * @Author: WangLi
 * @Date: 2021-05-13 15:17:55
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-13 20:04:23
 */
// pages/main/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    tabBarList: [
      {
        pagePath: "/pages/home/index",
        text: "首页",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/home_active.png",
      },
      {
        pagePath: "/pages/classify/index",
        text: "分类",
        iconPath: "/images/classify.png",
        selectedIconPath: "/images/classify_active.png",
      },
      {
        pagePath: "/pages/cart/index",
        text: "购物车",
        iconPath: "/images/cart.png",
        selectedIconPath: "/images/cart_active.png",
      },
      {
        pagePath: "/pages/mine/index",
        text: "我的",
        iconPath: "/images/mine.png",
        selectedIconPath: "/images/mine_active.png",
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  onChange(event) {
    this.setData({ active: event.detail });
  },
  init() {
    const page = getCurrentPages().pop();
    this.setData({
      active: this.data.list.findIndex((item) => item.url === `/${page.route}`),
    });
  },
});
