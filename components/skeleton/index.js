/*
 * @Author: WangLi
 * @Date: 2021-06-02 17:23:41
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-02 17:56:14
 */
Component({
  properties: {
    selector: {
      type: String,
      value: "skeleton",
    },
    region: {
      type: Object,
    },
    unit: {
      type: String,
      value: "px",
    },
  },
  data: {
    skeletonRegion: {},
  },
  observers: {
    "region.**": function (field) {
      for (let key in field) {
        this.setData({
          [`skeletonRegion.${key}.isShow`]: field[key],
        });
      }
    },
  },
  attached() {
    for (let key in this.data.region) {
      this.data.skeletonRegion[key] = {
        isShow: true,
        skeletonRectLists: [],
        skeletonCircleLists: [],
      };
    }
    //绘制矩形
    this.rectHandle();

    //绘制圆形
    this.radiusHandle();
  },
  methods: {
    rectHandle() {
      const that = this;
      for (let key in this.data.skeletonRegion) {
        wx.createSelectorQuery()
          .selectAll(
            `.${this.data.selector} >>> .${this.data.selector}-${key}-rect`
          )
          .boundingClientRect()
          .exec((res) => {
            that.setData({
              [`skeletonRegion.${key}.skeletonRectLists`]: res[0],
            });
          });
      }
    },
    radiusHandle() {
      const that = this;
      for (let key in this.data.skeletonRegion) {
        wx.createSelectorQuery()
          .selectAll(
            `.${this.data.selector} >>> .${this.data.selector}-${key}-radius`
          )
          .boundingClientRect()
          .exec((res) => {
            that.setData({
              [`skeletonRegion.${key}.skeletonCircleLists`]: res[0],
            });
          });
      }
    },
  },
});
