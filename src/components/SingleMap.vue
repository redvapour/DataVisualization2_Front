<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { getProvinceMapInfo } from "../utils/map_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize: 0,
      mapColorIndex: 0,
    };
  },
  mounted() {
    this.initChart();
    this.getScatterData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    // 初始化列表方法
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      // 获取地图数据
      const { data: mapData } = await axios.get(
        "http://127.0.0.1:8888/static/map/china.json"
      );
      // console.log(mapData);
      // 注册地图数据
      this.$echarts.registerMap("china", mapData);
      const mapColor = ["#68768f", "#ffc992"];
      const option = {
        title: {
          text: "丨商家分布",
          left: 20,
          top: 20,
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: mapColor[this.mapColorIndex % 2 === 0 ? 0 : 1],
            borderColor: "#333",
          },
        },
      };

      this.chartInstance.setOption(option);
      this.chartInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        const { data: res } = await axios.get(
          "http://127.0.0.1:8888" + provinceInfo.path
        );
        this.$echarts.registerMap(provinceInfo.key, res);

        this.chartInstance.setOption({
          geo: {
            map: provinceInfo.key,
          },
        });
        this.getScatterData();
      });
    },
    // 双击返回中国地图方法
    revertMap() {
      this.chartInstance.setOption({
        geo: {
          map: "china",
        },
      });
    },
    // 获取散点数据的方法
    async getScatterData() {
      const { data: res } = await this.$http.get("map");
      this.allData = res;
      // console.log(this.allData);
      this.updateChart();
    },
    // 更新图表的方法
    updateChart() {
      // 图例数据
      const legendData = this.allData.map((item) => item.name);
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          coordinateSystem: "geo",
          name: item.name,
          data: item.children,
        };
      });
      const option = {
        legend: {
          data: legendData,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(option);
    },

    // 屏幕适配方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
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
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.chartInstance.dispose(); // 销毁当前的图表
      this.mapColorIndex++;
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕的适配
      this.updateChart(); // 更新图表的展示
    },
  },
};
</script>

<style></style>
