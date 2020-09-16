import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import checkPossibleShip from "./mixins/checkPossibleShip";
import shipCells from "./mixins/shipCells";

Vue.config.productionTip = false;

Vue.mixin(checkPossibleShip);
Vue.mixin(shipCells);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
