import Vue from "vue";
import Vuex from "vuex";

import mutations from "./mutations";
import actions from "./actions";
import { getPlayer } from "../services/player";

import ship from "./modules/ship";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    player: getPlayer() || {},
    playersOnline: [],
    isLookingForMatch: false,
    pollingInterval: null,
    systemMessage: "",
    game: {},
  },
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions
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
