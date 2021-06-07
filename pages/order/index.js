/*
 * @Author: WangLi
 * @Date: 2021-05-06 14:35:50
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-21 16:50:00
 */
import { getOrderList } from "../../http/api";
import config from "../../config/index";
import { transformDate } from "../../utils/util";
const App = getApp();

Page({
  data: {
    orderTypeList: [
      { type: "", name: "全部" },
      { type: 0, name: "待付款" },
      { type: 1, name: "待配送" },
      { type: 2, name: "待提货" },
      { type: 3, name: "已完成" },
    ],
    orderTotal: 0,
    currentOrder: 0,
    currentStatus: "",
    currentPage: 1,
    pageSize: config.orderPageSize,
    orderList: [],
    emptyText: config.orderEmpty,
    clearTimer: false,
    isRefreshing: false,
    loadLoding: false,
    loadMore: true,
  },
  onLoad(options) {
    const { orderTypeList } = this.data;
    const { orderType } = App.router.extract(options);
    orderTypeList.forEach((x, i) => {
      if (x.type === orderType) {
        this.setData({
          currentOrder: i,
          currentStatus: x.type,
        });
      }
    });
  },
  onShow() {
    this.getOrderList();
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
  countDownHandle(e) {
    const orderId = e.currentTarget.dataset.id;
    const { orderList } = this.data;
    orderList.forEach((x) => {
      if (x.id === orderId) {
        x.status = 5;
      }
    });
    this.setData({
      orderList,
    });
  },
  refreshHandle() {
    this.initPage();
    this.getOrderList();
  },
  scrolltolowerHandle(e) {
    const { loadLoding } = this.data;
    if (loadLoding) {
      return;
    }
    const { currentPage, pageSize, orderTotal } = this.data;
    const loadMore = orderTotal - currentPage * pageSize;
    if (loadMore > 0) {
      this.setData({
        currentPage: currentPage + 1,
      });
      this.getOrderList();
    } else {
      this.setData({
        loadMore: false,
      });
    }
  },
  goOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    App.router.push("orderDetail", { orderId });
  },
  payHandle() {},
  async getOrderList() {
    this.setData({
      loadMore: true,
    });
    const { currentStatus, currentPage, pageSize, orderList } = this.data;
    const params = {
      userId: App.globalData.userId,
      status: currentStatus,
      currentPage,
      pageSize,
    };
    const { code, data, msg } = await getOrderList(params);
    if (code === 200) {
      if (data.count) {
        data.list.forEach((x) => {
          x.creat_time = transformDate(x.creat_time);
        });
      }
      let orders;
      if (currentPage === 1) {
        if (pageSize >= data.total) {
          this.setData({
            loadMore: false,
          });
        }
        orders = data.list;
      } else {
        orders = orderList.concat(data.list);
      }
      this.setData({
        orderList: orders,
        orderTotal: data.total,
        loadLoding: false,
        isRefreshing: false,
      });
    }
  },
  orderChange(e) {
    const { orderTypeList } = this.data;
    const index = e.currentTarget.dataset.index;
    const orderType = orderTypeList[index].type;
    this.setData({
      currentOrder: index,
      currentStatus: orderType,
      loadLoding: true,
      currentPage: 1,
      orderList: [],
    });
    this.getOrderList();
  },
});
