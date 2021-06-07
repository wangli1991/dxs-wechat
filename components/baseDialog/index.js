/*
 * @Author: WangLi
 * @Date: 2021-04-28 13:23:03
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 09:13:44
 */
const App = getApp();
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    initialValue: {
      type: Object,
    },
  },
  data: {
    isShow: false,
    inputValue: 1,
  },
  lifetimes: {
    attached: function () {
      this.setData({
        winHei: App.globalData.windowHeight,
        navHeight: App.globalData.navHeight,
        isShow: this.properties.show,
      });
    },
  },
  observers: {
    show: function (value) {
      if (value) {
        this.openDialog();
      }
    },
  },
  methods: {
    focusHandle() {
      const { winHei, navHeight } = this.data;
      const options = {
        duration: 1,
      };
      const tranAnimation = wx.createAnimation(options);
      tranAnimation.top(winHei / 2 - navHeight).step();
      this.setData({
        tranAnimation: tranAnimation.export(),
      });
    },
    blurHandle() {
      const { winHei } = this.data;
      const options = {
        duration: 1,
      };
      const tranAnimation = wx.createAnimation(options);
      tranAnimation.top(winHei / 2).step();
      this.setData({
        tranAnimation: tranAnimation.export(),
      });
    },
    closeDialog() {
      this.triggerEvent("close");
      this.setData({
        isShow: false,
      });
    },
    openDialog() {
      this.setData({
        isShow: true,
      });
    },
    keyInputHandle(e) {
      this.setData({
        inputValue: e.detail.value,
      });
    },
    confirmHandle() {
      const { initialValue, inputValue } = this.data;
      const data = Object.assign({}, initialValue, {
        count: Number(inputValue),
      });
      this.triggerEvent("confirm", data);
      this.setData({
        isShow: false,
      });
    },
  },
});
