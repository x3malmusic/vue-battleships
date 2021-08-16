import { login, register, uploadAvatar, silentLogin, getUserTotalStats, getUserLastGame } from "../services/http";
import { getToken, saveToken, deleteToken } from "../services/token";
import { SET_USER, SET_SYSTEM_MESSAGE, SET_IS_LOADING, SET_PLAYER_STATS, SET_LAST_GAME } from "./mutations";
import { NAME_PASSWORD_EMPTY, PLAYERS_NOT_FOUND, UPLOAD_SUCCESS } from "../constants/messages";

export const LOGIN = 'LOGIN';
export const SILENT_LOGIN = 'SILENT_LOGIN';
export const REGISTER = 'REGISTER';
export const LOG_OUT = 'LOG_OUT';
export const UPLOAD_AVATAR = 'UPLOAD_AVATAR';
export const GET_PLAYER_STATS = 'GET_PLAYER_STATS';
export const GET_LAST_GAME = 'GET_LAST_GAME';

export const FIND_MATCH = "FIND_MATCH";

export default {
  [LOGIN]: async({ commit, state }, data) => {
    if (!data.name.trim() || !data.password.trim()) return commit(SET_SYSTEM_MESSAGE, { type: NAME_PASSWORD_EMPTY })

    try {
      commit(SET_IS_LOADING, true)
      const player = await login(data)
      commit(SET_USER, player)
      saveToken(player.token)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
    } finally {
      commit(SET_IS_LOADING, false)
    }
  },

  [REGISTER]: async({ state, commit }, data) => {
    if (!data.name.trim() || !data.password.trim()) return commit(SET_SYSTEM_MESSAGE, { type: NAME_PASSWORD_EMPTY });

    try {
      commit(SET_IS_LOADING, true)
      const player = await register(data)
      commit(SET_USER, player)
      saveToken(player.token)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
    } finally {
      commit(SET_IS_LOADING, false)
    }
  },

  [SILENT_LOGIN]: async ({ commit }, cb = () => {}) => {
    const token = getToken();
    if (!token) return

    try {
      commit(SET_IS_LOADING, true)
      const player = await silentLogin()
      player.token = token
      commit(SET_USER, player)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
      deleteToken()
    } finally {
      commit(SET_IS_LOADING, false)
      cb()
    }
  },

  [LOG_OUT]({ commit }) {
    deleteToken();
    commit(SET_USER, {});
  },

  [UPLOAD_AVATAR]: async ({ state, commit }, avatar) => {
    const data = new FormData();
    await data.append('image', avatar);

    try {
      state.player.avatar = await uploadAvatar(data);
      commit(SET_SYSTEM_MESSAGE, { type: UPLOAD_SUCCESS });
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
    }
  },

  [FIND_MATCH]({ commit, state }, socket) {
    state.isLookingForMatch = true;
    const player = { name: state.player.name, id: state.player.id };
    let triesNumber = 0;
    state.pollingInterval = setInterval(() => {
      if (triesNumber > 4) {
        clearInterval(state.pollingInterval);
        state.isLookingForMatch = false;
        commit(SET_SYSTEM_MESSAGE, { type: PLAYERS_NOT_FOUND })
      } else {
        socket.emit("FIND_MATCH", player);
        triesNumber++;
      }
    }, 2000);
  },

  [GET_PLAYER_STATS]: async({ commit }) => {
    try {
      const data = await getUserTotalStats();
      commit(SET_PLAYER_STATS, data)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
    }
  },

  [GET_LAST_GAME]: async({ commit }) => {
    try {
      const data = await getUserLastGame();
      commit(SET_LAST_GAME, data)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
    }
  },
}