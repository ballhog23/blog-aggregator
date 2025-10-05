import { pgTable, uuid, timestamp, text, unique } from 'drizzle-orm/pg-core';

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
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    lastFetchedAt: timestamp('last_fetched_at'),
});

export const feedFollows = pgTable("feed_follows_table", {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    feedId: uuid("feed_id").references(() => feeds.id, { onDelete: 'cascade' }).notNull()
}, (t) => [
    unique().on(t.userId, t.feedId)
]
);

export const posts = pgTable("posts_table", {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    title: text('title').notNull(),
    url: text('url').notNull().unique(),
    description: text('description'),
    publishedAt: timestamp('published_at').notNull(),
    feedId: uuid('feed_id').references(() => feeds.id, { onDelete: 'cascade' }).notNull()
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertFeed = typeof feeds.$inferInsert;
export type SelectFeed = typeof feeds.$inferSelect;
export type InsertFeedFollows = typeof feedFollows.$inferInsert;
export type SelectFeedFollows = typeof feedFollows.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;