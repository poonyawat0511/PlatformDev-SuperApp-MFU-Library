// apiEndpoints.ts
import { ApiService } from "./apiServiceTypes";

const API_URLS = {
  [ApiService.AUTH]:
    process.env.API_URL_AUTH || "http://localhost:8080/auth",
  //   [ApiService.PRODUCTS]: process.env.API_URL_PRODUCTS || 'http://localhost:8080/products',
  //   [ApiService.USERS]: process.env.API_URL_USERS || 'http://localhost:8080/users',
  // Add more services and their base URLs
};

export default API_URLS;
