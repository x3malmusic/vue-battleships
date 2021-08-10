import axios from 'axios'
import { getToken } from "./token";

const http = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 4000,
});

http.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response)
);

http.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${getToken()}`
    return config
  }
);

export const login = (creds) => http.post('/api/auth/login', { name: creds.name, password: creds.password })

export const silentLogin = () => http.post('/api/auth/silent-login', {})

export const register = (creds) => http.post('/api/auth/register', { name: creds.name, password: creds.password })

export const uploadAvatar = (img) => http.post('/api/avatar/upload', img, { headers: { "Content-Type": "multipart/form-data" }})

