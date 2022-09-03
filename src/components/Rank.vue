<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null, //echarts的实例对象
      allData: null, //获取的全部数据
      startValue: 0,
      endValue: 9,
      timerId: null,
      titleFontSize: 0,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
  },
  methods: {
    //初始化图表方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme);

      const option = {
        title: {
          text: "丨地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          bottom: "5%",
          right: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
          max: "400",
        },
        series: [
          {
            type: "bar",
            itemStyle: {},
          },
        ],
      };
      this.chartInstance.setOption(option);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    //获取数据方法
    async getData() {
      const { data: res } = await this.$http.get("rank");
      this.allData = res;
      //   console.log(res);

      //   排个序
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updateChart();
      this.startInterval();
    },
    //更新图表方法
    updateChart() {
      const colorArr = [
        ["#f6d365", "#ff0844"],
        ["#fee140", "#fa709a"],
        ["#f6d365", "#fda085"],
      ];
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const option = {
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    // 开启动画
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 3000);
    },

    // 屏幕适配方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      //   console.log(this.titleFontSize);
      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              borderRadius: [15, 15, 0, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(option);
      this.chartInstance.resize();
    },
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.chartInstance.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕的适配
      this.updateChart(); // 更新图表的展示
    },
  },
};
</script>

<style lang="less" scoped></style>
