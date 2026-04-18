import api from "../api/axios.js";

const API_URL = "/bookings";

const toCreatePayload = (data) => ({
  resourceId: Number(data.resourceId),
  bookingDate: data.bookingDate,
  startTime: data.startTime,
  endTime: data.endTime,
  purpose: (data.purpose || "").trim(),
});

export const createBooking = (data) => {
  return api.post(API_URL, toCreatePayload(data));
};

export const getBookingsByStatus = (status) => {
  return api.get(API_URL, { params: { status } });
};

export const approveBooking = (id) => {
  return api.put(`${API_URL}/${id}/approve`);
};

export const rejectBooking = (id, reason) => {
  return api.put(`${API_URL}/${id}/reject`, { reason });
};
