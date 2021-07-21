import axios from 'axios'
import { getPlayer } from "./player";

const http = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 4000,
});

http.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response)
);

http.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${getPlayer().token}`
    return config
  }
)

export const login = (creds) => http.post('/api/auth/login', {name: creds.name, password: creds.password})

export const register = (creds) => http.post('/api/auth/register', {name: creds.name, password: creds.password})

export const uploadAvatar = (img) => http.post('/api/upload/avatar', img, { headers: { "Content-Type": "multipart/form-data" }})

