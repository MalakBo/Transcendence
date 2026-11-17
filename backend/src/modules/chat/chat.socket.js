import jwt from "jsonwebtoken";
import { getForMember, saveMessage } from "./chat.service.js";

export function registerChat(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("conversation:join", async (conversationId) => {
      if (!(await getForMember(conversationId, socket.userId))) return;
      socket.join(`conv:${conversationId}`);
    });

    socket.on("message:send", async ({ conversationId, content }) => {
      try {
        const message = await saveMessage(conversationId, socket.userId, content);
        io.to(`conv:${conversationId}`).emit("message:new", message);
      } catch (e) {
        console.error(e.message);
      }
    });
  });
}