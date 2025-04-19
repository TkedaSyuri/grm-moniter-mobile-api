import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import roomRoute from "./routers/rooms";
import taskRoute from "./routers/tasks";

const app = new Hono()
app.use(cors())

app.route("/api/room",roomRoute)
app.route("/api/task",taskRoute)


console.log("✅ サーバー起動中 http://localhost:8080")

serve({
  fetch: app.fetch,
  port: 8080
})