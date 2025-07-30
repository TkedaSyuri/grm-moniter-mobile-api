import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'

import roomRoute from './routers/rooms'
import taskRoute from './routers/tasks'
import chatRoute from './routers/chats'

const app = new Hono()
app.use(cors())

app.route('/api/room', roomRoute)
app.route('/api/task', taskRoute)
app.route('/api/chat', chatRoute)

const PORT = Number(process.env.PORT) || 8080

console.log(`サーバー起動中  http://localhost:${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT          
  
})
