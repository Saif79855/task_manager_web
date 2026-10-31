import api from "@/lib/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  console.log(response.data);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/users", userData);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");

  return response.data;
};
