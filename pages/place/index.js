/*
 * @Author: WangLi
 * @Date: 2021-04-29 05:48:15
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 15:33:38
 */
import { getPlaceList, creatOrder, getReceiverInfo } from "../../http/api";
import { mathRound, Toast } from "../../utils/util";
const App = getApp();

Page({
  data: {
    list: [],
    count: 0,
    totalCost: 0,
    payCost: 0,
    couponCost: 0,
    discountCost: 0,
    showEditDialog: false,
    orderUser: {},
    location: {},
    placeType: null,
  },
  onLoad(options) {
    const { ids, type } = App.router.extract(options);
    this.setData({
      placeType: type,
      location: {
        latitude: App.globalData.latitude,
        longitude: App.globalData.longitude,
      },
    });
    this.getReceiverInfo();
    this.getPlaceList(ids);
  },
  onShow() {},
  async getReceiverInfo() {
    const { data } = await getReceiverInfo(App.globalData.userId);
    const { name, phone } = data;
    this.setData({
      orderUser: { name, phone },
    });
  },
  async getPlaceList(values) {
    const { placeType } = this.data;
    const params = {
      type: placeType,
      ids: values,
      userId: App.globalData.userId,
    };
    const { code, data, msg } = await getPlaceList(params);
    this.setData({
      list: data.list,
      count: data.count,
    });
    this.getTotalCost();
  },
  getTotalCost() {
    let sumCost = 0;
    const { list, discountCost, couponCost } = this.data;
    list.forEach((item) => {
      sumCost += Number(item.sales_price) * item.count;
    });
    const payCost = sumCost - discountCost - couponCost;
    this.setData({
      sumCost: mathRound(sumCost),
      payCost: mathRound(payCost),
    });
  },
  editUserHandle() {
    const { orderUser } = this.data;
    this.setData({
      showEditDialog: true,
      initialValues: orderUser,
    });
  },
  editConfirmHandle(e) {
    const $this = this;
    const { name, phone } = e.detail;
    this.setData({
      orderUser: { name, phone },
    });
  },
  closeDialogHandle(e) {
    this.setData({
      showEditDialog: false,
    });
  },
  async placeOrderHandle() {
    const { orderUser, list, location, placeType, couponCost, discountCost } =
      this.data;
    if (!orderUser.name) {
      Toast("提货人信息不能为空", "none");
      return;
    }
    const { code, msg, data } = await creatOrder({
      orderUser,
      list,
      location,
      userId: App.globalData.userId,
      payStatus: false,
      type: placeType,
      couponCost,
      discountCost,
    });
    App.router.replace("order", { orderType: "" });
  },
});
