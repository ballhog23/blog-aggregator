import type { SelectFeed, SelectUser } from "src/lib/db/schema";
import type { CommandName } from "./commands";
import { getUser } from "src/lib/db/queries/users";
import { insertFeed, selectFeed } from "src/lib/db/queries/feeds";
import { readConfig } from "src/config";

export async function handlerAddFeed(cmdName: CommandName, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }
    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const name = args[0];
    const url = args[1];
    const feed = await insertFeed(name, url, user.id);
    printFeed(feed, user);
}

function printFeed(feed: SelectFeed, user: SelectUser) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* Name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}