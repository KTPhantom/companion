import axios from "axios";

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
