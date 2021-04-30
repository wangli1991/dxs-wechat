/*
 * @Author: WangLi
 * @Date: 2021-04-12 14:06:10
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 16:01:34
 */
import config from "../config/index";
class Request {
  constructor(parms) {}
  get(url, data) {
    return this.request("GET", url, data);
  }
  post(url, data) {
    return this.request("POST", url, data);
  }
  put(url, data) {
    return this.request("PUT", url, data);
  }
  delete(url, data) {
    return this.request("DELETE", url, data);
  }
  request(method, url, data) {
    const vm = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.baseApi + url,
        data,
        method,
        timeout: config.timeout,
        header: { Authorization: `Bearer ${wx.getStorageSync("token")}` },
        success(res) {
          resolve(res.data);
        },
        fail() {
          wx.showToast({
            title: "网络繁忙，请稍后重试",
            icon: "error",
            duration: 2000,
            mask: true,
          });
        },
      });
    });
  }
}

const request = new Request();

module.exports = request;
