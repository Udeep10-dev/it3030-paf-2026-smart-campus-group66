import axios from "axios";

const API_URL = "/api/bookings";

export const createBooking = (data) => {
  return axios.post(API_URL, data);
};

export const getBookingsByStatus = (status) => {
  return axios.get(`${API_URL}?status=${status}`);
};

export const approveBooking = (id) => {
  return axios.put(`${API_URL}/${id}/approve`);
};

export const rejectBooking = (id, reason) => {
  return axios.put(`${API_URL}/${id}/reject`, { reason });
};
