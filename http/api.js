/*
 * @Author: WangLi
 * @Date: 2021-04-12 14:06:37
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-13 04:41:23
 */
import request from "./request";

//微信登陆
export const wxLogin = (params) => request.post("/user/wxLogin", params);

//获取分类数据
export const getClassifyList = (params) =>
  request.post("/classify/list", params);

//获取筛选排序数据
export const getSortList = (params) => request.post("/sort/list", params);

//获取筛选排序商品数据
export const getListByClassify = (params) =>
  request.post("/product/listByClassify", params);

//获取商品信息数据
export const getProductById = (params) =>
  request.post("/product/productById", params);

//购物车添加
export const creatCart = (params) => request.post("/cart/creat", params);

//购物车更新
export const updateCart = (params) => request.post("/cart/update", params);

//购物车删除
export const deleteCart = (params) => request.post("/cart/delete", params);

//查询购物车数据
export const getCartList = (params) => request.post("/cart/list", params);

//查询购物车数据
export const getCartCount = (params) => request.post("/cart/count", params);

//查询下单数据
export const getPlaceList = (params) =>
  request.post("/order/placeList", params);

//商品下单
export const creatOrder = (params) => request.post("/order/creat", params);

//查询商品订单列表数据
export const getOrderList = (params) => request.post("/order/list", params);

//查询默认收货人信息
export const getReceiverInfo = (uid) =>
  request.get("/user/receiver/info", { userId: uid });
