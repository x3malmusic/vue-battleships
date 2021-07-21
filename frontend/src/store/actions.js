import i18n from "../i18n";
import { login, register, uploadAvatar } from "../services/http";
import { savePlayer, deletePlayer } from "../services/player";

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOG_OUT = 'LOG_OUT';
export const UPLOAD_AVATAR = 'UPLOAD_AVATAR';

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

  [UPLOAD_AVATAR]: async ({ state, commit }, avatar) => {
    const data = new FormData();
    await data.append('image', avatar);

    console.log(data)
    try {
      const img = await uploadAvatar(data);
      // URL.createObjectURL(img)
      console.log(img)
    } catch (e) {
      state.systemMessage = {
        text: e.data,
        id: Date.now().toLocaleString(),
      };
    }
  },
}