/*
 * @Author: WangLi
 * @Date: 2021-04-29 05:48:15
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 16:13:38
 */
import { getPlaceList } from "../../http/api";
import { mathRound, toast, modal } from "../../utils/util";
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
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("key", (data) => {
      this.getPlaceList(data.ids);
    });
  },
  onShow: function () {},
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
    this.setData({
      showEditDialog: true,
      initialValues: {},
    });
  },
  editConfirmHandle: async function (e) {
    const $this = this;
    const { name, tel } = e.detail;
    console.log(name, tel);
    this.setData({
      orderUser: { name, tel },
    });
  },
  closeDialogHandle: function (e) {
    this.setData({
      showEditDialog: false,
    });
  },
});
