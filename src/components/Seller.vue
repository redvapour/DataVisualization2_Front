<template>
  <div class="com-container" ref="seller_ref">Seller组件</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null, //echarts的实例对象
      allData: [], //获取的全部数据
      currentPage: 1, //当前页
      totalPage: 0, //总页数，收到数据数目/5 + 1
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
    clearInterval(this.timerId);
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    //初始化图表方法
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.seller_ref,
        this.theme
      );
      // 初始化图标配置 ==> 与数据无关的配置项
      const option = {
        title: {
          text: "丨 商家销量排行",
          left: 20,
          top: 20,
          textStyle: {
            textStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPoint: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 66,
              color: "#2d3443",
            },
          },
        },
        xAxis: {
          type: "value",
          max: 250,
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            label: {
              show: true,
              position: "right",
              color: "#fff",
            },
            barWidth: 33,
            itemStyle: {
              borderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#dd6b66",
                },
                {
                  offset: 1,
                  color: "#e69d87",
                },
              ]),
            },
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(option);
      // 检测鼠标移入移除，开启或关闭动画
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    //获取数据方法
    async getData() {
      const { data: res } = await this.$http.get("seller");
      this.allData = res;
      // console.log(res);

      // 对收到的数据进行排列
      this.allData.sort((a, b) => a.value - b.value);
      // 计算总页数
      let tem = this.allData.length;
      this.totalPage =
        tem % 5 === 0 ? parseInt(tem / 5) : parseInt(tem / 5 + 1);
      // console.log(this.totalPage);
      this.updateChart();
      this.startInterval(); //开启动画
    },
    //更新图表方法
    updateChart() {
      // 根据当前页截取要展示的数据
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);

      const sellerNames = showData.map((iteam) => iteam.name);
      const sellerValues = showData.map((iteam) => iteam.value);
      const option = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    //开启动画方法
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        // console.log(this.currentPage++);

        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    // 屏幕适配方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              borderRadius: [
                0,
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
              ],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
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
