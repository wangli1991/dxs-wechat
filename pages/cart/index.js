/*
 * @Author: WangLi
 * @Date: 2021-04-22 06:51:42
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-30 10:37:33
 */
// pages/cart/index.js
import { getCartList, updateCart, deleteCart } from "../../http/api";
import { mathRound, toast, modal } from "../../utils/util";
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    salesList: [],
    salesCount: 0,
    salesEndList: [],
    salesEndCount: 0,
    selectedAll: false,
    selectedCount: 0,
    showAll: false, //显示购物车全部商品
    cartCount: 0,
    selectedValues: {},
    showInfo: false, //显示价格详情
    totalPrice: 0,
    savePrice: 0,
    showNum: false,
    editCart: false,
    tabBarEle: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: App.globalData.navHeight,
      navTop: App.globalData.navTop,
      navRight: App.globalData.navRight,
      menuButtonHeight: App.globalData.menuButtonHeight,
    });
  },
  onShow: function () {
    //设置tabbar
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.setData({
        tabBarEle: this.getTabBar(),
      });
      this.getTabBar().setData({
        selected: 2,
      });
    }
    this.getCartList();
  },
  getCartList: async function (params) {
    const { data, code, msg } = await getCartList({
      userId: App.globalData.userId,
    });
    const { count, dataList } = data;
    let salesCount = 0,
      salesEndCount = 0,
      selectedCount = 0,
      salesList = [],
      salesEndList = [];
    if (count) {
      salesList = dataList.filter((x) => x.sales_status === 1 && x.stock > 0);
      salesCount = salesList.length;
      salesList.forEach((x) => {
        x.selected = true;
        selectedCount++;
      });

      salesEndList = dataList.filter(
        (x) => x.sales_status === 0 && x.stock === 0
      );
      salesEndCount = salesEndList.length;
    }

    this.setData({
      cartList: count ? dataList : [],
      cartCount: count,
      salesList,
      salesCount,
      salesEndList,
      salesEndCount,
      selectedCount,
    });
    this.getSelectedAll();
    this.getTotalPrice();
  },
  showAll: function () {
    this.setData({
      showAll: !this.data.showAll,
    });
  },
  cartNumHandle: function (e) {
    const { salesList } = this.data;
    const index = e.currentTarget.dataset.index;
    const salesData = salesList[index];
    this.setData({
      showNum: true,
      selectedValues: { id: salesData.id, count: salesData.count },
    });
  },
  closeDialogHandle: function (e) {
    this.setData({
      showNum: false,
    });
  },
  numConfirmHandle: async function (e) {
    const $this = this;
    const { id, count } = e.detail;
    const { salesList, tabBarEle } = this.data;
    const salesData = salesList.filter((x) => x.id === id);
    const params = {
      cartId: salesData[0].id,
      updateCount: count ? count : 0,
      userId: App.globalData.userId,
    };
    if (!count) {
      modal({
        content: "确认删除这个商品吗",
        cancelText: "我再想想",
        confirmText: "确认删除",
        confirm() {
          $this.cartDeleteHandle(salesData[0].id);
        },
        cancel() {},
      });
      return;
    }
    const { code, data, msg } = await updateCart(params);
    if (code !== 200) {
      toast("添加购物车失败，请重试", "error");
      return;
    }
    if (tabBarEle) {
      tabBarEle.getCartCount();
    }
    salesData[0].count = count;
    this.setData({
      salesList,
    });
    this.getTotalPrice();
  },
  minusHandle: async function (e) {
    const $this = this;
    const { salesList, tabBarEle } = this.data;
    const index = e.currentTarget.dataset.index;
    const salesData = salesList[index];
    let count = salesData.count;
    count--;
    if (count < 1) {
      modal({
        content: "确认删除这个商品吗",
        cancelText: "我再想想",
        confirmText: "确认删除",
        confirm() {
          $this.cartDeleteHandle(salesData.id);
        },
        cancel() {},
      });
      return;
    }
    const params = {
      cartId: salesData.id,
      updateCount: count,
      userId: App.globalData.userId,
    };
    const { code, data, msg } = await updateCart(params);
    if (code !== 200) {
      toast("添加购物车失败，请重试", "error");
      return;
    }
    if (tabBarEle) {
      tabBarEle.getCartCount();
    }
    salesData.count = count;
    salesData.selected = true;
    this.setData({
      salesList,
    });
    this.getTotalPrice();
  },
  addHandle: async function (e) {
    const { salesList, tabBarEle } = this.data;
    const index = e.currentTarget.dataset.index;
    const salesData = salesList[index];
    let count = salesData.count;
    count++;
    salesData.count = count;
    const params = {
      cartId: salesData.id,
      updateCount: count,
      userId: App.globalData.userId,
    };
    const { code, data, msg } = await updateCart(params);
    if (code !== 200) {
      toast("添加购物车失败，请重试", "error");
      return;
    }
    if (tabBarEle) {
      tabBarEle.getCartCount();
    }
    salesData.selected = true;
    this.setData({
      salesList,
    });
    this.getTotalPrice();
  },
  cartDeleteHandle: async function (value) {
    const ids = value.toString().split(",");
    const delLen = ids.length;
    const { salesList, salesCount, selectedCount, tabBarEle } = this.data;
    const params = {
      ids: value,
      updateCount: 0,
      userId: App.globalData.userId,
    };
    const { code, data, msg } = await deleteCart(params);
    if (code !== 200) {
      toast("删除购物车失败，请重试", "error");
      return;
    }
    if (tabBarEle) {
      tabBarEle.getCartCount();
    }
    const updateSalesData = salesList.filter((x) =>
      delLen > 1 ? !ids.includes(x.id) : x.id != value
    );
    this.setData({
      salesCount: salesCount - delLen,
      selectedCount: selectedCount - delLen,
      salesList: updateSalesData,
      editCart: false,
    });
    this.getSelectedAll();
    this.getTotalPrice();
  },
  cartSelect(e) {
    const index = e.currentTarget.dataset.index;
    const { salesList, salesCount } = this.data;
    const selectData = salesList[index];
    const selected = selectData.selected;
    selectData.selected = !selected;
    this.setData({
      salesList,
    });
    const selectedCount = salesCount
      ? salesList.filter((x) => x.selected).length
      : 0;
    this.setData({
      selectedCount,
    });
    this.getSelectedAll();
    this.getTotalPrice();
  },
  cartSelectAll() {
    const { selectedAll, salesList, salesCount } = this.data;
    let selectedCount = 0;
    salesList.forEach((item) => {
      item.selected = !selectedAll;
    });
    if (selectedAll) {
      selectedCount = 0;
    } else {
      selectedCount = salesCount;
    }
    this.setData({
      selectedCount,
      selectedAll: !selectedAll,
      salesList,
    });
    this.getTotalPrice();
  },
  getSelectedAll() {
    const { selectedCount, salesCount } = this.data;
    const selectedStatus = salesCount && selectedCount === salesCount;
    this.setData({
      selectedAll: selectedStatus ? true : false,
    });
  },
  getTotalPrice() {
    let totalPrice = 0,
      marketPrice = 0;
    const { salesList } = this.data;
    salesList.forEach((item) => {
      if (item.selected) {
        totalPrice += Number(item.product_sales_price) * item.count;
        marketPrice += Number(item.product_market_price) * item.count;
      }
    });
    const savePrice = marketPrice - totalPrice;
    this.setData({
      totalPrice: mathRound(totalPrice),
      savePrice: mathRound(savePrice),
    });
  },
  goProduct: function (e) {
    const productId = e.currentTarget.dataset.proid;
    App.router.push("product", { id: productId });
  },
  goHome() {
    // App.router.pushTab("home");
    App.router.push("place");
  },
  editCartHandle() {
    const { editCart } = this.data;
    this.setData({
      editCart: !editCart,
    });
  },
  deleteHandle() {
    const $this = this;
    const { salesList, selectedCount } = this.data;
    if (!selectedCount) {
      return;
    }
    const ids = salesList.filter((x) => x.selected).map((x) => x.id);
    modal({
      content: "确认删除选择的商品吗",
      cancelText: "我再想想",
      confirmText: "确认删除",
      confirm() {
        $this.cartDeleteHandle(ids);
      },
      cancel() {},
    });
  },
  cartPlace: function () {
    const { selectedCount, salesList } = this.data;
    if (!selectedCount) {
      return;
    }
    const ids = salesList.filter((x) => x.selected).map((x) => x.id);
    App.router.push("place", { ids });
  },
});
