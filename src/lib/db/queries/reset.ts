import { db } from '..';
import { users, feeds } from '../schema';

export async function deleteAllTableData() {
    await db.delete(feeds);
    await db.delete(users);
}