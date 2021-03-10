import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";

import ship from "./modules/ship";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    player: {},
    playersOnline: [],
    isLookingForMatch: false,
    pollingInterval: null,
    systemMessage: "",
  },
  mutations: {
    ...mutations,
  },
  modules: { ship },
  getters: {
    playersOnlineFiltered: (state) => {
      return state.playersOnline.filter(
        (player) => player.name !== state.player.name
      );
    },
  },
});
