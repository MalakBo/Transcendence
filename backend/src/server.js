import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./modules/auth/auth.config.db.js";
import { seedAdmin } from "./modules/profiles/seedAdmin.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("received:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

const start = async () => {
  try {
    await connectDB();
    await seedAdmin();
    httpServer.listen(PORT, () => {
      console.log(`EventMatch API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

start();