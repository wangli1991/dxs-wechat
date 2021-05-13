/*
 * @Author: WangLi
 * @Date: 2021-04-29 05:48:15
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-13 04:46:30
 */
import { getPlaceList, creatOrder, getReceiverInfo } from "../../http/api";
import { mathRound, toast } from "../../utils/util";
const App = getApp();

Page({
  data: {
    list: [],
    count: 0,
    totalPrice: 0,
    savePrice: 0,
    payPrice: 0,
    showEditDialog: false,
    orderUser: {},
    location: {},
  },
  onLoad: function (options) {
    this.getReceiverInfo();
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("key", (data) => {
      this.getPlaceList(data.ids);
    });
    this.setData({
      location: {
        latitude: App.globalData.latitude,
        longitude: App.globalData.longitude,
      },
    });
  },
  onShow: function () {},
  async getReceiverInfo() {
    const { data } = await getReceiverInfo(App.globalData.userId);
    const { name, phone } = data;
    this.setData({
      orderUser: { name, phone },
    });
  },
  getPlaceList: async function (values) {
    const params = {
      ids: values,
      userId: App.globalData.userId,
    };
    const { code, data, msg } = await getPlaceList(params);
    if (code !== 200) {
      toast("获取商品失败，请重试", "error");
      return;
    }
    this.setData({
      list: data.dataList,
      count: data.count,
    });
    this.getTotalPrice();
  },
  getTotalPrice: function () {
    let totalPrice = 0,
      marketPrice = 0;
    const { list } = this.data;
    list.forEach((item) => {
      totalPrice += Number(item.product_sales_price) * item.count;
      marketPrice += Number(item.product_market_price) * item.count;
    });
    const savePrice = marketPrice - totalPrice;
    this.setData({
      totalPrice: mathRound(totalPrice),
      savePrice: mathRound(savePrice),
      payPrice: mathRound(totalPrice),
    });
  },
  editUserHandle: function () {
    const { orderUser } = this.data;
    this.setData({
      showEditDialog: true,
      initialValues: orderUser,
    });
  },
  editConfirmHandle: async function (e) {
    const $this = this;
    const { name, phone } = e.detail;
    console.log(name, phone);
    this.setData({
      orderUser: { name, phone },
    });
  },
  closeDialogHandle: function (e) {
    this.setData({
      showEditDialog: false,
    });
  },
  payHandle: async function () {
    const { orderUser, list, location } = this.data;
    console.log(orderUser, list, location);
    console.log(Date.now());
    console.log(orderUser);
    if (!orderUser.name) {
      toast("提货人信息不能为空");
      return;
    }
    const { code, msg, data } = await creatOrder({
      orderUser,
      list,
      location,
      userId: App.globalData.userId,
      payStatus: false,
    });
    App.router.replace("order");
  },
});
