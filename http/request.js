/*
 * @Author: WangLi
 * @Date: 2021-04-12 14:06:10
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-03 15:31:07
 */
import config from "../config/index";
import { Toast } from "../utils/util";

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
    const header = {
      Authorization: `Bearer ${wx.getStorageSync("token")}`,
      "content-type": "application/json; charset=utf-8",
      cookie: wx.getStorageSync("sessionid"), //请求携带服务端返回的cookie 解决服务端session跨域
    };
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.baseApi + url,
        data,
        method,
        timeout: config.timeout,
        header,
        success(res) {
          if (res.data.code !== 200) {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000,
              mask: true,
            });
          } else {
            const cookie = res.header["Set-Cookie"];
            if (cookie) {
              wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
            }
          }
          resolve(res.data);
        },
        fail(error) {
          wx.showToast({
            title: "网络繁忙，请稍后重试",
            icon: "none",
            duration: 2000,
            mask: true,
          });
          reject(error);
        },
      });
    });
  }
}

const request = new Request();

module.exports = request;
