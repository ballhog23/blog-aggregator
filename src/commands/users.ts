import type { CommandName } from './commands';
import { setUser, readConfig } from '../config';
import { createUser, getAllUsers, getUser } from '../lib/db/queries/users';

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

export async function handlerGetAllUsers(cmdName: CommandName, ...args: string[]) {
    checkArgs('users', args);
    const users = await getAllUsers();
    const config = readConfig();
    const { currentUserName } = config;
    users.forEach(user => {
        if (user.name === currentUserName) console.log(`* ${user.name} (current)`)
        else console.log(`* ${user.name}`)
    });
}

export function checkArgs(cmdName: CommandName, args: string[]) {
    const noArgsCommands: CommandName[] = ['reset', 'users'];
    const isNoArgCommand = noArgsCommands.includes(cmdName);

    if (!isNoArgCommand && args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
}