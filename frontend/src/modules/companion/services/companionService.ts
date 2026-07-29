import { api } from "../../../shared/api";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

// Conversation history lives server-side now; the backend replays the last
// turns to the model automatically.
export const askCompanion = async (message: string) => {
  const response = await api.post("/companion/chat", { message });
  return response.data;
};

export const fetchChatHistory = async (): Promise<ChatTurn[]> => {
  const response = await api.get("/companion/history");
  return response.data;
};
