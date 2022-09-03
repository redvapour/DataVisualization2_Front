import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 全局引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
// 注册echarts主题
import chalk from "./assets/theme/dark.json";
import vintage from "./assets/theme/vintage.json";
echarts.registerTheme("dark", chalk);
echarts.registerTheme("vintage", vintage);
// 引入字体图标
import "./assets/font/iconfont.css";
// 全局引入axios，并设置基础路径
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8080/api/";
Vue.prototype.$http = axios;
// console.log(Vue.prototype);

import moment from "moment";
Vue.prototype.$moment = moment;
// 全局样式
import "./assets/css/global.less";
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
