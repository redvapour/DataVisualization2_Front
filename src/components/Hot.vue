<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr_left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr_right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat_name" :style="comStyle">{{ catTitle }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null, //echarts的实例对象
      allData: null, //获取的全部数据
      currentIndex: 0,
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
  },
  methods: {
    //初始化图表方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);

      const option = {
        title: {
          text: "丨热销商品销售金额占比统计",
          left: 20,
          top: 20,
        },
        legend: {
          top: "20%",
          icon: "circle",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let tipArray = [];
            params.data.children.forEach(function (item) {
              let childStr = `${item.name}&nbsp;&nbsp;&nbsp;${
                parseInt((item.value / params.value) * 100) + "%"
              }`;
              tipArray.push(childStr);
            });
            return tipArray.join("<br/>");
          },
        },
        series: [
          {
            type: "pie",
            label: {
              // 隐藏文字
              show: false,
            },
            labelLine: {
              // 隐藏线
              show: false,
            },
            emphasis: {
              label: {
                // 高亮显示文字
                show: true,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    //获取数据方法
    async getData() {
      const { data: res } = await this.$http.get("hotproduct");
      this.allData = res;
      //   console.log(res);

      this.updateChart();
    },
    //更新图表方法
    updateChart() {
      // 饼图数据
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            value: item.value,
            name: item.name,
            children: item.children,
          };
        }
      );
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );

      const option = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    // 左翻页方法
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      t;
      his.updateChart();
    },
    // 右翻页方法
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
    // 屏幕适配方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
          },
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize / 1.2,
          itemGap: this.titleFontSize / 1.2,
          textStyle: {
            fontSize: this.titleFontSize / 1.2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
  computed: {
    // 分类名称
    catTitle() {
      if (!this.allData) {
        return "";
      }
      return this.allData[this.currentIndex].name;
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
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

<style lang="less" scoped>
.arr_left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.arr_right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.cat_name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
  font-weight: bold;
}
</style>
