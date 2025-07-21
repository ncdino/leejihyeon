import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.leejihyeon.dev",
  withCredentials: true,
});

export default apiClient;
