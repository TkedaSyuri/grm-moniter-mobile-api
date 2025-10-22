import { Hono } from "hono";
import { db } from "../db/database";
import { chat, floor } from "../drizzle/schema";
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

app.post("/", async (c: Context) => {
  const { newMessage, sender, floorNumber } = await c.req.json<{
    newMessage: string;
    sender: string;
    floorNumber: string;
  }>();
  try {
    await db
      .insert(chat)
      .values({
        message: newMessage,
        sender: sender,
        floorNumber: floorNumber,
      });
    io.emit("updatedChat", {
      newMessage: newMessage,
      sender: sender,
      floorNumber: floorNumber,
    });

    return c.json({ message: "データの作成に成功" }, 200);
  } catch (e) {
    return c.json({ message: "データの作成に失敗" }, 500);
  }
});

export default app;
