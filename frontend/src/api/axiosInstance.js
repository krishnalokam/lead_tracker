import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5002/api",
});

export default axiosInstance;
