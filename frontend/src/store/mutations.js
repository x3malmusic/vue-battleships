import i18n from "../i18n";

export default {
  setUser(state, player) {
    state.player = player;
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

  SOCKET_ERROR(state, error) {
    state.ship.systemMessage = error;
  },
};
