import axios from "axios";
import logger from "../utils/logger";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5002/api",
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    logger.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    logger.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    logger.log("API Response:", {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    logger.error("Response Error:", {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
