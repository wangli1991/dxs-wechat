/*
 * @Author: WangLi
 * @Date: 2021-05-27 10:34:22
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-27 15:51:23
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    dir: {
      type: String,
      value: "right",
    },
  },
  data: {
    style: "",
  },
  lifetimes: {
    attached() {
      const { dir } = this.properties;
      this.setData({
        style: dir === "left" ? "left:40rpx" : "right:40rpx",
      });
    },
  },
  methods: {
    backTop() {
      this.triggerEvent("backtop");
    },
  },
});
