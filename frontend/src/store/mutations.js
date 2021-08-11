import i18n from "../i18n";

export const SET_USER = "SET_USER";
export const SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE";
export const PLAYER_READY_TO_BEGIN_MATCH = "PLAYER_READY_TO_BEGIN_MATCH";
export const UPDATE_PLAYERS = "UPDATE_PLAYERS";
export const INIT_USER_ID = "INIT_USER_ID";
export const SET_IS_LOADING = "SET_IS_LOADING";

export const MAKE_SHOT = "MAKE_SHOT";
export const DISCONNECT_FROM_GAME = "DISCONNECT_FROM_GAME";
export const SET_GAMEDATA = "SET_GAMEDATA";
export const RESET_GAMEDATA = "RESET_GAMEDATA";

export default {
  [SET_USER](state, player) {
    state.player = player;
  },

  [SET_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading;
  },

  [SET_SYSTEM_MESSAGE](state, { name, type }) {
    state.systemMessage = {
      text: `${name ? name + " " : ""}${i18n.t(`messages.${type}`)}`,
      id: Date.now().toLocaleString(),
    };
  },

  [MAKE_SHOT](state, fieldId) {
    const gameData = {
      gameId: this.state.game.gameId,
      oponentId: this.state.game.opponent,
      playerId: this.state.player.id,
      fieldId: fieldId - 1,
    }

    this._vm.$socket.emit("PLAYER_SHOT", gameData);
  },

  [PLAYER_READY_TO_BEGIN_MATCH](state) {
    const gameData = {
      gameId: state.game.gameId,
      playerId: state.player.id,
      shipPositions: state.ship.playerShips,
      shotPositions: state.ship.playerShots
    }

    this._vm.$socket.emit("PLAYER_SET_SHIPS", gameData);
  },

  [DISCONNECT_FROM_GAME](state) {
    this._vm.$socket.emit("DISCONNECT_FROM_GAME", state.game.gameId);
  },

  [SET_GAMEDATA](state, gameData) {
    state.game = gameData;
  },

  [RESET_GAMEDATA](state) {
    state.game = {};
  },

  [UPDATE_PLAYERS](state, players) {
    state.playersOnline = players;
  },

  [INIT_USER_ID](state, userId) {
    state.player.id = userId
  },
};
