import { api } from "../../../shared/api";
import type { PresenceEvent } from "../types";

const FLUSH_INTERVAL_MS = 15_000;
const MAX_BATCH = 100;

// A distracted user generates a lot of signals. Batch them so attention
// tracking never turns into a request storm.
let queue: PresenceEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

export const flushPresenceEvents = async () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;

  const batch = queue.slice(0, MAX_BATCH);
  queue = queue.slice(MAX_BATCH);

  try {
    await api.post("/presence/events", { events: batch });
  } catch (error) {
    console.error("Presence events dropped", error);
  }
};

export const recordPresenceEvent = (event: PresenceEvent) => {
  queue.push({ occurred_at: new Date().toISOString(), ...event });

  if (queue.length >= MAX_BATCH) {
    void flushPresenceEvents();
    return;
  }
  if (!timer) {
    timer = setTimeout(() => void flushPresenceEvents(), FLUSH_INTERVAL_MS);
  }
};

/** Best-effort flush when the page is closing — queued signals would be lost. */
export const flushPresenceEventsOnUnload = () => {
  if (queue.length === 0) return;
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = JSON.stringify({ events: queue.slice(0, MAX_BATCH) });
  queue = [];

  // sendBeacon survives unload where fetch does not, but it cannot set an
  // Authorization header — fall back to a keepalive fetch.
  void fetch(`${api.defaults.baseURL}/presence/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: payload,
    keepalive: true,
  }).catch(() => {});
};

export const fetchPresenceSummary = async () => {
  const response = await api.get("/presence/summary");
  return response.data;
};

/** Test seam — clears queued events between cases. */
export const __resetPresenceQueue = () => {
  queue = [];
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};
