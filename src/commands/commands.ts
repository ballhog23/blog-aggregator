import type { SelectUser } from "src/lib/db/schema";

export type CommandName =
    'login' |
    'register' |
    'reset' |
    'users' |
    'agg' |
    'addfeed' |
    'feeds' |
    'follow' |
    'following' |
    'unfollow' |
    'browse';

export type CommandHandler = (cmdName: CommandName, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<CommandName, CommandHandler>;

export type UserCommandHandler = (
    cmdName: CommandName,
    user: SelectUser,
    ...args: string[]
) => Promise<void>;

export function registerCommand(registry: CommandsRegistry, cmdName: CommandName, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: CommandName, ...args: string[]) {
    const handler = registry[cmdName];
    if (!handler) throw new Error(`Unknown Command: ${cmdName}`);
    await handler(cmdName, ...args);
}