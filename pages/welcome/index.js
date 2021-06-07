/*
 * @Author: WangLi
 * @Date: 2021-06-07 09:48:22
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 14:03:48
 */
const App = getApp();
import { wxLogin } from "../../http/api";

Page({
  data: {},
  onLoad(options) {
    this.login();
  },
  login() {
    wx.login({
      success: (res) => {
        console.log("app login");
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.wxLogin(res.code);
      },
    });
  },
  async wxLogin(value) {
    const { code, data } = await wxLogin({ code: value });
    if (code === 200) {
      App.globalData.userId = data.openid;
      wx.setStorageSync("token", data.token);
      wx.setStorageSync("user", data.openid);
      App.router.pushTab("main", { pageIndex: 0 });
    }
  },
});
