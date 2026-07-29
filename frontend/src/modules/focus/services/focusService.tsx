import { api } from "../../../shared/api";

export const createSession = async (
  subject: string,
  duration: number,
  focusScore: number = 100
) => {
  const response = await api.post("/sessions/create", {
    subject,
    duration,
    focus_score: focusScore,
  });
  return response.data;
};
