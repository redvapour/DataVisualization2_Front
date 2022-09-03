import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    theme: "dark",
  },
  getters: {},
  mutations: {
    changeTheme(state) {
      if (state.theme === "dark") {
        state.theme = "vintage";
      } else {
        state.theme = "dark";
      }
    },
  },
  actions: {},
  modules: {},
});
