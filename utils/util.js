import config from "../config/index";
/**
 * @description: 校验手机号
 * @param {*} str 手机号
 * @return {*}
 */
const cellphoneCheck = (str) => {
  const reg = /^1[0-9]{10}$/;
  return reg.test(str);
};
/**
 * @description: 计算时间差
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 * @return {*} 时间差值
 */
const diffTime = (start, end) => {
  const startTimestamp = new Date(start).getTime();
  const endTimestamp = new Date(end).getTime();
  return endTimestamp - startTimestamp;
};

/**
 * @description: 时间戳转换时间
 * @param {*} date
 * @param {*} format
 * @return {*}
 */
const formatDate = (date, format = "YYYY-MM-DD hh:mm:ss") => {
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
 * 时间戳转化为年 月 日 时 分 秒
 * date: 传入时间 例2021-05-28 12：00：00
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
const transformDate = (date, format = "Y-M-D") => {
  const formateArr = ["Y", "M", "D", "h", "m", "s"];
  let returnArr = [];
  const dateStr = new Date(date);
  returnArr.push(dateStr.getFullYear());
  returnArr.push(formatNumber(dateStr.getMonth() + 1));
  returnArr.push(formatNumber(dateStr.getDate()));

  returnArr.push(formatNumber(dateStr.getHours()));
  returnArr.push(formatNumber(dateStr.getMinutes()));
  returnArr.push(formatNumber(dateStr.getSeconds()));
  for (let i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
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
 * @description: loading提示
 * @param {*} title 提示文字
 * @return {*}
 */
const Loading = (title = "加载中", mask = true) => {
  wx.showLoading({
    title,
    mask,
  });
};

/**
 * @description: hideLoading提示
 * @param {*} title 提示文字
 * @return {*}
 */
const hideLoading = () => {
  wx.hideLoading();
};

/**
 * @description: toast提示
 * @param {*} title 提示文字
 * @return {*}
 */
const Toast = (title = "成功", icon = "none", mask = true) => {
  wx.showToast({
    title,
    icon,
    duration: config.loading,
    mask,
  });
};

/**
 * @description: Modal确认提示
 * @param {*} title 提示标题
 * @param {*} content 提示内容
 * @param {*} confirm 确认回调
 * @param {*} cancel 取消回调
 * @return {*}
 */
const Modal = (values) => {
  const {
    title = "",
    content = "",
    showCancel = true,
    cancelText = "取消",
    cancelColor = "#999",
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
  formatDate,
  transformDate,
  diffTime,
  mathRound,
  Toast,
  Modal,
  Loading,
  hideLoading,
  cellphoneCheck,
};
