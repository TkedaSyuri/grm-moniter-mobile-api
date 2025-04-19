import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { db } from './db/database'
import { task } from './drizzle/schema'

const app = new Hono()

app.get('/tasks', async (c) => {
  const allTask = await db.select().from(task)  
  return c.json(allTask)
})

console.log("✅ サーバー起動中 http://localhost:8080")

serve({
  fetch: app.fetch,
  port: 8080
})