import type { CommandName } from './commands';
import { deleteAllUsers } from '../lib/db/queries/users';

export async function handlerDeleteAllUsers(_: CommandName) {
    await deleteAllUsers();
    console.log("NOTICE: users_table was reset successfully.");
}