import i18n from "../i18n";
import { login, register } from "../services/http";
import { savePlayer, deletePlayer } from "../services/player";

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOG_OUT = 'LOG_OUT';

export default {
  [LOGIN]: async({ commit, state }, data) => {
    if(!data.name.trim() || !data.password.trim()) {
      state.systemMessage = {
        text: i18n.t("messages.namePasswordEmpty"),
        id: Date.now().toLocaleString(),
      };
      return
    }

    try {
      const player = await login(data)
      commit('setUser', player)
      savePlayer(player)
    } catch (e) {
      state.systemMessage = {
        text: e.data,
        id: Date.now().toLocaleString(),
      };
    }
  },

  [REGISTER]: async({ state, commit }, data) => {
    if(!data.name.trim() || !data.password.trim()) {
      state.systemMessage = {
        text: i18n.t("messages.namePasswordEmpty"),
        id: Date.now().toLocaleString(),
      };
      return
    }

    try {
      const player = await register(data)
      commit('setUser', player)
      savePlayer(player)
    } catch (e) {
      state.systemMessage = {
        text: e.data,
        id: Date.now().toLocaleString(),
      };
    }
  },

  [LOG_OUT]({ commit }) {
    deletePlayer();
    commit('setUser', {});
  },
}