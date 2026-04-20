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

const withJsonAuth = () => ({
  headers: {
    "Content-Type": "application/json",
    ...(withAuth().headers || {}),
  },
});

const ticketService = {
  getAll: (params = {}) => axios.get("/tickets", { params, ...withAuth() }),

  getMyTickets: () => axios.get("/tickets/my", withAuth()),

  getById: (id) => axios.get(`/tickets/${id}`, withAuth()),

  create: (payload) => axios.post("/tickets", payload, withAuth()),

  updateStatus: (id, payload) =>
    axios.request({
      method: "patch",
      url: `/tickets/${id}/status`,
      data: payload,
      ...withJsonAuth(),
    }),

  assignTicket: (id, payload) =>
    axios.request({
      method: "patch",
      url: `/tickets/${id}/assign`,
      data: payload,
      ...withJsonAuth(),
    }),

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
