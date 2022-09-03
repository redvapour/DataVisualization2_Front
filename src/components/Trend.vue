<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ "丨    " + title }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-if="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="iteam in selectTypes"
          :key="iteam.key"
          @click="handleSelect(iteam.key)"
        >
          {{ iteam.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize: 0,
      dataType: "map",
      showChoice: false,
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
    // 初始化列表方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme);
      const option = {
        grid: {
          top: "35%",
          left: "3%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "20%",
          icon: "circle",
          left: "5%",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(option);
    },
    // 获取数据的方法
    async getData() {
      const { data: res } = await this.$http.get("trend");
      this.allData = res;
      //   console.log(this.allData);
      this.updateChart();
    },
    // 更新图表的方法
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(221,107,102, 0.5)",
        "rgba(117,154,160, 0.5)",
        "rgba(230,157,135, 0.5)",
        "rgba(141,193,169, 0.5)",
        "rgba(234,126,83,0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(221,107,102, 0)",
        "rgba(117,154,160, 0)",
        "rgba(230,157,135, 0)",
        "rgba(141,193,169, 0)",
        "rgba(234,126,83, 0)",
      ];
      // x轴数据
      const timeArrs = this.allData.common.month;
      //y轴数据
      //map代表地区销量，seller代表商家销量趋势，commodity代表销量趋势
      //   const valueArrs = this.allData.map.data;
      const valueArrs = this.allData[this.dataType].data;
      // 将数据处理为series数组
      const seriesArr = valueArrs.map((item, index) => {
        return {
          type: "line",
          name: item.name,
          data: item.data,
          stack: this.dataType, //堆叠图
          smooth: true, //平滑曲线
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      const legendArr = valueArrs.map((item) => item.name);
      //   console.log(legendArr);
      const option = {
        xAxis: {
          data: timeArrs,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(option);
    },
    // 获取选择类目方法
    handleSelect(key) {
      this.dataType = key;
      this.updateChart();
      this.showChoice = false;
      //   console.log(key);
    },
    // 屏幕适配方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const option = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(option);
      this.chartInstance.resize();
    },
  },
  computed: {
    selectTypes() {
      if (!this.allData || !this.allData.type) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.dataType;
        });
      }
    },
    title() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.dataType].title;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize / 2 + "px",
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
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-item {
    cursor: pointer;
  }
}
</style>
