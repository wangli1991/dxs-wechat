/*
 * @Author: WangLi
 * @Date: 2021-04-07 20:35:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-07 14:21:53
 */
import {
  getSortList,
  getClassifyList,
  getListByClassify,
  creatCart,
} from "../../http/api";
import config from "../../config/index";
import { toast } from "../../utils/util";
const App = getApp();

Page({
  /**
   * 组件的初始数据
   */
  data: {
    isRefresh: false,
    currentPage: 1,
    isInitProductPage: true,
    isLoading: true,
    sideList: [],
    sort: null,
    currentSort: 0, //当前排序index
    sortType: -1, //排序类型 1：正序 -1：倒序
    sortList: [], //排序数据
    currrentClassify: 0,
    classifyList: [],
    productList: [],
    productTotal: 0,
    loadMore: true,
    loadMoreText: "加载中...",
    tabBarEle: null,
  },
  onLoad: function () {
    //设置tabbar
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.setData({
        tabBarEle: this.getTabBar(),
      });
      this.getTabBar().setData({
        selected: 1,
      });
    }
    this.setData({
      navHeight: App.globalData.navHeight,
      navTop: App.globalData.navTop,
      navRight: App.globalData.navRight,
      menuButtonHeight: App.globalData.menuButtonHeight,
      searchText: "苹果",
    });
    this.getSortList();
  },
  onShow: function () {
    this.getClassifyList();
  },
  initProductPage() {
    this.setData({
      currentPage: 1,
      isInitProductPage: true,
    });
  },
  getClassifyList: async function () {
    const { code, msg, data } = await getClassifyList();
    if (code === 200) {
      this.setData({
        classifyList: data.dataList,
        currentSort: 0,
        sort: this.data.sortList[0].type,
      });
      this.initProductPage();
      this.getList();
    }
  },
  classifyTap: function (e) {
    this.setData({
      currrentClassify: e.currentTarget.dataset.index,
      sortType: -1,
      currentSort: 0,
      sort: this.data.sortList[0].type,
    });
    this.initProductPage();
    this.loadMore();
    this.getList();
  },
  getSortList: async function () {
    const { code, msg, data } = await getSortList();
    this.setData({
      sortList: data.dataList,
    });
  },
  sortTap: function (e) {
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
    });
    this.getList();
  },
  productTap: function (e) {
    const productId = e.currentTarget.dataset.id;
    App.router.push("product", { id: productId });
  },
  lower: function (e) {
    const { isLoading } = this.data;
    if (isLoading) {
      return;
    }
    const { currentPage, productTotal } = this.data;
    const loadMore = currentPage * config.classifyPageSize - productTotal;
    if (loadMore > 0) {
      this.loadMore({ text: 11 });
      return;
    }
    this.loadMore();
    this.setData({
      currentPage: currentPage + 1,
    });
    this.getList();
  },
  onScrollRefresh: function (e) {
    this.initProductPage();
    this.loadMore();
    this.getList();
  },
  onScrollRestore: function (e) {
    console.log("刷新复位");
  },
  getList: async function () {
    this.setData({
      isLoading: true,
    });
    const {
      currrentClassify,
      classifyList,
      sort,
      currentPage,
      productList,
    } = this.data;
    const classifyData = classifyList[currrentClassify];
    const pageSize = config.classifyPageSize;
    const params = {
      classify: classifyData.id,
      sort,
      currentPage,
      pageSize,
    };
    const { code, msg, data } = await getListByClassify(params);
    if (code === 200) {
      const products =
        currentPage === 1 ? data.dataList : productList.concat(data.dataList);
      if (currentPage === 1) {
        this.setData({
          productTotal: data.total,
          isInitProductPage: false,
        });
        if (data.total <= pageSize) {
          this.loadMore({ text: 11 });
        }
      }
      console.log(products);
      this.setData({
        productList: products,
        isLoading: false,
        isRefresh: false,
      });
    }
  },
  loadMore(value) {
    const loadMoreText = value ? "到底了" : "加载中...";
    const loadMore = value ? false : true;
    this.setData({
      loadMore,
      loadMoreText,
    });
  },
  async addCartHandle(e) {
    const productId = e.currentTarget.dataset.product;
    const productData = this.data.productList.filter((x) => x.id === productId);
    const params = {
      productId,
      addCount: 1,
      userId: App.globalData.userId,
    };
    const { code, msg, data } = await creatCart(params);
    if (code === 200) {
      const { tabBarEle } = this.data;
      if (tabBarEle) {
        tabBarEle.getCartCount();
      }
    } else {
      toast("失败", "error");
    }
  },
});
