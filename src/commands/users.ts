import type { CommandName } from './commands';
import { setUser, readConfig } from '../config';
import { createUser, getAllUsers, getUser } from '../lib/db/queries/users';

export async function handlerLoginUser(cmdName: CommandName, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const name = args[0];
    const existingUser = await getUser(name);

    if (!existingUser) {
        throw new Error(`User ${name} not found`);
    }

    setUser(existingUser.name);
    console.log(`Current User: ${name}.`);
}

export async function handlerRegisterUser(cmdName: CommandName, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const name = args[0];
    await createUser(name);
    setUser(name);
    console.log(`User: ${name} created successfully.`);
}

export async function handlerGetAllUsers(_: CommandName) {
    const users = await getAllUsers();
    const config = readConfig();
    const { currentUserName } = config;

    users.forEach(user => {
        if (user.name === currentUserName) console.log(`* ${user.name} (current)`)
        else console.log(`* ${user.name}`)
    });
}