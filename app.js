/*
 * @Author: WangLi
 * @Date: 2021-04-06 20:53:18
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-03 17:11:36
 */
// app.js
const router = require("./router/index");
import { wxLogin, getCartCount } from "./http/api";
App({
  onLaunch() {
    //自定义navbar全局高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        let statusBarHeight = res.statusBarHeight,
          menuButtonHeight = menuButtonObject.height,
          navRight =
            menuButtonObject.width + res.windowWidth - menuButtonObject.right,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight =
            statusBarHeight +
            menuButtonHeight +
            (menuButtonObject.top - statusBarHeight) * 2, //导航高度
          tabBarHeight = res.screenHeight - res.windowHeight;
        this.globalData.statusBarHeight = statusBarHeight;
        this.globalData.menuButtonHeight = menuButtonHeight;
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.navRight = navRight;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.tabBarHeight = tabBarHeight;
      },
      fail(err) {
        console.log(err);
      },
    });
    this.getLocation();
    // 登录
    wx.login({
      success: (res) => {
        console.log("app login");
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getWxInfo(res.code);
      },
    });
  },
  globalData: {
    userInfo: null,
    userId: null,
  },
  router,
  authSetting: function () {
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting["scope.userLocation"]) {
          wx.authorize({
            scope: "scope.getLocation",
            success() {
              $this.getUserInfo();
            },
          });
        }
      },
    });
  },
  getWxInfo: async function (value) {
    const { code, data } = await wxLogin({ code: value });
    if (code === 200) {
      try {
        this.globalData.userId = data.openid;
        console.log(data.openid);
        wx.setStorageSync("token", data.token);
        wx.setStorageSync("user", data.openid);
        this.getCartCount();
      } catch (error) {
        console.log(error);
      }
    }
  },
  getLocation: function (e) {
    const $this = this;
    wx.getLocation({
      type: "gcj02",
      success(res) {
        console.log(res);
        $this.globalData.latitude = res.latitude;
        $this.globalData.longitude = res.longitude;
        $this.getUserInfo();
      },
      fail() {
        wx.getSetting({
          success(res) {
            console.log(res);
            if (!res.authSetting["scope.userLocation"]) {
              wx.authorize({
                scope: "scope.userLocation",
                success() {
                  wx.chooseLocation({
                    success: function (res) {
                      console.log(res);
                    },
                  });
                },
                fail(error) {
                  console.log(error);
                },
              });
            }
          },
        });
      },
    });
  },
  getUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
      },
    });
  },
  getCartCount: async function () {
    const params = {
      userId: wx.getStorageSync("user"),
    };
    const { code, data, msg } = await getCartCount(params);
  },
});
