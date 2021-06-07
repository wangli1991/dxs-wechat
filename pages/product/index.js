/*
 * @Author: WangLi
 * @Date: 2021-04-14 09:59:56
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 11:19:12
 */
import {
  getProductById,
  getProductCartCount,
  creatCart,
  getRecommendProducts,
} from "../../http/api";
import config from "../../config/index";
import { Toast } from "../../utils/util";

const App = getApp();

Page({
  data: {
    currrentTab: 0,
    tabList: ["商品", "详情", "推荐"],
    carouselCount: 0,
    currentCarousel: 1,
    carouselList: [{ id: 0 }, { id: 1 }],
    navbarOpacity: 1,
    showExplain: true,
    product: {},
    showTips: false,
    scrollTop: 0,
    showBackTop: false,
    productId: null,
    cartCount: 0,
    cartId: null,
    productTotal: 0,
    productList: [],
    currentPage: 1,
    pageSize: config.recommendPageSize,
    isRefreshing: false,
    loadLoding: false,
    loadMore: true,
    loadMoreText: "加载中",
    intoView: "",
  },
  onLoad(options) {
    const { productId } = App.router.extract(options);
    const { navHeight, navTop, menuButtonHeight } = App.globalData;
    this.setData({
      navHeight,
      navTop,
      menuButtonHeight,
      productId,
    });
    this.getProduct();
    this.getCartCount();
    this.initPage();
  },
  //初始化页面
  initPage() {
    this.setData({
      loadMore: true,
      currentPage: 1,
    });
    this.getProductList();
  },
  back() {
    App.router.back(1);
  },
  async getProduct(params) {
    const { productId } = this.data;
    const { data, code, msg } = await getProductById({ productId });
    this.setData({
      product: data,
    });
  },
  async getCartCount() {
    const { productId } = this.data;
    const params = {
      productId,
      userId: App.globalData.userId,
    };
    const { data, code, msg } = await getProductCartCount(params);
    this.setData({
      cartCount: data.count,
      cartId: data.cart_id,
    });
  },
  async addCartHandle() {
    const { productId, cartCount } = this.data;
    const params = {
      productId,
      addCount: 1,
      userId: App.globalData.userId,
    };
    const { code, data, msg } = await creatCart(params);
    if (code === 200) {
      Toast("加入购物车成功", "success");
    }
    const updateCount = cartCount + 1;
    this.setData({
      cartCount: updateCount,
    });
  },
  placeHandle() {
    const { productId } = this.data;
    App.router.push("place", { ids: productId, type: "product" });
  },
  goMain(e) {
    const index = e.currentTarget.dataset.index;
    App.router.pushTab("main", { pageIndex: index });
  },
  tabTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currrentTab: index,
      intoView: "product" + index,
    });
  },
  scrollHandle(e) {
    wx.createSelectorQuery()
      .select("#product1")
      .boundingClientRect((res) => {
        if (res.top <= 0) {
          this.setData({
            currrentTab: 1,
          });
        } else {
          this.setData({
            currrentTab: 0,
          });
        }
      })
      .exec();
    wx.createSelectorQuery()
      .select("#product2")
      .boundingClientRect((res) => {
        if (res.top <= 0) {
          this.setData({
            currrentTab: 2,
          });
        }
      })
      .exec();
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
  scrollToToupper() {
    this.setData({
      navbarOpacity: 0,
      showBackTop: false,
    });
  },
  scrollToLower() {
    this.setData({
      navbarOpacity: 1,
    });
  },
  scrollBackTop() {
    this.setData({
      scrollTop: 0,
    });
  },
  carouselChange(e) {
    const { current } = e.detail;
    this.setData({
      currentCarousel: current + 1,
    });
  },
  showExplain() {
    this.setData({
      showExplain: !this.data.showExplain,
    });
  },
  showTipsHandle() {
    this.setData({
      showTips: true,
    });
  },
  closePopupHandle(e) {
    this.setData({
      showTips: false,
    });
  },
  //获取推荐商品列表
  async getProductList() {
    this.setData({
      loadMore: true,
    });
    const { currentPage, pageSize, productList } = this.data;

    const params = {
      recommend: 0,
      currentPage,
      pageSize,
    };
    const { code, data, msg } = await getRecommendProducts(params);
    let products;
    if (currentPage === 1) {
      this.setData({
        productTotal: data.total,
      });
      if (pageSize >= data.total) {
        this.setData({
          loadMore: false,
        });
      }
      products = data.list;
    } else {
      products = productList.concat(data.list);
    }
    this.setData({ productList: products });
  },
  //滚动触底
  scrolltolowerHandle(e) {
    const { loadLoding } = this.data;
    if (loadLoding) {
      return;
    }
    const { currentPage, pageSize, productTotal } = this.data;
    const loadMore = productTotal - currentPage * pageSize;
    if (loadMore > 0) {
      this.setData({
        currentPage: currentPage + 1,
      });
      this.getProductList();
    } else {
      this.setData({
        loadMore: false,
      });
    }
  },
});
