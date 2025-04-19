
import { Hono } from "hono";
import { db } from '../db/database'
import { task } from '../drizzle/schema'

const app = new Hono()

app.get('/', async (c) => {
    const allTask = await db.select().from(task)  
    return c.json(allTask)
  })
  



export default app;
