import { eq } from 'drizzle-orm';
import { db } from '../index';
import { users } from '../schema';

export async function createUser(name: string) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string) {
    const rows = await db.select().from(users).where(eq(users.name, name));

    if (rows.length === 0) throw new Error('user does not exist');

    return rows[0];
}

export async function deleteAllUsers() {
    const [result] = await db.delete(users).returning();
    return result;
}