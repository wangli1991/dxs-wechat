/*
 * @Author: WangLi
 * @Date: 2021-04-14 09:52:20
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-29 06:01:00
 */

const routes = require("./routes.js");

function push(name, data, events) {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.navigateTo({
    url: `${url}?encodedData=${dataStr}`,
    success: function (res) {
      res.eventChannel.emit("key", data);
    },
  });
}

function replace(name, data) {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.redirectTo({
    url: `${url}?encodedData=${dataStr}`,
  });
}

function replaceAll(name, data) {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.reLaunch({
    url: `${url}?encodedData=${dataStr}`,
  });
}

function pushTab(name) {
  const route = routes[name];
  const url = route ? route : `/pages/${name.replace(/\./g, "/")}/index`;
  wx.switchTab({
    url: `${url}`,
  });
}

function back(data) {
  wx.navigateBack({
    delta: data,
  });
}

function extract(options) {
  return JSON.parse(decodeURIComponent(options.encodedData));
}

module.exports = {
  push,
  replace,
  replaceAll,
  pushTab,
  back,
  extract,
};
