export const SET_CURRENT_SHIP = "SET_CURRENT_SHIP";
export const SET_DIRECTION = "SET_DIRECTION";
export const CHANGE_SHIP_COUNT = "CHANGE_SHIP_COUNT";
export const SET_OCCUPIED_CELLS = "SET_OCCUPIED_CELLS";
export const SET_POSSIBLE_SHIP = "SET_POSSIBLE_SHIP";
export const SET_PLAYER_SHIPS = "SET_PLAYER_SHIPS";
export const SET_NOT_ALLOWED_POSITIONS = "SET_NOT_ALLOWED_POSITIONS";
export const SET_PLAYER_READY_FLAG = "SET_PLAYER_READY_FLAG";
export const SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE";

export default {
  state: {
    ships: [
      { name: "deck-4", size: 4, count: 1 },
      { name: "deck-3", size: 3, count: 2 },
      { name: "deck-2", size: 2, count: 3 },
      { name: "deck-1", size: 1, count: 4 },
    ],
    currentShip: { name: "deck-4", size: 4, count: 1 },
    notAllowedPositions: [],
    horizontal: true,
    occupiedCells: [],
    possibleShip: [],
    playerShips: {},
    playerReadyFlag: false,
    systemMessage: "",
  },

  mutations: {
    SET_CURRENT_SHIP(state, ship) {
      state.currentShip = ship;
    },

    SET_DIRECTION(state, horizontal) {
      state.horizontal = horizontal;
    },

    CHANGE_SHIP_COUNT(state, ship) {
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

    SET_OCCUPIED_CELLS(state, cells) {
      state.occupiedCells = [...new Set([...state.occupiedCells, ...cells])];
    },

    SET_POSSIBLE_SHIP(state, possibleShip) {
      state.possibleShip = possibleShip;
    },

    SET_PLAYER_SHIPS(state, ship) {
      const newShip = { [ship.name]: [...ship.positions] };
      state.playerShips = { ...state.playerShips, newShip };
    },

    SET_NOT_ALLOWED_POSITIONS(state, positions) {
      state.notAllowedPositions = positions;
    },

    SET_PLAYER_READY_FLAG(state, flag) {
      state.playerReadyFlag = flag;
    },

    SET_SYSTEM_MESSAGE(state, message) {
      state.systemMessage = message;
    },
  },

  getters: {
    getNextShip: (state) => {
      return state.ships.filter((ship) => ship.count !== 0)[0];
    },
  },
};
