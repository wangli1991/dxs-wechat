/*
 * @Author: WangLi
 * @Date: 2021-05-25 13:59:39
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 05:43:08
 */
import {
  creatSearch,
  clearSearch,
  getSearchList,
  getHotSearchList,
  getProductBySearch,
  getSortList,
  creatCart,
  getRollList,
} from "../../http/api";
import { Toast, Modal } from "../../utils/util";
import config from "../../config/index";

const App = getApp();

Page({
  data: {
    searchVal: "",
    initVal: "",
    historyList: [],
    historyCount: 0,
    hotList: [],
    keywordList: [],
    searching: false,
    sort: null,
    currentSort: 0, //当前排序index
    sortType: -1, //排序类型 1：正序 -1：倒序
    sortList: [], //排序数据
    productList: [],
    productTotal: 0,
    currentPage: 1,
    pageSize: config.recommendPageSize,
    loadLoding: false,
    loadMore: true,
    loadMoreText: "加载中",
    scrollTop: 0,
    loading: false,
  },
  onLoad(options) {
    const { search } = App.router.extract(options);
    this.setData({
      initVal: search,
    });
    this.getSearch();
  },
  initPage() {
    this.setData({
      currentPage: 1,
    });
  },
  getSearch() {
    this.getHistoryList();
    this.getHotList();
  },
  async getHistoryList() {
    const { data, code, msg } = await getSearchList({
      userId: App.globalData.userId,
    });
    const { count, list } = data;
    this.setData({
      historyList: list,
      historyCount: count,
    });
  },
  clearSearchHistoryHandle() {
    const $this = this;
    Modal({
      content: "确认删除所有搜索记录吗？",
      cancelText: "取消",
      confirmText: "确认删除",
      confirmColor: "#ff3634",
      confirm() {
        $this.clearHistory();
      },
      cancel() {},
    });
  },
  async clearHistory() {
    const { data, code, msg } = await clearSearch({
      userId: App.globalData.userId,
    });
    this.setData({
      historyList: [],
      historyCount: 0,
    });
  },
  async getHotList() {
    const { data, code, msg } = await getHotSearchList();
    const { count, list } = data;
    this.setData({
      hotList: list,
    });
  },
  searchTapHandle(e) {
    const searchVal = e.currentTarget.dataset.text;
    this.setData({
      searchVal,
    });
    this.searchHandle();
  },
  changeHandle(e) {
    console.log(e);
    const { value } = e.detail;
    this.setData({
      searchVal: value,
    });
    this.getProductBySearch(value);
  },
  async searchHandle() {
    this.setData({
      loading: true,
    });
    const { searchVal, initVal } = this.data;
    const submitVal = searchVal ? searchVal : initVal;
    this.setData({
      searchVal: submitVal,
    });
    this.getSortList();
    this.getProductList();
    const { data, code, msg } = await creatSearch({
      userId: App.globalData.userId,
      name: submitVal,
    });
    this.getSearch();
  },
  async getProductBySearch(value) {
    const { data, code, msg } = await getProductBySearch({ search: value });
    if (data.total) {
      var reg = new RegExp(value, "g");
      const keywordList = data.list.map((x) => {
        const keyword = x.name.replace(
          reg,
          `<span style="color:#02c521">${value}</span>`
        );
        return { ...x, keyword: `<div>${keyword}</div>` };
      });
      this.setData({
        keywordList,
      });
    } else {
      this.setData({
        keywordList: [],
      });
    }
  },
  searchClearHandle() {
    this.setData({
      searching: false,
      searchVal: "",
      currentSort: 0,
    });
  },
  async getSortList() {
    const { code, msg, data } = await getSortList();
    this.setData({
      sortList: data.list,
    });
  },
  sortTap(e) {
    const index = e.currentTarget.dataset.index;
    const sortData = this.data.sortList[index];
    const { can_sort, type } = sortData;
    if (can_sort) {
      this.setData({
        sortType: -1 * this.data.sortType,
      });
    } else {
      this.setData({
        sortType: -1,
      });
    }
    const sort = can_sort ? type * this.data.sortType : type;
    this.setData({
      sort,
      currentSort: index,
      loading: true,
      scrollTop: 0,
    });
    this.initPage();
    this.getProductList();
  },
  //获取推荐商品列表
  async getProductList() {
    this.setData({
      loadMore: true,
    });
    const { searchVal, sort, currentPage, productList } = this.data;
    const pageSize = config.searchPageSize;
    const params = {
      search: searchVal,
      sort,
      currentPage,
      pageSize,
    };
    const { code, data, msg } = await getProductBySearch(params);
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
    this.setData({ productList: products, searching: true, loading: false });
  },
  //滚动触底
  scrolltolowerHandle(e) {
    console.log("到底了");
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
});
