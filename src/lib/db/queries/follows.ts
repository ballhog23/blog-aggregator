import type { InsertFeed, InsertFeedFollows, SelectFeedFollows } from "src/lib/db/schema";
import { feedFollows, feeds, users } from "src/lib/db/schema";
import { db } from '../index';
import { eq } from 'drizzle-orm';

export async function createFeedFollows(feedId: InsertFeedFollows["feedId"], userId: InsertFeed["userId"]) {
    try {
        const [result] = await db.insert(feedFollows).values({ feedId: feedId, userId: userId }).returning();

        const [feedFollowData] = await db
            .select({
                id: feedFollows.id,
                createdAt: feedFollows.createdAt,
                updatedAt: feedFollows.updatedAt,
                userId: feedFollows.userId,
                feedId: feedFollows.feedId,
                feedName: feeds.name,
                userName: users.name
            })
            .from(feedFollows)
            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
            .innerJoin(users, eq(feedFollows.userId, users.id))
            .where(eq(feedFollows.id, result.id));

        return feedFollowData;
    } catch (error: any) {
        throw new Error('user already follows feed');
    }
}

export async function getFeedFollowsForUser(userId: SelectFeedFollows['userId']) {
    const userFeeds = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            feedName: feeds.name,
            userName: users.name
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
    return userFeeds;
}