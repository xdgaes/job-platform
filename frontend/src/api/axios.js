import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // nanti bisa untuk JWT auth / cookie
});

export default api;
