// src/lib/socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const normalizeOrigins = () => {
  const envOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : [];

  const defaults = [
    "https://chatty-frontend-i6cv.onrender.com/",
    // "http://localhost:5174",
    // "http://localhost:3000",
  ];

  return [...envOrigins, ...defaults]
    .map((origin) => origin?.trim())
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ""));
};

export const allowedOrigins = normalizeOrigins();

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// map userId -> socketId
const userSocketMap = {};

// helper if you use it in message routes
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User online:", userId);
  }

  // send online users list to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      console.log("User offline:", userId);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
