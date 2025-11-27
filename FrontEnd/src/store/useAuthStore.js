import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// 👇 correct backend URLs for dev + prod
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"                          // local backend
    : "https://chatty-backend-1fu6.onrender.com";      // render backend

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // 🔐 check auth on app load
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 📝 signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create account";
      toast.error(errorMessage);
      console.error("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 🔑 login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to login";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 🚪 logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error("Logout error:", error);
    }
  },

  // 👤 update profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // 🌐 connect socket.io
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true,
      // transports: ["websocket"], // optional if you wanna force ws
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // 🔌 disconnect socket.io
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
