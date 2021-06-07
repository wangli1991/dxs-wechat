/*
 * @Author: WangLi
 * @Date: 2021-04-06 20:53:18
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 09:46:14
 */
import config from "../../config/index";
import {
  getRecommendProducts,
  getBannerList,
  getActiveList,
  getListByActive,
  creatCart,
} from "../../http/api";
import { diffTime, transformDate, Toast } from "../../utils/util";

const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    selected: Number,
  },
  data: {
    bannerList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    productTotal: 0,
    productList: [],
    currentPage: 1,
    pageSize: config.recommendPageSize,
    isRefreshing: false,
    loadLoding: false,
    loadMore: true,
    loadMoreText: "加载中",
    animationData: {},
    barWidth: 0,
    todayTime: "",
    clearTimer: false,
    activeData: [],
    activeCount: 0,
    activeProductList: [],
    activeType: null,
  },
  lifetimes: {
    attached() {
      const barWidth = App.rpxToPxFormat(30);
      this.setData({
        barWidth,
      });
      this.initPage();
    },
    onUnload() {
      this.setData({
        clearTimer: true,
      });
    },
  },
  observers: {
    selected(value) {},
  },
  methods: {
    //初始化页面
    initPage() {
      this.setData({
        loadMore: true,
        currentPage: 1,
      });
      this.getBannerList();
      this.getProductList();
      this.getActiveList();
    },
    //获取banner列表
    async getBannerList() {
      const { code, data, msg } = await getBannerList();
      this.setData({
        bannerList: data.list,
      });
    },
    //分类滚动
    classifyScrollHandle(e) {
      const { barWidth } = this.data;
      const { windowWidth } = App.globalData;
      const { scrollWidth, scrollLeft } = e.detail;
      const difWidth = scrollWidth - windowWidth;
      const tranWidth = (scrollLeft / difWidth) * barWidth;
      const tranAnimation = wx.createAnimation({
        duration: 10,
      });
      tranAnimation.translateX(tranWidth).step();
      this.setData({
        tranAnimation: tranAnimation.export(),
      });
    },
    classifyScrollUp() {
      const tranAnimation = wx.createAnimation({
        duration: 10,
      });
      tranAnimation.translateX(0).step();
      this.setData({
        tranAnimation: tranAnimation.export(),
      });
    },
    classifyScrollLower() {
      const { barWidth } = this.data;
      const tranAnimation = wx.createAnimation({
        duration: 10,
      });
      tranAnimation.translateX(barWidth).step();
      this.setData({
        tranAnimation: tranAnimation.export(),
      });
    },
    //限时秒杀结束
    countDownHandle(e) {},
    //下拉刷新
    refreshHandle() {
      this.initPage();
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
    //获取活动信息
    async getActiveList() {
      const { code, data, msg } = await getActiveList();
      const activeList = data.list.map((x) => {
        let status = 0, //活动状态 0：未开始 1：正在进行 -1：已结束
          time = null,
          status_text = "即将开始";
        if (x.type === 1) {
          const startStatus = this.getActiveStatus(new Date(), x.start_time);
          const endStatus = this.getActiveStatus(x.end_time, new Date());
          if (startStatus > 0) {
            status = 0;
            status_text = "距离开始";
          } else if (endStatus > 0) {
            status = -1;
            status_text = "已结束";
          } else {
            status = 1;
            status_text = "距离结束";
          }
        }
        time = transformDate(x.start_time, "h:m");
        return { ...x, status, time, status_text };
      });
      const activeData = activeList.find((x) => {
        return x.type === 1;
      });
      this.setData({
        activeData,
        activeType: activeList[0].id,
      });
      this.getActiveProductList();
    },
    //获取活动商品列表
    async getActiveProductList() {
      const { activeProductList, activeType } = this.data;
      const params = {
        currentPage: 1,
        pageSize: 6,
        activeType,
      };
      const { code, data, msg } = await getListByActive(params);
      this.setData({ activeProductList: data.list, activeCount: data.count });
    },
    getActiveStatus(start, end) {
      const diff = diffTime(start, end);
      return diff;
    },
    todayEnd() {
      this.getActiveList();
    },
    productTap(e) {
      const productId = e.currentTarget.dataset.id;
      App.router.push("product", { productId });
    },
    async addCartHandle(e) {
      const productId = e.currentTarget.dataset.product;
      const params = {
        productId,
        addCount: 1,
        userId: App.globalData.userId,
      };
      const { code, msg, data } = await creatCart(params);
      Toast("添加购物车成功", "none");
      this.updateCartHandle();
    },
    goSalesHandle() {
      App.router.push("sales");
    },
    updateCartHandle() {
      this.triggerEvent("updateCart", true);
    },
  },
});
