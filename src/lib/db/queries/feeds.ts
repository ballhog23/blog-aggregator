import type { InsertFeed, SelectFeed } from "src/lib/db/schema";
import { feeds } from "src/lib/db/schema";
import { firstOrUndefined } from "./utils";
import { db } from '../index';
import { eq } from 'drizzle-orm';

export async function insertFeed(name: InsertFeed['name'], url: InsertFeed['url'], user: InsertFeed['userId']) {
    const result = await db.insert(feeds).values({ name: name, url: url, userId: user }).returning();
    return firstOrUndefined(result);
}

export async function selectAllFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function selectFeedByURL(url: SelectFeed['url']) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
}