/*
 * @Author: WangLi
 * @Date: 2021-04-14 09:52:20
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-18 15:51:36
 */

const routes = require("./routes.js");

const push = (name, data) => {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.navigateTo({
    url: `${url}?encodedData=${dataStr}`,
    success: function (res) {
      res.eventChannel.emit("key", data);
    },
  });
};

const replace = (name, data) => {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.redirectTo({
    url: `${url}?encodedData=${dataStr}`,
  });
};

const replaceAll = (name, data) => {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.reLaunch({
    url: `${url}?encodedData=${dataStr}`,
  });
};

const pushTab = (name, page) => {
  wx.setStorageSync("tabbar", Number(page.pageIndex));
  replaceAll(name, { page });
};

const back = (data) => {
  wx.navigateBack({
    delta: data,
  });
};

const extract = (options) => {
  return JSON.parse(decodeURIComponent(options.encodedData));
};

module.exports = {
  push,
  replace,
  replaceAll,
  pushTab,
  back,
  extract,
};
