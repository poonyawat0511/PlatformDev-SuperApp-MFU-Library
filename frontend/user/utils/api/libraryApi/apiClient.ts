import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://172.27.66.240:8082/api",
});

export default apiClient;
