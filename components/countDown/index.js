/*
 * @Author: WangLi
 * @Date: 2021-05-11 13:22:17
 * @LastEditors: WangLi
 * @LastEditTime: 2021-05-28 14:02:36
 */
Component({
  properties: {
    end: String, // 结束时间
    end: String, // 倒计时结束回调
    clearTimer: Boolean, // 清除定时器
    format: String, //倒计时类型 h:m:s h:时 m:分 s:秒
  },
  data: {
    time: "",
  },
  ready() {
    this.getFinalTime();
  },
  methods: {
    init() {
      const $this = this;
      setTimeout(() => {
        $this.getFinalTime.call($this);
      }, 1000);
    },
    getFinalTime() {
      const { end, clearTimer, format } = this.data;
      const endTime = Math.ceil(
        (new Date(end).getTime() - new Date().getTime()) / 1000
      ); // 距离结束时间
      let time = format;
      if (endTime > 0) {
        const formateArr = ["h", "m", "s"];
        let lastTime = endTime % 86400;
        const hour = this.formatNum(parseInt(lastTime / 3600));
        lastTime = lastTime % 3600;
        const minute = this.formatNum(parseInt(lastTime / 60));
        const second = this.formatNum(lastTime % 60);
        const returnArr = [hour, minute, second];
        for (let i in returnArr) {
          time = time.replace(formateArr[i], returnArr[i]);
        }
        if (!clearTimer) this.init.call(this);
      } else {
        this.endFn();
      }
      this.setData({
        time: time,
      });
    },
    formatNum(n) {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    },
    endFn() {
      this.triggerEvent("end", {});
    },
  },
});
