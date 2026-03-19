import axios from 'axios';

const http = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL ,
=======
  baseURL: import.meta.env.VITE_API_URL,
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
  timeout: 15000,
});

let token: string | null = null;
export function setAuthToken(t: string | null) { token = t; }

http.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default http;