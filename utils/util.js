/*
 * @Author: WangLi
 * @Date: 2021-04-06 20:53:18
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 16:19:48
 */
/**
 * @description: 校验手机号
 * @param {*} str 手机号
 * @return {*}
 */
const cellphoneCheck = (str) => {
  const reg = /^1[0-9]{10}$/;
  return reg.test(str);
};

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};
/**
 * @description: 四舍五入保留小数
 * @param {*} value 原始数字
 * @param {*} num 小数位数 默认2
 * @return {*}
 */
const mathRound = (value = 1, num = 2) => {
  return Math.round(value * Math.pow(10, num)) / Math.pow(10, num);
};

/**
 * @description: toast提示
 * @param {*} title 提示文字
 * @return {*}
 */
const toast = (title = "成功", icon) => {
  wx.showToast({
    title,
    icon,
    duration: 2000,
  });
};

/**
 * @description: modal确认提示
 * @param {*} title 提示标题
 * @param {*} content 提示内容
 * @param {*} confirm 确认回调
 * @param {*} cancel 取消回调
 * @return {*}
 */
const modal = (values) => {
  const {
    title = "",
    content = "",
    showCancel = true,
    cancelText = "取消",
    cancelColor = "#000000",
    confirmText = "确认",
    confirmColor = "#576B95",
    confirm = () => {},
    cancel = () => {},
  } = values;
  wx.showModal({
    title,
    content,
    showCancel,
    cancelText,
    cancelColor,
    confirmText,
    confirmColor,
    success(res) {
      if (res.confirm) {
        confirm("确定");
      } else if (res.cancel) {
        cancel("取消");
      }
    },
  });
};
module.exports = {
  formatTime,
  mathRound,
  toast,
  modal,
  cellphoneCheck,
};
