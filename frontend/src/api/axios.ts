// frontend/src/api/axios.ts
import axios from "axios";

const BASE_URL = "http://localhost:8000/api"; // adjust if using different host/port

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed if you use authentication with cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
