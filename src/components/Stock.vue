<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null, //echarts的实例对象
      allData: null, //获取的全部数据
      currentIndex: 0,
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
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme);
      const option = {
        title: {
          text: "丨库存销售量",
          left: 20,
          top: 20,
        },
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
      const { data: res } = await this.$http.get("stock");
      this.allData = res;
      //   console.log(res);

      this.updateChart();
      this.startInterval();
    },
    //更新图表方法
    updateChart() {
      // 圆环中心点
      const centerPointers = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArrs = [
        ["#f6d365", "#ff0844"],
        ["#fee140", "#fa709a"],
        ["#f6d365", "#fda085"],
        ["#E8821C", "#E55445"],
        ["#f6d365", "#E55445"],
      ];

      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      //   const showData = this.allData.slice(0, 5);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          // radius: [110, 90],
          center: centerPointers[index],
          //hoverAnimation: false, // 关闭鼠标移入到饼图时的动画效果
          labelLine: {
            show: false, // 隐藏指示线
          },
          //==========================就是不显示label======================//
          label: {
            show: true,
            position: "center", //换成inside就可以，center就不显示
            color: colorArrs[index][0],
          },
          data: [
            {
              name: item.name + "\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArrs[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArrs[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const option = {
        series: seriesArr,
      };
      this.chartInstance.setOption(option);
    },
    // 开启动画方法
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 3000);
    },
    // 屏幕适配方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const innerRadius = this.titleFontSize * 2.8;
      const outterRadius = innerRadius * 1.25;
      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
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
