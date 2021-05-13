/*
 * @Author: WangLi
 * @Date: 2021-04-12 14:00:42
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-11 13:09:46
 */
const config = {
  // 远端地址，上线切换
  // serverPath: 'https://xxx.com/xx/',
  // 本地地址
  baseApi: "http://127.0.0.1:8888",
  timeout: 5000,
  classifyPageSize: 10,
  orderEmpty: "您还未买过任何商品",
  cartEmpty: "你的购物车空空如也",
  payTime: 600000, //支付时间倒计时 单位毫秒
};
export default config;
