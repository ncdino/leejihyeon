import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.leejihyeon.dev",
  // baseURL: "http://localhost:8088",
  withCredentials: true,
});

export default apiClient;
