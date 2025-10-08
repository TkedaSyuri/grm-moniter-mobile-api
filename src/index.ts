import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import roomRoute from "./routers/rooms";
import taskRoute from "./routers/tasks";
import chatRoute from "./routers/chats";

const app = new Hono();

const PORT = Number(process.env.PORT) || 10000;

const httpServer = serve({
  fetch: app.fetch,
  port: PORT,
});

// socket.io を Honoサーバーにアタッチ
export const io = new SocketServer(httpServer as any);

app.route("/api/rooms", roomRoute);
app.route("/api/tasks", taskRoute);
app.route("/api/chats", chatRoute);

// Redisクライアントを作成
const pubClient = createClient({
  url: process.env.REDIS_URL,
});

const subClient = pubClient.duplicate();

(async () => {
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
})();

// Socket.IO に Redis Adapter を設定
io.on("connection", (socket) => {
  console.log(`Web Socket connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Web Socket disconnected: ${socket.id}`);
  });
});

console.log(`サーバー起動中  http://localhost:${PORT}`);
