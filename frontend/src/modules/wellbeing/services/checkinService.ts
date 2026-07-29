import { api } from "../../../shared/api";

export const ENERGY_OPTIONS = [
  { value: "drained", label: "Drained", emoji: "🪫" },
  { value: "tired", label: "Tired", emoji: "😔" },
  { value: "steady", label: "Steady", emoji: "🙂" },
  { value: "good", label: "Good", emoji: "😊" },
  { value: "energised", label: "Energised", emoji: "⚡" },
] as const;

export const FOCUS_OPTIONS = [
  { value: "scattered", label: "Scattered", emoji: "🌪️" },
  { value: "distracted", label: "Distracted", emoji: "🌀" },
  { value: "okay", label: "Okay", emoji: "👍" },
  { value: "sharp", label: "Sharp", emoji: "🎯" },
  { value: "deep", label: "Deep", emoji: "🧠" },
] as const;

export type CheckIn = {
  energy: string;
  focus_quality: string;
  note?: string;
  session_id?: number;
};

export const submitCheckIn = async (checkIn: CheckIn) => {
  const response = await api.post("/check-ins", checkIn);
  return response.data;
};

export const fetchWellbeingSummary = async () => {
  const response = await api.get("/check-ins/summary");
  return response.data;
};
