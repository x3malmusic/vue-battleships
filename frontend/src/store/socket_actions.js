import { SET_SYSTEM_MESSAGE, UPDATE_PLAYERS, INIT_USER_ID, SET_GAMEDATA } from "./mutations";
import router from "../router";
import { YOU_WIN, YOU_LOSE } from "../constants/messages";

export default {
  SOCKET_SYSTEM_MESSAGE({ commit }, { name, type }) {
    commit(SET_SYSTEM_MESSAGE, { name, type })
  },

  SOCKET_UPDATE_PLAYERS({ commit }, players) {
    commit(UPDATE_PLAYERS, players)
  },

  SOCKET_INIT_USER_ID({ commit }, userId) {
    commit(INIT_USER_ID, userId)
  },

  SOCKET_MATCH_CREATED({ commit, state }, { gameData, foundPlayer }) {
    state.isLookingForMatch = false;
    clearInterval(state.pollingInterval);
    this._vm.$socket.emit('CONNECT_TO_MATCH', gameData.gameId);
    commit(SET_GAMEDATA, { ...gameData, opponent: foundPlayer.id, gameHasBegun: false, gameIsOver: false })
    router.push('/game');
  },

  SOCKET_SHOW_PLAYER_SHOT({ state }, { board, whosGo }) {
    state.ship.playerShips = board;
    state.game.whosGo = whosGo;
  },

  SOCKET_SHOW_MY_SHOT({ state }, { shots, whosGo }) {
    state.ship.playerShots = shots;
    state.game.whosGo = whosGo;
  },

  SOCKET_PLAYERS_READY_TO_PLAY({ state }, whosGo) {
    state.game = { ...state.game, whosGo, gameHasBegun: true, gameIsOver: false };
  },

  SOCKET_GAME_OVER({ commit, state }, { winnerId, gameHasBegun, gameIsOver }) {
    const winMessage = { type: YOU_WIN };
    const loseMessage = { type: YOU_LOSE, name: state.game.gameData[winnerId].name };

    const message = state.player.id === winnerId ? winMessage : loseMessage;

    state.game.gameHasBegun = gameHasBegun;
    state.game.gameIsOver = gameIsOver;

    commit(SET_SYSTEM_MESSAGE, message)
  },

  SOCKET_GAME_OVER_BY_DISCONNECT({ state }, { gameHasBegun, gameIsOver }) {
    state.game.gameHasBegun = gameHasBegun;
    state.game.gameIsOver = gameIsOver;
  },

  SOCKET_connect() {
    if (router.history.current.path !== '/lobby') router.push('/lobby');
  },

  SOCKET_ERROR({ state }, error) {
    state.systemMessage = { text: error, id: Date.now().toLocaleString() };
  },

  SOCKET_error({ state }, error) {
    state.systemMessage = { text: error, id: Date.now().toLocaleString() };
  },
}