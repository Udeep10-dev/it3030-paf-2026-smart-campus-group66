import api from "../api/axios.js";

const API_URL = "/bookings";

const toCreatePayload = (data) => ({
  resourceId: Number(data.resourceId),
  bookingDate: data.bookingDate,
  startTime: data.startTime,
  endTime: data.endTime,
  expectedAttendees: Number(data.expectedAttendees),
  purpose: (data.purpose || "").trim(),
});

export const createBooking = (data) => {
  return api.post(API_URL, toCreatePayload(data));
};

export const getBookingsByStatus = (status) => {
  return api.get(API_URL, { params: { status } });
};

export const getMyBookingsByStatus = (status, userId = 1) => {
  return api.get(`${API_URL}/my`, { params: { status, userId } });
};

export const approveBooking = (id) => {
  return api.put(`${API_URL}/${id}/approve`);
};

export const rejectBooking = (id, reason) => {
  return api.put(`${API_URL}/${id}/reject`, { reason });
};

export const cancelBooking = (id) => {
  return api.put(`${API_URL}/${id}/cancel`).catch((error) => {
    const status = error?.response?.status;
    if (status === 404 || status === 405) {
      return api.put(`${API_URL}/${id}/reject`, { reason: "Cancelled by admin" });
    }
    throw error;
  });
};

export const deleteBooking = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

export const updateBooking = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};
