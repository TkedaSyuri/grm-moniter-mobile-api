import { Hono } from "hono";
import { db } from "../db/database";
import { chat } from "../drizzle/schema";
import type { Context } from "hono";
import { io } from "..";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const allChats = await db.select().from(chat);
    return c.json(allChats, 200);
  } catch (e) {
    return c.json({ message: "データの取得に失敗" }, 200);
  }
});

app.post("/create", async (c: Context) => {
  const { newMessage,sender } = await c.req.json<{ newMessage: string,sender:string }>();
  try {
    await db.insert(chat).values({ message: newMessage,sender:sender });
    io.emit("updatedChat",{newMessage:newMessage,sender:sender});

    return c.json({ message: "データの作成に成功" }, 200);
  } catch (e) {
    return c.json({ message: "データの作成に失敗" }, 500);
  }
});

export default app;
