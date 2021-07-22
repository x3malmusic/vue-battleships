import i18n from "../i18n";
import router from "../router";

export const SET_USER = "SET_USER";
export const SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE";
export const FIND_MATCH = "FIND_MATCH";
export const PLAYER_READY_TO_BEGIN_MATCH = "PLAYER_READY_TO_BEGIN_MATCH";

export const MAKE_SHOT = "MAKE_SHOT";
export const DISCONNECT_FROM_GAME = "DISCONNECT_FROM_GAME";
export const RESET_GAMEDATA = "RESET_GAMEDATA";

export default {
  [SET_USER](state, player) {
    state.player = player;
  },

  [SET_SYSTEM_MESSAGE](state, message) {
    state.systemMessage = message;
  },

  [FIND_MATCH](state, socket) {
    state.isLookingForMatch = true;
    const player = { name: state.player.name, id: state.player.id };
    let triesNumber = 0;
    state.pollingInterval = setInterval(() => {
      if (triesNumber > 4) {
        clearInterval(state.pollingInterval);
        state.isLookingForMatch = false;
        state.systemMessage = {
          text: "No players found, please try again",
          id: Date.now().toLocaleString(),
        };
      } else {
        socket.emit("findMatch", player);
        triesNumber++;
      }
    }, 2000);
  },

  [MAKE_SHOT](state, fieldId) {
    const gameData = {
      gameId: this.state.game.gameId,
      oponentId: this.state.game.opponent,
      playerId: this.state.player.id,
      fieldId: fieldId - 1,
    }

    this._vm.$socket.emit("playerShot", gameData);
  },

  [PLAYER_READY_TO_BEGIN_MATCH](state) {
    const gameData = {
      gameId: state.game.gameId,
      playerId: state.player.id,
      shipPositions: state.ship.playerShips,
      shotPositions: state.ship.playerShots
    }

    this._vm.$socket.emit("playerSetShips", gameData);
  },

  [DISCONNECT_FROM_GAME](state) {
    this._vm.$socket.emit("disconnectFromGame", state.game.gameId);
  },

  [RESET_GAMEDATA](state) {
    state.game = {};
  },

  SOCKET_initUserId(state, userId) {
    state.player.id = userId
  },

  SOCKET_matchCreated(state, { gameData, foundPlayer }) {
    state.isLookingForMatch = false;
    clearInterval(state.pollingInterval);
    state.systemMessage = {
      text: `${foundPlayer.name} is your next enemy!`,
      id: Date.now().toLocaleString(),
    };
    this._vm.$socket.emit('connectToMatch', gameData.gameId);
    state.game = { ...gameData, opponent: foundPlayer.id, gameHasBegun: false, gameIsOver: false };
    router.push('/game');
  },

  SOCKET_showPlayerShot(state, { board, whosGo }) {
    state.ship.playerShips = board;
    state.game.whosGo = whosGo;
  },

  SOCKET_enemyShipStatus(state, enemyShip) {
    state.systemMessage = {
      text: enemyShip,
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_showMyShot(state, { shots, whosGo }) {
    state.ship.playerShots = shots;
    state.game.whosGo = whosGo;
  },

  SOCKET_playersReadyToPlay(state, whosGo) {
    state.game = { ...state.game, whosGo, gameHasBegun: true, gameIsOver: false };
  },

  SOCKET_updatePlayers(state, players) {
    state.playersOnline = players;
  },

  SOCKET_gameRequest(state, from) {
    state.systemMessage = {
      text: from.name + " " + i18n.t("messages.playerSendRequest"),
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_gameRequestCanceled(state, data) {
    state.systemMessage = {
      text: data.from.name + " " + i18n.t("messages.playerCancelRequest"),
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_gameRequestAccepted(state, data) {
    state.systemMessage = {
      text:
        data.from.name + " " + i18n.t("messages.playerAcceptedYourGameRequest"),
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_gameRequestDeclined(state, data) {
    state.systemMessage = {
      text:
        data.from.name + " " + i18n.t("messages.playerDeclinedYourGameRequest"),
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_systemMessage(state, messageType) {
    state.systemMessage = {
      text: i18n.t(`messages.${messageType}`),
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_gameOver(state, { winnerId, gameHasBegun, gameIsOver }) {
    const winMessage = i18n.t("messages.youWin");
    const loseMessage = `${state.game.gameData[winnerId].name} ${i18n.t("messages.youLose")}`;

    const message = state.player.id === winnerId ? winMessage : loseMessage;

    state.game.gameHasBegun = gameHasBegun;
    state.game.gameIsOver = gameIsOver;

    state.systemMessage = { text: message, id: Date.now().toLocaleString() };
  },

  SOCKET_gameOverByDisconnect(state, { gameHasBegun, gameIsOver }) {
    state.game.gameHasBegun = gameHasBegun;
    state.game.gameIsOver = gameIsOver;
  },

  SOCKET_connect() {
    if(router.history.current.path !== '/lobby') router.push('/lobby');
  },

  SOCKET_ERROR(state, error) {
    state.systemMessage = { text: error, id: Date.now().toLocaleString() };
  },

  SOCKET_error(state, error) {
    state.systemMessage = { text: error, id: Date.now().toLocaleString() };
  },
};
