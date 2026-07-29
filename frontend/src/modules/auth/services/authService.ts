import { api } from "../../../shared/api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const token = response.data.access_token;
  localStorage.setItem("token", token);
  return token;
};

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get("/auth/me");
  return response.data as { id: number; username: string; email: string };
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => Boolean(localStorage.getItem("token"));
