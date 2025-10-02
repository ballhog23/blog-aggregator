import type { InsertFeed, SelectFeed, SelectFeedFollows } from "src/lib/db/schema";
import { feeds } from "src/lib/db/schema";
import { db } from '../index';
import { eq } from 'drizzle-orm';

export async function insertFeed(name: InsertFeed['name'], url: InsertFeed['url'], user: InsertFeed['userId']) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: user }).returning();
    return result;
}

export async function selectAllFeeds(): Promise<SelectFeed[]> {
    const rows = await db.select().from(feeds);

    if (rows.length === 0) throw new Error('No data was found in feeds_table');

    return rows;
}

export async function selectFeedByURL(url: SelectFeed['url']): Promise<SelectFeed> {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    return feed;
}