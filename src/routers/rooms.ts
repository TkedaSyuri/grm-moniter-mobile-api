import { Hono } from "hono";
import { db } from "../db/database";
import { floor, room } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/:id", async (c) => {
  const floorNumber = parseInt(c.req.param("id"));
  try {
    const roomData = await db
      .select()
      .from(room)
      .innerJoin(floor, eq(room.floorId, floor.floorNumber))
      .where(eq(floor.floorNumber, floorNumber))
      .orderBy(room.id);
    return c.json(roomData,200);
  } catch (e) {
  return  c.json({ err: e, message: "データを取得できませんでした" }, 500);
  }
});

app.put("/room-state/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { roomState } = await c.req.json<typeof room.$inferInsert>();
  try {
    await db.update(room).set({ roomState }).where(eq(room.id, id));
    return c.json({ message: "データの更新に成功しました" }, 200);
  } catch (e) {
   return c.json({ err: e, message: "データを更新できませんでした" }, 500);
  }
});

export default app;
