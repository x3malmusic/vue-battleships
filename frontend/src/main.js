import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueSocketIO from "vue-socket.io";
import SocketIO from 'socket.io-client'
import checkPossibleShip from "./mixins/checkPossibleShip";
import shipCells from "./mixins/shipCells";
import systemMessage from "./mixins/systemMessage";
import "./assets/styles/main.scss";

Vue.config.productionTip = false;

Vue.mixin(checkPossibleShip);
Vue.mixin(shipCells);
Vue.mixin(systemMessage);

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO(process.env.VUE_APP_URL, { autoConnect: false, query: { auth: JSON.stringify(store.state.player) }}),
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
