/*
 * @Author: WangLi
 * @Date: 2021-04-28 13:23:03
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 16:26:49
 */
import { cellphoneCheck, toast } from "../../utils/util";
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
    telValue: "",
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
        telValue: e.detail.value,
      });
    },
    confirmHandle() {
      const { initialValue, nameValue, telValue } = this.data;
      if (!nameValue) {
        toast("请填写提货人姓名", "error");
        return;
      } else if (!telValue) {
        toast("请填写手机号", "error");
        return;
      } else if (!cellphoneCheck(telValue)) {
        toast("手机号格式错误", "error");
        return;
      }
      this.triggerEvent("confirm", {
        name: nameValue,
        tel: telValue,
      });
      this.setData({
        isShow: false,
      });
    },
  },
});
