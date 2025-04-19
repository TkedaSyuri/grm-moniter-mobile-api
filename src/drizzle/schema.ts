import {
    pgTable,
    serial,
    integer,
    varchar,
    boolean,
    timestamp
  } from 'drizzle-orm/pg-core';
  
   //Floor テーブル
  export const floor = pgTable('Floor', {
    id: serial('id').primaryKey(),
    floorNumber: integer('floorNumber').unique(),
  });
  //Room テーブル
  export const room = pgTable('Room', {
    id: serial('id').primaryKey(),
    roomNumber: varchar('roomNumber', { length: 255 }),
    roomState: varchar('roomState', { length: 255 }).default('vacant'),
    isConsecutiveNight: boolean('isConsecutiveNight').default(false),
    floorId: integer('floorId').references(() => floor.floorNumber),
  });
  
  //Staff　テーブル
  export const staff = pgTable('Staff', {
    staffId: serial('staffId').primaryKey(),
    staffName: varchar('staffName', { length: 255 }),
    email: varchar('email', { length: 255 }).unique(),
    password: varchar('password', { length: 255 }),
  });
  
   // Task テーブル
  export const task = pgTable('Task', {
    id: serial('id').primaryKey(),
    task: varchar('task', { length: 255 }),
    isCompleted: boolean('isCompleted').default(false),
  });
  
   //Chat テーブル
  export const chat = pgTable('Chat', {
    id: serial('id').primaryKey(),
    message: varchar('message', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow(),
  });
  