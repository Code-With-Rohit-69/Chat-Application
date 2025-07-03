import express from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";

import http from "http";
import { connectDB } from "./utils/Db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    Credential: true,
  })
);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.get("/", (req, res) => res.send("Server is running"));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const start = () => {
  connectDB();
  server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
};

start();
