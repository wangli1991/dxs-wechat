/*
 * @Author: WangLi
 * @Date: 2021-04-30 05:49:10
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-30 11:09:50
 */
import { getCartCount } from "../http/api";
const App = getApp();

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#07c160",
    list: [
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
    cartCount: 0,
  },
  lifetimes: {
    created: function () {
      // this.getCartCount();
    },
  },
  methods: {
    switchTab: function (e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({
        selected: data.index,
      });
    },
    getCartCount: async function () {
      console.log(App.globalData.userId, wx.getStorageSync("user"));
      const params = {
        userId: wx.getStorageSync("user"),
      };
      const { code, data, msg } = await getCartCount(params);
      if (code === 200) {
        this.setData({
          cartCount: data.count,
        });
      }
    },
  },
});
