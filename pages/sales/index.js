/*
 * @Author: WangLi
 * @Date: 2021-05-28 09:15:25
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-03 13:26:12
 */
import config from "../../config/index";
import { getActiveList, getListByActive, creatCart } from "../../http/api";
import { diffTime, transformDate, Toast } from "../../utils/util";

const App = getApp();

Page({
  data: {
    todayTime: "",
    clearTimer: false,
    activeList: [],
    currentActive: 0,
    activeType: null,
    productTotal: 0,
    productList: [],
    currentPage: 1,
    pageSize: config.recommendPageSize,
    isRefreshing: true,
    loadLoding: false,
    loadMore: true,
    loadMoreText: "加载中",
    region: {
      header: true,
      list: true,
    },
  },
  onLoad() {
    //获取明天0点
    const nextDay = new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toLocaleDateString();
    const todayTime = transformDate(nextDay, "Y-M-D h:m:s");
    this.setData({
      todayTime,
    });
    //初始化页面
    this.getActiveList();
    this.initPage();
  },
  onUnload() {
    this.setData({
      clearTimer: true,
    });
  },
  //初始化页面
  initPage() {
    this.setData({
      loadMore: true,
      currentPage: 1,
    });
  },
  async getActiveList() {
    const { code, data, msg } = await getActiveList();
    const activeList = data.list.map((x) => {
      let status = 0,
        time = null,
        status_text = "即将开始"; //活动状态 0：未开始 1：正在进行 -1：已结束
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
    this.setData({
      activeList,
      activeType: activeList[0].id,
    });
    this.getProductList();
  },
  activeChangeHandle(e) {
    const index = e.currentTarget.dataset.index;
    const { activeList } = this.data;
    this.setData({
      currentActive: index,
      activeType: activeList[index].id,
    });
    this.initPage();
    this.getProductList();
  },
  countDownEndHandle() {
    console.log("倒计时结束了");
    this.getActiveList();
  },
  todayEnd() {
    this.getActiveList();
  },
  //下拉刷新
  refreshHandle() {
    this.initPage();
    this.getProductList();
  },
  restoreHandle(e) {},
  //获取商品列表
  async getProductList() {
    this.setData({
      loadMore: true,
    });
    const { currentPage, pageSize, productList, activeType } = this.data;

    const params = {
      currentPage,
      pageSize,
      activeType,
    };
    const { code, data, msg } = await getListByActive(params);
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
      this.setData({
        loading: false,
      });
    } else {
      products = productList.concat(data.list);
    }
    this.setData({ productList: products, isRefreshing: false });
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
    this.triggerEvent("updateCart", true);
  },
  getActiveStatus(start, end) {
    const diff = diffTime(start, end);
    return diff;
  },
});
