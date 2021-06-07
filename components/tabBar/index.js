/*
 * @Author: WangLi
 * @Date: 2021-04-30 05:49:10
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 13:18:06
 */
import { getCartCount } from "../../http/api";
const App = getApp();
Component({
  properties: {
    cartChange: {
      type: Number,
    },
    selected: { type: Number },
  },
  options: {
    styleIsolation: "shared",
  },
  observers: {
    cartChange(value) {
      this.getCartCount();
    },
    count(value) {
      const { list } = this.data;
      list[2].info = value ? value : "";
      this.setData({
        list,
      });
    },
    selected(value) {
      this.setData({
        active: value,
      });
    },
  },
  data: {
    active: 0,
    color: "#7A7E83",
    selectedColor: "#02c521",
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
        info: "",
      },
      {
        pagePath: "/pages/mine/index",
        text: "我的",
        iconPath: "/images/mine.png",
        selectedIconPath: "/images/mine_active.png",
      },
    ],
    count: 0,
  },
  methods: {
    onChange(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ active: index });
      this.triggerEvent("change", index);
      wx.setStorageSync("tabbar", index);
    },
    async getCartCount() {
      const params = {
        userId: wx.getStorageSync("user"),
      };
      const { code, data, msg } = await getCartCount(params);
      if (code === 200) {
        this.setData({
          count: data.count < 100 ? data.count : "99+",
        });
      }
    },
  },
});
