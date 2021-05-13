/*
 * @Author: WangLi
 * @Date: 2021-05-06 14:35:50
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-13 10:44:59
 */
import { getOrderList } from "../../http/api";
import config from "../../config/index";
import { transformDate, setCountdown } from "../../utils/util";
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
    currentOrder: 0,
    currentStatus: "",
    orderList: [],
    orderCount: 0,
    emptyText: config.orderEmpty,
    // 倒计时
    clearTimer: false,
    loading: true,
  },
  onLoad(options) {
    const { orderTypeList } = this.data;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("key", (data) => {
      const { orderType } = data;
      orderTypeList.forEach((x, i) => {
        if (x.type === orderType) {
          this.setData({
            currentOrder: i,
            currentStatus: x.type,
          });
        }
      });
    });
  },
  onShow: function () {
    this.getOrderList();
  },
  onUnload: function () {
    this.setData({
      clearTimer: true,
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
  goOrderDetail() {
    App.router.push("orderDetail");
  },
  payHandle() {},
  async getOrderList() {
    const { currentStatus } = this.data;
    const params = {
      userId: App.globalData.userId,
      status: currentStatus,
    };
    const { code, data, msg } = await getOrderList(params);
    if (code === 200) {
      if (data.count) {
        data.dataList.forEach((x) => {
          x.creat_time = transformDate(x.creat_time);
        });
      }
      this.setData({
        orderList: data.dataList,
        orderCount: data.count,
        loading: false,
      });
    }
  },
  getOrder(e) {
    const { orderTypeList } = this.data;
    const index = e.currentTarget.dataset.index;
    const orderType = orderTypeList[index].type;
    this.setData({
      currentOrder: index,
      currentStatus: orderType,
      loading: true,
    });
    this.getOrderList();
  },
});
