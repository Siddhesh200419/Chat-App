import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://chatty-backend-1fu6.onrender.com/api" : "/api",
  withCredentials: true,
});
