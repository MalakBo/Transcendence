
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { getForMember, saveMessage } from "./chat.service.js";

export function registerChat(io) {

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    try {
      // 1. Read cookies from the handshake request
      const cookies = cookie.parse(
        socket.handshake.headers.cookie || ""
      );

      // 2. Extract JWT
      const token = cookies.jwt;

      if (!token) {
        return next(new Error("unauthorized"));
      }

      // 3. Verify JWT
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach authenticated user ID
      socket.userId = payload.id;

      next();

    } catch (error) {
      next(new Error("unauthorized"));
    }
  });

  // Handle authenticated connections
  io.on("connection", (socket) => {

    console.log("Authenticated user connected:", socket.userId);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });

    // Join a conversation
    socket.on("conversation:join", async (conversationId) => {
      try {
        const isMember = await getForMember(
          conversationId,
          socket.userId
        );

        if (!isMember) return;

        socket.join(`conv:${conversationId}`);

      } catch (error) {
        console.error("Conversation join error:", error.message);
      }
    });

    // Send a message
    socket.on("message:send", async ({ conversationId, content } = {}) => {
      try {
        // Verify conversation membership before saving
        const isMember = await getForMember(
          conversationId,
          socket.userId
        );

        if (!isMember) return;

        const message = await saveMessage(
          conversationId,
          socket.userId,
          content
        );

        io.to(`conv:${conversationId}`).emit("message:new", message);

      } catch (error) {
        console.error("Message sending error:", error.message);
      }
    });

  });
}
