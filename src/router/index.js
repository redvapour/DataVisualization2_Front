import Vue from "vue";
import VueRouter from "vue-router";

import SellerPage from "../views/SellerPage.vue";
import TrendPage from "../views/TrendPage.vue";
import MapPage from "../views/MapPage.vue";
import RankPage from "../views/RankPage.vue";
import HotPage from "../views/HotPage.vue";
import StockPage from "../views/StockPage.vue";
import HomePage from "../views/HomePage.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/sellerpage",
    component: SellerPage,
  },
  {
    path: "/TrendPage",
    component: TrendPage,
  },
  {
    path: "/MapPage",
    component: MapPage,
  },
  {
    path: "/RankPage",
    component: RankPage,
  },
  {
    path: "/HotPage",
    component: HotPage,
  },
  {
    path: "/StockPage",
    component: StockPage,
  },
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/HomePage",
    component: HomePage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
