import api from "../api/axios.js";

const BASE = "/resources";

const resourceService = {
  getAll:    (params)     => api.get(BASE, { params }),
  getById:   (id)         => api.get(`${BASE}/${id}`),
  create:    (data)       => api.post(BASE, data),
  update:    (id, data)   => api.put(`${BASE}/${id}`, data),
  remove:    (id)         => api.delete(`${BASE}/${id}`),
};

export default resourceService;