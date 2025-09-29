import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';

export const users = pgTable("users_table", {
    id: uuid('id').primaryKey().defaultRandom(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    name: text('name').notNull().unique(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;