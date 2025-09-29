import type { InsertFeed, InsertFeedFollows, SelectFeedFollows, SelectUser, SelectFeed } from "src/lib/db/schema";
import { feedFollows, feeds, users } from "src/lib/db/schema";
import { db } from '../index';
import { and, eq } from 'drizzle-orm';

export async function createFeedFollow(feedId: InsertFeedFollows["feedId"], userId: InsertFeed["userId"]) {
    try {
        const [newFeedFollow] = await db.insert(feedFollows).values({ feedId, userId }).returning();

        const [result] = await db
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
            .where(eq(feedFollows.id, newFeedFollow.id));

        return result;
    } catch (error: any) {
        throw new Error('user already follows feed');
    }
}

export async function getFeedFollowsForUser(userId: SelectFeedFollows['userId']) {
    const result = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId));

    return result;
}

export async function deleteFeedFollow(feedId: SelectFeed['id'], userId: SelectUser['id']) {
    const [result] = await db.delete(feedFollows)
        .where(and(
            eq(feedFollows.feedId, feedId),
            eq(feedFollows.userId, userId)
        ))
        .returning();

    return result;
}