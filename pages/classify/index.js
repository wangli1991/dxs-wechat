/*
 * @Author: WangLi
 * @Date: 2021-04-07 20:35:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 10:32:09
 */
import {
  getSortList,
  getClassifyList,
  getClassifyProducts,
  creatCart,
} from "../../http/api";
import config from "../../config/index";
import { Toast, Loading, hideLoading } from "../../utils/util";
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    selected: Number,
    classify: Number,
  },
  data: {
    isRefreshing: false,
    currentPage: 1,
    isInitPage: true,
    loadLoding: true,
    sideList: [],
    sort: null,
    currentSort: 0, //当前排序index
    sortType: -1, //排序类型 1：正序 -1：倒序
    sortList: [], //排序数据
    currrentClassify: 0,
    classifyList: [],
    classifyCount: 0,
    productList: [],
    productTotal: 0,
    loadMore: true,
    loadMoreText: "上滑加载更多好物",
    pullText: "松开立即刷新",
    scrollTop: 0,
  },
  observers: {
    selected(value) {
      if (value === 1) {
        this.getSortList();
        this.getClassifyList();
      }
    },
  },
  methods: {
    initPage() {
      this.setData({
        currentPage: 1,
        isInitPage: true,
      });
    },
    async getClassifyList() {
      const { code, msg, data } = await getClassifyList();
      if (code === 200) {
        this.setData({
          classifyList: data.list,
          currentSort: 0,
          sort: this.data.sortList[0].type,
          classifyCount: data.count,
        });
        const { classify } = this.data;
        if (classify) {
          let currrentClassify = 0;
          data.list.forEach((x, i) => {
            if (x.id === classify) {
              currrentClassify = i;
            }
          });
          this.setData({
            currrentClassify,
          });
        }
        this.initPage();
        this.getProductList();
      }
    },
    classifyTap(e) {
      this.setData({
        currrentClassify: e.currentTarget.dataset.index,
        sortType: -1,
        currentSort: 0,
        sort: this.data.sortList[0].type,
      });
      this.initPage();
      this.loadMoreHandle();
      this.getProductList();
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
        scrollTop: 0,
      });
      this.initPage();
      this.getProductList();
    },
    productTap(e) {
      const productId = e.currentTarget.dataset.id;
      App.router.push("product", { productId });
    },
    lowerHandle(e) {
      const { loadLoding } = this.data;
      if (loadLoding) {
        return;
      }
      const { currentPage, productTotal, currrentClassify, classifyCount } =
        this.data;
      const loadMore = currentPage * config.classifyPageSize - productTotal;
      console.log(loadMore, currentPage, productTotal);
      if (loadMore > 0) {
        this.loadMoreHandle(true);
        if (currrentClassify === classifyCount - 1) {
          return;
        }
        Loading();
        this.setData({
          currrentClassify: currrentClassify + 1,
        });
        this.initPage();
        this.getProductList();
      } else {
        this.loadMoreHandle();
        this.setData({
          currentPage: currentPage + 1,
        });
        this.getProductList();
      }
    },
    pullingHandle() {
      const { currrentClassify, classifyList } = this.data;
      let pullText;
      const prevIndex = currrentClassify - 1;
      if (currrentClassify > 0) {
        const prevClassify = classifyList[prevIndex].name;
        pullText = `下滑查看 ${prevClassify}`;
      } else {
        pullText = "松开立即刷新";
      }
      this.setData({ pullText });
    },
    refreshHandle(e) {
      const { currrentClassify } = this.data;
      let prevIndex;
      if (currrentClassify > 0) {
        prevIndex = currrentClassify - 1;
      } else {
        prevIndex = currrentClassify;
      }
      this.setData({ currrentClassify: prevIndex });
      this.initPage();
      this.getProductList();
    },
    restoreHandle(e) {},
    async getProductList() {
      this.setData({
        loadLoding: true,
        loadMore: true,
      });
      const { currrentClassify, classifyList, sort, currentPage, productList } =
        this.data;
      const classifyData = classifyList[currrentClassify];
      const pageSize = config.classifyPageSize;
      const params = {
        classify: classifyData.id,
        sort,
        currentPage,
        pageSize,
      };
      const { code, msg, data } = await getClassifyProducts(params);
      if (code === 200) {
        const products =
          currentPage === 1 ? data.list : productList.concat(data.list);
        if (currentPage === 1) {
          this.setData({
            productTotal: data.total,
            isInitPage: false,
          });
          if (data.total <= pageSize) {
            this.loadMoreHandle(true);
          }
        }
        this.setData({
          productList: products,
          loadLoding: false,
          isRefreshing: false,
        });
        hideLoading();
      }
    },
    loadMoreHandle(value) {
      const { currrentClassify, classifyList, classifyCount } = this.data;
      let loadMoreText, loadMore;
      if (currrentClassify < classifyCount - 1) {
        const classifyIndex = currrentClassify + 1;
        const nextClassify = classifyList[classifyIndex].name;
        loadMoreText = value ? `上滑查看${nextClassify}` : "上滑加载更多好物";
        loadMore = true;
      } else {
        //最后1个分类
        loadMoreText = value ? "没有更多商品了" : "上滑加载更多好物";
        loadMore = value ? false : true;
      }
      this.setData({
        loadMore,
        loadMoreText,
      });
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
  },
});
