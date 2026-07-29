import { api } from "../../../shared/api";

export const saveMemory = async (key: string, value: string) => {
  await api.post("/memory/save", { key, value });
};

export const fetchMemories = async () => {
  const response = await api.get("/memory/my-memories");
  return response.data;
};
