import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8088",
  withCredentials: true,
});

export default apiClient;
