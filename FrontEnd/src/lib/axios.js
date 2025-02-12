import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "chat-app-indol-nine-45.vercel.app/api" : "/api",
  withCredentials: true,
});