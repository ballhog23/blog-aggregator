import type { CommandName } from './commands';
import { setUser } from '../config';
import { createUser, deleteAllUsers, getUser } from '../lib/db/queries/users';

export async function handlerLoginUser(cmdName: CommandName, ...args: string[]) {
    checkArgs(cmdName, args);
    const name = args[0];
    await getUser(name);
    setUser(name);
}

export async function handlerRegisterUser(cmdName: CommandName, ...args: string[]) {
    checkArgs(cmdName, args);
    const name = args[0];
    await createUser(name);
    setUser(name);
}

export async function handlerDeleteAllUsers(cmdName: CommandName, ...args: string[]) {
    checkArgs(cmdName, args);
    await deleteAllUsers();
}

function checkArgs(cmdName: string, args: string[]) {
    if (cmdName !== 'reset' && args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
}