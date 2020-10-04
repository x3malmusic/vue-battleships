import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueSocketIO from "vue-socket.io";
import checkPossibleShip from "./mixins/checkPossibleShip";
import shipCells from "./mixins/shipCells";

Vue.config.productionTip = false;

Vue.mixin(checkPossibleShip);
Vue.mixin(shipCells);

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: "http://localhost:8000",
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
