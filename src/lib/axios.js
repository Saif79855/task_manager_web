import axios from "axios";

let getAuthToken = () => null;

export const setAuthTokenGetter = (getter) => {
  getAuthToken = getter;
};

const api = axios.create({
  baseURL: "https://task-manager-tbbg.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
