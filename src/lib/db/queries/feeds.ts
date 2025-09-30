import type { InsertFeed, SelectFeed } from "src/lib/db/schema";
import { db } from '../index';
import { eq } from "drizzle-orm";
import { feeds } from "src/lib/db/schema";

export async function insertFeed(name: InsertFeed['name'], url: InsertFeed['url'], user: InsertFeed['userId']) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: user }).returning();
    return result;
};

export async function selectFeed(name: SelectFeed['name']) {
    const rows = await db.select().from(feeds).where(eq(feeds.name, name));

    if (rows.length === 0) throw new Error('feed does not exist.')

    return rows[0];
}