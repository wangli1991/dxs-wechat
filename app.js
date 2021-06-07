/*
 * @Author: WangLi
 * @Date: 2021-04-06 20:53:18
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 10:02:30
 */
const router = require("./router/index");
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
        this.globalData.windowWidth = res.windowWidth;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.tabBarHeight = tabBarHeight;
      },
      fail(err) {
        console.log(err);
      },
    });
    this.getLocation();
    const openid = wx.getStorageSync("user");
    if (openid) {
      this.globalData.userId = openid;
      return;
    }
  },
  onShow() {
    console.log("小程序启动了");
  },
  globalData: {
    userInfo: null,
    userId: null,
  },
  router,
  authSetting() {
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
  getLocation(e) {
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
  rpxToPxFormat(value) {
    return (value / 750) * wx.getSystemInfoSync().windowWidth;
  },
});
