import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server as SocketServer } from "socket.io";

import roomRoute from "./routers/rooms";
import taskRoute from "./routers/tasks";
import chatRoute from "./routers/chats";

const app = new Hono();
app.use();

const PORT = Number(process.env.PORT) || 10000;

const httpServer = serve({
  fetch: app.fetch,
  port: PORT,
});

// socket.io を Honoサーバーにアタッチ
export const io = new SocketServer(httpServer as any);

app.route("/api/room", roomRoute);
app.route("/api/task", taskRoute);
app.route("/api/chat", chatRoute);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

console.log(`サーバー起動中  http://localhost:${PORT}`);
