/*
 * @Author: WangLi
 * @Date: 2021-04-22 06:51:42
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-07 11:07:58
 */
import config from "../../config/index";
import {
  getCartList,
  updateCart,
  deleteCart,
  getRecommendProducts,
} from "../../http/api";
import { mathRound, Modal } from "../../utils/util";
const App = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    selected: {
      type: Number,
    },
    cartChange: {
      type: Number,
    },
  },
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
    cartEmpty: config.cartEmpty,
    productList: [],
    productTotal: 0,
    currentPage: 1,
    pageSize: config.recommendPageSize,
    loadLoding: false,
    loadMore: true,
    loadMoreText: "加载中",
  },
  lifetimes: {
    attached(options) {
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop,
        navRight: App.globalData.navRight,
        menuButtonHeight: App.globalData.menuButtonHeight,
      });
    },
  },
  observers: {
    selected(value) {
      if (value === 2) {
        this.getCartList();
        this.getProductList();
      }
    },
    cartChange() {
      this.getCartList();
    },
  },
  methods: {
    tabbarChange(e) {
      this.triggerEvent("tabchange", { pageIndex: e.detail.pageIndex });
    },
    async getCartList(params) {
      const { data, code, msg } = await getCartList({
        userId: App.globalData.userId,
      });
      const { count, list } = data;
      let salesCount = 0,
        salesEndCount = 0,
        selectedCount = 0,
        salesList = [],
        salesEndList = [];
      if (count) {
        salesList = list.filter((x) => x.sales_status === 1 && x.stock > 0);
        salesCount = salesList.length;
        salesList.forEach((x) => {
          x.selected = true;
          selectedCount++;
        });

        salesEndList = list.filter(
          (x) => x.sales_status === 0 && x.stock === 0
        );
        salesEndCount = salesEndList.length;
      }

      this.setData({
        cartList: count ? list : [],
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
    showAll() {
      this.setData({
        showAll: !this.data.showAll,
      });
    },
    inputChange(e) {
      const index = e.currentTarget.dataset.index;
    },
    cartNumHandle(e) {
      const { salesList } = this.data;
      const index = e.currentTarget.dataset.index;
      const salesData = salesList[index];
      this.setData({
        showNum: true,
        selectedValues: { id: salesData.id, count: salesData.count },
      });
    },
    closeDialogHandle(e) {
      this.setData({
        showNum: false,
      });
    },
    async numConfirmHandle(e) {
      const $this = this;
      const { id, count } = e.detail;
      const { salesList } = this.data;
      const salesData = salesList.filter((x) => x.id === id);
      const params = {
        cartId: salesData[0].id,
        updateCount: count ? count : 0,
        userId: App.globalData.userId,
      };
      if (!count) {
        Modal({
          content: "确认删除这个商品吗",
          cancelText: "我再想想",
          confirmText: "确认删除",
          confirm() {
            $this.deleteCartHandle(salesData[0].id);
          },
          cancel() {},
        });
        return;
      }
      const { code, data, msg } = await updateCart(params);
      salesData[0].count = count;
      this.setData({
        salesList,
      });
      this.updateCartHandle();
    },
    async minusHandle(e) {
      const $this = this;
      const { salesList } = this.data;
      const index = e.currentTarget.dataset.index;
      const salesData = salesList[index];
      let count = salesData.count;
      count--;
      if (count < 1) {
        Modal({
          content: "确认删除这个商品吗",
          cancelText: "我再想想",
          confirmText: "确认删除",
          confirm() {
            $this.deleteCartHandle(salesData.id);
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
      salesData.count = count;
      salesData.selected = true;
      this.setData({
        salesList,
      });
      this.updateCartHandle();
    },
    async addHandle(e) {
      const { salesList } = this.data;
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
      salesData.selected = true;
      this.setData({
        salesList,
      });
      this.updateCartHandle();
    },
    async deleteCartHandle(value) {
      const ids = value.toString().split(",");
      const delLen = ids.length;
      const { salesList, salesCount, selectedCount } = this.data;
      const params = {
        ids: value,
        updateCount: 0,
        userId: App.globalData.userId,
      };
      const { code, data, msg } = await deleteCart(params);
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
      this.updateCartHandle();
    },
    updateCartHandle() {
      this.triggerEvent("updateCart", true);
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
    goProduct(e) {
      const productId = e.currentTarget.dataset.proid;
      App.router.push("product", { productId });
    },
    goHome() {
      App.router.pushTab("main", { pageIndex: 0 });
    },
    editHandle() {
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
      Modal({
        content: "确认删除选择的商品吗",
        cancelText: "我再想想",
        confirmText: "确认删除",
        confirm() {
          $this.deleteCartHandle(ids);
        },
        cancel() {},
      });
    },
    cartPlace() {
      const { selectedCount, salesList } = this.data;
      if (!selectedCount) {
        return;
      }
      const ids = salesList
        .filter((x) => x.selected)
        .map((x) => x.id)
        .join(",");
      App.router.push("place", { ids, type: "cart" });
    },
    async getProductList() {
      this.setData({
        loadMore: true,
      });
      const { currentPage, pageSize, productList } = this.data;

      const params = {
        recommend: 2,
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
    updateCartHandle() {
      this.triggerEvent("updateCart", true);
    },
  },
});
