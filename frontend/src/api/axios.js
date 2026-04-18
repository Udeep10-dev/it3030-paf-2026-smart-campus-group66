import axios from "axios";

const api = axios.create({
  // Use env override when provided, otherwise rely on Vite proxy (/api -> backend).
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;