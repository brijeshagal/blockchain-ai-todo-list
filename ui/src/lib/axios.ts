import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_IS_DEV
    ? "http://localhost:8080/api"
    : process.env.NEXT_PUBLIC_SERVER,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
