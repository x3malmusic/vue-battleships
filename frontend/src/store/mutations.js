import i18n from "../i18n";

export const SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE";
export const FIND_MATCH = "FIND_MATCH";

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

  SOCKET_matchCreated(state, { gameData, foundPlayer }) {
    state.isLookingForMatch = false;
    clearInterval(state.pollingInterval);
    state.systemMessage = {
      text: `${foundPlayer.name} is your next enemy!`,
      id: Date.now().toLocaleString(),
    };
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

  SOCKET_ERROR(state, error) {
    state.systemMessage = error;
  },

  SOCKET_error(state, error) {
    console.log(error);
    state.systemMessage = error;
  },
};
