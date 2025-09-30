import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';

export const users = pgTable("users_table", {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    name: text('name').notNull().unique(),
});

export const feeds = pgTable("feeds_table", {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    name: text('name').notNull(),
    url: text('url').notNull().unique(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull()
})

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertFeed = typeof feeds.$inferInsert;
export type SelectFeed = typeof feeds.$inferSelect;