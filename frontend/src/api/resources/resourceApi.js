import axios from "axios";

const API_URL = "http://localhost:8080/api/resources";

export const getResources = (params) => axios.get(API_URL, { params });

export const getResourceById = (id) => axios.get(`${API_URL}/${id}`);

export const createResource = (data) => axios.post(API_URL, data);

export const updateResource = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteResource = (id) =>
  axios.delete(`${API_URL}/${id}`);