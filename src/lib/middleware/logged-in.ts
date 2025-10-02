import type { CommandName, CommandHandler } from "src/commands/commands";
import type { SelectUser } from "../db/schema";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

export type UserCommandHandler = (
    cmdName: CommandName,
    user: SelectUser,
    ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler) {
    return async (cmdName: CommandName, ...args: string[]) => {
        const config = readConfig();
        const user = await getUser(config.currentUserName);

        if (!user) {
            throw new Error(`User ${config.currentUserName} not found`);
        }

        return await handler(cmdName, user, ...args);
    }
}