import axios from 'axios'

const http = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 4000,
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response)
);

export const login = (creds) => http.post('/api/auth/login', {name: creds.name, password: creds.password})

export const register = (creds) => http.post('/api/auth/register', {name: creds.name, password: creds.password})

