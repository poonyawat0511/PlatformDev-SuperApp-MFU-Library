import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.0.201:8082/api",
});

export default apiClient;
