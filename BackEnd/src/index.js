import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server, allowedOrigins } from "./lib/socket.js";
import cors from "cors";
import path from "path"
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../FrontEnd/dist")));

    app.get("*",(req,res) => {
        res.sendFile(path.join(__dirname,"../FrontEnd","dist","index.html"));
    })
}

server.listen(PORT, () => {
    console.log("Server is running on port:" + PORT);
    connectDB();
});
