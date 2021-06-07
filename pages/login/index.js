/*
 * @Author: WangLi
 * @Date: 2021-06-03 15:41:43
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-03 16:11:21
 */
Page({
  data: {},
  onLoad(options) {},
  async loginHandle() {
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
      },
    });
  },
  getPhoneNumber(e) {
    console.log(e);
  },
});
