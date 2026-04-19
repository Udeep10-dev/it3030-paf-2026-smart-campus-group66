import axios from "../api/axios";

const ticketService = {
  getAll: (params = {}) => axios.get("/tickets", { params }),

  getMyTickets: () => axios.get("/tickets/my"),

  getById: (id) => axios.get(`/tickets/${id}`),

  create: (payload) => axios.post("/tickets", payload),

  updateStatus: (id, payload) =>
    axios.patch(`/tickets/${id}/status`, payload),

  assignTicket: (id, payload) =>
    axios.patch(`/tickets/${id}/assign`, payload),

  getAttachments: (ticketId) =>
    axios.get(`/tickets/${ticketId}/attachments`),

  uploadAttachment: (ticketId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`/tickets/${ticketId}/attachments`, formData);
  },

  deleteAttachment: (attachmentId) =>
    axios.delete(`/tickets/attachments/${attachmentId}`),

  getComments: (ticketId) => axios.get(`/tickets/${ticketId}/comments`),

  addComment: (ticketId, payload) =>
    axios.post(`/tickets/${ticketId}/comments`, payload),

  updateComment: (commentId, payload) =>
    axios.put(`/comments/${commentId}`, payload),

  deleteComment: (commentId) => axios.delete(`/comments/${commentId}`),
};

export default ticketService;