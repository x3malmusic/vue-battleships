import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ships: [
      { name: "deck-4", size: 4 },
      { name: "deck-3", size: 3 },
      { name: "deck-2", size: 2 },
      { name: "deck-1", size: 1 },
    ],
    currentShip: { name: "deck-4", size: 4 },
    direction: true,
  },
  mutations: {
    ...mutations,
  },
  actions: {},
  modules: {},
});
