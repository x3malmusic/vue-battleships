import i18n from "../i18n";
import router from "../router";

export const SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE";
export const FIND_MATCH = "FIND_MATCH";
export const BEGIN_MATCH = "BEGIN_MATCH";

export default {
  setUser(state, player) {
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

  [BEGIN_MATCH](state, shipPositions) {
    // const gameData = {
    //   gameId: this.state.gameData,
    //   playerId,
    //   shipPositions
    // }
    // this._vm.$socket.emit("playerSetShips", gameData);
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
    this._vm.$socket.emit('connectToMatch', gameData.gameId)

    state.game = gameData;
    router.push('/game');
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

    state.playersOnline = data.playersList;
  },

  SOCKET_gameRequestAccepted(state, data) {
    state.systemMessage = {
      text:
        data.from.name + " " + i18n.t("messages.playerAcceptedYourGameRequest"),
      id: Date.now().toLocaleString(),
    };

    state.playersOnline = data.playersList;
  },

  SOCKET_gameRequestDeclined(state, data) {
    state.systemMessage = {
      text:
        data.from.name + " " + i18n.t("messages.playerDeclinedYourGameRequest"),
      id: Date.now().toLocaleString(),
    };

    state.playersOnline = data.playersList;
  },

  SOCKET_connect(state) {
    router.push('/lobby')
  },

  SOCKET_ERROR(state, error) {
    state.systemMessage = {text: error, id: Date.now().toLocaleString()};
  },

  SOCKET_error(state, error) {
    state.systemMessage = {text: error, id: Date.now().toLocaleString()};
  },
};
