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

export const requestMagicLink = async (email: string) => {
  const response = await api.post("/auth/request-magic-link", { email });
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get("/auth/me");
  return response.data as {
    id: number;
    username: string;
    email: string;
    timezone: string;
    daily_goal: number;
  };
};

export const updateDailyGoal = async (dailyGoal: number) => {
  const response = await api.patch("/auth/me/preferences", { daily_goal: dailyGoal });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => Boolean(localStorage.getItem("token"));
