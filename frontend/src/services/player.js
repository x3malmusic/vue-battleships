const appName = 'vue-battleships';

export const savePlayer = (player) => {
  localStorage.setItem(appName, JSON.stringify(player));
}

export const getPlayer = () => {
  return JSON.parse(localStorage.getItem(appName));
}

export const deletePlayer = () => {
  localStorage.removeItem(appName);
}