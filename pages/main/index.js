/*
 * @Author: WangLi
 * @Date: 2021-05-13 15:17:55
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-15 17:33:58
 */
// pages/main/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    timestamp: null,
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
  onChange(e) {
    console.log(e.detail);
    this.setData({ selected: e.detail, timestamp: new Date().getTime() });
  },
  init() {
    const page = getCurrentPages().pop();
    this.setData({
      active: this.data.list.findIndex((item) => item.url === `/${page.route}`),
    });
  },
});
