/*
 * @Author: WangLi
 * @Date: 2021-05-06 16:26:57
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-07 14:26:16
 */
import { getListByClassify } from "../../http/api";
const App = getApp();

Page({
  data: {
    orderData: {},
    recomandList: [],
  },
  onShow: function () {
    this.getRecommendList();
  },
  copyHandle() {
    wx.setClipboardData({
      data: "data",
      success(res) {
        wx.showToast({
          title: "复制成功",
          icon: "success",
          duration: 1500,
          mask: true,
        });
      },
    });
  },
  async getRecommendList() {
    const params = {
      classify: 1,
      sort: 1,
      currentPage: 1,
      pageSize: 10,
    };
    const { code, data, msg } = await getListByClassify(params);
    this.setData({ recomandList: data.dataList });
  },
});
