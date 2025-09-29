import type { CommandName } from './commands';
import { checkArgs } from './users';
import { deleteAllUsers } from '../lib/db/queries/users';

export async function handlerDeleteAllUsers(cmdName: CommandName, ...args: string[]) {
    checkArgs(cmdName, args);
    await deleteAllUsers();
}