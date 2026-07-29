import { api } from "../../../shared/api";

export const fetchSessions = async () => {
  const response = await api.get("/sessions/my-sessions");
  return response.data;
};
