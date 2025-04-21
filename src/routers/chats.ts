
import { Hono } from "hono";
import { db } from '../db/database'
import { chat, task } from '../drizzle/schema'
import { eq } from "drizzle-orm";

const app = new Hono()

app.get('/', async (c) => {
  try{
    const allChats = await db.select().from(chat)  
    return c.json(allChats,200)
  }catch(e){
    return c.json({message:"データの取得に失敗"},200)
  }
  })

  app.post("/create",async (c)=>{
    const {newMessage} = await c.req.json<{newMessage:string}>()
    try{
         await db.insert(chat).values({message:newMessage})
        return c.json({message:"データの作成に成功"},200)
    }catch(e){
        return c.json({message:"データの作成に失敗"},500)
    }
  })




export default app;
