import { eq } from 'drizzle-orm';
import { db } from '../index';
import { InsertUser, SelectUser, users } from '../schema';

export async function createUser(name: InsertUser['name']) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: SelectUser['name']) {
    const rows = await db.select().from(users).where(eq(users.name, name));

    if (rows.length === 0) throw new Error('user does not exist');

    return rows[0];
}

export async function deleteAllUsers() {
    await db.delete(users);
    console.log('users_table reset was successful');
}

export async function getAllUsers() {
    const rows = await db.select().from(users);

    if (rows.length === 0) throw new Error('users_table is empty');

    return rows;
}