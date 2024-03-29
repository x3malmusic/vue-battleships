import Vue from "vue";
import Vuex from "vuex";

import mutations from "./mutations";
import actions from "./actions";
import socketActions from "./socket_actions";
import ship from "./modules/ship";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    player: {},
    playerStats: {},
    lastGame: {},
    playersOnline: [],
    isLoading: false,
    isLookingForMatch: false,
    pollingInterval: null,
    systemMessage: "",
    game: {},
  },
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
    ...socketActions
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
