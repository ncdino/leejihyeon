import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.leejihyeon.dev:8088",
  withCredentials: true,
});

export default apiClient;
