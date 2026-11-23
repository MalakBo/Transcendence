// const chatService = require('./chat.service');

// function registerChatSocket(io) {
//   io.on('connection', (socket) => {
    
//     socket.user = socket.user || { id: 1 };

//     socket.on('join booking', async ({ bookingId, afterId = 0 }) => {
//       socket.join(`booking:${bookingId}`);
//       const history = await chatService.getMessages(bookingId, afterId);
//       socket.emit('chat history', history);
//     });

//     socket.on('chat message', async ({ bookingId, content }) => {
//       if (typeof content !== 'string' || !content.trim()) return;
//       const msg = await chatService.saveMessage(bookingId, socket.user.id, content.trim());
//       io.to(`booking:${bookingId}`).emit('chat message', msg);
//     });
//   });
// }

// module.exports = { registerChatSocket };


import * as chatService from "./chat.service.js";

export function registerChatSocket(io) {
  io.on("connection", (socket) => {
    // TEMP until P1's auth works: use a real user id from your database
    socket.user = socket.user || { id: "PUT-A-USER-UUID-HERE" };

    socket.on("join booking", async ({ bookingId, after }) => {
      try {
        const conversation = await chatService.getOrCreateConversation(bookingId);
        socket.join(`conversation:${conversation.id}`);
        const messages = await chatService.getMessages(conversation.id, after);
        socket.emit("chat history", { conversationId: conversation.id, messages });
      } catch (e) {
        console.error("join booking failed:", e);
      }
    });

    socket.on("chat message", async ({ conversationId, content }) => {
      if (typeof content !== "string" || !content.trim()) return;
      try {
        const msg = await chatService.saveMessage(conversationId, socket.user.id, content.trim());
        io.to(`conversation:${conversationId}`).emit("chat message", msg);
      } catch (e) {
        console.error("chat message failed:", e);
      }
    });
  });
}
