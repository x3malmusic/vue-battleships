export const SET_CURRENT_SHIP = "SET_CURRENT_SHIP";
export const SET_DIRECTION = "SET_DIRECTION";
export const CHANGE_SHIP_COUNT = "CHANGE_SHIP_COUNT";
export const SET_OCCUPIED_CELLS = "SET_OCCUPIED_CELLS";
export const SET_POSSIBLE_SHIP = "SET_POSSIBLE_SHIP";
export const SET_PLAYER_SHIPS = "SET_PLAYER_SHIPS";
export const SET_NOT_ALLOWED_POSITIONS = "SET_NOT_ALLOWED_POSITIONS";
export const SET_PLAYER_READY_FLAG = "SET_PLAYER_READY_FLAG";
export const SET_PLAYER_SHIPS_ARE_SET = "SET_PLAYER_SHIPS_ARE_SET";
export const SET_RESET_SHIPS = "SET_RESET_SHIPS";
export const INITIALIZE_BOARD = "INITIALIZE_BOARD";

const initCurrentShip = { name: "deck-4", size: 4, count: 1 };
const initShips = [
  { name: "deck-4", size: 4, count: 1 },
  { name: "deck-3", size: 3, count: 2 },
  { name: "deck-2", size: 2, count: 3 },
  { name: "deck-1", size: 1, count: 4 },
];

export default {
  state: {
    ships: [...initShips],
    currentShip: { ...initCurrentShip },
    horizontal: true,
    notAllowedPositions: [],
    occupiedCells: [],
    possibleShip: [],
    playerShips: [],
    playerShots: [],
    playerShipsAreSet: false,
    playerReadyFlag: false,
    resetShipsSwitch: false,
  },

  mutations: {
    [SET_CURRENT_SHIP](state, ship) {
      state.currentShip = ship;
    },

    [INITIALIZE_BOARD](state) {
      state.playerShips = [];
      state.playerShots = [];
      for (let i = 1; i < 101; i++) {
        state.playerShips.push({ className: "", id: i });
        state.playerShots.push({ className: "", id: i });
      }
    },

    [SET_DIRECTION](state, horizontal) {
      state.horizontal = horizontal;
    },

    [CHANGE_SHIP_COUNT](state, ship) {
      state.ships = state.ships.map((stateShip) => {
        if (stateShip.name === ship.name && stateShip.count !== 0) {
          const newShip = {
            ...stateShip,
            count: stateShip.count - 1,
          };
          state.currentShip = newShip;
          return newShip;
        }
        return stateShip;
      });
    },

    [SET_OCCUPIED_CELLS](state, cells) {
      state.occupiedCells = [...new Set([...state.occupiedCells, ...cells])];
    },

    [SET_POSSIBLE_SHIP](state, possibleShip) {
      state.possibleShip = possibleShip;
    },

    [SET_PLAYER_SHIPS](state, ship) {
      const newShip = { [ship.name]: [...ship.positions] };
      state.playerShips = { ...state.playerShips, newShip };
    },

    [SET_NOT_ALLOWED_POSITIONS](state, positions) {
      state.notAllowedPositions = positions;
    },

    [SET_PLAYER_READY_FLAG](state, flag) {
      state.playerReadyFlag = flag;
    },

    [SET_PLAYER_SHIPS_ARE_SET](state, flag) {
      state.playerShipsAreSet = flag;
    },

    [SET_RESET_SHIPS](state, flag) {
      state.resetShipsSwitch = flag;
      state.occupiedCells = [];
      state.playerReadyFlag = false;
      state.playerShipsAreSet = false;
      state.currentShip = { ...initCurrentShip };
      state.ships = [...initShips];
      this.commit(INITIALIZE_BOARD);
    },
  },

  getters: {
    getNextShip: (state) => {
      return state.ships.filter((ship) => ship.count !== 0)[0];
    },
  },
};
