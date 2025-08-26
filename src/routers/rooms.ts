import { Hono } from "hono";
import { db } from "../db/database";
import { room } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { io } from "..";

const app = new Hono();

app.get("/:id", async (c: Context) => {
  const floorNumber = Number(c.req.param("id"));

  try {
    const rooms = await db
      .select()
      .from(room)
      .where(eq(room.floorId, floorNumber))
      .orderBy(room.id);
    return c.json(rooms, 200);
  } catch (err) {
    console.error(err);
    return c.json({ message: "データを取得できませんでした" }, 500);
  }
});
app.put("/room-state/:id", async (c: Context) => {
  const RoomId = parseInt(c.req.param("id"));
  const { roomState } = await c.req.json<typeof room.$inferInsert>();
  try {
    await db.update(room).set({ roomState }).where(eq(room.id, RoomId));
    io.emit("updatedRoomState", { roomId: RoomId, roomState });

    return c.json({ message: "データの更新に成功しました" }, 200);
  } catch (e) {
    return c.json({ err: e, message: "データを更新できませんでした" }, 500);
  }
});

app.put("/is-consecutive-nights/:id", async (c: Context) => {
  const isConsecutiveId = parseInt(c.req.param("id"));

  try {
    const currentIsConsecutiveNight = await db
      .select({ isConsecutiveNight: room.isConsecutiveNight })
      .from(room)
      .where(eq(room.id, isConsecutiveId))
      .then((res) => res[0]);

    const changedIsConsecutiveNight =
      !currentIsConsecutiveNight.isConsecutiveNight;

    await db
      .update(room)
      .set({ isConsecutiveNight: changedIsConsecutiveNight })
      .where(eq(room.id, isConsecutiveId));
    io.emit("updatedRoomState");

    return c.json(
      {
        message: "データの更新に成功しました",
      },
      200
    );
  } catch (e) {
    console.error(e);
    return c.json(
      { err: String(e), message: "データを更新できませんでした" },
      500
    );
  }
});

export default app;
