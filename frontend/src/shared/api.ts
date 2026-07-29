import axios from "axios";

const FIELD_LABELS: Record<string, string> = {
  email: "Email",
  username: "Username",
  password: "Password",
};

/**
 * Turn any API error into a string safe to render.
 *
 * FastAPI returns `detail` as a plain string for HTTPException but as an
 * array of objects for 422 validation errors. Rendering that array directly
 * as a React child throws and unmounts the tree, so every caller must go
 * through here rather than reading `detail` itself.
 */
export const errorMessage = (
  error: any,
  fallback = "Something went wrong. Please try again."
): string => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === "string") return item;
        const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : null;
        const label = field ? FIELD_LABELS[field] ?? String(field) : null;
        const msg = typeof item?.msg === "string" ? item.msg : null;
        if (!msg) return null;
        // Pydantic prefixes value errors; the prefix reads as noise to users.
        const cleaned = msg.replace(/^Value error,\s*/i, "");
        return label ? `${label}: ${cleaned}` : cleaned;
      })
      .filter(Boolean);

    if (parts.length) return parts.join(" ");
  }

  if (error?.message === "Network Error") {
    return "Can't reach the server. Is the backend running?";
  }

  return fallback;
};

// Single API client for the whole app. All backend routes live under /api.
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // The backend buckets days and peak hours in the user's own timezone.
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz) {
    config.headers["X-Timezone"] = tz;
  }
  return config;
});

// If the token is expired or invalid, drop it and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
