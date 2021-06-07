/*
 * @Author: WangLi
 * @Date: 2021-05-06 16:26:57
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 10:29:12
 */
import config from "../../config/index";
import { getRecommendProducts, getOrderInfo } from "../../http/api";
import { Toast } from "../../utils/util";
const App = getApp();

Page({
  data: {
    orderId: null,
    orderData: {},
    clearTimer: false,
    statusDescription: "",
    productList: [],
    productTotal: 0,
    currentPage: 1,
    pageSize: config.recommendPageSize,
    isRefreshing: false,
    loadLoding: false,
    loadMore: true,
    loadMoreText: "加载中",
  },
  onLoad(options) {
    const { orderId } = App.router.extract(options);
    this.setData({ orderId });
  },
  onShow() {
    this.getOrderInfo();
    this.getProductList();
  },
  onUnload() {
    this.setData({
      clearTimer: true,
    });
  },
  initPage() {
    this.setData({
      loadMore: true,
      currentPage: 1,
    });
  },
  countDownEndHandle() {
    const { orderData } = this.data;
    orderData.status = 5;
    this.setData({
      orderData,
    });
  },
  copyHandle(e) {
    const content = e.currentTarget.dataset.no;
    wx.setClipboardData({
      data: content,
      success(res) {
        Toast("复制成功", "success");
      },
    });
  },
  async getOrderInfo() {
    const params = {
      orderId: this.data.orderId,
    };
    const { code, data, msg } = await getOrderInfo(params);
    this.setData({
      orderData: data,
      isRefreshing: false,
    });

    let statusDescription;
    switch (data.status) {
      case 0:
        statusDescription = "下单后若对订单取货有疑问，请联系团长哦~";
        break;
      case 1:
        statusDescription = "您的商品正在赶来路上，请耐心等待！";
        break;
      case 2:
        statusDescription = "您的商品正在等您，快联系团长取货吧！";
        break;
      case 3:
        statusDescription = "感谢您的支持，记得跟小伙伴分享购物心得哦~";
        break;
      default:
        statusDescription = "超时未支付，感谢您选择我们为您服务！";
        break;
    }
    this.setData({
      statusDescription,
    });
  },
  goMap() {},
  async getProductList() {
    this.setData({
      loadMore: true,
    });
    const { currentPage, pageSize, productList } = this.data;

    const params = {
      recommend: 4,
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
  refreshHandle() {
    this.initPage();
    this.getOrderInfo();
  },
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
