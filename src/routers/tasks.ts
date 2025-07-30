
import { Hono } from "hono";
import { db } from '../db/database'
import { task } from '../drizzle/schema'
import { eq } from "drizzle-orm";
import type { Context } from 'hono'

const app = new Hono()

app.get('/', async (c:Context) => {
  try{
    const allTasks = await db.select().from(task)  
    return c.json(allTasks,200)
  }catch(e){
    return c.json({message:"データの取得に失敗"},500)
  }
  })


app.put("/complete-task/:id",async (c:Context)=>{
  const id = parseInt(c.req.param("id"));
  const {isCompleted} = await c.req.json<{isCompleted:boolean}>();
  const reverseIsCompleted = !isCompleted
  try{
    await db.update(task).set({isCompleted:reverseIsCompleted}).where(eq(task.id,id))
    return c.json({message:"データの更新に成功"},200)
  }catch(e){
    return c.json({message:"データの更新に失敗"},500)
  }
})


export default app;
