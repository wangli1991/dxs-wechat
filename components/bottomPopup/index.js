/*
 * @Author: WangLi
 * @Date: 2021-04-15 14:31:41
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-28 13:42:25
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
    },
    show: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    isShow: false,
    animationData: {},
    animationOpacity: {},
  },
  lifetimes: {
    attached: function () {
      this.setData({
        isShow: this.properties.show,
      });
    },
  },
  observers: {
    show: function (value) {
      if (value) {
        this.openPopup();
      }
    },
  },
  methods: {
    closePopup: function () {
      this.triggerEvent("close");
      const options = {
        duration: 100,
      };
      const tranAnimation = wx.createAnimation(options);
      const opaAnimation = wx.createAnimation(options);
      tranAnimation.translateY(300).step();
      opaAnimation.opacity(0).step();
      this.setData({
        tranAnimation: tranAnimation.export(),
        opaAnimation: opaAnimation.export(),
      });
      let timer = setTimeout(() => {
        this.setData({
          isShow: false,
        });
        clearTimeout(timer);
        timer = null;
      }, 300);
    },
    openPopup: function () {
      this.setData({
        isShow: true,
      });
      const options = {
        duration: 150,
      };
      const tranAnimation = wx.createAnimation(options);
      const opaAnimation = wx.createAnimation(options);
      let timer = setTimeout(() => {
        tranAnimation.translateY(0).step();
        opaAnimation.opacity(1).step();
        this.setData({
          tranAnimation: tranAnimation.export(),
          opaAnimation: opaAnimation.export(),
        });
        clearTimeout(timer);
        timer = null;
      }, 0);
    },
  },
});
