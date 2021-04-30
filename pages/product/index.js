/*
 * @Author: WangLi
 * @Date: 2021-04-14 09:59:56
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 14:16:00
 */
// pages/product/index.js
import { getProductById } from "../../http/api";
const App = getApp();
Page({
  data: {
    currrentTab: 0,
    tabList: ["商品", "推荐", "详情"],
    carouselCount: 0,
    currentCarousel: 1,
    carouselList: [{ id: 0 }, { id: 1 }],
    navbarOpacity: 0,
    showExplain: true,
    product: {},
    recomandList: [{ id: 0 }, { id: 1 }, { id: 2 }],
    showTips: false,
    scrollTop: 0,
    showBackTop: false,
  },
  onLoad: function (options) {
    const { navHeight, navTop, menuButtonHeight } = App.globalData;
    this.setData({
      navHeight,
      navTop,
      menuButtonHeight,
    });
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("key", (data) => {
      this.getProduct({ productId: data.id });
    });
  },
  back: function () {
    App.router.back(1);
  },
  getProduct: async function (params) {
    const { data, code, msg } = await getProductById(params);
    this.setData({
      product: data,
    });
  },
  tabTap: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currrentTab: index,
    });
  },
  scrollHandle: function (e) {
    const { scrollTop } = e.detail;
    const { navHeight, windowHeight } = App.globalData;
    const opacity = Math.floor((100 * scrollTop) / navHeight) / 100;
    this.setData({
      navbarOpacity: opacity,
    });
    if (scrollTop < windowHeight) {
      this.setData({
        showBackTop: false,
      });
    } else {
      this.setData({
        showBackTop: true,
      });
    }
  },
  scrollToToupper: function () {
    this.setData({
      navbarOpacity: 0,
      showBackTop: false,
    });
  },
  scrollToLower: function () {
    this.setData({
      navbarOpacity: 1,
    });
  },
  scrollBackTop: function () {
    this.setData({
      scrollTop: 0,
    });
  },
  carouselChange: function (e) {
    const { current } = e.detail;
    this.setData({
      currentCarousel: current + 1,
    });
  },
  showExplain: function () {
    this.setData({
      showExplain: !this.data.showExplain,
    });
  },
  showTipsHandle: function () {
    this.setData({
      showTips: true,
    });
  },
  closePopupHandle: function (e) {
    this.setData({
      showTips: false,
    });
  },
});
