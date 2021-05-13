/*
 * @Author: WangLi
 * @Date: 2021-04-06 20:53:18
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-13 13:45:29
 */
// 获取应用实例
const App = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
    tabBarEle: null,
    orderTypeList: [
      { type: 0, name: "待付款" },
      { type: 1, name: "待配送" },
      { type: 2, name: "待提货" },
      { type: 3, name: "已完成" },
    ],
  },
  onLoad() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.setData({
        tabBarEle: this.getTabBar(),
      });
      this.getTabBar().setData({
        selected: 3,
      });
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  onShow() {
    const storageUser = wx.getStorageSync("user");
    const { tabBarEle } = this.data;
    if (tabBarEle && storageUser) {
      tabBarEle.getCartCount();
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        console.log(Base64_Decode(res.encryptedData));
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },
  goOrder(e) {
    const type = e.currentTarget.dataset.type;
    App.router.push("order", { orderType: type });
  },
});
