import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConsumeNotificationsToSocket } from "./brocker/consumer";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    path: '/omma/socket.io',
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("message", (data) => {
        console.log("Received message:", data);
        io.emit("message", data); // Рассылаем всем
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(5006, async () => {
    console.log("Socket service running on port 5006");
    await ConsumeNotificationsToSocket(io).catch(console.error);
});
