import { db } from '..';
import { users, feeds, feedFollows, posts } from '../schema';

export async function deleteAllTableData() {
    await db.delete(feeds);
    await db.delete(users);
    await db.delete(feedFollows);
    await db.delete(posts);
}