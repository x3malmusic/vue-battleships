import i18n from "../i18n";
import { login, register, uploadAvatar } from "../services/http";
import { savePlayer, deletePlayer } from "../services/player";
import { SET_USER, SET_SYSTEM_MESSAGE } from "./mutations";

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOG_OUT = 'LOG_OUT';
export const UPLOAD_AVATAR = 'UPLOAD_AVATAR';

export default {
  [LOGIN]: async({ commit, state }, data) => {
    if(!data.name.trim() || !data.password.trim()) {
      return commit(SET_SYSTEM_MESSAGE, {
        text: i18n.t("messages.namePasswordEmpty"),
        id: Date.now().toLocaleString(),
      })
    }

    try {
      const player = await login(data)
      commit(SET_USER, player)
      savePlayer(player)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, {
        text: e.data,
        id: Date.now().toLocaleString(),
      });
    }
  },

  [REGISTER]: async({ state, commit }, data) => {
    if(!data.name.trim() || !data.password.trim()) {
      return commit(SET_SYSTEM_MESSAGE, {
        text: i18n.t("messages.namePasswordEmpty"),
        id: Date.now().toLocaleString(),
      });
    }

    try {
      const player = await register(data)
      commit('setUser', player)
      savePlayer(player)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, {
        text: e.data,
        id: Date.now().toLocaleString(),
      });
    }
  },

  [LOG_OUT]({ commit }) {
    deletePlayer();
    commit(SET_USER, {});
  },

  [UPLOAD_AVATAR]: async ({ state, commit }, avatar) => {
    const data = new FormData();
    await data.append('image', avatar);

    try {
      state.player.avatar = await uploadAvatar(data);

      commit(SET_SYSTEM_MESSAGE, {
        text: i18n.t("profile.uploadSuccess"),
        id: Date.now().toLocaleString(),
      });

      savePlayer(state.player)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, {
        text: e.data,
        id: Date.now().toLocaleString(),
      });
    }
  },
}