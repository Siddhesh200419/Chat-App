import axios from "axios";

const BASE_API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"                        // LOCAL backend
    : "https://chatty-backend-1fu6.onrender.com/api";    // RENDER backend

export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});
