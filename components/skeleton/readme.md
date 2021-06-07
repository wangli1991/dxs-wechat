<!--
 * @Author: WangLi
 * @Date: 2021-06-02 17:26:22
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 17:30:46
-->

| Options  | Type   | Required | Default | Description                                                                                                                                 |
| -------- | ------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| selector | String | No       | skelton | 渲染节点的标识前缀，比如 selector="sk"，那么页面根节点就是 class="sk"绘制矩形就是 class="sk-region-rect"，圆形就是 class="sk-region-radius" |
| unit     | String | No       | px      | 骨架屏单位，默认 px                                                                                                                         |
| region   | Object | Yes      | --      | 骨架屏渲染区域，可按需分块展示/隐藏骨架屏                                                                                                   |

#### 1.在 wxml 页面需要用到的地方使用，如下：

```
<!--引入骨架屏模版 -->
<skeleton selector="sk"
          unit="px"
          region="{{region}}"></skeleton>

<!--index.wxml-->
<!--给页面根节点class添加skeleton, 用于获取当前页面尺寸，没有的话就默认使用屏幕尺寸-->
<view class="box sk">
    <view class="logo">
        <image class="img sk-header-radius" src="{{header.logo}}"></image>
    </view>
    <view class="title">
        <text class="sk-header-rect">{{header.title}}</text>
    </view>
    <parent feature="{{feature}}"></parent>
    <view class="item">
        <view class="title_sub">非骨架屏生成区域</view>
        <view>这是一块没有骨架屏遮盖区域</view>
    </view>
</view>
```

#### 2.在 js 页面需要用到的地方使用，如下：

```
//index.js
//初始化默认的数据，用于撑开页面结构，让骨架屏可以获取到整体的页面结构
Page({
	data: {
		region: {		//骨架屏区域
			header: true,
			lists: true
		},
		header: {
			logo: '../../images/logo.png',
			title: 'skeleton'
		},
		feature: {
			title: '特性',
			lists: [
				'1.运行时渲染，支持动态生成骨架屏',
				'2.支持分块渲染，渐进式展示页面',
				'3.支持多种骨架屏动画',
				'4.支持npm',
			]
		}
	},
	onLoad: function () {
    //隐藏header区域的骨架屏
		setTimeout(() => {
			that.setData({
				'region.header': false
			})
		}, 2000)
    //隐藏lists区域的骨架屏
		setTimeout(() => {
			that.setData({
				'region.lists': false
			})
		}, 3000)
	}
})
```
