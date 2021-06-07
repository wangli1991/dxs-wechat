/*
 * @Author: WangLi
 * @Date: 2021-04-28 13:23:03
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 10:26:09
 */
import { cellphoneCheck, Toast } from "../../utils/util";

const App = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
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
    nameValue: "",
    phoneValue: "",
  },
  lifetimes: {
    attached: function () {
      const { show } = this.properties;
      this.setData({
        isShow: show,
      });
    },
  },
  observers: {
    show: function (value) {
      if (value) {
        const { initialValue } = this.properties;
        this.setData({
          nameValue: initialValue.name,
          phoneValue: initialValue.phone,
        });
        this.openDialog();
      }
    },
  },
  methods: {
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
    nameInputHandle(e) {
      this.setData({
        nameValue: e.detail.value,
      });
    },
    telInputHandle(e) {
      this.setData({
        phoneValue: e.detail.value,
      });
    },
    confirmHandle() {
      const { nameValue, phoneValue } = this.data;
      if (!nameValue) {
        Toast("请填写提货人姓名", "error");
        return;
      } else if (!phoneValue) {
        Toast("请填写手机号", "error");
        return;
      } else if (!cellphoneCheck(phoneValue)) {
        Toast("手机号格式错误", "error");
        return;
      }
      this.triggerEvent("confirm", {
        name: nameValue,
        phone: phoneValue,
      });
      this.setData({
        isShow: false,
      });
    },
  },
});
