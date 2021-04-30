/*
 * @Author: WangLi
 * @Date: 2021-04-12 14:06:37
 * @LastEditors: WangLi
 * @LastEditTime: 2021-04-30 08:22:43
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
export const addCart = (params) => request.post("/cart/add", params);

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
