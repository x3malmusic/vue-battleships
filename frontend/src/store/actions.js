import { login, register, uploadAvatar } from "../services/http";
import { savePlayer, deletePlayer } from "../services/player";
import { SET_USER, SET_SYSTEM_MESSAGE } from "./mutations";
import { NAME_PASSWORD_EMPTY, PLAYERS_NOT_FOUND, UPLOAD_SUCCESS } from "../constants/messages";

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOG_OUT = 'LOG_OUT';
export const UPLOAD_AVATAR = 'UPLOAD_AVATAR';

export const FIND_MATCH = "FIND_MATCH";

export default {
  [LOGIN]: async({ commit, state }, data) => {
    if(!data.name.trim() || !data.password.trim()) {
      return commit(SET_SYSTEM_MESSAGE, { type: NAME_PASSWORD_EMPTY })
    }

    try {
      const player = await login(data)
      commit(SET_USER, player)
      savePlayer(player)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
    }
  },

  [REGISTER]: async({ state, commit }, data) => {
    if(!data.name.trim() || !data.password.trim()) {
      return commit(SET_SYSTEM_MESSAGE, { type: NAME_PASSWORD_EMPTY });
    }

    try {
      const player = await register(data)
      commit(SET_USER, player)
      savePlayer(player)
    } catch (e) {
      commit(SET_SYSTEM_MESSAGE, { type: e.data.type });
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

      commit(SET_SYSTEM_MESSAGE, { type: UPLOAD_SUCCESS });
      savePlayer(state.player)
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
}