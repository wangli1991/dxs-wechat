const App = getApp();

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  properties: {
    scrollTop: {
      type: [String, Number],
    },
    refresherEnable: {
      type: Boolean,
      value: true,
    },
    refresherType: {
      type: String,
      value: "default",
    },
    lowerThreshold: {
      type: Number,
      value: 45,
    },
    refresherColor: {
      type: String,
      value: "black",
    },
    refresherBackground: {
      type: String,
      value: "#FFF",
    },
    loadType: {
      type: String,
      value: "default",
    },
    pullText: {
      type: String,
      value: "下拉刷新",
    },
    releaseText: {
      type: String,
      value: "松开立即刷新",
    },
    refreshText: {
      type: String,
      value: "正在刷新",
    },
    loadmoreText: {
      type: String,
      value: "加载中",
    },
    nomoreText: {
      type: String,
      value: "到底了",
    },
    refresherThreshold: {
      type: Number,
      value: 50,
    },
    refreshing: {
      type: Boolean,
      value: false,
      observer: "_onRefreshFinished",
    },
    scrollY: {
      type: Boolean,
      value: true,
    },
    nomore: {
      type: Boolean,
      value: false,
    },
    showLoading: {
      type: Boolean,
      value: true,
    },
    scrollIntoView: {
      type: String,
      value: "",
    },
    scrollWithAnimation: {
      type: Boolean,
      value: false,
    },
    backTopEnable: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    pullState: 0,
    lastScrollEnd: 0,
    scrollTop: 0,
    isLoadMore: false,
    showBackTop: false,
  },
  lifetimes: {
    attached() {
      this.setData({
        windowHeight: App.globalData.windowHeight,
      });
    },
  },
  methods: {
    //滚动事件
    _onScroll: function (e) {
      this.triggerEvent("scroll", e);
      const { windowHeight } = this.data;
      const scrollTop = e.detail.scrollTop;
      if (scrollTop > windowHeight) {
        this.setData({
          showBackTop: true,
        });
      } else {
        this.setData({
          showBackTop: false,
        });
      }
    },
    //被下拉
    _onPulling: function (e) {
      let y = e.detail.dy;
      if (y < this.properties.refresherThreshold) {
        this.setData({
          pullState: 0,
        });
      } else {
        this.setData({
          pullState: 1,
        });
      }
      this.triggerEvent("refresherpulling", this.data.pullState);
    },
    //滚动到顶部
    _onScrollTop: function (e) {
      this.triggerEvent("scrolltoupper", e);
      this.setData({
        showBackTop: false,
      });
    },
    //下拉刷新复位
    _onClose: function (e) {
      this.triggerEvent("refresherrestore", e);
    },
    //下拉刷新执行
    _onRefresh: function (e) {
      this.setData({
        pullState: 2,
      });
      this.triggerEvent("refresherrefresh", e);
    },
    //滚动到底部
    _onLoadmore: function (e) {
      this.triggerEvent("scrolltolower", e);
      if (!this.properties.nomore && !this.properties.refreshing) {
        this.triggerEvent("lower", e);
      }
    },
    _backTopHandle() {
      this.setData({
        scrollTop: 0,
      });
    },
  },
});
