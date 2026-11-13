<<<<<<< HEAD
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
 


async function main() {

   await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {}
  });

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  io.on('connection', async (socket) => {
    socket.on('chat message', async (msg) => {
      let result;
      try {
        // store the message in the database
        result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
      } catch (e) {
        // TODO handle the failure
        return;
      }
      // include the offset with the message
      io.emit('chat message', msg, result.lastID);
    });

    if (!socket.recovered) {
      // if the connection state recovery was not successful
      try {
        await db.each(
          'SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id);
          }
        );
      } catch (e) {
       }
    }
  });

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });
} 

main();
=======
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
>>>>>>> origin/main
