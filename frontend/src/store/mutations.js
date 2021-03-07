import i18n from "../i18n";

export const SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE";

export default {
  setUser(state, player) {
    state.player = player;
  },

  [SET_SYSTEM_MESSAGE](state, message) {
    state.systemMessage = message;
  },

  SOCKET_updatePlayers(state, players) {
    state.playersOnline = players;
  },

  SOCKET_gameRequest(state, from) {
    state.ship.systemMessage = {
      text: from.name + " " + i18n.t("messages.playerSendRequest"),
      id: Date.now().toLocaleString(),
    };
  },

  SOCKET_gameRequestCanceled(state, data) {
    state.ship.systemMessage = {
      text: data.from.name + " " + i18n.t("messages.playerCancelRequest"),
      id: Date.now().toLocaleString(),
    };

    state.playersOnline = data.playersList;
  },

  SOCKET_gameRequestAccepted(state, data) {
    state.ship.systemMessage = {
      text:
        data.from.name + " " + i18n.t("messages.playerAcceptedYourGameRequest"),
      id: Date.now().toLocaleString(),
    };

    state.playersOnline = data.playersList;
  },

  SOCKET_gameRequestDeclined(state, data) {
    state.ship.systemMessage = {
      text:
        data.from.name + " " + i18n.t("messages.playerDeclinedYourGameRequest"),
      id: Date.now().toLocaleString(),
    };

    state.playersOnline = data.playersList;
  },

  SOCKET_ERROR(state, error) {
    state.ship.systemMessage = error;
  },

  SOCKET_error(state, error) {
    console.log(error);
    state.ship.systemMessage = error;
  },
};
