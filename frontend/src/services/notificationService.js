import api from "../api/axios";

const getToken = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getNotifications = () =>
  api.get("/notifications", { headers: headers() });

export const markAsRead = (id) =>
  api.patch(`/notifications/${id}/read`, {}, { headers: headers() });
