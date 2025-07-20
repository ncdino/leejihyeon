import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://172.30.1.6:8088",
  withCredentials: true,
});

export default apiClient;
