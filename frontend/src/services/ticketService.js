import axios from "../api/axios";

const withAuth = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

const ticketService = {
  getAll: (params = {}) => axios.get("/tickets", { params, ...withAuth() }),

  getMyTickets: () => axios.get("/tickets/my", withAuth()),

  getById: (id) => axios.get(`/tickets/${id}`, withAuth()),

  create: (payload) => axios.post("/tickets", payload, withAuth()),

  updateStatus: (id, payload) =>
    axios.patch(`/tickets/${id}/status`, payload, withAuth()),

  assignTicket: (id, payload) =>
    axios.patch(`/tickets/${id}/assign`, payload, withAuth()),

  getAttachments: (ticketId) =>
    axios.get(`/tickets/${ticketId}/attachments`, withAuth()),

  uploadAttachment: (ticketId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`/tickets/${ticketId}/attachments`, formData, {
      ...withAuth(),
      headers: {
        ...withAuth().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteAttachment: (attachmentId) =>
    axios.delete(`/tickets/attachments/${attachmentId}`, withAuth()),

  getComments: (ticketId) =>
    axios.get(`/tickets/${ticketId}/comments`, withAuth()),

  addComment: (ticketId, payload) =>
    axios.post(`/tickets/${ticketId}/comments`, payload, withAuth()),

  updateComment: (commentId, payload) =>
    axios.put(`/comments/${commentId}`, payload, withAuth()),

  deleteComment: (commentId) => axios.delete(`/comments/${commentId}`, withAuth()),
};

export default ticketService;
