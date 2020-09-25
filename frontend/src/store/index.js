import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ships: [
      { name: "deck-4", size: 4, count: 1 },
      { name: "deck-3", size: 3, count: 2 },
      { name: "deck-2", size: 2, count: 3 },
      { name: "deck-1", size: 1, count: 4 },
    ],
    currentShip: { name: "deck-4", size: 4, count: 1 },
    horizontal: true,
    occupiedCells: [],
    possibleShip: [],
    playerShips: {}

  },
  mutations: {
    ...mutations,
  },
  actions: {},
  modules: {},
  getters: {
    getNextShip: (state) => {
      return state.ships.filter((ship) => ship.count !== 0)[0];
    },
  },
});
