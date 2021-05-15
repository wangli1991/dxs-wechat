/*
 * @Author: WangLi
 * @Date: 2021-04-06 20:53:18
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-15 20:57:56
 */
// 获取应用实例
import { getUserInfo } from "../../http/api";
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    selected: {
      type: Number,
    },
  },
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
    tabBarEle: null,
    dataStr: "",
  },
  lifetimes: {
    attached() {
      if (typeof this.getTabBar === "function" && this.getTabBar()) {
        this.setData({
          tabBarEle: this.getTabBar(),
        });
        this.getTabBar().setData({
          selected: 0,
        });
      }
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true,
        });
      }
      const storageUser = wx.getStorageSync("user");
      const { tabBarEle } = this.data;
      if (tabBarEle && storageUser) {
        tabBarEle.getCartCount();
      }
    },
  },
  observers: {
    selected: function (value) {
      console.log("tabbar==" + value);
    },
  },
  methods: {
    async getUserProfile(e) {
      const res = await getUserInfo();
      console.log(res);
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
    getUserInfo(e) {
      // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
      // wx.getUserProfile({
      //   desc: "展示用户信息",
      //   success: (res) => {
      //     console.log(res);
      //   },
      // });
    },
  },
});
