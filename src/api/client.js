import axios from "axios";

const TOKEN_KEY = "uc_token";

export const demoMode = false;

export const api = axios.create({
  baseURL: "https://service-full-stack-backend-1.onrender.com/api",
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const path = response.config.url || "";

    if (/\/auth\/(login|register)\/?$/.test(path) && response.data?.token) {
      sessionStorage.setItem(TOKEN_KEY, response.data.token);
    }

    if (/\/auth\/logout\/?$/.test(path)) {
      sessionStorage.removeItem(TOKEN_KEY);
    }

    return response;
  },
  (error) => Promise.reject(error),
);

export const errorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Unable to complete your request.";
