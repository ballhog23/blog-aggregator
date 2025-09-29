import type { CommandName, CommandHandler } from "src/commands/commands";
import type { UserCommandHandler } from "src/commands/commands";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn: middlewareLoggedIn = (handler) => {
    return async (cmdName: CommandName, ...args: string[]): Promise<void> => {
        const config = readConfig();
        const userName = config.currentUserName;
        if (!userName) {
            throw new Error("User not logged in");
        }

        const user = await getUser(userName);
        if (!user) {
            throw new Error(`User: ${userName} not found`);
        }

        await handler(cmdName, user, ...args);
    }
}
